
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import EnterpriseDashboard from '@/components/EnterpriseDashboard';
import PatientManagement from '@/components/PatientManagement';
import ProfessionalManagement from '@/components/ProfessionalManagement';
import UnitManagement from '@/components/UnitManagement';
import AppointmentManagement from '@/components/AppointmentManagement';
import NovoAtendimento from '@/components/NovoAtendimento';
import Triagem from '@/components/Triagem';
import ConsultationHistory from '@/components/ConsultationHistory';
import AuthRequired from '@/components/AuthRequired';

const EnterpriseDashboardPage = () => {
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
      case 'units':
        return <UnitManagement onBack={handleBack} />;
      case 'appointments':
        return <AppointmentManagement onBack={handleBack} />;
      case 'novo-atendimento':
        return <NovoAtendimento onBack={handleBack} />;
      case 'triagem':
        return <Triagem onBack={handleBack} />;
      case 'consultation-history':
        return <ConsultationHistory onBack={handleBack} />;
      default:
        return <EnterpriseDashboard onNavigate={handleNavigate} selectedPlan="enterprise" onPlanChange={() => {}} />;
    }
  };

  return renderCurrentView();
};

export default EnterpriseDashboardPage;
