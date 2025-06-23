
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Triagem {
  id: string;
  patient_id: string;
  queixa_principal: string;
  sintomas?: string[];
  pressao_arterial?: string;
  temperatura?: number;
  frequencia_cardiaca?: number;
  saturacao_oxigenio?: number;
  classificacao_manchester: string;
  observacoes?: string;
  created_at: string;
  // Dados relacionados
  patientName?: string;
}

export const useTriagem = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const getTriagens = async (): Promise<Triagem[]> => {
    try {
      setLoading(true);
      
      if (!user) {
        console.log('Usuário não autenticado');
        return [];
      }
      
      console.log('Buscando triagens para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('triagem')
        .select(`
          *,
          patient:patients(nome)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar triagens:', error);
        throw error;
      }
      
      console.log('Triagens encontradas:', data);
      
      return data.map(item => ({
        ...item,
        patientName: item.patient?.nome
      }));
    } catch (error: any) {
      console.error('Erro ao buscar triagens:', error);
      toast({
        title: 'Erro ao carregar triagens',
        description: error.message || 'Não foi possível carregar a lista de triagens',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createTriagem = async (triagemData: Omit<Triagem, 'id' | 'patientName' | 'created_at'>): Promise<Triagem | null> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log('Criando triagem:', triagemData);
      
      const { data, error } = await supabase
        .from('triagem')
        .insert([{ ...triagemData, user_id: user.id }])
        .select()
        .single();
      
      if (error) {
        console.error('Erro do Supabase ao criar triagem:', error);
        throw error;
      }
      
      console.log('Triagem criada com sucesso:', data);
      
      toast({
        title: 'Triagem registrada com sucesso!',
        description: 'A triagem foi salva no sistema.',
      });
      
      // Buscar nome do paciente
      const patientRes = await supabase
        .from('patients')
        .select('nome')
        .eq('id', triagemData.patient_id)
        .single();
      
      return {
        ...data,
        patientName: patientRes.data?.nome
      };
    } catch (error: any) {
      console.error('Erro ao criar triagem:', error);
      toast({
        title: 'Erro ao registrar triagem',
        description: error.message || 'Não foi possível registrar a triagem',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getTriagens,
    createTriagem
  };
};
