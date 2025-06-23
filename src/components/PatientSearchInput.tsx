
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Patient } from '@/hooks/usePatients';
import { ChevronDown, User } from 'lucide-react';

interface PatientSearchInputProps {
  patients: Patient[];
  selectedPatient: string;
  onSelectPatient: (patientId: string) => void;
  loading?: boolean;
  label?: string;
  placeholder?: string;
}

const PatientSearchInput = ({ 
  patients, 
  selectedPatient, 
  onSelectPatient, 
  loading = false,
  label = "Paciente",
  placeholder = "Digite o nome do paciente..."
}: PatientSearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPatientObj = patients.find(p => p.id === selectedPatient);

  // Update search term when selected patient changes
  useEffect(() => {
    if (selectedPatientObj && !searchTerm) {
      setSearchTerm(selectedPatientObj.nome);
    }
  }, [selectedPatientObj?.nome]); // Only depend on the name, not the whole object

  // Filter patients based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = patients.filter(patient =>
        patient.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.telefone?.includes(searchTerm) ||
        patient.cpf?.includes(searchTerm)
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchTerm, patients.length]); // Only depend on search term and patients length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
    
    // Se o campo foi limpo, limpar seleção
    if (value === '') {
      onSelectPatient('');
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    console.log('✅ DEBUG PatientSearchInput - Paciente selecionado:', patient);
    setSearchTerm(patient.nome);
    onSelectPatient(patient.id);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Não mostrar o componente se estiver carregando indefinidamente
  if (loading && patients.length === 0) {
    return (
      <div>
        <Label htmlFor="patient-search">{label} *</Label>
        <div className="relative mt-1">
          <Input
            disabled
            placeholder="Carregando pacientes..."
            className="pr-10"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Label htmlFor="patient-search">{label} *</Label>
      <div className="relative mt-1">
        <Input
          ref={inputRef}
          id="patient-search"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={patients.length === 0 ? "Nenhum paciente cadastrado" : placeholder}
          disabled={patients.length === 0}
          className="pr-10"
        />
        <ChevronDown 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredPatients.length === 0 ? (
            <div className="p-3 text-center text-gray-500">
              {patients.length === 0 ? 'Nenhum paciente cadastrado' : 'Nenhum paciente encontrado'}
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelectPatient(patient)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{patient.nome}</p>
                    <p className="text-sm text-gray-500">
                      {patient.idade} anos • {patient.telefone}
                      {patient.convenio && ` • ${patient.convenio}`}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedPatientObj && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1">Paciente Selecionado</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><strong>Nome:</strong> {selectedPatientObj.nome}</p>
            <p><strong>Idade:</strong> {selectedPatientObj.idade} anos</p>
            <p><strong>Telefone:</strong> {selectedPatientObj.telefone}</p>
            <p><strong>Convênio:</strong> {selectedPatientObj.convenio || 'Particular'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearchInput;
