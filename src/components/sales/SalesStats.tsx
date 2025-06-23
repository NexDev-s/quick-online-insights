
import React from 'react';

export const SalesStats = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-2 h-32 bg-white/20 rotate-12 animate-gentle-pulse"></div>
        <div className="absolute top-20 right-32 w-2 h-24 bg-white/20 -rotate-12 animate-gentle-bounce"></div>
        <div className="absolute bottom-10 left-1/3 w-3 h-3 bg-white/30 rotate-45 animate-gentle-float"></div>
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="group transform hover:scale-110 transition-all duration-300">
            <div className="text-4xl font-bold mb-2 animate-gentle-pulse">10k+</div>
            <div className="text-green-100">Médicos ativos</div>
          </div>
          <div className="group transform hover:scale-110 transition-all duration-300">
            <div className="text-4xl font-bold mb-2 animate-gentle-pulse">500k+</div>
            <div className="text-green-100">Pacientes atendidos</div>
          </div>
          <div className="group transform hover:scale-110 transition-all duration-300">
            <div className="text-4xl font-bold mb-2 animate-gentle-pulse">99.9%</div>
            <div className="text-green-100">Uptime garantido</div>
          </div>
          <div className="group transform hover:scale-110 transition-all duration-300">
            <div className="text-4xl font-bold mb-2 animate-gentle-pulse">24/7</div>
            <div className="text-green-100">Suporte técnico</div>
          </div>
        </div>
      </div>
    </section>
  );
};
