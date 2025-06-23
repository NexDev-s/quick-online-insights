
import React from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const SalesPlatformPreview = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Acesse de qualquer lugar
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Plataforma responsiva que funciona perfeitamente em desktop, tablet e smartphone
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-8">
            <CardContent>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Desktop</h3>
              <p className="text-gray-600">Interface completa para gestão total da clínica</p>
            </CardContent>
          </Card>

          <Card className="text-center p-8">
            <CardContent>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tablet className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tablet</h3>
              <p className="text-gray-600">Perfeito para consultas e prontuários digitais</p>
            </CardContent>
          </Card>

          <Card className="text-center p-8">
            <CardContent>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smartphone</h3>
              <p className="text-gray-600">Agenda e notificações sempre na palma da mão</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
