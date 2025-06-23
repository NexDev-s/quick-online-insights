
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Heart, Thermometer, Activity, AlertTriangle, Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePatients, Patient } from '@/hooks/usePatients';
import { useTriagem } from '@/hooks/useTriagem';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import PatientSearchInput from '@/components/PatientSearchInput';

const Triagem = ({ onBack }) => {
  const [pacienteSelecionado, setPacienteSelecionado] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [queixaPrincipal, setQueixaPrincipal] = useState('');
  const [sintomas, setSintomas] = useState('');
  const [sinaisVitais, setSinaisVitais] = useState({
    pressao: '',
    temperatura: '',
    frequenciaCardiaca: '',
    saturacao: ''
  });
  const [classificacao, setClassificacao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);

  const { getPatients } = usePatients();
  const { createTriagem } = useTriagem();
  const { toast } = useToast();
  const { user, session } = useAuth();

  // Aguardar autenticação estar pronta
  useEffect(() => {
    console.log('🔐 DEBUG: Triagem - Verificando estado de autenticação');
    console.log('👤 DEBUG: Triagem - user:', user);
    console.log('🎫 DEBUG: Triagem - session:', session);
    
    const currentUser = user || session?.user;
    
    if (currentUser) {
      console.log('✅ DEBUG: Triagem - Usuário autenticado:', currentUser.id);
      setAuthReady(true);
    } else {
      console.log('⏳ DEBUG: Triagem - Aguardando autenticação...');
      setAuthReady(false);
    }
  }, [user, session]);

  // Carregar dados apenas quando autenticação estiver pronta e uma única vez
  useEffect(() => {
    if (!authReady || hasLoadedOnce) {
      console.log('⏳ DEBUG: Triagem - Autenticação não está pronta ou já carregou uma vez');
      return;
    }

    const loadPatients = async () => {
      console.log('📥 DEBUG: Triagem - Carregando pacientes...');
      setLoadingPatients(true);
      
      try {
        const data = await getPatients();
        console.log('✅ DEBUG: Triagem - Pacientes encontrados:', data);
        
        setPatients(data);
        setHasLoadedOnce(true);
      } catch (error) {
        console.error('❌ DEBUG: Triagem - Erro ao carregar pacientes:', error);
        
        // Só mostrar toast se não for erro de rede
        if (!error?.message?.includes('Failed to fetch')) {
          toast({
            title: "Erro ao carregar pacientes",
            description: "Não foi possível carregar a lista de pacientes",
            variant: "destructive",
          });
        }
        setPatients([]);
      } finally {
        setLoadingPatients(false);
      }
    };
    
    loadPatients();
  }, [authReady, hasLoadedOnce, getPatients, toast]);

  const classificacoesManchester = [
    { nivel: 'vermelho', nome: 'Emergência', tempo: 'Imediato', cor: 'bg-red-500' },
    { nivel: 'laranja', nome: 'Muito Urgente', tempo: '10 min', cor: 'bg-orange-500' },
    { nivel: 'amarelo', nome: 'Urgente', tempo: '60 min', cor: 'bg-yellow-500' },
    { nivel: 'verde', nome: 'Pouco Urgente', tempo: '120 min', cor: 'bg-green-500' },
    { nivel: 'azul', nome: 'Não Urgente', tempo: '240 min', cor: 'bg-blue-500' }
  ];

  const handleSalvar = async () => {
    if (!pacienteSelecionado || !queixaPrincipal || !classificacao) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione o paciente, informe a queixa principal e a classificação",
        variant: "destructive",
      });
      return;
    }

    setSalvando(true);
    
    const triagemData = {
      patient_id: pacienteSelecionado,
      queixa_principal: queixaPrincipal,
      sintomas: sintomas ? sintomas.split(',').map(s => s.trim()) : [],
      pressao_arterial: sinaisVitais.pressao || null,
      temperatura: sinaisVitais.temperatura ? parseFloat(sinaisVitais.temperatura) : null,
      frequencia_cardiaca: sinaisVitais.frequenciaCardiaca ? parseInt(sinaisVitais.frequenciaCardiaca) : null,
      saturacao_oxigenio: sinaisVitais.saturacao ? parseInt(sinaisVitais.saturacao) : null,
      classificacao_manchester: classificacao,
      observacoes: observacoes || null
    };

    const resultado = await createTriagem(triagemData);
    
    if (resultado) {
      // Limpar formulário
      setPacienteSelecionado('');
      setQueixaPrincipal('');
      setSintomas('');
      setSinaisVitais({
        pressao: '',
        temperatura: '',
        frequenciaCardiaca: '',
        saturacao: ''
      });
      setClassificacao('');
      setObservacoes('');
    }
    
    setSalvando(false);
  };

  // Mostrar loading enquanto autenticação não estiver pronta
  if (!authReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4 hover:bg-red-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-white h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sistema de Triagem</h1>
              <p className="text-gray-600">Protocolo de Manchester</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Paciente */}
            <Card className="shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800">
                  <User className="mr-2 h-5 w-5" />
                  Dados do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PatientSearchInput
                  patients={patients}
                  selectedPatient={pacienteSelecionado}
                  onSelectPatient={setPacienteSelecionado}
                  loading={loadingPatients}
                  label="Paciente"
                  placeholder="Digite o nome, telefone ou CPF do paciente..."
                />
                
                <div>
                  <Label htmlFor="queixa">Queixa Principal *</Label>
                  <Textarea
                    id="queixa"
                    value={queixaPrincipal}
                    onChange={(e) => setQueixaPrincipal(e.target.value)}
                    placeholder="Descreva a queixa principal do paciente"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sintomas">Sintomas (separados por vírgula)</Label>
                  <Input
                    id="sintomas"
                    value={sintomas}
                    onChange={(e) => setSintomas(e.target.value)}
                    placeholder="Ex: febre, dor de cabeça, náusea"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sinais Vitais */}
            <Card className="shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800">
                  <Activity className="mr-2 h-5 w-5" />
                  Sinais Vitais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pressao">Pressão Arterial</Label>
                    <Input
                      id="pressao"
                      value={sinaisVitais.pressao}
                      onChange={(e) => setSinaisVitais({...sinaisVitais, pressao: e.target.value})}
                      placeholder="120/80"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperatura">Temperatura (°C)</Label>
                    <Input
                      id="temperatura"
                      type="number"
                      step="0.1"
                      value={sinaisVitais.temperatura}
                      onChange={(e) => setSinaisVitais({...sinaisVitais, temperatura: e.target.value})}
                      placeholder="36.5"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fc">Frequência Cardíaca (bpm)</Label>
                    <Input
                      id="fc"
                      type="number"
                      value={sinaisVitais.frequenciaCardiaca}
                      onChange={(e) => setSinaisVitais({...sinaisVitais, frequenciaCardiaca: e.target.value})}
                      placeholder="80"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="saturacao">Saturação O2 (%)</Label>
                    <Input
                      id="saturacao"
                      type="number"
                      min="0"
                      max="100"
                      value={sinaisVitais.saturacao}
                      onChange={(e) => setSinaisVitais({...sinaisVitais, saturacao: e.target.value})}
                      placeholder="98"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classificação */}
            <Card className="shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Classificação de Risco *
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classificacoesManchester.map((nivel, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        classificacao === nivel.nivel
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setClassificacao(nivel.nivel)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 ${nivel.cor} rounded-full`}></div>
                          <div>
                            <p className="font-semibold text-gray-900">{nivel.nome}</p>
                            <p className="text-sm text-gray-600">Tempo máximo: {nivel.tempo}</p>
                          </div>
                        </div>
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            <Card className="shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Observações Adicionais</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Observações adicionais sobre o paciente ou triagem..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Painel Lateral */}
          <div className="space-y-6">
            {/* Ações */}
            <Card className="shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  onClick={handleSalvar}
                  disabled={salvando || patients.length === 0}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {salvando ? 'Salvando...' : 'Salvar Triagem'}
                </Button>
              </CardContent>
            </Card>

            {/* Status Atual */}
            {classificacao && (
              <Card className="shadow-lg border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-800">Classificação Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  {classificacoesManchester
                    .filter(nivel => nivel.nivel === classificacao)
                    .map((nivel, index) => (
                      <div key={index} className="text-center">
                        <div className={`w-16 h-16 ${nivel.cor} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                          <AlertTriangle className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{nivel.nome}</h3>
                        <p className="text-gray-600">Atendimento em até {nivel.tempo}</p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            {/* Informações */}
            <Card className="shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Pacientes Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {loadingPatients ? 'Carregando...' : `${patients.length} pacientes disponíveis para triagem`}
                </p>
                {!loadingPatients && patients.length === 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Cadastre pacientes primeiro na gestão de pacientes
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-2 w-full"
                      onClick={() => onBack()}
                    >
                      Ir para Gestão de Pacientes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Triagem;
