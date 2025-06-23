
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientBooking from "./pages/ClientBooking";
import Login from "./pages/Login";
import Sales from "./pages/Sales";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import BasicDashboard from "./pages/BasicDashboard";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import AuthRequired from "./components/AuthRequired";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Sales />} />
          <Route path="/login" element={<Login />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/dashboard" element={
            <AuthRequired>
              <Dashboard />
            </AuthRequired>
          } />
          <Route path="/dashboard-basico" element={
            <AuthRequired>
              <BasicDashboard />
            </AuthRequired>
          } />
          <Route path="/dashboard-profissional" element={
            <AuthRequired>
              <ProfessionalDashboard />
            </AuthRequired>
          } />
          <Route path="/dashboard-enterprise" element={
            <AuthRequired>
              <EnterpriseDashboard />
            </AuthRequired>
          } />
          <Route path="/agendar" element={<ClientBooking />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
