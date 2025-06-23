import React, { useState, useEffect } from 'react';
import { Check, Zap, CreditCard, Shield, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const {
    toast
  } = useToast();
  const plans = [{
    id: 'basic',
    name: 'Básico',
    price: 'R$ 97',
    period: '/mês',
    description: 'Para consultórios pequenos',
    features: ['Até 50 pacientes', '1 profissional', 'Agenda básica', 'Prontuário eletrônico', 'Anamnese SOAP', 'Sistema de triagem', 'Suporte por email'],
    popular: false
  }, {
    id: 'professional',
    name: 'Profissional',
    price: 'R$ 197',
    period: '/mês',
    description: 'Para clínicas em crescimento',
    features: ['Até 200 pacientes', 'Até 5 profissionais', 'Agenda avançada', 'Prontuário completo', 'Relatórios detalhados', 'Integração WhatsApp', 'Sistema de triagem avançado', 'Suporte prioritário'],
    popular: true
  }, {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'R$ 397',
    period: '/mês',
    description: 'Para grandes clínicas',
    features: ['Pacientes ilimitados', 'Profissionais ilimitados', 'Múltiplas unidades', 'Funcionalidades avançadas', 'API personalizada', 'Backup automático', 'Treinamento incluído', 'Suporte 24/7'],
    popular: false
  }];
  useEffect(() => {
    checkSubscriptionStatus();
  }, []);
  const checkSubscriptionStatus = async () => {
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) return;
      const {
        data,
        error
      } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(true);
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session && subscriptionStatus?.has_used_trial && !subscriptionStatus?.subscribed) {
        toast({
          title: "Teste já utilizado",
          description: "Você já utilizou seu período de teste gratuito.",
          variant: "destructive"
        });
        return;
      }
      const {
        data,
        error
      } = await supabase.functions.invoke('create-trial-checkout', {
        body: {
          planId
        },
        headers: session ? {
          Authorization: `Bearer ${session.access_token}`
        } : {}
      });
      if (error) {
        throw error;
      }
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro ao processar",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleManageSubscription = async () => {
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) return;
      const {
        data,
        error
      } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o painel de gerenciamento.",
        variant: "destructive"
      });
    }
  };
  const getTrialDaysLeft = () => {
    if (!subscriptionStatus?.trial_ends_at) return 0;
    const trialEnd = new Date(subscriptionStatus.trial_ends_at);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-green-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" className="text-white hover:bg-white/10 p-2 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center">
                <Zap className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SALUS</h1>
                <p className="text-xs text-green-200">Healthcare Platform</p>
              </div>
            </div>
            <Link to="/login">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-700">
                Já sou assinante
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Trial Status Banner */}
        {subscriptionStatus?.is_trial_active && <div className="mb-8 p-4 bg-blue-50/90 backdrop-blur-md border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  🎉 Teste Gratuito Ativo!
                </h3>
                <p className="text-blue-700">
                  Você tem {getTrialDaysLeft()} dias restantes do seu teste gratuito.
                </p>
              </div>
              <Button onClick={handleManageSubscription} variant="outline">
                Gerenciar Assinatura
              </Button>
            </div>
          </div>}

        {/* Subscription Status Banner */}
        {subscriptionStatus?.subscribed}

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Experimente 30 dias grátis
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">Comece sua jornada digital agora mesmo. Durante o checkout você pode criar sua conta.</p>
          
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map(plan => <Card key={plan.id} className={`relative hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-md ${plan.popular ? 'ring-2 ring-green-400 scale-105 shadow-2xl' : 'hover:scale-105'}`}>
              {plan.popular && <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1">
                  Mais Popular
                </Badge>}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-1">30 dias grátis, depois:</div>
                  <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>)}
                </ul>

                <Button onClick={() => handleSubscribe(plan.id)} disabled={loading} className={`w-full h-12 font-bold rounded-xl transform hover:scale-105 transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg' : 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white'}`} variant={plan.popular ? 'default' : 'outline'}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Começar teste grátis
                </Button>
              </CardContent>
            </Card>)}
        </div>

        {/* Features Section */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Por que escolher o SALUS?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="text-white h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cadastro Simplificado</h4>
              <p className="text-gray-600">
                Crie sua conta durante o processo de compra. Rápido e sem complicações.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Segurança</h4>
              <p className="text-gray-600">
                Dados protegidos com criptografia de ponta e backup automático
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="text-white h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Teste Completo</h4>
              <p className="text-gray-600">
                30 dias completamente grátis. Cobrança automática após o período de teste.
              </p>
            </div>
          </div>

          
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-white/80 mb-4">
            Já é assinante? 
            <Link to="/login" className="text-green-300 font-medium hover:underline ml-1">
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>
    </div>;
};
export default Subscription;