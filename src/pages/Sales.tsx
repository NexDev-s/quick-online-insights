import React from 'react';
import { SalesHero } from '@/components/sales/SalesHero';
import SalesPricing from '@/components/sales/SalesPricing';
import { SalesTestimonials } from '@/components/sales/SalesTestimonials';
import { SalesFinalCTA } from '@/components/sales/SalesFinalCTA';
import { SalesFeatures } from '@/components/sales/SalesFeatures';
import { SalesPlatformPreview } from '@/components/sales/SalesPlatformPreview';
import { SalesScreenshots } from '@/components/sales/SalesScreenshots';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const Sales = () => {
  return <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">SALUS</h1>
              <p className="text-sm text-slate-600">Sistema de Gestão de Clínicas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-700 hover:bg-slate-100 font-medium px-4 py-2">
                Acessar Sistema
              </Button>
            </Link>
            <Link to="/subscription">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-medium">
                Teste Gratuito
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <SalesHero />
        
        
        
        <SalesFeatures />
        
        
        
        <SalesPricing />
        
        <SalesTestimonials />
        
        <SalesFinalCTA />
      </main>

      {/* Clean Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white h-4 w-4" />
                </div>
                <span className="text-lg font-bold">SALUS</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Sistema de gestão de clínicas desenvolvido no Brasil para profissionais brasileiros da área da saúde.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="hover:text-white cursor-pointer">Sobre Nós</li>
                <li className="hover:text-white cursor-pointer">Tecnologia</li>
                <li className="hover:text-white cursor-pointer">Certificações</li>
                <li className="hover:text-white cursor-pointer">Cases de Sucesso</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Compliance</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="hover:text-white cursor-pointer">Termos de Uso</li>
                <li className="hover:text-white cursor-pointer">Privacidade</li>
                <li className="hover:text-white cursor-pointer">LGPD</li>
                <li className="hover:text-white cursor-pointer">ISO 27001</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>contato@salus.com.br</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>(11) 3000-1234</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>São Paulo - SP</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2025 SALUS. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-4 text-slate-400 text-sm mt-4 md:mt-0">
              <span className="hover:text-white cursor-pointer">Central de Ajuda</span>
              <span className="hover:text-white cursor-pointer">Status</span>
              <span className="hover:text-white cursor-pointer">API</span>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Sales;