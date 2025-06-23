import React from 'react';
import { Calendar, Users, Clock, FileText, BarChart3, Activity, Plus, Search, AlertCircle, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Dashboard = ({ onNavigate, selectedPlan, onPlanChange }) => {
  const handleNavigate = (section) => {
    if (section === 'pacientes') {
      onNavigate('patients');
    } else if (section === 'agenda') {
      onNavigate('appointments');
    } else if (section === 'relatorios') {
      onNavigate('consultation-history');
    }
  };

  const stats = [
    {
      title: 'Pacientes Hoje',
      value: '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Próxima Consulta',
      value: '--:--',
      subtitle: 'Nenhuma agendada',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Atendimentos',
      value: '0',
      subtitle: 'Este mês',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pendências',
      value: '0',
      subtitle: 'Retornos',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
  ];

  const quickActions = [
    {
      title: 'Triagem',
      description: 'Classificar paciente',
      icon: Activity,
      color: 'bg-red-600 hover:bg-red-700',
      action: () => onNavigate('triagem')
    },
    {
      title: 'Novo Atendimento',
      description: 'Iniciar consulta',
      icon: FileText,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => onNavigate('novo-atendimento')
    },
    {
      title: 'Cadastrar Paciente',
      description: 'Novo registro',
      icon: Plus,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => onNavigate('patients')
    },
    {
      title: 'Buscar Paciente',
      description: 'Localizar registro',
      icon: Search,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => onNavigate('patients')
    },
  ];

  // Mock data para pacientes aguardando atendimento
  const pacientesAguardando = [
    { nome: 'Maria Silva', classificacao: 'amarelo', tempo: '15 min', queixa: 'Dor abdominal' },
    { nome: 'João Santos', classificacao: 'verde', tempo: '45 min', queixa: 'Consulta de rotina' },
    { nome: 'Ana Costa', classificacao: 'laranja', tempo: '8 min', queixa: 'Dificuldade respiratória' },
  ];

  const getClassificacaoColor = (classificacao) => {
    switch (classificacao) {
      case 'vermelho': return 'bg-red-500';
      case 'laranja': return 'bg-orange-500';
      case 'amarelo': return 'bg-yellow-500';
      case 'verde': return 'bg-green-500';
      case 'azul': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Painel de Controle</h2>
            <p className="text-blue-100">Terça-feira, 05 de Junho de 2025</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-blue-200">Próxima consulta</p>
              <p className="text-xl font-bold">Não agendada</p>
            </div>
            {/* Seletor de Plano */}
            <div className="bg-white/10 rounded-lg p-2">
              <Select value={selectedPlan} onValueChange={onPlanChange}>
                <SelectTrigger className="w-[180px] bg-transparent border-white/20 text-white">
                  <SelectValue placeholder="Selecionar Plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Plano Básico</SelectItem>
                  <SelectItem value="professional">Plano Profissional</SelectItem>
                  <SelectItem value="enterprise">Plano Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-xs text-gray-600 mt-1">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions - Triagem primeiro */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              onClick={action.action}
              className={`h-20 flex-col space-y-2 ${action.color} text-white`}
            >
              <Icon className="h-6 w-6" />
              <div className="text-center">
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule - Empty State */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Agenda de Hoje
            </CardTitle>
            <CardDescription>0 consultas agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma consulta agendada para hoje
              </h3>
              <p className="text-gray-600 mb-4">
                Comece criando agendamentos para seus pacientes
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" 
                onClick={() => onNavigate('appointments')}
              >
                Criar Primeiro Agendamento
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Pacientes Aguardando Atendimento */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Pacientes Aguardando</CardTitle>
              <CardDescription>Triagens realizadas, prontos para atendimento</CardDescription>
            </CardHeader>
            <CardContent>
              {pacientesAguardando.length > 0 ? (
                <div className="space-y-3">
                  {pacientesAguardando.map((paciente, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 ${getClassificacaoColor(paciente.classificacao)} rounded-full`}></div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{paciente.nome}</p>
                          <p className="text-xs text-gray-600">{paciente.queixa}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Aguardando</p>
                        <p className="text-xs font-medium text-blue-600">{paciente.tempo}</p>
                      </div>
                    </div>
                  ))}
                  <Button 
                    className="w-full mt-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" 
                    onClick={() => onNavigate('novo-atendimento')}
                  >
                    Iniciar Próximo Atendimento
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Nenhum paciente aguardando</p>
                  <Button 
                    variant="outline" 
                    className="mt-2 text-xs"
                    onClick={() => onNavigate('triagem')}
                  >
                    Realizar Triagem
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Reports */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Relatórios Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-10" size="sm">
                <BarChart3 className="mr-2 h-4 w-4 text-blue-600" />
                Atendimentos do Dia
              </Button>
              <Button variant="outline" className="w-full justify-start h-10" size="sm">
                <FileText className="mr-2 h-4 w-4 text-green-600" />
                Receitas Emitidas
              </Button>
              <Button variant="outline" className="w-full justify-start h-10" size="sm">
                <Users className="mr-2 h-4 w-4 text-purple-600" />
                Novos Pacientes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
