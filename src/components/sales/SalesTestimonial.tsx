
import React from 'react';
import { Star } from 'lucide-react';

export const SalesTestimonial = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">
          "O SALUS transformou a rotina da minha clínica."
        </h2>
        
        <div className="bg-white rounded-3xl p-12 shadow-xl">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
            ))}
          </div>
          
          <blockquote className="text-xl text-gray-700 italic mb-8 leading-relaxed">
            "Agora consigo agendar e atender pacientes de forma organizada e rápida. O suporte também é excelente!"
          </blockquote>
          
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-800 to-green-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">RM</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-900 text-lg">Dr. Rafael Menezes</div>
              <div className="text-gray-600">Clínico Geral</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
