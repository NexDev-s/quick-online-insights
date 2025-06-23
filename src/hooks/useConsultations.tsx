
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Consultation {
  id: string;
  patient_id: string;
  professional_id: string;
  subjetivo?: string;
  objetivo?: string;
  avaliacao?: string;
  plano?: string;
  receitas?: string;
  exames?: string;
  atestados?: string;
  created_at: string;
  updated_at: string;
  // Dados relacionados
  patientName?: string;
  professionalName?: string;
}

export const useConsultations = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const getConsultations = async (): Promise<Consultation[]> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('medical_consultations')
        .select(`
          *,
          patient:patients(nome),
          professional:professionals(nome)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        patientName: item.patient?.nome,
        professionalName: item.professional?.nome
      }));
    } catch (error: any) {
      console.error('Erro ao buscar consultas:', error);
      toast({
        title: 'Erro ao carregar consultas',
        description: error.message || 'Não foi possível carregar a lista de consultas',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getConsultationById = async (id: string): Promise<Consultation | null> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('medical_consultations')
        .select(`
          *,
          patient:patients(nome),
          professional:professionals(nome)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        ...data,
        patientName: data.patient?.nome,
        professionalName: data.professional?.nome
      };
    } catch (error: any) {
      console.error('Erro ao buscar consulta:', error);
      toast({
        title: 'Erro ao carregar consulta',
        description: error.message || 'Não foi possível carregar os dados da consulta',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createConsultation = async (consultationData: Omit<Consultation, 'id' | 'patientName' | 'professionalName' | 'created_at' | 'updated_at'>): Promise<Consultation | null> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('medical_consultations')
        .insert([{ ...consultationData, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Consulta registrada com sucesso!',
        description: 'O atendimento foi salvo no sistema.',
      });
      
      // Buscar nomes do paciente e profissional
      const patientRes = await supabase
        .from('patients')
        .select('nome')
        .eq('id', consultationData.patient_id)
        .single();
        
      const professionalRes = await supabase
        .from('professionals')
        .select('nome')
        .eq('id', consultationData.professional_id)
        .single();
      
      return {
        ...data,
        patientName: patientRes.data?.nome,
        professionalName: professionalRes.data?.nome
      };
    } catch (error: any) {
      console.error('Erro ao criar consulta:', error);
      toast({
        title: 'Erro ao registrar consulta',
        description: error.message || 'Não foi possível registrar a consulta',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateConsultation = async (id: string, consultationData: Partial<Consultation>): Promise<Consultation | null> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Remover campos calculados que não existem na tabela
      const { patientName, professionalName, created_at, ...dataToUpdate } = consultationData;
      
      const { data, error } = await supabase
        .from('medical_consultations')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Consulta atualizada com sucesso!',
        description: 'Os dados da consulta foram atualizados.',
      });
      
      // Buscar nomes do paciente e profissional
      const patientRes = await supabase
        .from('patients')
        .select('nome')
        .eq('id', data.patient_id)
        .single();
        
      const professionalRes = await supabase
        .from('professionals')
        .select('nome')
        .eq('id', data.professional_id)
        .single();
      
      return {
        ...data,
        patientName: patientRes.data?.nome,
        professionalName: professionalRes.data?.nome
      };
    } catch (error: any) {
      console.error('Erro ao atualizar consulta:', error);
      toast({
        title: 'Erro ao atualizar consulta',
        description: error.message || 'Não foi possível atualizar a consulta',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteConsultation = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { error } = await supabase
        .from('medical_consultations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Consulta removida com sucesso',
        description: 'O registro da consulta foi removido do sistema.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir consulta:', error);
      toast({
        title: 'Erro ao remover consulta',
        description: error.message || 'Não foi possível remover o registro da consulta',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getConsultations,
    getConsultationById,
    createConsultation,
    updateConsultation,
    deleteConsultation
  };
};
