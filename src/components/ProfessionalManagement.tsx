
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Search, Plus, Edit, Eye, Phone, Mail, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProfessionalForm from './ProfessionalForm';
import ProfessionalAgenda from './ProfessionalAgenda';
import { useProfessionals, Professional } from '@/hooks/useProfessionals';

const ProfessionalManagement = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showAgenda, setShowAgenda] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [especialidadeFilter, setEspecialidadeFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState('ativo');
  const { getProfessionals, loading } = useProfessionals();

  useEffect(() => {
    const loadProfessionals = async () => {
      const data = await getProfessionals();
      setProfessionals(data);
    };
    
    loadProfessionals();
  }, []);

  const handleSaveProfessional = async (professionalData) => {
    // Dados reais são salvos no banco através do hook useProfessionals no ProfessionalForm
    // Aqui só precisamos atualizar a lista
    const data = await getProfessionals();
    setProfessionals(data);
    setShowForm(false);
  };

  const handleViewAgenda = (professional: Professional) => {
    setSelectedProfessional(professional);
    setShowAgenda(true);
  };

  const filteredProfessionals = professionals.filter(prof => {
    // Filtro de busca
    const matchesSearch = (
      prof.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.registro.includes(searchTerm)
    );
    
    // Filtro de especialidade
    const matchesEspecialidade = especialidadeFilter === 'todas' || 
      prof.especialidade.toLowerCase().includes(especialidadeFilter.toLowerCase());
    
    // Filtro de status
    const matchesStatus = statusFilter === 'todos' || 
      prof.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesEspecialidade && matchesStatus;
  });

  if (showForm) {
    return <ProfessionalForm onBack={() => setShowForm(false)} onSave={handleSaveProfessional} />;
  }

  if (showAgenda && selectedProfessional) {
    return <ProfessionalAgenda 
      professional={selectedProfessional} 
      onBack={() => { setShowAgenda(false); setSelectedProfessional(null); }} 
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mr-4 hover:bg-emerald-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
                <Users className="text-white h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Equipe de Profissionais</h1>
                <p className="text-gray-600">{professionals.length} profissionais cadastrados</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Profissional
          </Button>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6 shadow-lg border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar profissional por nome, especialidade ou registro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select 
                  defaultValue="todas"
                  value={especialidadeFilter}
                  onValueChange={setEspecialidadeFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as especialidades</SelectItem>
                    <SelectItem value="cardiologia">Cardiologia</SelectItem>
                    <SelectItem value="pediatria">Pediatria</SelectItem>
                    <SelectItem value="ortopedia">Ortopedia</SelectItem>
                    <SelectItem value="nutricao">Nutrição</SelectItem>
                    <SelectItem value="psicologia">Psicologia</SelectItem>
                    <SelectItem value="dermatologia">Dermatologia</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  defaultValue="ativo"
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativos</SelectItem>
                    <SelectItem value="inativo">Inativos</SelectItem>
                    <SelectItem value="todos">Todos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado de carregamento */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Carregando profissionais...</p>
          </div>
        )}

        {/* Lista de Profissionais */}
        {!loading && (
          <div className="grid gap-4">
            {filteredProfessionals.map((professional) => (
              <Card key={professional.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{professional.nome}</h3>
                        <p className="text-gray-600">{professional.especialidade} • {professional.registro}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Phone className="h-4 w-4 mr-1" />
                          <span className="text-sm">{professional.telefone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-1" />
                          <span className="text-sm">{professional.email}</span>
                        </div>
                      </div>
                      
                      <div className="text-center bg-emerald-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Consultas hoje</p>
                        <p className="text-2xl font-bold text-emerald-700">0</p>
                      </div>
                      
                      <Badge className={`${
                        professional.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                      } hover:bg-emerald-200`}>
                        {professional.status || 'Ativo'}
                      </Badge>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800" 
                          size="sm"
                          onClick={() => handleViewAgenda(professional)}
                        >
                          Ver Agenda
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredProfessionals.length === 0 && (
          <Card className="shadow-lg border-emerald-200">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum profissional encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros ou cadastre um novo profissional
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfessionalManagement;
