import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/patient';
import { processPatientData, preparePatientForInsert, preparePatientForUpdate } from '@/utils/patientUtils';

export const fetchPatients = async (userId: string): Promise<Patient[]> => {
  console.log('🔍 DEBUG: fetchPatients - Iniciando busca de pacientes');
  console.log('👤 DEBUG: fetchPatients - User ID:', userId);
  
  try {
    // Verificar se o usuário está autenticado antes de fazer a requisição
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('❌ DEBUG: fetchPatients - Usuário não autenticado:', authError);
      return [];
    }
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .order('nome', { ascending: true });
    
    if (error) {
      console.error('❌ DEBUG: fetchPatients - Erro do Supabase:', error);
      console.error('❌ DEBUG: fetchPatients - Error code:', error.code);
      console.error('❌ DEBUG: fetchPatients - Error message:', error.message);
      
      // Se for erro de rede, retornar array vazio sem throw
      if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch')) {
        console.log('🌐 DEBUG: fetchPatients - Erro de rede detectado, retornando array vazio');
        return [];
      }
      
      throw error;
    }
    
    console.log('📊 DEBUG: fetchPatients - Dados brutos retornados:', data);
    console.log('📊 DEBUG: fetchPatients - Quantidade de registros:', data?.length || 0);
    
    if (!data || data.length === 0) {
      console.log('ℹ️ DEBUG: fetchPatients - Nenhum paciente encontrado para este usuário');
      return [];
    }
    
    const processedPatients = data.map(processPatientData);
    console.log('✅ DEBUG: fetchPatients - Pacientes processados:', processedPatients);
    
    return processedPatients;
  } catch (error) {
    console.error('❌ DEBUG: fetchPatients - Erro na operação:', error);
    
    // Para erros de rede, não fazer throw para evitar erro contínuo
    if (error instanceof Error && error.message?.includes('Failed to fetch')) {
      console.log('🌐 DEBUG: fetchPatients - Tratando erro de rede graciosamente');
      return [];
    }
    
    throw error;
  }
};

export const insertPatient = async (patientData: Omit<Patient, 'id' | 'idade' | 'ultimaConsulta'>, userId: string): Promise<Patient> => {
  console.log('🚀 DEBUG: insertPatient - Iniciando inserção de paciente');
  console.log('📝 DEBUG: insertPatient - Dados recebidos:', patientData);
  console.log('👤 DEBUG: insertPatient - User ID:', userId);
  
  try {
    // Verificar se o usuário está autenticado no Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ DEBUG: insertPatient - Erro de autenticação:', authError);
      throw new Error('Erro de autenticação: ' + authError.message);
    }
    
    if (!user) {
      console.error('❌ DEBUG: insertPatient - Usuário não autenticado no Supabase');
      throw new Error('Usuário não autenticado');
    }
    
    console.log('✅ DEBUG: insertPatient - Usuário autenticado no Supabase:', user.id);
    console.log('📧 DEBUG: insertPatient - Email do usuário:', user.email);
    
    // Verificar se o userId passado corresponde ao usuário autenticado
    if (user.id !== userId) {
      console.error('❌ DEBUG: insertPatient - ID do usuário não confere');
      console.log('📊 DEBUG: insertPatient - User ID from auth:', user.id);
      console.log('📊 DEBUG: insertPatient - User ID passed:', userId);
      throw new Error('ID do usuário não confere com o usuário autenticado');
    }
    
    const insertData = preparePatientForInsert(patientData, userId);
    console.log('📋 DEBUG: insertPatient - Dados preparados para inserção:', insertData);
    
    // Verificar se já existe paciente com o mesmo CPF para este usuário
    console.log('🔍 DEBUG: insertPatient - Verificando CPF duplicado...');
    const { data: existingPatient, error: checkError } = await supabase
      .from('patients')
      .select('id, cpf')
      .eq('user_id', userId)
      .eq('cpf', insertData.cpf)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('❌ DEBUG: insertPatient - Erro ao verificar CPF:', checkError);
      throw checkError;
    }
    
    if (existingPatient) {
      console.error('❌ DEBUG: insertPatient - CPF já existe:', existingPatient);
      throw new Error('Já existe um paciente cadastrado com este CPF');
    }
    
    console.log('✅ DEBUG: insertPatient - CPF disponível, prosseguindo com inserção...');
    
    const { data, error } = await supabase
      .from('patients')
      .insert([insertData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ DEBUG: insertPatient - Erro do Supabase na inserção:', error);
      console.error('❌ DEBUG: insertPatient - Error code:', error.code);
      console.error('❌ DEBUG: insertPatient - Error message:', error.message);
      console.error('❌ DEBUG: insertPatient - Error details:', error.details);
      console.error('❌ DEBUG: insertPatient - Error hint:', error.hint);
      
      // Traduzir erros comuns
      if (error.code === '23505') {
        throw new Error('Já existe um paciente com este CPF');
      }
      
      if (error.message.includes('violates row-level security')) {
        throw new Error('Erro de permissão: não é possível salvar o paciente');
      }
      
      throw error;
    }
    
    if (!data) {
      console.error('❌ DEBUG: insertPatient - Nenhum dado retornado após inserção');
      throw new Error('Falha na inserção: nenhum dado retornado');
    }
    
    console.log('🎉 DEBUG: insertPatient - Paciente inserido com sucesso:', data);
    const processedPatient = processPatientData(data);
    console.log('✅ DEBUG: insertPatient - Paciente processado:', processedPatient);
    
    return processedPatient;
  } catch (error) {
    console.error('❌ DEBUG: insertPatient - Erro geral na operação:', error);
    throw error;
  }
};

export const fetchPatientById = async (id: string, userId: string): Promise<Patient | null> => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  if (!data) return null;
  
  return processPatientData(data);
};

export const updatePatientById = async (id: string, patientData: Partial<Patient>, userId: string): Promise<Patient> => {
  console.log('Atualizando paciente:', id, patientData);
  
  const dataToUpdate = preparePatientForUpdate(patientData);
  
  const { data, error } = await supabase
    .from('patients')
    .update(dataToUpdate)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Erro do Supabase ao atualizar paciente:', error);
    throw error;
  }
  
  console.log('Paciente atualizado com sucesso:', data);
  return processPatientData(data);
};

export const removePatient = async (id: string, userId: string): Promise<void> => {
  console.log('Excluindo paciente:', id);
  
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Erro do Supabase ao excluir paciente:', error);
    throw error;
  }
  
  console.log('Paciente excluído com sucesso');
};

export const removeAllPatients = async (userId: string): Promise<void> => {
  console.log('Excluindo todos os pacientes para usuário:', userId);
  
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('user_id', userId);
  
  if (error) {
    console.error('Erro do Supabase ao excluir todos os pacientes:', error);
    throw error;
  }
  
  console.log('Todos os pacientes foram excluídos com sucesso');
};
