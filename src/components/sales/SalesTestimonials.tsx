import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
export const SalesTestimonials = () => {
  const testimonials = [{
    name: "Dr. Rafael Monteiro",
    specialty: "Cardiologista",
    location: "São Paulo, SP",
    rating: 5,
    comment: "O Salus eliminou completamente os conflitos de agenda da minha clínica. Agora consigo atender 30% mais pacientes por dia sem estresse.",
    highlight: "30% mais pacientes",
    initials: "RM",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
  }, {
    name: "Dra. Fernanda Silva",
    specialty: "Fisioterapeuta",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    comment: "O Salus me devolveu 3 horas por dia que eu perdia com burocracia. Os pacientes adoram receber os lembretes automáticos.",
    highlight: "3h economizadas/dia",
    initials: "FS",
    photo: "https://images.unsplash.com/photo-1594824694996-8c184e7893a7?w=400&h=400&fit=crop&crop=face"
  }, {
    name: "Dr. Carlos Eduardo",
    specialty: "Psicólogo",
    location: "Brasília, DF",
    rating: 5,
    comment: "Administro 4 clínicas e o Salus sincroniza tudo perfeitamente. O relatório financeiro me mostrou onde estava perdendo dinheiro.",
    highlight: "40% mais faturamento",
    initials: "CE",
    photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face"
  }];
  return <section className="py-20 px-4 bg-slate-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            O que Nossos Clientes Dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Depoimentos reais de profissionais que transformaram suas clínicas
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => <Card key={index} className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={testimonial.photo} alt={testimonial.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 font-bold">{testimonial.name}</CardTitle>
                    <CardDescription className="text-gray-600">{testimonial.specialty}</CardDescription>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />)}
                  </div>
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {testimonial.highlight}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">"{testimonial.comment}"</p>
              </CardContent>
            </Card>)}
        </div>
        
        {/* Trust metrics */}
        
      </div>
    </section>;
};