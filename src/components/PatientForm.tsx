import React, { useState } from 'react';
import { User, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePatients } from '@/hooks/usePatients';

const PatientForm = ({ onBack, onSave }) => {
  const { toast } = useToast();
  const { createPatient, loading } = usePatients();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    nascimento: '',
    convenio: '',
    endereco: '',
    genero: '',
    responsavel: '',
    observacoes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Iniciando salvamento do paciente:', formData);
    
    try {
      // Validar campos obrigatórios
      if (!formData.nome?.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O nome é obrigatório.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.cpf?.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O CPF é obrigatório.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.telefone?.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O telefone é obrigatório.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.nascimento) {
        toast({
          title: "Campo obrigatório",
          description: "A data de nascimento é obrigatória.",
          variant: "destructive",
        });
        return;
      }

      // Preparar dados para envio - garantir que strings vazias sejam null
      const patientDataToSave = {
        nome: formData.nome.trim(),
        cpf: formData.cpf.trim(),
        telefone: formData.telefone.trim(),
        email: formData.email?.trim() || null,
        nascimento: formData.nascimento,
        convenio: formData.convenio || null,
        endereco: formData.endereco?.trim() || null,
        genero: formData.genero || null,
        responsavel: formData.responsavel?.trim() || null,
        observacoes: formData.observacoes?.trim() || null,
        status: 'Ativo'
      };

      console.log('Dados preparados para salvamento:', patientDataToSave);
      
      // Salvar no banco de dados via Supabase
      const newPatient = await createPatient(patientDataToSave);
      
      if (newPatient) {
        console.log('Paciente salvo com sucesso:', newPatient);
        // Limpar formulário
        setFormData({
          nome: '',
          cpf: '',
          telefone: '',
          email: '',
          nascimento: '',
          convenio: '',
          endereco: '',
          genero: '',
          responsavel: '',
          observacoes: ''
        });
        
        if (onSave) {
          onSave(newPatient);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar o paciente.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field, value) => {
    console.log('Campo alterado:', field, 'Valor:', value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4 hover:bg-green-50"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <User className="text-white h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Novo Paciente</h1>
              <p className="text-gray-600">Cadastro completo de paciente</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Dados do Paciente</CardTitle>
              <CardDescription>
                Preencha todos os campos obrigatórios para cadastrar o paciente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Nome completo do paciente"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@exemplo.com"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nascimento">Data de Nascimento *</Label>
                  <Input
                    id="nascimento"
                    type="date"
                    value={formData.nascimento}
                    onChange={(e) => handleInputChange('nascimento', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="genero">Gênero</Label>
                  <Select value={formData.genero} onValueChange={(value) => handleInputChange('genero', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                      <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="convenio">Convênio</Label>
                  <Select value={formData.convenio} onValueChange={(value) => handleInputChange('convenio', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o convênio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="particular">Particular</SelectItem>
                      <SelectItem value="unimed">Unimed</SelectItem>
                      <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                      <SelectItem value="sulamerica">SulAmérica</SelectItem>
                      <SelectItem value="amil">Amil</SelectItem>
                      <SelectItem value="golden-cross">Golden Cross</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  placeholder="Rua, número, bairro, cidade, CEP"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="responsavel">Responsável (para menores de idade)</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={(e) => handleInputChange('responsavel', e.target.value)}
                  placeholder="Nome do responsável"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Observações adicionais sobre o paciente"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Cadastrar Paciente
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
