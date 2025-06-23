
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Plus, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppointments, Appointment } from '@/hooks/useAppointments';
import { usePatients, Patient } from '@/hooks/usePatients';
import { Professional } from '@/hooks/useProfessionals';
import { useAuth } from '@/hooks/useAuth';

interface ProfessionalAgendaProps {
  professional: Professional;
  onBack: () => void;
}

const ProfessionalAgenda = ({ professional, onBack }: ProfessionalAgendaProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const { getAppointments, updateAppointment, loading } = useAppointments();
  const { getPatients } = usePatients();
  const { user, session } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      // Verificar tanto user quanto session para autenticação
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        console.log('🔄 Aguardando autenticação para carregar agenda...');
        return;
      }

      console.log('✅ Carregando dados da agenda...');
      
      try {
        const appointmentsData = await getAppointments();
        const patientsData = await getPatients();
        
        console.log('📋 Agendamentos carregados:', appointmentsData.length);
        console.log('👥 Pacientes carregados:', patientsData.length);
        
        // Filtrar agendamentos deste profissional
        const professionalAppointments = appointmentsData.filter(
          apt => apt.professional_id === professional.id
        );
        
        console.log('📅 Agendamentos deste profissional:', professionalAppointments.length);
        
        setAppointments(professionalAppointments);
        setPatients(patientsData);
      } catch (error) {
        console.error('❌ Erro ao carregar dados da agenda:', error);
      }
    };
    
    loadData();
  }, [professional.id, user, session]);

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    const success = await updateAppointment(appointmentId, { status: newStatus });
    if (success) {
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

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toDateString();
    const aptDate = new Date(apt.data_agendamento).toDateString();
    return today === aptDate;
  });

  // Mostrar loading enquanto autentica
  const currentUser = user || session?.user;
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Autenticando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4 hover:bg-emerald-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <Calendar className="text-white h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agenda - {professional.nome}</h1>
              <p className="text-gray-600">{professional.especialidade}</p>
            </div>
          </div>
        </div>

        {/* Informações do Profissional */}
        <Card className="mb-6 shadow-lg border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-semibold">{professional.nome}</h3>
                  <p className="text-gray-600">{professional.especialidade} • {professional.registro}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Phone className="h-4 w-4 mr-1" />
                    <span className="text-sm">{professional.telefone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-1" />
                    <span className="text-sm">{professional.email}</span>
                  </div>
                </div>
                <div className="text-center bg-emerald-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Consultas hoje</p>
                  <p className="text-2xl font-bold text-emerald-700">{todayAppointments.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado de carregamento */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Carregando agenda...</p>
          </div>
        )}

        {/* Lista de Agendamentos */}
        {!loading && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Agendamentos de Hoje ({todayAppointments.length})
            </h2>
            
            {todayAppointments.length === 0 ? (
              <Card className="shadow-lg border-emerald-200">
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum agendamento para hoje
                  </h3>
                  <p className="text-gray-600">
                    Não há consultas agendadas para hoje
                  </p>
                </CardContent>
              </Card>
            ) : (
              todayAppointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patient_id);
                const appointmentTime = new Date(appointment.data_agendamento);
                
                console.log('🔍 Debug agendamento:', {
                  appointmentId: appointment.id,
                  patientId: appointment.patient_id,
                  patientName: appointment.patientName,
                  patientFound: patient?.nome
                });
                
                return (
                  <Card key={appointment.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-emerald-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-emerald-700" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {appointment.patientName || patient?.nome || 'Paciente não encontrado'}
                            </h3>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{appointmentTime.toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}</span>
                              <span className="mx-2">•</span>
                              <span>{appointment.tipo}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Badge className={`${getStatusColor(appointment.status || 'agendado')}`}>
                            {appointment.status || 'Agendado'}
                          </Badge>
                          
                          <div className="flex space-x-2">
                            {appointment.status === 'Agendado' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusChange(appointment.id, 'Confirmado')}
                              >
                                Confirmar
                              </Button>
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
                                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                              >
                                Atender
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {appointment.observacoes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Observações:</strong> {appointment.observacoes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalAgenda;
