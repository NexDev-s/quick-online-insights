
import React, { useState } from 'react';
import { FileText, Search, Plus, Download, Eye, Calendar, User, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const MedicalHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      patientId: 1,
      patientName: 'Maria Silva',
      date: '2024-05-20',
      doctor: 'Dr. João Santos',
      type: 'Consulta',
      diagnosis: 'Hipertensão arterial',
      treatment: 'Prescrição de anti-hipertensivo',
      notes: 'Paciente apresenta pressão arterial elevada. Orientação sobre dieta e exercícios.',
      prescriptions: ['Losartana 50mg - 1x ao dia', 'Hidroclorotiazida 25mg - 1x ao dia'],
      exams: ['Hemograma completo', 'Glicemia de jejum'],
      nextVisit: '2024-06-20'
    },
    {
      id: 2,
      patientId: 2,
      patientName: 'João Santos',
      date: '2024-05-18',
      doctor: 'Dra. Ana Maria',
      type: 'Retorno',
      diagnosis: 'Diabetes mellitus tipo 2',
      treatment: 'Ajuste na medicação',
      notes: 'Glicemia controlada. Manter dieta e exercícios regulares.',
      prescriptions: ['Metformina 850mg - 2x ao dia', 'Insulina NPH - conforme orientação'],
      exams: ['HbA1c', 'Glicemia capilar'],
      nextVisit: '2024-07-18'
    },
    {
      id: 3,
      patientId: 3,
      patientName: 'Ana Costa',
      date: '2024-04-30',
      doctor: 'Dr. Carlos Silva',
      type: 'Exame',
      diagnosis: 'Check-up preventivo',
      treatment: 'Orientações gerais',
      notes: 'Exames dentro da normalidade. Manter hábitos saudáveis.',
      prescriptions: [],
      exams: ['Colesterol total', 'Triglicerídeos', 'TSH'],
      nextVisit: '2025-04-30'
    }
  ]);

  const [newRecord, setNewRecord] = useState({
    patientName: '',
    doctor: '',
    type: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    prescriptions: '',
    exams: ''
  });

  const patients = ['Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Oliveira'];
  const doctors = ['Dr. João Santos', 'Dra. Ana Maria', 'Dr. Carlos Silva', 'Dra. Maria Costa'];
  const recordTypes = ['Consulta', 'Retorno', 'Exame', 'Procedimento', 'Emergência'];

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = selectedPatient === 'all' || record.patientName === selectedPatient;
    return matchesSearch && matchesPatient;
  });

  const handleAddRecord = () => {
    const record = {
      id: medicalRecords.length + 1,
      patientId: medicalRecords.length + 1,
      ...newRecord,
      date: new Date().toISOString().split('T')[0],
      prescriptions: newRecord.prescriptions.split('\n').filter(p => p.trim()),
      exams: newRecord.exams.split('\n').filter(e => e.trim()),
      nextVisit: null
    };
    setMedicalRecords([...medicalRecords, record]);
    setNewRecord({
      patientName: '',
      doctor: '',
      type: '',
      diagnosis: '',
      treatment: '',
      notes: '',
      prescriptions: '',
      exams: ''
    });
    setIsAddDialogOpen(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Consulta':
        return 'bg-blue-100 text-blue-800';
      case 'Retorno':
        return 'bg-green-100 text-green-800';
      case 'Exame':
        return 'bg-purple-100 text-purple-800';
      case 'Procedimento':
        return 'bg-orange-100 text-orange-800';
      case 'Emergência':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Histórico Médico</h2>
          <p className="text-gray-600">Registros e prontuários dos pacientes</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Registro Médico</DialogTitle>
              <DialogDescription>
                Adicione um novo registro ao prontuário do paciente.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="patientName">Paciente</Label>
                  <Select onValueChange={(value) => setNewRecord({...newRecord, patientName: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient} value={patient}>{patient}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doctor">Profissional</Label>
                  <Select onValueChange={(value) => setNewRecord({...newRecord, doctor: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo de Atendimento</Label>
                <Select onValueChange={(value) => setNewRecord({...newRecord, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="diagnosis">Diagnóstico</Label>
                <Input
                  id="diagnosis"
                  value={newRecord.diagnosis}
                  onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                  placeholder="Diagnóstico principal"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="treatment">Tratamento</Label>
                <Input
                  id="treatment"
                  value={newRecord.treatment}
                  onChange={(e) => setNewRecord({...newRecord, treatment: e.target.value})}
                  placeholder="Tratamento recomendado"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                  placeholder="Observações detalhadas sobre o atendimento"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prescriptions">Prescrições (uma por linha)</Label>
                <Textarea
                  id="prescriptions"
                  value={newRecord.prescriptions}
                  onChange={(e) => setNewRecord({...newRecord, prescriptions: e.target.value})}
                  placeholder="Ex: Dipirona 500mg - 1 comprimido a cada 6 horas"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exams">Exames Solicitados (um por linha)</Label>
                <Textarea
                  id="exams"
                  value={newRecord.exams}
                  onChange={(e) => setNewRecord({...newRecord, exams: e.target.value})}
                  placeholder="Ex: Hemograma completo"
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddRecord}>Salvar Registro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por paciente, diagnóstico ou médico..."
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
              <SelectItem key={patient} value={patient}>{patient}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Medical Records */}
      <div className="space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{record.patientName}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(record.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center">
                          <Stethoscope className="mr-1 h-3 w-3" />
                          {record.doctor}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(record.type)}>
                        {record.type}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Diagnóstico</h4>
                    <p className="text-sm">{record.diagnosis}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Tratamento</h4>
                    <p className="text-sm">{record.treatment}</p>
                  </div>
                  
                  {record.notes && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Observações</h4>
                      <p className="text-sm text-gray-600">{record.notes}</p>
                    </div>
                  )}
                  
                  {record.prescriptions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Prescrições</h4>
                      <ul className="space-y-1">
                        {record.prescriptions.map((prescription, index) => (
                          <li key={index} className="text-sm bg-blue-50 p-2 rounded border-l-2 border-blue-200">
                            {prescription}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {record.exams.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Exames Solicitados</h4>
                      <ul className="space-y-1">
                        {record.exams.map((exam, index) => (
                          <li key={index} className="text-sm bg-purple-50 p-2 rounded border-l-2 border-purple-200">
                            {exam}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {record.nextVisit && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">
                        <strong>Próxima consulta:</strong> {new Date(record.nextVisit).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhum registro médico encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
