import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Stethoscope, FileText, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatients, Patient } from '@/hooks/usePatients';
import { useProfessionals, Professional } from '@/hooks/useProfessionals';
import { useConsultations } from '@/hooks/useConsultations';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import PatientSearchInput from '@/components/PatientSearchInput';
import MedicalPrescription from '@/components/MedicalPrescription';
import MedicalCertificate from '@/components/MedicalCertificate';
import ExamRequest from '@/components/ExamRequest';
import MedicalDeclaration from '@/components/MedicalDeclaration';

const NovoAtendimento = ({ onBack }) => {
  const [pacienteSelecionado, setPacienteSelecionado] = useState('');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');
  const [subjetivo, setSubjetivo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [avaliacao, setAvaliacao] = useState('');
  const [plano, setPlano] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [activeTab, setActiveTab] = useState('soap');

  const [patients, setPatients] = useState<Patient[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const { getPatients } = usePatients();
  const { getProfessionals } = useProfessionals();
  const { createConsultation } = useConsultations();
  const { toast } = useToast();
  const { user, session } = useAuth();

  // Aguardar autenticação estar pronta
  useEffect(() => {
    console.log('🔐 DEBUG: NovoAtendimento - Verificando estado de autenticação');
    console.log('👤 DEBUG: NovoAtendimento - user:', user);
    console.log('🎫 DEBUG: NovoAtendimento - session:', session);
    
    const currentUser = user || session?.user;
    
    if (currentUser) {
      console.log('✅ DEBUG: NovoAtendimento - Usuário autenticado:', currentUser.id);
      setAuthReady(true);
    } else {
      console.log('⏳ DEBUG: NovoAtendimento - Aguardando autenticação...');
      setAuthReady(false);
    }
  }, [user, session]);

  // Carregar dados apenas quando autenticação estiver pronta
  useEffect(() => {
    if (!authReady) {
      console.log('⏳ DEBUG: NovoAtendimento - Autenticação não está pronta');
      return;
    }

    const loadData = async () => {
      console.log('📥 DEBUG: NovoAtendimento - Carregando pacientes e profissionais...');
      setLoadingPatients(true);
      
      try {
        const [patientsData, professionalsData] = await Promise.all([
          getPatients(),
          getProfessionals()
        ]);
        
        console.log('✅ DEBUG: NovoAtendimento - Pacientes encontrados:', patientsData);
        console.log('✅ DEBUG: NovoAtendimento - Profissionais encontrados:', professionalsData);
        
        setPatients(patientsData);
        setProfessionals(professionalsData);
      } catch (error) {
        console.error('❌ DEBUG: NovoAtendimento - Erro ao carregar dados:', error);
        
        // Só mostrar toast se não for erro de rede
        if (!error?.message?.includes('Failed to fetch')) {
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível carregar pacientes e profissionais. Tente novamente.",
            variant: "destructive",
          });
        }
      } finally {
        setLoadingPatients(false);
      }
    };
    
    loadData();
  }, [authReady, getPatients, getProfessionals, toast]);

  const handleSalvar = async () => {
    if (!pacienteSelecionado || !profissionalSelecionado) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione o paciente e o profissional",
        variant: "destructive",
      });
      return;
    }

    setSalvando(true);
    
    const consultaData = {
      patient_id: pacienteSelecionado,
      professional_id: profissionalSelecionado,
      subjetivo: subjetivo || null,
      objetivo: objetivo || null,
      avaliacao: avaliacao || null,
      plano: plano || null,
      receitas: null, // Will be handled by MedicalPrescription component
      exames: null, // Will be handled by ExamRequest component
      atestados: null // Will be handled by MedicalCertificate component
    };

    console.log('💾 DEBUG: NovoAtendimento - Dados da consulta a serem salvos:', consultaData);
    
    const resultado = await createConsultation(consultaData);
    
    if (resultado) {
      // Limpar formulário
      setPacienteSelecionado('');
      setProfissionalSelecionado('');
      setSubjetivo('');
      setObjetivo('');
      setAvaliacao('');
      setPlano('');
    }
    
    setSalvando(false);
  };

  const handlePrescriptionSave = (prescription) => {
    console.log('📝 DEBUG: NovoAtendimento - Receita salva:', prescription);
    toast({
      title: "Receita salva",
      description: "A receita foi adicionada ao atendimento.",
    });
  };

  const handleCertificateSave = (certificate) => {
    console.log('📋 DEBUG: NovoAtendimento - Atestado salvo:', certificate);
    toast({
      title: "Atestado gerado",
      description: "O atestado foi criado com sucesso.",
    });
  };

  const handleExamSave = (examRequest) => {
    console.log('🔬 DEBUG: NovoAtendimento - Solicitação de exames salva:', examRequest);
    toast({
      title: "Solicitação de exames gerada",
      description: "A solicitação de exames foi criada com sucesso.",
    });
  };

  const handleDeclarationSave = (declaration) => {
    console.log('📄 DEBUG: NovoAtendimento - Declaração salva:', declaration);
    toast({
      title: "Declaração gerada",
      description: "A declaração médica foi criada com sucesso.",
    });
  };

  const pacienteSelecionadoObj = patients.find(p => p.id === pacienteSelecionado);
  const profissionalSelecionadoObj = professionals.find(p => p.id === profissionalSelecionado);

  // Mostrar loading enquanto autenticação não estiver pronta
  if (!authReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4 hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <FileText className="text-white h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Novo Atendimento</h1>
              <p className="text-gray-600">Registro de consulta médica</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Seleção de Paciente e Profissional */}
            <Card className="shadow-lg border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <User className="mr-2 h-5 w-5" />
                  Dados do Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PatientSearchInput
                    patients={patients}
                    selectedPatient={pacienteSelecionado}
                    onSelectPatient={setPacienteSelecionado}
                    loading={loadingPatients}
                    label="Paciente"
                    placeholder="Digite o nome, telefone ou CPF do paciente..."
                  />
                  
                  <div>
                    <Label htmlFor="profissional">Profissional *</Label>
                    <Select value={profissionalSelecionado} onValueChange={setProfissionalSelecionado}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione um profissional" />
                      </SelectTrigger>
                      <SelectContent>
                        {professionals.length === 0 ? (
                          <SelectItem value="no-professionals" disabled>
                            Nenhum profissional cadastrado
                          </SelectItem>
                        ) : (
                          professionals.map((professional) => (
                            <SelectItem key={professional.id} value={professional.id}>
                              {professional.nome} - {professional.especialidade}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Aviso se não há dados */}
                {!loadingPatients && patients.length === 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                      <p className="text-yellow-800">
                        Nenhum paciente cadastrado. Cadastre pacientes primeiro na gestão de pacientes.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs para diferentes seções */}
            <Card className="shadow-lg border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Registro da Consulta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="soap">SOAP</TabsTrigger>
                    <TabsTrigger value="receitas">Receitas</TabsTrigger>
                    <TabsTrigger value="exames">Exames</TabsTrigger>
                    <TabsTrigger value="atestados">Atestados</TabsTrigger>
                    <TabsTrigger value="declaracoes">Declarações</TabsTrigger>
                  </TabsList>

                  <TabsContent value="soap" className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="subjetivo">Subjetivo (S)</Label>
                      <Textarea
                        id="subjetivo"
                        value={subjetivo}
                        onChange={(e) => setSubjetivo(e.target.value)}
                        placeholder="Queixa principal, história da doença atual, sintomas relatados pelo paciente..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="objetivo">Objetivo (O)</Label>
                      <Textarea
                        id="objetivo"
                        value={objetivo}
                        onChange={(e) => setObjetivo(e.target.value)}
                        placeholder="Exame físico, sinais vitais, achados objetivos..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="avaliacao">Avaliação (A)</Label>
                      <Textarea
                        id="avaliacao"
                        value={avaliacao}
                        onChange={(e) => setAvaliacao(e.target.value)}
                        placeholder="Diagnóstico, impressão clínica, CID..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="plano">Plano (P)</Label>
                      <Textarea
                        id="plano"
                        value={plano}
                        onChange={(e) => setPlano(e.target.value)}
                        placeholder="Conduta, tratamento, orientações..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="receitas" className="mt-6">
                    {pacienteSelecionadoObj ? (
                      <MedicalPrescription 
                        onSave={handlePrescriptionSave}
                        patientName={pacienteSelecionadoObj.nome}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Selecione um paciente para criar receitas</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="exames" className="mt-6">
                    {pacienteSelecionadoObj ? (
                      <ExamRequest 
                        onSave={handleExamSave}
                        patientName={pacienteSelecionadoObj.nome}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Selecione um paciente para solicitar exames</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="atestados" className="mt-6">
                    {pacienteSelecionadoObj ? (
                      <MedicalCertificate 
                        onSave={handleCertificateSave}
                        patientName={pacienteSelecionadoObj.nome}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Selecione um paciente para criar atestados</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="declaracoes" className="mt-6">
                    {pacienteSelecionadoObj ? (
                      <MedicalDeclaration 
                        onSave={handleDeclarationSave}
                        patientName={pacienteSelecionadoObj.nome}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Selecione um paciente para criar declarações</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Painel Lateral */}
          <div className="space-y-6">
            {/* Ações */}
            <Card className="shadow-lg border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  onClick={handleSalvar}
                  disabled={salvando || patients.length === 0 || professionals.length === 0}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {salvando ? 'Salvando...' : 'Salvar Consulta'}
                </Button>
              </CardContent>
            </Card>

            {/* Informações */}
            <Card className="shadow-lg border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Pacientes cadastrados:</strong> {patients.length}</p>
                  <p><strong>Profissionais cadastrados:</strong> {professionals.length}</p>
                  
                  {profissionalSelecionadoObj && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-blue-800">Profissional:</p>
                      <p className="text-sm">{profissionalSelecionadoObj.nome}</p>
                      <p className="text-sm">{profissionalSelecionadoObj.especialidade}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovoAtendimento;
