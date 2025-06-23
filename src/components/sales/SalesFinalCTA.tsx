import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star, Shield, Clock, Award, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
export const SalesFinalCTA = () => {
  return <section className="relative py-20 px-6 bg-slate-900">
      <div className="container mx-auto max-w-4xl text-center text-white">
        {/* Main content */}
        <div className="space-y-8 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Transforme sua Clínica Hoje Mesmo
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Mais de 5.000 profissionais de saúde já modernizaram sua gestão com o Salus. 
            Chegou a sua vez de oferecer o melhor atendimento.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
            </div>
            <h3 className="font-bold text-2xl mb-2">5.000+</h3>
            <p className="text-slate-300">Profissionais Satisfeitos</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Shield className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-bold text-2xl mb-2">ISO 27001</h3>
            <p className="text-slate-300">Segurança Certificada</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Zap className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="font-bold text-2xl mb-2">24 Horas</h3>
            <p className="text-slate-300">Para Implementar</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Award className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <h3 className="font-bold text-2xl mb-2">30 Dias</h3>
            <p className="text-slate-300">Teste Gratuito</p>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <Link to="/subscription">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 font-semibold">
              Começar Teste Gratuito
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          
        </div>
        
        {/* Final trust indicators */}
        
      </div>
    </section>;
};