import React, { useState } from 'react';
import { Calendar, Users, Clock, FileText, BarChart3, Activity, Stethoscope, UserPlus, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useTriagemList } from '@/hooks/useTriagemList';
const BasicDashboard = ({
  onNavigate,
  selectedPlan,
  onPlanChange
}) => {
  const {
    logout
  } = useAuth();
  const {
    pacientesAguardando,
    loading: loadingTriagens
  } = useTriagemList();
  const handleNavigate = section => {
    if (section === 'pacientes') {
      onNavigate('patients');
    } else if (section === 'agenda') {
      onNavigate('appointments');
    } else if (section === 'relatorios') {
      onNavigate('novo-atendimento');
    } else if (section === 'professionals') {
      onNavigate('professionals');
    }
  };
  const handleIniciarAtendimento = paciente => {
    // Navegar para o atendimento com o paciente selecionado
    onNavigate('novo-atendimento');
  };
  const getClassificacaoColor = classificacao => {
    switch (classificacao) {
      case 'vermelho':
        return 'bg-red-500';
      case 'laranja':
        return 'bg-orange-500';
      case 'amarelo':
        return 'bg-yellow-500';
      case 'verde':
        return 'bg-green-500';
      case 'azul':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getTempoEspera = createdAt => {
    const agora = new Date();
    const criacao = new Date(createdAt);
    const diffMs = agora.getTime() - criacao.getTime();
    const diffMinutos = Math.floor(diffMs / (1000 * 60));
    if (diffMinutos < 60) {
      return `${diffMinutos} min`;
    } else {
      const horas = Math.floor(diffMinutos / 60);
      const minutos = diffMinutos % 60;
      return `${horas}h ${minutos}min`;
    }
  };
  const basicStats = [{
    title: 'Pacientes Cadastrados',
    value: '32',
    limit: '50',
    icon: Users,
    color: 'text-green-700',
    bgColor: 'bg-green-50'
  }, {
    title: 'Agendamentos Hoje',
    value: '5',
    limit: '10',
    icon: Calendar,
    color: 'text-green-700',
    bgColor: 'bg-green-50'
  }, {
    title: 'Consultas do Mês',
    value: '45',
    limit: '100',
    icon: Activity,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }, {
    title: 'Taxa de Ocupação',
    value: '85%',
    limit: '100%',
    icon: BarChart3,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }];
  const upcomingAppointments = [{
    time: '09:00',
    patient: 'Maria Silva',
    type: 'Consulta',
    status: 'confirmado'
  }, {
    time: '10:30',
    patient: 'Pedro Santos',
    type: 'Retorno',
    status: 'confirmado'
  }, {
    time: '14:00',
    patient: 'José Oliveira',
    type: 'Consulta',
    status: 'pendente'
  }];
  const basicFeatures = ['Cadastro de até 50 pacientes', 'Agendamentos básicos', 'Prontuário eletrônico simples', 'Cadastro de profissionais', 'Relatórios básicos', 'Suporte por email', 'Backup semanal'];
  return <div className="space-y-6">
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Plano Básico</h2>
            <p className="text-green-100 text-lg">Ideal para profissionais autônomos</p>
            <p className="text-green-200 text-sm mt-2">Até 50 pacientes • 1 profissional</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-4">
              <Badge className="bg-white text-green-700 hover:bg-gray-100 text-lg px-4 py-2">
                Demonstração
              </Badge>
              
              <Button onClick={logout} variant="ghost" className="text-white hover:bg-white/10">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200" onClick={() => onNavigate('novo-atendimento')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <FileText className="mr-2 h-5 w-5 text-green-600" />
              Atendimento Básico
            </CardTitle>
            <CardDescription>
              Anamnese simples e prescrições
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
              Novo Atendimento
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200" onClick={() => onNavigate('patients')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-2 h-5 w-5 text-green-600" />
              Pacientes
            </CardTitle>
            <CardDescription>
              Cadastro e gestão básica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              Gerenciar Pacientes
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200" onClick={() => handleNavigate('professionals')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <UserPlus className="mr-2 h-5 w-5 text-green-600" />
              Profissionais
            </CardTitle>
            <CardDescription>
              Cadastro de profissionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              Gerenciar Profissionais
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200" onClick={() => onNavigate('appointments')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 h-5 w-5 text-green-600" />
              Agenda
            </CardTitle>
            <CardDescription>
              Agendamentos simples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              Ver Agenda
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {basicStats.map((stat, index) => {
        const Icon = stat.icon;
        const percentage = stat.title === 'Taxa de Ocupação' ? parseFloat(stat.value.replace('%', '')) : parseInt(stat.value) / parseInt(stat.limit) * 100;
        return <Card key={index} className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600">
                  {stat.limit !== 'Ilimitado' && `Limite: ${stat.limit}`}
                </p>
                {stat.title === 'Taxa de Ocupação' && <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{
                width: `${percentage}%`
              }}></div>
                  </div>}
              </CardContent>
            </Card>;
      })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-green-800">
              <Calendar className="mr-2 h-5 w-5" />
              Agenda de Hoje
            </CardTitle>
            <CardDescription>Próximos agendamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment, index) => <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-bold text-green-700 bg-white px-2 py-1 rounded">
                      {appointment.time}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                    </div>
                  </div>
                  <Badge variant={appointment.status === 'confirmado' ? 'default' : 'secondary'} className="text-xs">
                    {appointment.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                  </Badge>
                </div>)}
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" onClick={() => onNavigate('appointments')}>
              Ver Agenda Completa
            </Button>
          </CardContent>
        </Card>

        {/* Pacientes Aguardando Atendimento */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-green-800">Pacientes Aguardando</CardTitle>
            <CardDescription>Fila de atendimento por prioridade</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTriagens ? <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Carregando...</p>
              </div> : pacientesAguardando.length > 0 ? <div className="space-y-3 max-h-64 overflow-y-auto">
                {pacientesAguardando.map((triagem, index) => <div key={triagem.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => handleIniciarAtendimento(triagem)}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 ${getClassificacaoColor(triagem.classificacao_manchester)} rounded-full`}></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{triagem.patientName}</p>
                        <p className="text-xs text-gray-600">{triagem.queixa_principal}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Aguardando</p>
                      <p className="text-xs font-medium text-green-600">{getTempoEspera(triagem.created_at)}</p>
                    </div>
                  </div>)}
              </div> : <div className="text-center py-6">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Nenhum paciente aguardando</p>
                <Button variant="outline" className="mt-2 text-xs" onClick={() => onNavigate('triagem')} disabled>
                  Triagem (Upgrade necessário)
                </Button>
              </div>}
          </CardContent>
        </Card>

        {/* Analytics and Features */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-green-800">Recursos Incluídos</CardTitle>
            <CardDescription>No plano básico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {basicFeatures.map((feature, index) => <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm">{feature}</span>
                </div>)}
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  Suporte em horário comercial
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default BasicDashboard;