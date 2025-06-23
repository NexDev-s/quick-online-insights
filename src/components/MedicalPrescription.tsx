
import React, { useState } from 'react';
import { Plus, Trash2, Pill, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MedicalPrescription = ({ onSave, patientName }) => {
  const [medications, setMedications] = useState([]);
  const [observations, setObservations] = useState('');

  // Lista completa de medicamentos com doses usuais para autocomplete
  const allMedications = [
    { name: 'Dipirona', doses: ['500mg', '1g'], frequency: ['6/6h', '8/8h'], duration: ['5 dias', '7 dias'] },
    { name: 'Paracetamol', doses: ['500mg', '750mg'], frequency: ['6/6h', '8/8h'], duration: ['3 dias', '5 dias'] },
    { name: 'Ibuprofeno', doses: ['400mg', '600mg'], frequency: ['8/8h', '12/12h'], duration: ['3 dias', '5 dias'] },
    { name: 'Amoxicilina', doses: ['500mg', '875mg'], frequency: ['8/8h', '12/12h'], duration: ['7 dias', '10 dias'] },
    { name: 'Azitromicina', doses: ['500mg'], frequency: ['24/24h'], duration: ['3 dias', '5 dias'] },
    { name: 'Losartana', doses: ['50mg', '100mg'], frequency: ['24/24h'], duration: ['Uso contínuo'] },
    { name: 'Metformina', doses: ['500mg', '850mg'], frequency: ['12/12h', '8/8h'], duration: ['Uso contínuo'] },
    { name: 'Omeprazol', doses: ['20mg', '40mg'], frequency: ['24/24h'], duration: ['14 dias', '30 dias'] },
    { name: 'Simvastatina', doses: ['20mg', '40mg'], frequency: ['24/24h'], duration: ['Uso contínuo'] },
    { name: 'Captopril', doses: ['25mg', '50mg'], frequency: ['8/8h', '12/12h'], duration: ['Uso contínuo'] },
    { name: 'Hidroclorotiazida', doses: ['25mg', '50mg'], frequency: ['24/24h'], duration: ['Uso contínuo'] },
    { name: 'Atenolol', doses: ['25mg', '50mg'], frequency: ['24/24h'], duration: ['Uso contínuo'] },
    { name: 'Prednisona', doses: ['5mg', '20mg', '40mg'], frequency: ['24/24h', '12/12h'], duration: ['5 dias', '7 dias'] },
    { name: 'Cetoconazol', doses: ['200mg'], frequency: ['24/24h'], duration: ['7 dias', '14 dias'] },
    { name: 'Bromoprida', doses: ['10mg'], frequency: ['8/8h'], duration: ['3 dias', '5 dias'] },
    { name: 'Ácido Acetilsalicílico', doses: ['100mg', '500mg'], frequency: ['24/24h', '6/6h'], duration: ['Uso contínuo', '3 dias'] },
    { name: 'Diclofenaco', doses: ['50mg', '75mg'], frequency: ['8/8h', '12/12h'], duration: ['3 dias', '5 dias'] },
    { name: 'Nimesulida', doses: ['100mg'], frequency: ['12/12h'], duration: ['3 dias', '5 dias'] },
    { name: 'Cefalexina', doses: ['500mg'], frequency: ['6/6h'], duration: ['7 dias', '10 dias'] },
    { name: 'Clindamicina', doses: ['300mg', '600mg'], frequency: ['8/8h'], duration: ['7 dias', '10 dias'] },
    { name: 'Furosemida', doses: ['40mg'], frequency: ['24/24h'], duration: ['Uso contínuo'] },
    { name: 'Anlodipino', doses: ['5mg', '10mg'], frequency: ['24/24h'], duration: ['Uso contínuo'] },
    { name: 'Dexametasona', doses: ['4mg', '8mg'], frequency: ['24/24h'], duration: ['3 dias', '5 dias'] },
    { name: 'Ranitidina', doses: ['150mg'], frequency: ['12/12h'], duration: ['14 dias', '30 dias'] }
  ];

  const addMedication = () => {
    setMedications([...medications, {
      id: Date.now(),
      name: '',
      dose: '',
      frequency: '',
      duration: '',
      instructions: '',
      suggestions: []
    }]);
  };

  const removeMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const updateMedication = (id, field, value) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleMedicationNameChange = (id, value) => {
    const suggestions = value.length > 0 
      ? allMedications.filter(med => 
          med.name.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5)
      : [];

    setMedications(medications.map(med => 
      med.id === id 
        ? { ...med, name: value, suggestions } 
        : med
    ));
  };

  const selectSuggestion = (id, selectedMed) => {
    setMedications(medications.map(med => 
      med.id === id 
        ? { 
            ...med, 
            name: selectedMed.name,
            dose: selectedMed.doses[0],
            frequency: selectedMed.frequency[0],
            duration: selectedMed.duration[0],
            suggestions: []
          } 
        : med
    ));
  };

  const handleSave = () => {
    const prescription = {
      medications,
      observations,
      patientName,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR')
    };
    onSave(prescription);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const currentTime = new Date().toLocaleTimeString('pt-BR');
    
    let medicationsHtml = '';
    medications.forEach((med, index) => {
      medicationsHtml += `
        <div style="margin: 15px 0; padding: 10px; border-left: 3px solid #3b82f6;">
          <strong>${index + 1}. ${med.name} ${med.dose}</strong><br>
          <em>Tomar ${med.frequency} por ${med.duration}</em><br>
          ${med.instructions ? `<small>${med.instructions}</small>` : ''}
        </div>
      `;
    });
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Receita Médica - ${patientName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .patient-info { margin-bottom: 20px; background: #f5f5f5; padding: 15px; border-radius: 5px; }
            .content { margin: 20px 0; line-height: 1.6; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            .doctor-signature { margin-top: 50px; text-align: right; }
            h1 { color: #333; margin-bottom: 10px; }
            h2 { color: #666; margin-bottom: 15px; }
            .medications { background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
            @media print { 
              body { margin: 0; } 
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Flash Clinics</h1>
            <h2>Receita Médica</h2>
            <p>Data: ${currentDate} - Horário: ${currentTime}</p>
          </div>
          
          <div class="patient-info">
            <strong>Paciente:</strong> ${patientName}
          </div>
          
          <div class="medications">
            <h3>Medicações Prescritas:</h3>
            ${medicationsHtml}
          </div>
          
          ${observations ? `
            <div class="content">
              <h3>Observações:</h3>
              <p>${observations.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}
          
          <div class="doctor-signature">
            <p>_________________________________</p>
            <p>Dr(a). [Nome do Médico]</p>
            <p>CRM: [Número do CRM]</p>
          </div>
          
          <div class="footer">
            <p>Flash Clinics - Seus atendimentos em um flash!</p>
            <p>Este documento foi gerado eletronicamente em ${currentDate} às ${currentTime}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Pill className="mr-2 h-5 w-5" />
            Receita Médica - {patientName}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePrint}
            disabled={medications.length === 0}
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium">Medicações Prescritas</Label>
            <Button onClick={addMedication} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Medicação
            </Button>
          </div>

          {medications.map((medication, index) => (
            <div key={medication.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <Label className="font-medium">Medicação {index + 1}</Label>
                <Button 
                  onClick={() => removeMedication(medication.id)} 
                  size="sm" 
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <Label>Medicamento</Label>
                  <Input
                    value={medication.name}
                    onChange={(e) => handleMedicationNameChange(medication.id, e.target.value)}
                    placeholder="Digite o nome do medicamento"
                  />
                  
                  {/* Sugestões automáticas */}
                  {medication.suggestions && medication.suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                      {medication.suggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                          onClick={() => selectSuggestion(medication.id, suggestion)}
                        >
                          <div className="font-medium text-blue-700">{suggestion.name}</div>
                          <div className="text-xs text-gray-600">
                            Doses: {suggestion.doses.join(', ')} | Frequência: {suggestion.frequency.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Dose</Label>
                  <Input
                    value={medication.dose}
                    onChange={(e) => updateMedication(medication.id, 'dose', e.target.value)}
                    placeholder="Ex: 500mg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequência</Label>
                  <Select onValueChange={(value) => updateMedication(medication.id, 'frequency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={medication.frequency || "Selecione"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6/6h">6/6 horas</SelectItem>
                      <SelectItem value="8/8h">8/8 horas</SelectItem>
                      <SelectItem value="12/12h">12/12 horas</SelectItem>
                      <SelectItem value="24/24h">24/24 horas (1x ao dia)</SelectItem>
                      <SelectItem value="SOS">Se necessário (SOS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Duração</Label>
                  <Select onValueChange={(value) => updateMedication(medication.id, 'duration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={medication.duration || "Selecione"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3 dias">3 dias</SelectItem>
                      <SelectItem value="5 dias">5 dias</SelectItem>
                      <SelectItem value="7 dias">7 dias</SelectItem>
                      <SelectItem value="10 dias">10 dias</SelectItem>
                      <SelectItem value="14 dias">14 dias</SelectItem>
                      <SelectItem value="30 dias">30 dias</SelectItem>
                      <SelectItem value="Uso contínuo">Uso contínuo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Instruções Especiais</Label>
                <Input
                  value={medication.instructions}
                  onChange={(e) => updateMedication(medication.id, 'instructions', e.target.value)}
                  placeholder="Ex: Tomar com alimentos, em jejum, etc."
                />
              </div>
            </div>
          ))}

          {medications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma medicação adicionada</p>
              <p className="text-sm">Clique em "Adicionar Medicação" para começar</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Observações Gerais</Label>
          <Textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Orientações gerais, cuidados especiais, retorno..."
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={medications.length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Gerar Receita
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalPrescription;
