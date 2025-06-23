
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Patient } from '@/types/patient';
import { 
  fetchPatients, 
  insertPatient, 
  fetchPatientById, 
  updatePatientById, 
  removePatient, 
  removeAllPatients 
} from '@/services/patientService';

let patientsCache: Patient[] | null = null;
let isLoadingPatients = false;

export const usePatients = () => {
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();
  const { toast } = useToast();

  const getPatients = async (): Promise<Patient[]> => {
    try {
      // Verificar tanto user quanto session para autenticação
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        console.log('❌ DEBUG: Usuário não autenticado para buscar pacientes');
        return [];
      }

      // Verificar se já está carregando para evitar múltiplas requisições
      if (isLoadingPatients) {
        console.log('⏳ DEBUG: Já existe uma requisição em andamento, aguardando...');
        // Aguardar um pouco e tentar novamente
        await new Promise(resolve => setTimeout(resolve, 100));
        return patientsCache || [];
      }

      // Se já temos dados em cache, retornar
      if (patientsCache) {
        console.log('💾 DEBUG: Retornando pacientes do cache');
        return patientsCache;
      }
      
      isLoadingPatients = true;
      setLoading(true);
      
      console.log('🔍 DEBUG: Buscando pacientes para usuário:', currentUser.id);
      
      const patients = await fetchPatients(currentUser.id);
      console.log('✅ DEBUG: Pacientes retornados no usePatients:', patients);
      
      // Armazenar no cache
      patientsCache = patients;
      
      return patients;
    } catch (error: any) {
      console.error('❌ DEBUG: Erro ao buscar pacientes no usePatients:', error);
      
      // Não mostrar toast de erro para problemas de rede comum
      if (!error.message?.includes('Failed to fetch')) {
        toast({
          title: 'Erro ao carregar pacientes',
          description: error.message || 'Não foi possível carregar a lista de pacientes',
          variant: 'destructive',
        });
      }
      return [];
    } finally {
      setLoading(false);
      isLoadingPatients = false;
    }
  };

  const createPatient = async (patientData: Omit<Patient, 'id' | 'idade' | 'ultimaConsulta'>): Promise<Patient | null> => {
    try {
      setLoading(true);
      
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        console.error('❌ DEBUG: Usuário não autenticado - não é possível criar paciente');
        toast({
          title: 'Erro de autenticação',
          description: 'Você precisa estar logado para cadastrar pacientes',
          variant: 'destructive',
        });
        return null;
      }
      
      console.log('🚀 DEBUG: Iniciando criação de paciente');
      
      // Validar dados obrigatórios
      if (!patientData.nome || !patientData.cpf || !patientData.telefone) {
        toast({
          title: 'Dados incompletos',
          description: 'Nome, CPF e telefone são obrigatórios',
          variant: 'destructive',
        });
        return null;
      }
      
      const result = await insertPatient(patientData, currentUser.id);
      
      // Limpar cache para forçar recarregamento
      patientsCache = null;
      
      toast({
        title: 'Paciente cadastrado com sucesso!',
        description: `${patientData.nome} foi adicionado ao sistema.`,
      });
      
      return result;
    } catch (error: any) {
      console.error('❌ DEBUG: Erro ao criar paciente:', error);
      
      let errorMessage = 'Não foi possível cadastrar o paciente';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Erro ao cadastrar paciente',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPatientById = async (id: string): Promise<Patient | null> => {
    try {
      setLoading(true);
      
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      return await fetchPatientById(id, currentUser.id);
    } catch (error: any) {
      console.error('Erro ao buscar paciente:', error);
      toast({
        title: 'Erro ao carregar paciente',
        description: error.message || 'Não foi possível carregar os dados do paciente',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (id: string, patientData: Partial<Patient>): Promise<Patient | null> => {
    try {
      setLoading(true);
      
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      const result = await updatePatientById(id, patientData, currentUser.id);
      
      // Limpar cache para forçar recarregamento
      patientsCache = null;
      
      toast({
        title: 'Paciente atualizado com sucesso!',
        description: `Os dados de ${result.nome} foram atualizados.`,
      });
      
      return result;
    } catch (error: any) {
      console.error('Erro ao atualizar paciente:', error);
      toast({
        title: 'Erro ao atualizar paciente',
        description: error.message || 'Não foi possível atualizar os dados do paciente',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      await removePatient(id, currentUser.id);
      
      // Limpar cache para forçar recarregamento
      patientsCache = null;
      
      toast({
        title: 'Paciente removido com sucesso',
        description: 'O paciente foi removido do sistema.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir paciente:', error);
      toast({
        title: 'Erro ao remover paciente',
        description: error.message || 'Não foi possível remover o paciente',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAllPatients = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      const currentUser = user || session?.user;
      
      if (!currentUser) {
        console.error('Usuário não autenticado - não é possível excluir pacientes');
        toast({
          title: 'Erro de autenticação',
          description: 'Você precisa estar logado para excluir pacientes',
          variant: 'destructive',
        });
        return false;
      }
      
      await removeAllPatients(currentUser.id);
      
      // Limpar cache
      patientsCache = null;
      
      toast({
        title: 'Pacientes removidos com sucesso',
        description: 'Todos os pacientes foram removidos do sistema.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir todos os pacientes:', error);
      toast({
        title: 'Erro ao remover pacientes',
        description: error.message || 'Não foi possível remover os pacientes',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    deleteAllPatients
  };
};

export type { Patient };
