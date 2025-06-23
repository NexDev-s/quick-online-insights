
import React, { useState } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const ExamRequest = ({ onSave, patientName }) => {
  const [selectedExams, setSelectedExams] = useState([]);
  const [customExam, setCustomExam] = useState('');
  const [observations, setObservations] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const examSuggestions = [
    'Hemograma Completo',
    'Glicemia em Jejum',
    'Colesterol Total e Frações',
    'Triglicerídeos',
    'Ureia',
    'Creatinina',
    'TSH',
    'T4 Livre',
    'Ácido Úrico',
    'TGO/TGP',
    'Radiografia de Tórax',
    'Eletrocardiograma',
    'Ultrassom Abdominal',
    'Mamografia',
    'Colonoscopia',
    'Endoscopia Digestiva Alta',
    'Tomografia Computadorizada',
    'Ressonância Magnética',
    'Ecocardiograma',
    'Teste Ergométrico'
  ];

  const filteredSuggestions = examSuggestions.filter(exam => 
    exam.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedExams.includes(exam)
  );

  const addExam = (exam) => {
    if (!selectedExams.includes(exam)) {
      setSelectedExams([...selectedExams, exam]);
    }
  };

  const removeExam = (exam) => {
    setSelectedExams(selectedExams.filter(e => e !== exam));
  };

  const addCustomExam = () => {
    if (customExam.trim() && !selectedExams.includes(customExam.trim())) {
      setSelectedExams([...selectedExams, customExam.trim()]);
      setCustomExam('');
    }
  };

  const handleSave = () => {
    const examData = {
      patientName,
      exams: selectedExams,
      observations,
      date: new Date().toISOString(),
    };
    onSave(examData);
    
    // Limpar formulário
    setSelectedExams([]);
    setObservations('');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Solicitação de Exames</h3>
        <p className="text-sm text-blue-600">Paciente: {patientName}</p>
      </div>

      {/* Busca de Exames */}
      <div>
        <Label htmlFor="search-exams">Buscar Exames</Label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="search-exams"
            type="text"
            placeholder="Digite o nome do exame..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sugestões de Exames */}
      {searchTerm && filteredSuggestions.length > 0 && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Sugestões</Label>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.slice(0, 10).map((exam, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => addExam(exam)}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                {exam}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Adicionar Exame Personalizado */}
      <div className="flex gap-2">
        <Input
          placeholder="Exame personalizado..."
          value={customExam}
          onChange={(e) => setCustomExam(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addCustomExam()}
        />
        <Button onClick={addCustomExam} variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Exames Selecionados */}
      {selectedExams.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Exames Selecionados ({selectedExams.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedExams.map((exam, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {exam}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-red-500" 
                  onClick={() => removeExam(exam)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Observações */}
      <div>
        <Label htmlFor="exam-observations">Observações</Label>
        <Textarea
          id="exam-observations"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Observações sobre os exames solicitados..."
          className="mt-1"
          rows={3}
        />
      </div>

      {/* Botão Salvar */}
      <Button 
        onClick={handleSave}
        disabled={selectedExams.length === 0}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
      >
        Gerar Solicitação de Exames
      </Button>
    </div>
  );
};

export default ExamRequest;
