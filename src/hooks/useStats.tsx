
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface DashboardStats {
  pacientesCadastrados: number;
  agendamentosHoje: number;
  consultasMes: number;
  taxaOcupacao: number;
  limitePacientes: number;
  limiteAgendamentos: number;
  limiteConsultas: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    pacientesCadastrados: 0,
    agendamentosHoje: 0,
    consultasMes: 0,
    taxaOcupacao: 0,
    limitePacientes: 50,
    limiteAgendamentos: 10,
    limiteConsultas: 100
  });
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const loadStats = async () => {
    if (!user || authLoading) {
      console.log('⏳ Aguardando autenticação para carregar estatísticas...');
      return;
    }

    try {
      setLoading(true);
      console.log('📊 Carregando estatísticas para usuário:', user.id);
      
      // Buscar pacientes cadastrados
      const { count: pacientesCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Buscar agendamentos de hoje
      const hoje = new Date().toISOString().split('T')[0];
      const { count: agendamentosCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('data_agendamento', hoje)
        .lt('data_agendamento', hoje + 'T23:59:59');

      // Buscar consultas do mês
      const inicioMes = new Date();
      inicioMes.setDate(1);
      const { count: consultasCount } = await supabase
        .from('medical_consultations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', inicioMes.toISOString());

      // Calcular taxa de ocupação (exemplo simplificado)
      const taxaOcupacao = agendamentosCount ? Math.round((agendamentosCount / 10) * 100) : 0;

      const newStats = {
        pacientesCadastrados: pacientesCount || 0,
        agendamentosHoje: agendamentosCount || 0,
        consultasMes: consultasCount || 0,
        taxaOcupacao: Math.min(taxaOcupacao, 100),
        limitePacientes: 50,
        limiteAgendamentos: 10,
        limiteConsultas: 100
      };

      console.log('✅ Estatísticas carregadas:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Só carrega se o usuário estiver autenticado e não estiver carregando
    if (user && !authLoading) {
      console.log('🔄 Iniciando carregamento de estatísticas...');
      loadStats();
    } else if (!authLoading && !user) {
      // Se não estiver autenticado e não estiver carregando, reseta os stats
      setLoading(false);
    }
  }, [user, authLoading]);

  return { stats, loading, refreshStats: loadStats };
};
