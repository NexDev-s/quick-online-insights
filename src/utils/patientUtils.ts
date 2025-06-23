
export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const processPatientData = (patientData: any) => {
  console.log('🔄 DEBUG: processPatientData - Dados de entrada:', patientData);
  
  if (!patientData) {
    console.error('❌ DEBUG: processPatientData - Dados nulos ou indefinidos');
    return null;
  }
  
  if (!patientData.nascimento) {
    console.error('❌ DEBUG: processPatientData - Data de nascimento não encontrada');
    return patientData;
  }
  
  try {
    const processed = {
      ...patientData,
      idade: calculateAge(patientData.nascimento),
      ultimaConsulta: 'Nunca'
    };
    console.log('✅ DEBUG: processPatientData - Dados processados:', processed);
    return processed;
  } catch (error) {
    console.error('❌ DEBUG: processPatientData - Erro ao processar:', error);
    return patientData;
  }
};

export const preparePatientForInsert = (patientData: any, userId: string) => {
  console.log('📋 DEBUG: preparePatientForInsert - Iniciando preparação');
  console.log('📝 DEBUG: preparePatientForInsert - Dados originais:', patientData);
  console.log('👤 DEBUG: preparePatientForInsert - User ID:', userId);
  
  if (!userId) {
    console.error('❌ DEBUG: preparePatientForInsert - User ID não fornecido');
    throw new Error('ID do usuário é obrigatório');
  }
  
  if (!patientData) {
    console.error('❌ DEBUG: preparePatientForInsert - Dados do paciente não fornecidos');
    throw new Error('Dados do paciente são obrigatórios');
  }
  
  // Validar campos obrigatórios
  if (!patientData.nome?.trim()) {
    throw new Error('Nome é obrigatório');
  }
  
  if (!patientData.cpf?.trim()) {
    throw new Error('CPF é obrigatório');
  }
  
  if (!patientData.telefone?.trim()) {
    throw new Error('Telefone é obrigatório');
  }
  
  if (!patientData.nascimento) {
    throw new Error('Data de nascimento é obrigatória');
  }
  
  const prepared = {
    nome: patientData.nome.trim(),
    cpf: patientData.cpf.trim().replace(/\D/g, ''), // Remove caracteres não numéricos
    telefone: patientData.telefone.trim(),
    email: patientData.email?.trim() || null,
    nascimento: patientData.nascimento,
    convenio: patientData.convenio?.trim() || null,
    endereco: patientData.endereco?.trim() || null,
    genero: patientData.genero || null,
    responsavel: patientData.responsavel?.trim() || null,
    observacoes: patientData.observacoes?.trim() || null,
    status: patientData.status || 'Ativo',
    user_id: userId
  };
  
  console.log('✅ DEBUG: preparePatientForInsert - Dados preparados:', prepared);
  return prepared;
};

export const preparePatientForUpdate = (patientData: any) => {
  console.log('🔄 DEBUG: preparePatientForUpdate - Preparando dados para atualização:', patientData);
  const { idade, ultimaConsulta, ...dataToUpdate } = patientData;
  console.log('✅ DEBUG: preparePatientForUpdate - Dados preparados:', dataToUpdate);
  return dataToUpdate;
};
