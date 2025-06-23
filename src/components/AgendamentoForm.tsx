import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePatients, Patient } from '@/hooks/usePatients';
import { useProfessionals, Professional } from '@/hooks/useProfessionals';
import { useAppointments } from '@/hooks/useAppointments';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface AgendamentoFormProps {
  onBack: () => void;
  onSave: () => void;
}

const AgendamentoForm = ({ onBack, onSave }: AgendamentoFormProps) => {
  const [pacienteSelecionado, setPacienteSelecionado] = useState('');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [horaAgendamento, setHoraAgendamento] = useState('');
  const [tipoConsulta, setTipoConsulta] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const { getPatients } = usePatients();
  const { getProfessionals } = useProfessionals();
  const { createAppointment } = useAppointments();
  const { toast } = useToast();
  const { user, session } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      // Verificar tanto user quanto session para autenticação
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        console.log('⏳ DEBUG: AgendamentoForm - Aguardando autenticação...');
        return;
      }

      console.log('📥 DEBUG: AgendamentoForm - Carregando dados para usuário:', currentUser.email);
      setLoadingData(true);
      
      try {
        const [patientsData, professionalsData] = await Promise.all([
          getPatients(),
          getProfessionals()
        ]);
        
        console.log('✅ DEBUG: AgendamentoForm - Pacientes carregados:', patientsData);
        console.log('✅ DEBUG: AgendamentoForm - Profissionais carregados:', professionalsData);
        
        setPatients(patientsData);
        setProfessionals(professionalsData);
      } catch (error) {
        console.error('❌ DEBUG: AgendamentoForm - Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar pacientes e profissionais. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoadingData(false);
      }
    };
    
    // Only run once when user or session becomes available
    const currentUser = user || session?.user;
    if (currentUser && loadingData) {
      loadData();
    }
  }, [user?.id, session?.user?.id]); // Only depend on user ID changes

  const handleSalvar = async () => {
    if (!pacienteSelecionado || !profissionalSelecionado || !dataAgendamento || !horaAgendamento || !tipoConsulta) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setSalvando(true);
    
    const dataCompleta = new Date(`${dataAgendamento}T${horaAgendamento}:00`);
    
    const agendamentoData = {
      patient_id: pacienteSelecionado,
      professional_id: profissionalSelecionado,
      data_agendamento: dataCompleta.toISOString(),
      tipo: tipoConsulta,
      status: 'Agendado',
      observacoes: observacoes || null
    };

    console.log('💾 DEBUG: AgendamentoForm - Dados do agendamento:', agendamentoData);
    
    const resultado = await createAppointment(agendamentoData);
    
    if (resultado) {
      onSave();
    }
    
    setSalvando(false);
  };

  const tiposConsulta = [
    'Consulta de Rotina',
    'Consulta de Retorno',
    'Primeira Consulta',
    'Consulta de Urgência',
    'Exame Clínico',
    'Procedimento'
  ];

  // Mostrar loading enquanto autentica ou carrega dados
  const currentUser = user || session?.user;
  if (!currentUser || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {!currentUser ? 'Autenticando...' : 'Carregando dados...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
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
              <Calendar className="text-white h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Novo Agendamento</h1>
              <p className="text-gray-600">Agendar consulta ou procedimento</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Agendamento */}
            <Card className="shadow-lg border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Calendar className="mr-2 h-5 w-5" />
                  Dados do Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paciente">Paciente *</Label>
                    <Select value={pacienteSelecionado} onValueChange={setPacienteSelecionado}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione um paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.length === 0 ? (
                          <SelectItem value="no-patients" disabled>
                            Nenhum paciente cadastrado
                          </SelectItem>
                        ) : (
                          patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.nome} - {patient.telefone}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data">Data *</Label>
                    <Input
                      id="data"
                      type="date"
                      value={dataAgendamento}
                      onChange={(e) => setDataAgendamento(e.target.value)}
                      className="mt-1"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hora">Horário *</Label>
                    <Input
                      id="hora"
                      type="time"
                      value={horaAgendamento}
                      onChange={(e) => setHoraAgendamento(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tipo">Tipo de Consulta *</Label>
                  <Select value={tipoConsulta} onValueChange={setTipoConsulta}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o tipo de consulta" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposConsulta.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações sobre o agendamento..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
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
                  {salvando ? 'Salvando...' : 'Agendar Consulta'}
                </Button>
              </CardContent>
            </Card>

            {/* Informações */}
            <Card className="shadow-lg border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Informações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Pacientes:</strong> {patients.length} cadastrados</p>
                  <p><strong>Profissionais:</strong> {professionals.length} cadastrados</p>
                </div>
                {(patients.length === 0 || professionals.length === 0) && (
                  <p className="text-sm text-red-500 mt-2">
                    Cadastre pacientes e profissionais antes de agendar
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendamentoForm;
