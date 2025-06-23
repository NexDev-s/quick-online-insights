
import React from 'react';
import { Brain, Database, Lock, Smartphone, Cloud, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const TechFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: "Inteligência Artificial",
      description: "IA avançada para diagnósticos assistidos e análise preditiva de dados clínicos",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: Database,
      title: "Big Data Médico",
      description: "Processamento e análise de grandes volumes de dados para insights clínicos",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: Lock,
      title: "Segurança Militar",
      description: "Criptografia AES-256 e infraestrutura com certificação ISO 27001",
      gradient: "from-red-500 to-pink-600"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "App nativo para iOS e Android com sincronização em tempo real",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Cloud,
      title: "Cloud Computing",
      description: "Infraestrutura em nuvem AWS com 99.9% de disponibilidade garantida",
      gradient: "from-orange-500 to-yellow-600"
    },
    {
      icon: BarChart3,
      title: "Analytics Avançado",
      description: "Dashboard com métricas em tempo real e relatórios automatizados",
      gradient: "from-teal-500 to-green-600"
    }
  ];

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Geometric background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50 to-green-50 opacity-50"></div>
        <svg className="absolute top-0 right-0 w-1/2 h-full opacity-10" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Tecnologia de <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Ponta</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Utilizamos as mais avançadas tecnologias para criar uma experiência médica revolucionária
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group relative border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/80 backdrop-blur-sm overflow-hidden">
              {/* Gradient border effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[1px] rounded-lg`}>
                <div className="bg-white rounded-lg h-full"></div>
              </div>
              
              <CardHeader className="relative z-10 text-center pb-6">
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl group-hover:text-green-700 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
