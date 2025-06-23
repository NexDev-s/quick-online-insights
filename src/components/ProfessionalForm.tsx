
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Stethoscope, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useProfessionals, Professional } from '@/hooks/useProfessionals';

const professionalSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  tipo: z.string().min(1, 'Selecione o tipo de profissional'),
  registro: z.string().min(3, 'Número de registro é obrigatório'),
  especialidade: z.string().min(2, 'Especialidade é obrigatória'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  horario_inicio: z.string().optional(),
  horario_fim: z.string().optional(),
  observacoes: z.string().optional(),
});

type ProfessionalFormData = z.infer<typeof professionalSchema>;

interface ProfessionalFormProps {
  onBack: () => void;
  onSave: (professional: any) => void;
}

const ProfessionalForm = ({ onBack, onSave }: ProfessionalFormProps) => {
  const { toast } = useToast();
  const { createProfessional, loading } = useProfessionals();

  const form = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      nome: '',
      tipo: '',
      registro: '',
      especialidade: '',
      telefone: '',
      email: '',
      horario_inicio: '08:00',
      horario_fim: '18:00',
      observacoes: '',
    },
  });

  const professionTypes = [
    { value: 'medico', label: 'Médico', registro: 'CRM' },
    { value: 'dentista', label: 'Dentista', registro: 'CRO' },
    { value: 'nutricionista', label: 'Nutricionista', registro: 'CRN' },
    { value: 'psicologo', label: 'Psicólogo', registro: 'CRP' },
    { value: 'fisioterapeuta', label: 'Fisioterapeuta', registro: 'CREFITO' },
    { value: 'enfermeiro', label: 'Enfermeiro', registro: 'COREN' },
    { value: 'farmaceutico', label: 'Farmacêutico', registro: 'CRF' },
    { value: 'fonoaudiologo', label: 'Fonoaudiólogo', registro: 'CRFa' },
    { value: 'terapeutaocupacional', label: 'Terapeuta Ocupacional', registro: 'CREFITO' },
    { value: 'biomedico', label: 'Biomédico', registro: 'CRBM' },
    { value: 'veterinario', label: 'Veterinário', registro: 'CRMV' },
    { value: 'assistentesocial', label: 'Assistente Social', registro: 'CRESS' },
  ];

  const onSubmit = async (data: ProfessionalFormData) => {
    console.log('Salvando profissional:', data);
    
    try {
      // Garantir que os dados obrigatórios estão presentes antes de enviar
      const professionalData: Omit<Professional, 'id'> = {
        nome: data.nome,
        tipo: data.tipo,
        registro: data.registro,
        especialidade: data.especialidade,
        telefone: data.telefone,
        email: data.email,
        horario_inicio: data.horario_inicio,
        horario_fim: data.horario_fim,
        observacoes: data.observacoes,
      };
      
      const newProfessional = await createProfessional(professionalData);
      
      if (newProfessional) {
        onSave(newProfessional);
      }
    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o profissional.",
        variant: "destructive",
      });
    }
  };

  const selectedProfessionType = professionTypes.find(p => p.value === form.watch('tipo'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4 hover:bg-emerald-50"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
              <Stethoscope className="text-white h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Novo Profissional</h1>
              <p className="text-gray-600">Cadastro completo de profissional de saúde</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="shadow-lg border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800">Dados do Profissional</CardTitle>
                <CardDescription>
                  Preencha todos os campos obrigatórios para cadastrar o profissional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo do profissional" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Profissional *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {professionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="registro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Número do Registro {selectedProfessionType && `(${selectedProfessionType.registro})`} *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 12345-SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="especialidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especialidade *</FormLabel>
                        <FormControl>
                          <Input placeholder="Especialidade do profissional" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone *</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@clinica.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="horario_inicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário de Início</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="horario_fim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário de Fim</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Input placeholder="Observações adicionais sobre o profissional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4 mt-6">
              <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
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
                    Cadastrar Profissional
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfessionalForm;
