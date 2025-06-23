
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Search, Plus, Edit, Eye, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UnitForm from './UnitForm';

interface Unit {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  responsavel: string;
  tipo: string;
  status: string;
  created_at: string;
}

const UnitManagement = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [units, setUnits] = useState<Unit[]>([
    {
      id: '1',
      nome: 'Unidade Centro',
      endereco: 'Rua das Flores, 123 - Centro',
      telefone: '(11) 3456-7890',
      email: 'centro@clinica.com.br',
      responsavel: 'Dr. João Silva',
      tipo: 'Matriz',
      status: 'Ativo',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      nome: 'Unidade Norte',
      endereco: 'Av. Norte, 456 - Vila Norte',
      telefone: '(11) 3456-7891',
      email: 'norte@clinica.com.br',
      responsavel: 'Dra. Ana Costa',
      tipo: 'Filial',
      status: 'Ativo',
      created_at: '2024-02-01T10:00:00Z'
    },
    {
      id: '3',
      nome: 'Unidade Sul',
      endereco: 'Rua Sul, 789 - Zona Sul',
      telefone: '(11) 3456-7892',
      email: 'sul@clinica.com.br',
      responsavel: 'Dr. Carlos Santos',
      tipo: 'Filial',
      status: 'Ativo',
      created_at: '2024-02-15T10:00:00Z'
    },
    {
      id: '4',
      nome: 'Unidade Oeste',
      endereco: 'Av. Oeste, 321 - Vila Oeste',
      telefone: '(11) 3456-7893',
      email: 'oeste@clinica.com.br',
      responsavel: 'Dra. Beatriz Lima',
      tipo: 'Filial',
      status: 'Inativo',
      created_at: '2024-03-01T10:00:00Z'
    }
  ]);
  const [statusFilter, setStatusFilter] = useState('ativo');
  const [tipoFilter, setTipoFilter] = useState('todos');

  const handleSaveUnit = (unitData) => {
    if (selectedUnit) {
      setUnits(units.map(unit => 
        unit.id === selectedUnit.id 
          ? { ...unit, ...unitData }
          : unit
      ));
    } else {
      const newUnit = {
        id: Date.now().toString(),
        ...unitData,
        created_at: new Date().toISOString()
      };
      setUnits([...units, newUnit]);
    }
    setShowForm(false);
    setSelectedUnit(null);
  };

  const handleEditUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setShowForm(true);
  };

  const filteredUnits = units.filter(unit => {
    const matchesSearch = (
      unit.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'todos' || 
      unit.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesTipo = tipoFilter === 'todos' || 
      unit.tipo.toLowerCase() === tipoFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesTipo;
  });

  if (showForm) {
    return (
      <UnitForm 
        unit={selectedUnit}
        onBack={() => {
          setShowForm(false);
          setSelectedUnit(null);
        }} 
        onSave={handleSaveUnit} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mr-4 hover:bg-purple-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <Building2 className="text-white h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Unidades</h1>
                <p className="text-gray-600">{units.length} unidades cadastradas</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Unidade
          </Button>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6 shadow-lg border-purple-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar unidade por nome, endereço ou responsável..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select 
                  defaultValue="todos"
                  value={tipoFilter}
                  onValueChange={setTipoFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="matriz">Matriz</SelectItem>
                    <SelectItem value="filial">Filial</SelectItem>
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

        {/* Lista de Unidades */}
        <div className="grid gap-4">
          {filteredUnits.map((unit) => (
            <Card key={unit.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        {unit.nome}
                        <Badge 
                          className={`ml-2 ${
                            unit.tipo === 'Matriz' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {unit.tipo}
                        </Badge>
                      </h3>
                      <div className="space-y-1 mt-1">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{unit.endereco}</span>
                        </div>
                        <p className="text-gray-600 text-sm">Responsável: {unit.responsavel}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="flex items-center text-gray-600 mb-1">
                        <Phone className="h-4 w-4 mr-1" />
                        <span className="text-sm">{unit.telefone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-1" />
                        <span className="text-sm">{unit.email}</span>
                      </div>
                    </div>
                    
                    <div className="text-center bg-purple-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Profissionais</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {unit.tipo === 'Matriz' ? '8' : '3'}
                      </p>
                    </div>
                    
                    <Badge className={`${
                      unit.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    } hover:bg-green-200`}>
                      {unit.status}
                    </Badge>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUnit(unit)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUnits.length === 0 && (
          <Card className="shadow-lg border-purple-200">
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma unidade encontrada
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros ou cadastre uma nova unidade
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UnitManagement;
