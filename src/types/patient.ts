
export interface Patient {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  nascimento: string;
  convenio?: string;
  endereco?: string;
  genero?: string;
  responsavel?: string;
  observacoes?: string;
  status?: string;
  idade?: number; // Calculada, não armazenada
  ultimaConsulta?: string; // Calculada, não armazenada
}
