import React from 'react';
import { Check, Star, Zap, Crown, Rocket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const SalesPricing = () => {
  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: "97",
      period: "/mês",
      description: "Ideal para consultórios pequenos",
      target: "1 profissional • 50 pacientes",
      features: [
        "1 profissional",
        "Até 50 pacientes cadastrados",
        "Prontuário eletrônico CFM",
        "Agenda básica",
        "Relatórios essenciais",
        "Suporte por email",
        "Backup automático"
      ],
      highlight: false,
      cta: "Iniciar Teste Grátis",
      popular: false
    },
    {
      name: "Professional",
      icon: Star,
      price: "197", 
      period: "/mês",
      description: "Ideal para clínicas em crescimento",
      target: "Até 5 profissionais • 200 pacientes",
      features: [
        "Até 5 profissionais",
        "Até 200 pacientes cadastrados",
        "Prontuário eletrônico completo",
        "Agenda avançada",
        "Relatórios detalhados",
        "Integração WhatsApp",
        "Prescrição digital",
        "Suporte prioritário"
      ],
      highlight: true,
      cta: "Mais Escolhido",
      popular: true
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: "397",
      period: "/mês", 
      description: "Para hospitais e grandes redes",
      target: "Profissionais ilimitados • Pacientes ilimitados",
      features: [
        "Profissionais ilimitados",
        "Pacientes ilimitados",
        "Todas as funcionalidades",
        "API personalizada",
        "Relatórios customizados",
        "Gerente de conta dedicado",
        "Treinamento incluso",
        "Suporte 24/7",
        "Integrações avançadas"
      ],
      highlight: false,
      cta: "Falar com Especialista",
      popular: false
    }
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium mb-6 border-0">
            Planos e Preços
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Escolha o Plano Ideal para sua Clínica
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Todos os planos incluem 30 dias de teste gratuito - sem cartão de crédito
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative overflow-hidden transition-all duration-300 ${
                  plan.highlight 
                    ? 'border-2 border-blue-500 shadow-lg transform scale-105' 
                    : 'border border-slate-200 hover:border-blue-300 shadow-md hover:shadow-lg'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 text-sm font-medium">
                    Mais Escolhido
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.highlight ? 'pt-12' : 'pt-8'} pb-4`}>
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                      plan.highlight 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <CardDescription className="text-slate-600 mb-4">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900">R$ {plan.price}</span>
                    <span className="text-lg text-slate-600">{plan.period}</span>
                  </div>
                  
                  <div className="text-sm font-medium text-blue-600 bg-blue-50 p-3 rounded-lg">
                    {plan.target}
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-8">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/subscription" className="block">
                    <Button 
                      className={`w-full py-3 font-semibold ${
                        plan.highlight
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Guarantee section */}
        <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Garantia de Satisfação
          </h3>
          <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
            Teste o Salus por 30 dias completos. Se não ficar satisfeito, devolvemos seu dinheiro.
          </p>
          <div className="flex justify-center items-center space-x-8 text-slate-600">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <span className="font-medium">Sem fidelidade</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <span className="font-medium">Cancele quando quiser</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <span className="font-medium">Suporte especializado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesPricing;
