
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Plus, User, Search, Eye, Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppointments, Appointment } from '@/hooks/useAppointments';
import { usePatients, Patient } from '@/hooks/usePatients';
import { useProfessionals, Professional } from '@/hooks/useProfessionals';
import { useAuth } from '@/hooks/useAuth';
import AgendamentoForm from './AgendamentoForm';

const AppointmentManagement = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [dateFilter, setDateFilter] = useState('hoje');
  
  const { getAppointments, updateAppointment, loading } = useAppointments();
  const { getPatients } = usePatients();
  const { getProfessionals } = useProfessionals();
  const { user, session } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      // Verificar tanto user quanto session para autenticação
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        console.log('🔄 Aguardando autenticação para carregar gestão de agendamentos...');
        return;
      }

      console.log('✅ Carregando dados da gestão de agendamentos...');
      
      try {
        const appointmentsData = await getAppointments();
        const patientsData = await getPatients();
        const professionalsData = await getProfessionals();
        
        console.log('📋 Dados carregados:');
        console.log('- Agendamentos:', appointmentsData.length);
        console.log('- Pacientes:', patientsData.length);
        console.log('- Profissionais:', professionalsData.length);
        
        setAppointments(appointmentsData);
        setPatients(patientsData);
        setProfessionals(professionalsData);
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
      }
    };
    
    loadData();
  }, [user, session]);

  const handleSaveAppointment = async () => {
    const data = await getAppointments();
    setAppointments(data);
    setShowForm(false);
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    const updatedAppointment = await updateAppointment(appointmentId, { status: newStatus });
    if (updatedAppointment) {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'presente': return 'bg-blue-100 text-blue-800';
      case 'finalizado': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const patient = patients.find(p => p.id === appointment.patient_id);
    const professional = professionals.find(p => p.id === appointment.professional_id);
    
    // Filtro de busca - usar o nome do paciente do agendamento ou buscar na lista
    const patientName = appointment.patientName || patient?.nome || '';
    const professionalName = appointment.professionalName || professional?.nome || '';
    
    const matchesSearch = (
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filtro de status
    const matchesStatus = statusFilter === 'todos' || 
      appointment.status?.toLowerCase() === statusFilter.toLowerCase();
    
    // Filtro de data
    const appointmentDate = new Date(appointment.data_agendamento);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let matchesDate = true;
    if (dateFilter === 'hoje') {
      matchesDate = appointmentDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'amanha') {
      matchesDate = appointmentDate.toDateString() === tomorrow.toDateString();
    } else if (dateFilter === 'semana') {
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      matchesDate = appointmentDate >= today && appointmentDate <= weekFromNow;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (showForm) {
    return <AgendamentoForm onBack={() => setShowForm(false)} onSave={handleSaveAppointment} />;
  }

  // Mostrar loading enquanto autentica
  const currentUser = user || session?.user;
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Autenticando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
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
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Agendamentos</h1>
                <p className="text-gray-600">{appointments.length} agendamentos cadastrados</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6 shadow-lg border-blue-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por paciente, profissional ou tipo de consulta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select 
                  defaultValue="hoje"
                  value={dateFilter}
                  onValueChange={setDateFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Data" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hoje">Hoje</SelectItem>
                    <SelectItem value="amanha">Amanhã</SelectItem>
                    <SelectItem value="semana">Esta semana</SelectItem>
                    <SelectItem value="todos">Todos</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  defaultValue="todos"
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="presente">Presente</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="todos">Todos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado de carregamento */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Carregando agendamentos...</p>
          </div>
        )}

        {/* Lista de Agendamentos */}
        {!loading && (
          <div className="grid gap-4">
            {filteredAppointments.map((appointment) => {
              const patient = patients.find(p => p.id === appointment.patient_id);
              const professional = professionals.find(p => p.id === appointment.professional_id);
              const appointmentDate = new Date(appointment.data_agendamento);
              
              // Debug para verificar nomes dos pacientes
              console.log('🔍 Debug agendamento na lista:', {
                appointmentId: appointment.id,
                patientIdFromAppointment: appointment.patient_id,
                patientNameFromAppointment: appointment.patientName,
                patientFromList: patient?.nome,
                finalPatientName: appointment.patientName || patient?.nome || 'Paciente não encontrado'
              });
              
              return (
                <Card key={appointment.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.patientName || patient?.nome || 'Paciente não encontrado'}
                          </h3>
                          <p className="text-gray-600">
                            {appointment.professionalName || professional?.nome || 'Profissional não encontrado'} • {appointment.tipo}
                          </p>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{appointmentDate.toLocaleDateString('pt-BR')}</span>
                            <Clock className="h-4 w-4 ml-3 mr-1" />
                            <span>{appointmentDate.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge className={`${getStatusColor(appointment.status || 'agendado')}`}>
                          {appointment.status || 'Agendado'}
                        </Badge>
                        
                        <div className="flex space-x-2">
                          {appointment.status === 'Agendado' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusChange(appointment.id, 'Confirmado')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Confirmar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusChange(appointment.id, 'Cancelado')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancelar
                              </Button>
                            </>
                          )}
                          {appointment.status === 'Confirmado' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusChange(appointment.id, 'Presente')}
                            >
                              Presente
                            </Button>
                          )}
                          {appointment.status === 'Presente' && (
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                              onClick={() => handleStatusChange(appointment.id, 'Finalizado')}
                            >
                              Atender
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {appointment.observacoes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Observações:</strong> {appointment.observacoes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filteredAppointments.length === 0 && (
          <Card className="shadow-lg border-blue-200">
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros ou crie um novo agendamento
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;
