
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Appointment {
  id: string;
  patient_id: string;
  professional_id: string;
  data_agendamento: string;
  tipo: string;
  status?: string;
  observacoes?: string;
  // Dados relacionados
  patientName?: string;
  professionalName?: string;
}

export const useAppointments = () => {
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();
  const { toast } = useToast();

  const getAppointments = async (): Promise<Appointment[]> => {
    try {
      setLoading(true);
      
      // Verificar tanto user quanto session para autenticação
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        console.log('❌ Usuário não autenticado para buscar agendamentos');
        return [];
      }
      
      console.log('✅ Usuário autenticado, buscando agendamentos:', currentUser.email);
      
      // Buscar agendamentos com dados de pacientes e profissionais
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients(nome),
          professional:professionals(nome)
        `)
        .eq('user_id', currentUser.id)
        .order('data_agendamento', { ascending: true });
      
      if (error) {
        console.error('❌ Erro ao buscar agendamentos:', error);
        throw error;
      }
      
      console.log('📊 Agendamentos encontrados:', data?.length || 0);
      console.log('📄 Dados dos agendamentos:', data);
      
      // Formatar dados para uso no front-end
      return data?.map(item => ({
        ...item,
        patientName: item.patient?.nome,
        professionalName: item.professional?.nome
      })) || [];
    } catch (error: any) {
      console.error('Erro ao buscar agendamentos:', error);
      
      // Só mostrar toast se o usuário estiver autenticado
      const currentUser = user || session?.user;
      if (currentUser) {
        toast({
          title: 'Erro ao carregar agendamentos',
          description: error.message || 'Não foi possível carregar a lista de agendamentos',
          variant: 'destructive',
        });
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentById = async (id: string): Promise<Appointment | null> => {
    try {
      setLoading(true);
      
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients(nome),
          professional:professionals(nome)
        `)
        .eq('id', id)
        .eq('user_id', currentUser.id)
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        ...data,
        patientName: data.patient?.nome,
        professionalName: data.professional?.nome
      };
    } catch (error: any) {
      console.error('Erro ao buscar agendamento:', error);
      toast({
        title: 'Erro ao carregar agendamento',
        description: error.message || 'Não foi possível carregar os dados do agendamento',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'patientName' | 'professionalName'>): Promise<Appointment | null> => {
    try {
      setLoading(true);
      
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('appointments')
        .insert([{ ...appointmentData, user_id: currentUser.id }])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Agendamento criado com sucesso!',
        description: `O agendamento foi marcado para ${new Date(appointmentData.data_agendamento).toLocaleDateString()}.`,
      });
      
      // Buscar nomes do paciente e profissional
      const patientRes = await supabase
        .from('patients')
        .select('nome')
        .eq('id', appointmentData.patient_id)
        .eq('user_id', currentUser.id)
        .single();
        
      const professionalRes = await supabase
        .from('professionals')
        .select('nome')
        .eq('id', appointmentData.professional_id)
        .eq('user_id', currentUser.id)
        .single();
      
      return {
        ...data,
        patientName: patientRes.data?.nome,
        professionalName: professionalRes.data?.nome
      };
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: 'Erro ao criar agendamento',
        description: error.message || 'Não foi possível criar o agendamento',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id: string, appointmentData: Partial<Appointment>): Promise<Appointment | null> => {
    try {
      setLoading(true);
      
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      // Remover campos calculados que não existem na tabela
      const { patientName, professionalName, ...dataToUpdate } = appointmentData;
      
      const { data, error } = await supabase
        .from('appointments')
        .update(dataToUpdate)
        .eq('id', id)
        .eq('user_id', currentUser.id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Agendamento atualizado com sucesso!',
        description: 'As informações do agendamento foram atualizadas.',
      });
      
      // Buscar nomes do paciente e profissional
      const patientRes = await supabase
        .from('patients')
        .select('nome')
        .eq('id', data.patient_id)
        .eq('user_id', currentUser.id)
        .single();
        
      const professionalRes = await supabase
        .from('professionals')
        .select('nome')
        .eq('id', data.professional_id)
        .eq('user_id', currentUser.id)
        .single();
      
      return {
        ...data,
        patientName: patientRes.data?.nome,
        professionalName: professionalRes.data?.nome
      };
    } catch (error: any) {
      console.error('Erro ao atualizar agendamento:', error);
      toast({
        title: 'Erro ao atualizar agendamento',
        description: error.message || 'Não foi possível atualizar o agendamento',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      toast({
        title: 'Agendamento cancelado com sucesso',
        description: 'O agendamento foi removido do sistema.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir agendamento:', error);
      toast({
        title: 'Erro ao cancelar agendamento',
        description: error.message || 'Não foi possível cancelar o agendamento',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
  };
};
