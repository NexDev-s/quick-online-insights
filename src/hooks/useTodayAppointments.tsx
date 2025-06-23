
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TodayAppointment {
  id: string;
  time: string;
  patient: string;
  doctor: string;
  type: string;
  status: string;
}

export const useTodayAppointments = () => {
  const [appointments, setAppointments] = useState<TodayAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const loadTodayAppointments = async () => {
    if (!user || authLoading) return;

    try {
      setLoading(true);
      
      const hoje = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients(nome),
          professional:professionals(nome)
        `)
        .eq('user_id', user.id)
        .gte('data_agendamento', hoje)
        .lt('data_agendamento', hoje + 'T23:59:59')
        .order('data_agendamento', { ascending: true });

      if (error) throw error;

      const formattedAppointments = data?.map(apt => ({
        id: apt.id,
        time: new Date(apt.data_agendamento).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        patient: apt.patient?.nome || 'Paciente não encontrado',
        doctor: apt.professional?.nome || 'Profissional não encontrado',
        type: apt.tipo || 'Consulta',
        status: apt.status || 'confirmado'
      })) || [];

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Erro ao carregar agendamentos de hoje:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      loadTodayAppointments();
    }
  }, [user, authLoading]);

  return { appointments, loading, refreshAppointments: loadTodayAppointments };
};
