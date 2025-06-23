
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Eye, FileText, Calendar, User, Stethoscope, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useConsultations, Consultation } from '@/hooks/useConsultations';
import { usePatients } from '@/hooks/usePatients';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const ConsultationHistory = ({ onBack }) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const { getConsultations } = useConsultations();
  const { getPatients } = usePatients();
  const { getProfessionals } = useProfessionals();
  const { user, session } = useAuth();
  const { toast } = useToast();

  // Aguardar autenticação estar pronta
  useEffect(() => {
    const currentUser = user || session?.user;
    if (currentUser) {
      setAuthReady(true);
    } else {
      setAuthReady(false);
    }
  }, [user, session]);

  // Carregar dados
  useEffect(() => {
    if (!authReady) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [consultationsData, patientsData, professionalsData] = await Promise.all([
          getConsultations(),
          getPatients(),
          getProfessionals()
        ]);

        setConsultations(consultationsData);
        setPatients(patientsData);
        setProfessionals(professionalsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        if (!error?.message?.includes('Failed to fetch')) {
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível carregar o histórico de consultas",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authReady, getConsultations, getPatients, getProfessionals, toast]);

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.professionalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.subjetivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.avaliacao?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPatient = selectedPatient === 'all' || consultation.patient_id === selectedPatient;
    
    return matchesSearch && matchesPatient;
  });

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.nome || 'Paciente não encontrado';
  };

  const getProfessionalName = (professionalId: string) => {
    const professional = professionals.find(p => p.id === professionalId);
    return professional?.nome || 'Profissional não encontrado';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mr-4 hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <FileText className="text-white h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Histórico de Consultas</h1>
              <p className="text-gray-600">Relatórios e atendimentos realizados</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card className="shadow-lg border-blue-200 mb-6">
          <CardHeader>
            <CardTitle className="text-blue-800">Filtros de Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por paciente, profissional ou diagnóstico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por paciente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os pacientes</SelectItem>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>{patient.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Consultas */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando consultas...</p>
            </div>
          ) : filteredConsultations.length > 0 ? (
            filteredConsultations
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((consultation) => (
                <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {getPatientName(consultation.patient_id)}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(consultation.created_at)}
                          </span>
                          <span className="flex items-center">
                            <Stethoscope className="mr-1 h-3 w-3" />
                            {getProfessionalName(consultation.professional_id)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          Consulta SOAP
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Consulta</DialogTitle>
                              <DialogDescription>
                                Consulta realizada em {formatDate(consultation.created_at)}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium text-gray-700">Paciente</h4>
                                  <p className="text-sm">{getPatientName(consultation.patient_id)}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-700">Profissional</h4>
                                  <p className="text-sm">{getProfessionalName(consultation.professional_id)}</p>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              {consultation.subjetivo && (
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2">Subjetivo (S)</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                                    {consultation.subjetivo}
                                  </p>
                                </div>
                              )}
                              
                              {consultation.objetivo && (
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2">Objetivo (O)</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded border-l-4 border-green-400">
                                    {consultation.objetivo}
                                  </p>
                                </div>
                              )}
                              
                              {consultation.avaliacao && (
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2">Avaliação (A)</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded border-l-4 border-yellow-400">
                                    {consultation.avaliacao}
                                  </p>
                                </div>
                              )}
                              
                              {consultation.plano && (
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2">Plano (P)</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded border-l-4 border-purple-400">
                                    {consultation.plano}
                                  </p>
                                </div>
                              )}
                              
                              {consultation.receitas && (
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2">Receitas</h4>
                                  <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                                    {consultation.receitas}
                                  </p>
                                </div>
                              )}
                              
                              {consultation.atestados && (
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-2">Atestados</h4>
                                  <p className="text-sm bg-green-50 p-3 rounded border-l-4 border-green-500">
                                    {consultation.atestados}
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {consultation.avaliacao && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Diagnóstico Principal</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{consultation.avaliacao}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma consulta encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedPatient !== 'all' 
                  ? 'Não há consultas que correspondam aos filtros aplicados' 
                  : 'Nenhuma consulta foi registrada ainda'}
              </p>
              {!searchTerm && selectedPatient === 'all' && (
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  onClick={() => onBack()}
                >
                  Realizar Nova Consulta
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Estatísticas */}
        {!loading && consultations.length > 0 && (
          <Card className="shadow-lg border-blue-200 mt-6">
            <CardHeader>
              <CardTitle className="text-blue-800">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{consultations.length}</p>
                  <p className="text-sm text-gray-600">Total de Consultas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{patients.length}</p>
                  <p className="text-sm text-gray-600">Pacientes Atendidos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{professionals.length}</p>
                  <p className="text-sm text-gray-600">Profissionais Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConsultationHistory;
