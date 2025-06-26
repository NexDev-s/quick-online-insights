
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ConsultationWithDetails {
  id: string;
  patient_id: string;
  professional_id: string;
  subjetivo?: string;
  objetivo?: string;
  avaliacao?: string;
  plano?: string;
  created_at: string;
  // Dados relacionados
  patientName: string;
  patientCpf?: string;
  patientTelefone?: string;
  professionalName: string;
  professionalRegistro?: string;
  professionalEspecialidade?: string;
}

export const useConsultationsWithDetails = () => {
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const getConsultationsWithDetails = async (): Promise<ConsultationWithDetails[]> => {
    try {
      setLoading(true);
      
      if (authLoading || !user) {
        console.log('⏳ Aguardando autenticação para buscar consultas...');
        return [];
      }
      
      console.log('📊 Buscando consultas com detalhes...');
      
      const { data, error } = await supabase
        .from('medical_consultations')
        .select(`
          *,
          patient:patients(nome, cpf, telefone),
          professional:professionals(nome, registro, especialidade)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erro ao buscar consultas:', error);
        throw error;
      }
      
      console.log(`✅ ${data?.length || 0} consultas encontradas com detalhes`);
      
      return data?.map(consultation => ({
        id: consultation.id,
        patient_id: consultation.patient_id,
        professional_id: consultation.professional_id,
        subjetivo: consultation.subjetivo,
        objetivo: consultation.objetivo,
        avaliacao: consultation.avaliacao,
        plano: consultation.plano,
        created_at: consultation.created_at,
        patientName: consultation.patient?.nome || 'Paciente não encontrado',
        patientCpf: consultation.patient?.cpf,
        patientTelefone: consultation.patient?.telefone,
        professionalName: consultation.professional?.nome || 'Profissional não encontrado',
        professionalRegistro: consultation.professional?.registro,
        professionalEspecialidade: consultation.professional?.especialidade
      })) || [];
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar consultas com detalhes:', error);
      
      if (user && !authLoading) {
        toast({
          title: 'Erro ao carregar consultas',
          description: error.message || 'Não foi possível carregar as consultas com detalhes',
          variant: 'destructive',
        });
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getConsultationsWithDetails
  };
};
