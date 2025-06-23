
import React from 'react';
import { Check, Star, Rocket, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export const ModernPricing = () => {
  const plans = [
    {
      name: "Básico",
      price: "R$ 97",
      period: "/mês",
      description: "Ideal para consultórios pequenos",
      icon: Star,
      features: [
        "Até 50 pacientes",
        "1 profissional",
        "Agenda básica",
        "Prontuário eletrônico",
        "Anamnese SOAP",
        "Suporte por email"
      ],
      popular: false,
      gradient: "from-gray-600 to-gray-700",
      bgColor: "bg-white"
    },
    {
      name: "Profissional",
      price: "R$ 197",
      period: "/mês",
      description: "Perfeito para clínicas em crescimento",
      icon: Rocket,
      features: [
        "Até 200 pacientes",
        "Até 5 profissionais",
        "Agenda avançada",
        "Prontuário completo",
        "Relatórios detalhados",
        "Integração WhatsApp",
        "Suporte prioritário"
      ],
      popular: true,
      gradient: "from-green-600 to-emerald-600",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50"
    },
    {
      name: "Enterprise",
      price: "R$ 397",
      period: "/mês",
      description: "Solução completa para grandes clínicas",
      icon: Crown,
      features: [
        "Pacientes ilimitados",
        "Profissionais ilimitados",
        "Funcionalidades avançadas",
        "API personalizada",
        "Backup automático",
        "Treinamento incluído",
        "Suporte 24/7"
      ],
      popular: false,
      gradient: "from-blue-600 to-indigo-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Planos que Crescem com Você
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para o tamanho da sua clínica
          </p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg inline-block">
            <p className="text-sm text-yellow-800">
              ⚡ <strong>30 dias de teste grátis</strong> → Cobrança automática após o período de teste
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.bgColor} border-2 ${plan.popular ? 'border-green-500 scale-105 shadow-xl' : 'border-gray-200 hover:border-gray-300'} transition-all duration-300 hover:shadow-lg`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-600 text-white px-4 py-2 text-sm font-semibold">
                    Mais Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-1">30 dias grátis, depois:</div>
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 text-lg">{plan.period}</span>
                </div>
                <CardDescription className="text-gray-600 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3 text-gray-700">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/subscription" className="block w-full">
                  <Button 
                    className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    Começar Teste Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Todos os planos incluem 30 dias de teste gratuito • Cancele a qualquer momento
          </p>
        </div>
      </div>
    </section>
  );
};
