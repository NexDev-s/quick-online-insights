
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface UnitFormProps {
  unit?: any;
  onBack: () => void;
  onSave: (unitData: any) => void;
}

const UnitForm = ({ unit, onBack, onSave }: UnitFormProps) => {
  const form = useForm({
    defaultValues: {
      nome: unit?.nome || '',
      endereco: unit?.endereco || '',
      telefone: unit?.telefone || '',
      email: unit?.email || '',
      responsavel: unit?.responsavel || '',
      tipo: unit?.tipo || 'Filial',
      status: unit?.status || 'Ativo',
    }
  });

  const handleSubmit = (data: any) => {
    onSave(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4 hover:bg-purple-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Building2 className="text-white h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {unit ? 'Editar Unidade' : 'Nova Unidade'}
              </h1>
              <p className="text-gray-600">
                {unit ? 'Atualize as informações da unidade' : 'Cadastre uma nova unidade da organização'}
              </p>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
            <CardTitle className="text-2xl text-purple-800">Informações da Unidade</CardTitle>
            <CardDescription className="text-purple-600">
              Preencha todos os campos obrigatórios para cadastrar a unidade
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Nome da Unidade *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Unidade Centro" 
                            {...field} 
                            className="h-12"
                          />
                        </FormControl>
                        <FormDescription>
                          Nome identificador da unidade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Tipo de Unidade *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Matriz">Matriz</SelectItem>
                            <SelectItem value="Filial">Filial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Classificação da unidade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Endereço Completo *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Rua, número, bairro, cidade, CEP" 
                          {...field} 
                          className="h-12"
                        />
                      </FormControl>
                      <FormDescription>
                        Endereço completo da unidade
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Telefone *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(11) 3456-7890" 
                            {...field} 
                            className="h-12"
                          />
                        </FormControl>
                        <FormDescription>
                          Telefone principal da unidade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">E-mail *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="unidade@clinica.com.br" 
                            {...field} 
                            className="h-12"
                          />
                        </FormControl>
                        <FormDescription>
                          E-mail de contato da unidade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="responsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Responsável *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Dr. João Silva" 
                            {...field} 
                            className="h-12"
                          />
                        </FormControl>
                        <FormDescription>
                          Nome do responsável pela unidade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Ativo">Ativo</SelectItem>
                            <SelectItem value="Inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Status de funcionamento da unidade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onBack}
                    className="px-8"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-8"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {unit ? 'Atualizar' : 'Cadastrar'} Unidade
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitForm;
