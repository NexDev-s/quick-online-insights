import React from 'react';
import { Calendar, FileText, Users, TrendingUp, Shield, Heart, Clock, Award, Zap, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
export const SalesFeatures = () => {
  const features = [{
    icon: Calendar,
    title: "Gestão de Agenda",
    description: "Sistema inteligente de agendamento com confirmações automáticas via WhatsApp e redução significativa de faltas.",
    benefits: ["Agenda sincronizada", "Lembretes automáticos", "Reagendamento online"],
    highlight: "Redução de 85% nas faltas"
  }, {
    icon: FileText,
    title: "Prontuário Eletrônico",
    description: "Prontuário digital certificado pelo CFM com assinatura digital válida e backup automático na nuvem.",
    benefits: ["Certificação CFM", "Assinatura digital", "Backup automático"],
    highlight: "Certificado CFM"
  }, {
    icon: Users,
    title: "Portal do Paciente",
    description: "Portal exclusivo onde pacientes acessam histórico, documentos e podem agendar consultas online.",
    benefits: ["Acesso ao histórico", "Documentos organizados", "Agendamento online"],
    highlight: "Experiência premium"
  }, {
    icon: TrendingUp,
    title: "Relatórios Gerenciais",
    description: "Análises detalhadas de performance com insights para otimização de processos e aumento do faturamento.",
    benefits: ["Análise de lucratividade", "Métricas em tempo real", "Insights estratégicos"],
    highlight: "Aumento do faturamento"
  }, {
    icon: Shield,
    title: "Segurança e Compliance",
    description: "Proteção de dados com certificação ISO 27001 e total conformidade com a LGPD.",
    benefits: ["ISO 27001", "Criptografia avançada", "Conformidade LGPD"],
    highlight: "Segurança bancária"
  }, {
    icon: Heart,
    title: "Prescrição Digital",
    description: "Receitas digitais com certificação ICP-Brasil, válidas em todas as farmácias do país.",
    benefits: ["Válida nacionalmente", "Base de medicamentos", "Alertas de interação"],
    highlight: "ICP-Brasil"
  }];
  return <div className="bg-slate-50 py-20">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Funcionalidades que Fazem a Diferença
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Cada ferramenta foi desenvolvida para simplificar sua rotina e melhorar o atendimento
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => <Card key={index} className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {feature.highlight}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-slate-600 mb-4 leading-relaxed">
                  {feature.description}
                </CardDescription>
                
                <div className="space-y-3">
                  {feature.benefits.map((benefit, i) => <div key={i} className="flex items-center space-x-3 text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>)}
                </div>
              </CardContent>
            </Card>)}
        </div>
        
        {/* Stats section */}
        
        
        {/* CTA section */}
        <div className="text-center mt-16">
          <div className="bg-blue-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para Modernizar sua Clínica?
            </h3>
            <p className="text-lg mb-6 text-blue-100">
              Junte-se a milhares de profissionais que já transformaram sua gestão médica
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/subscription">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Começar Teste Gratuito
                </button>
              </Link>
              
            </div>
            
            <div className="flex justify-center items-center space-x-8 mt-6 text-blue-100 text-sm">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>30 dias grátis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Ativação em 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Dados seguros</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};