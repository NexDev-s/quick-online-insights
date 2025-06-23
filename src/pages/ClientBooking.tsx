
import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, ArrowLeft, Stethoscope, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const ClientBooking = () => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    dataConsulta: '',
    horario: '',
    profissional: '',
    tipoConsulta: 'primeira',
    tipoAtendimento: 'particular',
    observacoes: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.telefone || !formData.dataConsulta || !formData.horario) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Simular envio do agendamento
    toast({
      title: "Agendamento solicitado!",
      description: "Entraremos em contato em breve para confirmar sua consulta.",
    });

    // Limpar formulário
    setFormData({
      nome: '',
      telefone: '',
      email: '',
      dataConsulta: '',
      horario: '',
      profissional: '',
      tipoConsulta: 'primeira',
      tipoAtendimento: 'particular',
      observacoes: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const profissionais = [
    'Dr. João Silva - Cardiologia',
    'Dra. Maria Santos - Pediatria',
    'Dr. Pedro Oliveira - Dermatologia',
    'Dra. Ana Costa - Ginecologia',
    'Dr. Carlos Mendes - Ortopedia'
  ];

  const horarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Moderno */}
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="text-white h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Salus
                </h1>
                <p className="text-sm text-gray-500">Sistema de Gestão Médica</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" className="hover:bg-blue-50 border-blue-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Área Administrativa
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Calendar className="text-white h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Agende sua Consulta
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema inteligente de agendamento médico. Preencha o formulário e nossa equipe entrará em contato para confirmar sua consulta.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <User className="h-6 w-6 mr-3 text-blue-600" />
                  Dados do Agendamento
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Preencha suas informações para solicitar um agendamento médico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nome" className="text-sm font-semibold text-gray-700">Nome Completo *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        placeholder="Seu nome completo"
                        className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone" className="text-sm font-semibold text-gray-700">Telefone *</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="dataConsulta" className="text-sm font-semibold text-gray-700">Data da Consulta *</Label>
                      <Input
                        id="dataConsulta"
                        type="date"
                        value={formData.dataConsulta}
                        onChange={(e) => handleInputChange('dataConsulta', e.target.value)}
                        className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="horario" className="text-sm font-semibold text-gray-700">Horário *</Label>
                      <Select onValueChange={(value) => handleInputChange('horario', value)}>
                        <SelectTrigger className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {horarios.map((horario) => (
                            <SelectItem key={horario} value={horario}>
                              {horario}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="profissional" className="text-sm font-semibold text-gray-700">Profissional (Opcional)</Label>
                    <Select onValueChange={(value) => handleInputChange('profissional', value)}>
                      <SelectTrigger className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Selecione um profissional" />
                      </SelectTrigger>
                      <SelectContent>
                        {profissionais.map((prof) => (
                          <SelectItem key={prof} value={prof}>
                            {prof}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="tipoConsulta" className="text-sm font-semibold text-gray-700">Tipo de Consulta</Label>
                      <Select onValueChange={(value) => handleInputChange('tipoConsulta', value)} defaultValue="primeira">
                        <SelectTrigger className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primeira">Primeira Consulta</SelectItem>
                          <SelectItem value="retorno">Retorno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tipoAtendimento" className="text-sm font-semibold text-gray-700">Tipo de Atendimento</Label>
                      <Select onValueChange={(value) => handleInputChange('tipoAtendimento', value)} defaultValue="particular">
                        <SelectTrigger className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="particular">Particular</SelectItem>
                          <SelectItem value="convenio">Convênio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="observacoes" className="text-sm font-semibold text-gray-700">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      placeholder="Descreva o motivo da consulta ou observações importantes"
                      rows={4}
                      className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg shadow-lg"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Solicitar Agendamento
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Informações da Clínica */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Clock className="h-5 w-5 mr-2" />
                  Horários de Funcionamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Segunda a Sexta:</span>
                    <span className="font-semibold text-gray-900">08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Sábado:</span>
                    <span className="font-semibold text-gray-900">08:00 - 12:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Domingo:</span>
                    <span className="font-semibold text-red-600">Fechado</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Nossos Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profissionais.map((prof, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-800">{prof}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-900">Tipos de Consulta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Primeira Consulta</h4>
                    <p className="text-sm text-purple-700">Avaliação inicial completa, anamnese e exame físico detalhado</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Retorno</h4>
                    <p className="text-sm text-blue-700">Acompanhamento e reavaliação de pacientes já atendidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <MapPin className="h-5 w-5 mr-2" />
                  Contato e Localização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">(11) 3456-7890</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">contato@flashclinic.com</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-blue-600 mt-1" />
                    <span className="text-gray-700">Rua das Clínicas, 123<br/>São Paulo - SP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientBooking;
