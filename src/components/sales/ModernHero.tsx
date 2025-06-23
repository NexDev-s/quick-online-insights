
import React from 'react';
import { ArrowRight, Calendar, FileText, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const ModernHero = () => {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-green-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-300/10 to-blue-300/10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          {/* Logo/Brand Section */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-xl flex items-center justify-center">
                <Zap className="text-white h-7 w-7" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-white">SALUS</h1>
                <p className="text-green-200 text-sm">Healthcare Platform</p>
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <h2 className="text-6xl md:text-7xl font-black text-white mb-8 leading-tight">
            Revolucione a gestão
            <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              da sua Clínica
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            A plataforma mais avançada do Brasil para 
            <strong className="text-green-400"> agenda, prontuário eletrônico e gestão clínica</strong>. 
            Aumente sua produtividade e impressione seus pacientes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/subscription">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-green-400/50">
                Começar Teste Grátis
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 text-green-200 text-lg font-semibold">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span>30 dias grátis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Sem compromisso</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span>LGPD Compliant</span>
            </div>
          </div>
        </div>

        {/* Features Preview Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Agenda Inteligente</h3>
            <p className="text-gray-200 text-lg leading-relaxed">
              Automatize agendamentos com confirmação por WhatsApp e elimine faltas
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Prontuário Digital</h3>
            <p className="text-gray-200 text-lg leading-relaxed">
              Anamnese SOAP completa, receitas digitais e histórico centralizado
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Gestão Total</h3>
            <p className="text-gray-200 text-lg leading-relaxed">
              Controle profissionais, especialidades e convênios em um só lugar
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
