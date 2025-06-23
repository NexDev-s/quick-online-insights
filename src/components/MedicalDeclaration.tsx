
import React, { useState } from 'react';
import { FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const MedicalDeclaration = ({ onSave, patientName }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    const declarationData = {
      patientName,
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
    };

    onSave(declarationData);
    
    // Limpar formulário
    setTitle('');
    setContent('');
  };

  const titleSuggestions = [
    'Declaração de Comparecimento',
    'Declaração Médica',
    'Declaração de Aptidão Física',
    'Declaração de Acompanhamento Médico',
    'Declaração de Tratamento',
    'Declaração de Recomendação Médica'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2 flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Declaração Médica
        </h3>
        <p className="text-sm text-green-600">Paciente: {patientName}</p>
      </div>

      {/* Título */}
      <div>
        <Label htmlFor="declaration-title">Título da Declaração *</Label>
        <Input
          id="declaration-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Declaração de Comparecimento"
          className="mt-1"
        />
        
        {/* Sugestões de Título */}
        <div className="mt-2">
          <Label className="text-xs text-gray-500 mb-2 block">Sugestões:</Label>
          <div className="flex flex-wrap gap-2">
            {titleSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setTitle(suggestion)}
                className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 h-auto"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div>
        <Label htmlFor="declaration-content">Conteúdo da Declaração *</Label>
        <Textarea
          id="declaration-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Declaro para os devidos fins que o(a) paciente..."
          className="mt-1"
          rows={8}
        />
        <p className="text-xs text-gray-500 mt-1">
          Descreva o conteúdo completo da declaração médica
        </p>
      </div>

      {/* Preview */}
      {(title || content) && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Preview</Label>
          <div className="space-y-2">
            {title && (
              <h4 className="font-semibold text-center text-gray-900">{title}</h4>
            )}
            {content && (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{content}</p>
            )}
            <div className="text-right text-xs text-gray-500 mt-4">
              Data: {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
      )}

      {/* Botão Salvar */}
      <Button 
        onClick={handleSave}
        disabled={!title.trim() || !content.trim()}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
      >
        <Save className="mr-2 h-4 w-4" />
        Gerar Declaração
      </Button>
    </div>
  );
};

export default MedicalDeclaration;
