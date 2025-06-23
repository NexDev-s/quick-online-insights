
import React from 'react';
import { Monitor, Cpu, Shield, Zap } from 'lucide-react';

export const TechShowcase = () => {
  return (
    <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
      {/* Tech grid background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-emerald-900/20"></div>
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
          <defs>
            <pattern id="tech-grid" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#tech-grid)" />
        </svg>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-6">
            Arquitetura <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Enterprise</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Infraestrutura robusta e escalável para atender desde consultórios até grandes hospitais
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left side - Tech specs */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Processamento IA</h3>
                <p className="text-slate-300">Machine Learning avançado para análise de dados clínicos em tempo real</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Segurança Avançada</h3>
                <p className="text-slate-300">Criptografia de ponta a ponta com certificações internacionais</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Performance</h3>
                <p className="text-slate-300">Resposta em milissegundos com 99.9% de disponibilidade</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Interface Intuitiva</h3>
                <p className="text-slate-300">Design responsivo otimizado para produtividade médica</p>
              </div>
            </div>
          </div>

          {/* Right side - Visual representation */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
              {/* Mock dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-24 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-75"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg p-4 border border-green-600/30">
                    <div className="w-full h-2 bg-green-500 rounded mb-2"></div>
                    <div className="w-3/4 h-2 bg-slate-600 rounded"></div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg p-4 border border-blue-600/30">
                    <div className="w-full h-2 bg-blue-500 rounded mb-2"></div>
                    <div className="w-2/3 h-2 bg-slate-600 rounded"></div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4 border border-purple-600/30">
                    <div className="w-full h-2 bg-purple-500 rounded mb-2"></div>
                    <div className="w-1/2 h-2 bg-slate-600 rounded"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg"></div>
                    <div className="flex-1 h-3 bg-slate-700 rounded"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg"></div>
                    <div className="flex-1 h-3 bg-slate-700 rounded"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                    <div className="flex-1 h-3 bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
