import React from 'react';
import { Monitor, Calendar, FileText, Users, BarChart3, Stethoscope } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
export const SalesScreenshots = () => {
  const screenshots = [{
    title: "Dashboard Profissional",
    description: "Visão geral completa com métricas em tempo real",
    icon: Monitor,
    mockup: {
      type: "dashboard",
      stats: [{
        label: "Pacientes Ativos",
        value: "1,247",
        color: "blue",
        trend: "+12%"
      }, {
        label: "Consultas Hoje",
        value: "28",
        color: "green",
        trend: "+8%"
      }, {
        label: "Receita Mensal",
        value: "R$ 45.8k",
        color: "purple",
        trend: "+15%"
      }]
    }
  }, {
    title: "Agenda Inteligente",
    description: "Agendamento automático com confirmações",
    icon: Calendar,
    mockup: {
      type: "calendar",
      appointments: [{
        time: "08:30",
        patient: "Maria Silva",
        type: "Consulta",
        status: "confirmed"
      }, {
        time: "09:15",
        patient: "João Santos",
        type: "Retorno",
        status: "pending"
      }, {
        time: "10:00",
        patient: "Ana Costa",
        type: "Exame",
        status: "confirmed"
      }, {
        time: "11:30",
        patient: "Carlos Lima",
        type: "Consulta",
        status: "confirmed"
      }]
    }
  }, {
    title: "Prontuário Digital",
    description: "Histórico completo e prescrições digitais",
    icon: FileText,
    mockup: {
      type: "record",
      patient: "Maria Silva Santos",
      age: "45 anos",
      fields: [{
        label: "Queixa Principal",
        content: "Dor de cabeça frequente há 2 semanas"
      }, {
        label: "Pressão Arterial",
        content: "130/80 mmHg"
      }, {
        label: "Diagnóstico",
        content: "Cefaleia tensional"
      }, {
        label: "Prescrição",
        content: "Dipirona 500mg - 1 comp. 8/8h"
      }]
    }
  }, {
    title: "Gestão de Pacientes",
    description: "Cadastro completo com histórico médico",
    icon: Users,
    mockup: {
      type: "patients",
      list: [{
        name: "Maria Silva Santos",
        age: "45",
        phone: "(11) 99999-1234",
        lastVisit: "15/12/2024",
        status: "Ativo"
      }, {
        name: "João Carlos Oliveira",
        age: "32",
        phone: "(11) 98888-5678",
        lastVisit: "14/12/2024",
        status: "Ativo"
      }, {
        name: "Ana Paula Costa",
        age: "28",
        phone: "(11) 97777-9012",
        lastVisit: "13/12/2024",
        status: "Ativo"
      }]
    }
  }, {
    title: "Triagem Manchester",
    description: "Classificação de risco automatizada",
    icon: Stethoscope,
    mockup: {
      type: "triage",
      patients: [{
        name: "Pedro Lima",
        priority: "red",
        time: "5 min",
        complaint: "Dor no peito",
        classification: "Emergência"
      }, {
        name: "Lucia Ferreira",
        priority: "yellow",
        time: "12 min",
        complaint: "Febre alta",
        classification: "Urgência"
      }, {
        name: "Carlos Souza",
        priority: "green",
        time: "25 min",
        complaint: "Check-up",
        classification: "Pouco Urgente"
      }]
    }
  }, {
    title: "Relatórios Gerenciais",
    description: "Analytics completos e insights estratégicos",
    icon: BarChart3,
    mockup: {
      type: "reports",
      metrics: [{
        title: "Faturamento Mensal",
        value: "R$ 45.800",
        change: "+15%"
      }, {
        title: "Consultas Realizadas",
        value: "324",
        change: "+8%"
      }, {
        title: "Taxa de Ocupação",
        value: "87%",
        change: "+3%"
      }]
    }
  }];
  const renderMockup = (mockup: any, index: number) => {
    switch (mockup.type) {
      case "dashboard":
        return <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Dashboard Executivo</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Atualizado agora</span>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {mockup.stats.map((stat: any, i: number) => <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">{stat.label}</span>
                    <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-${stat.color}-500 rounded-full animate-pulse`} style={{
                  width: '75%'
                }}></div>
                  </div>
                </div>)}
            </div>
            
            {/* Chart Area */}
            <div className="bg-white rounded-lg p-4 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-700">Consultas por Dia</span>
                <span className="text-xs text-slate-500">Últimos 7 dias</span>
              </div>
              <div className="flex items-end justify-between h-20 space-x-1">
                {[28, 35, 42, 38, 45, 52, 48].map((height, i) => <div key={i} className="flex-1 bg-blue-500 rounded-t opacity-70 hover:opacity-100 transition-opacity" style={{
                height: `${height}%`
              }}></div>)}
              </div>
            </div>
          </div>;
      case "calendar":
        return <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-2xl border border-blue-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Agenda do Dia</h3>
                <p className="text-sm text-slate-600">Segunda-feira, 16 de Dezembro</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                Nova Consulta
              </button>
            </div>
            
            {/* Appointments */}
            <div className="space-y-3">
              {mockup.appointments.map((apt: any, i: number) => <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-blue-600">{apt.time}</span>
                      <div className={`w-2 h-2 rounded-full ${apt.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{apt.patient}</p>
                      <p className="text-sm text-slate-600">{apt.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                      {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </Badge>
                  </div>
                </div>)}
            </div>
          </div>;
      case "record":
        return <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-2xl border border-green-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Prontuário Eletrônico</h3>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-sm font-medium text-slate-900">{mockup.patient}</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{mockup.age}</span>
                </div>
              </div>
              <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors">
                Salvar
              </button>
            </div>
            
            {/* Medical Record Fields */}
            <div className="space-y-4">
              {mockup.fields.map((field: any, i: number) => <div key={i} className="bg-white rounded-lg p-4 border border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
                  <div className="bg-slate-50 rounded-md p-3 border border-slate-200">
                    <p className="text-sm text-slate-800">{field.content}</p>
                  </div>
                </div>)}
            </div>
          </div>;
      case "patients":
        return <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 shadow-2xl border border-purple-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Gestão de Pacientes</h3>
              <div className="flex items-center space-x-2">
                <input type="text" placeholder="Buscar paciente..." className="px-3 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500" />
                <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors">
                  Adicionar
                </button>
              </div>
            </div>
            
            {/* Patient List */}
            <div className="space-y-3">
              {mockup.list.map((patient: any, i: number) => <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                      <span className="text-purple-700 font-medium text-sm">{patient.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{patient.name}</p>
                      <div className="flex items-center space-x-3 text-sm text-slate-600">
                        <span>{patient.age} anos</span>
                        <span>•</span>
                        <span>{patient.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Última consulta</p>
                    <p className="text-sm font-medium text-slate-900">{patient.lastVisit}</p>
                    <Badge variant="outline" className="text-xs mt-1">{patient.status}</Badge>
                  </div>
                </div>)}
            </div>
          </div>;
      case "triage":
        return <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 shadow-2xl border border-red-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Triagem Manchester</h3>
                <p className="text-sm text-slate-600">Classificação de Risco Automatizada</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-600">3 pacientes aguardando</span>
              </div>
            </div>
            
            {/* Triage Queue */}
            <div className="space-y-3">
              {mockup.patients.map((patient: any, i: number) => <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${patient.priority === 'red' ? 'bg-red-500 shadow-red-200 shadow-lg' : patient.priority === 'yellow' ? 'bg-yellow-500 shadow-yellow-200 shadow-lg' : 'bg-green-500 shadow-green-200 shadow-lg'} animate-pulse`}></div>
                    <div>
                      <p className="font-medium text-slate-900">{patient.name}</p>
                      <p className="text-sm text-slate-600">{patient.complaint}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={patient.priority === 'red' ? 'destructive' : patient.priority === 'yellow' ? 'default' : 'secondary'} className="text-xs">
                        {patient.classification}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-900">Aguarda: {patient.time}</p>
                  </div>
                </div>)}
            </div>
          </div>;
      case "reports":
        return <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-2xl border border-indigo-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Relatórios Gerenciais</h3>
              <div className="flex items-center space-x-2">
                <select className="px-3 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500">
                  <option>Dezembro 2024</option>
                  <option>Novembro 2024</option>
                </select>
                <button className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors">
                  Exportar
                </button>
              </div>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {mockup.metrics.map((metric: any, i: number) => <div key={i} className="bg-white rounded-lg p-4 border border-slate-100">
                  <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">{metric.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">{metric.value}</span>
                    <span className="text-xs text-green-600 font-medium">{metric.change}</span>
                  </div>
                </div>)}
            </div>
            
            {/* Chart */}
            <div className="bg-white rounded-lg p-4 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-700">Performance Mensal</span>
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Receita</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Consultas</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between h-24 space-x-2">
                {[65, 72, 68, 78, 85, 82, 88, 92, 87, 94, 89, 96].map((height, i) => <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                    <div className="w-full bg-indigo-500 rounded-t opacity-80 hover:opacity-100 transition-opacity" style={{
                  height: `${height}%`
                }}></div>
                    <span className="text-xs text-slate-500">{i + 1}</span>
                  </div>)}
              </div>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Conheça a plataforma SALUS na prática
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Explore as principais funcionalidades através de interfaces reais do sistema
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent className="-ml-2 md:-ml-4">
            {screenshots.map((screenshot, index) => {
            const Icon = screenshot.icon;
            return <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
                  <Card className="h-full border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{screenshot.title}</h3>
                          <p className="text-sm text-gray-600">{screenshot.description}</p>
                        </div>
                      </div>
                      
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        {renderMockup(screenshot.mockup, index)}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>;
          })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
        </p>
          <Link to="/subscription">
            <button className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors">
              Começar Teste Grátis
            </button>
          </Link>
        </div>
      </div>
    </section>;
};