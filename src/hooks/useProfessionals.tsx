
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Professional {
  id: string;
  nome: string;
  tipo: string;
  registro: string;
  especialidade: string;
  telefone: string;
  email: string;
  horario_inicio?: string;
  horario_fim?: string;
  dias_atendimento?: string[];
  observacoes?: string;
  status?: string;
}

export const useProfessionals = () => {
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const getProfessionals = async (): Promise<Professional[]> => {
    try {
      setLoading(true);
      
      // Aguardar autenticação estar completa
      if (authLoading) {
        console.log('🔒 Aguardando autenticação para carregar profissionais...');
        return [];
      }
      
      if (!user) {
        console.log('❌ Usuário não autenticado para buscar profissionais');
        return [];
      }
      
      console.log('✅ Buscando profissionais para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .order('nome', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar profissionais:', error);
        throw error;
      }
      
      console.log('✅ Profissionais encontrados:', data);
      return data || [];
    } catch (error: any) {
      console.error('Erro ao buscar profissionais:', error);
      
      // Só mostrar toast se o usuário estiver autenticado
      if (user) {
        toast({
          title: 'Erro ao carregar profissionais',
          description: error.message || 'Não foi possível carregar a lista de profissionais',
          variant: 'destructive',
        });
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getProfessionalById = async (id: string): Promise<Professional | null> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Erro ao buscar profissional:', error);
      toast({
        title: 'Erro ao carregar profissional',
        description: error.message || 'Não foi possível carregar os dados do profissional',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProfessional = async (professionalData: Omit<Professional, 'id'>): Promise<Professional | null> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log('Criando profissional:', professionalData);
      
      const { data, error } = await supabase
        .from('professionals')
        .insert([{ ...professionalData, user_id: user.id }])
        .select()
        .single();
      
      if (error) {
        console.error('Erro do Supabase ao criar profissional:', error);
        throw error;
      }
      
      console.log('Profissional criado com sucesso:', data);
      
      toast({
        title: 'Profissional cadastrado com sucesso!',
        description: `${professionalData.nome} foi adicionado ao sistema.`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Erro ao criar profissional:', error);
      toast({
        title: 'Erro ao cadastrar profissional',
        description: error.message || 'Não foi possível cadastrar o profissional',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfessional = async (id: string, professionalData: Partial<Professional>): Promise<Professional | null> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log('Atualizando profissional:', id, professionalData);
      
      const { data, error } = await supabase
        .from('professionals')
        .update(professionalData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro do Supabase ao atualizar profissional:', error);
        throw error;
      }
      
      console.log('Profissional atualizado com sucesso:', data);
      
      toast({
        title: 'Profissional atualizado com sucesso!',
        description: `Os dados de ${data.nome} foram atualizados.`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar profissional:', error);
      toast({
        title: 'Erro ao atualizar profissional',
        description: error.message || 'Não foi possível atualizar os dados do profissional',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfessional = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log('Excluindo profissional:', id);
      
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Erro do Supabase ao excluir profissional:', error);
        throw error;
      }
      
      console.log('Profissional excluído com sucesso');
      
      toast({
        title: 'Profissional removido com sucesso',
        description: 'O profissional foi removido do sistema.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir profissional:', error);
      toast({
        title: 'Erro ao remover profissional',
        description: error.message || 'Não foi possível remover o profissional',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getProfessionals,
    getProfessionalById,
    createProfessional,
    updateProfessional,
    deleteProfessional
  };
};
