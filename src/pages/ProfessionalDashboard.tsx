
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProfessionalDashboard from '@/components/ProfessionalDashboard';
import PatientManagement from '@/components/PatientManagement';
import ProfessionalManagement from '@/components/ProfessionalManagement';
import AppointmentManagement from '@/components/AppointmentManagement';
import NovoAtendimento from '@/components/NovoAtendimento';
import Triagem from '@/components/Triagem';
import ConsultationHistory from '@/components/ConsultationHistory';
import AuthRequired from '@/components/AuthRequired';

const ProfessionalDashboardPage = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { user } = useAuth();

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView('dashboard');
  };

  if (!user) {
    return (
      <AuthRequired>
        <div>Loading...</div>
      </AuthRequired>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'patients':
        return <PatientManagement onBack={handleBack} />;
      case 'professionals':
        return <ProfessionalManagement onBack={handleBack} />;
      case 'appointments':
        return <AppointmentManagement onBack={handleBack} />;
      case 'novo-atendimento':
        return <NovoAtendimento onBack={handleBack} />;
      case 'triagem':
        return <Triagem onBack={handleBack} />;
      case 'consultation-history':
        return <ConsultationHistory onBack={handleBack} />;
      default:
        return <ProfessionalDashboard onNavigate={handleNavigate} selectedPlan="professional" onPlanChange={() => {}} />;
    }
  };

  return renderCurrentView();
};

export default ProfessionalDashboardPage;
