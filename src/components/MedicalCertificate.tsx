
import React, { useState } from 'react';
import { FileText, Printer, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MedicalCertificate = ({ onSave, patientName }) => {
  const [certificateData, setCertificateData] = useState({
    reason: '',
    days: '',
    startDate: new Date().toISOString().split('T')[0],
    observations: '',
    cid: '',
    type: 'medical'
  });

  const certificateTypes = [
    { value: 'medical', label: 'Atestado Médico' },
    { value: 'work', label: 'Atestado de Comparecimento' },
    { value: 'rest', label: 'Atestado de Repouso' },
    { value: 'companion', label: 'Atestado de Acompanhante' }
  ];

  const commonReasons = [
    'Doença',
    'Consulta médica',
    'Repouso médico',
    'Acompanhamento familiar',
    'Procedimento médico',
    'Exames complementares'
  ];

  const handleSave = () => {
    const certificate = {
      ...certificateData,
      patientName,
      date: new Date().toLocaleDateString('pt-BR'),
      doctorName: 'Dr(a). [Nome do Médico]',
      crm: '[CRM]'
    };
    onSave(certificate);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    const certificateTitle = certificateTypes.find(t => t.value === certificateData.type)?.label || 'Atestado Médico';
    
    // Convert days to number for arithmetic operations
    const daysAsNumber = parseInt(certificateData.days) || 0;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${certificateTitle} - ${patientName}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 2px solid #333; 
              padding-bottom: 20px; 
            }
            .content { 
              margin: 30px 0; 
              text-align: justify;
              font-size: 16px;
            }
            .footer { 
              margin-top: 60px; 
              text-align: center; 
            }
            .signature { 
              margin-top: 80px; 
              text-align: center; 
            }
            h1 { 
              color: #333; 
              margin-bottom: 10px; 
              font-size: 24px;
            }
            h2 { 
              color: #666; 
              margin-bottom: 20px; 
              font-size: 18px;
            }
            .patient-info {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            @media print { 
              body { margin: 20px; } 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Salus Healthcare Platform</h1>
            <h2>${certificateTitle}</h2>
          </div>
          
          <div class="content">
            <p><strong>Eu, Dr(a). [Nome do Médico], CRM [Número], </strong>atesto para os devidos fins que o(a) paciente:</p>
            
            <div class="patient-info">
              <strong>Nome:</strong> ${patientName}<br>
              ${certificateData.cid ? `<strong>CID:</strong> ${certificateData.cid}<br>` : ''}
            </div>
            
            <p>
              ${certificateData.type === 'medical' ? 
                `Necessita de afastamento de suas atividades por <strong>${certificateData.days} dias</strong>, no período de <strong>${new Date(certificateData.startDate).toLocaleDateString('pt-BR')}</strong> a <strong>${new Date(new Date(certificateData.startDate).getTime() + (daysAsNumber - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</strong>, devido a <strong>${certificateData.reason}</strong>.` :
                certificateData.type === 'work' ?
                `Esteve presente em consulta médica no dia <strong>${new Date(certificateData.startDate).toLocaleDateString('pt-BR')}</strong>, das <strong>[horário início]</strong> às <strong>[horário fim]</strong>, por motivo de <strong>${certificateData.reason}</strong>.` :
                certificateData.type === 'rest' ?
                `Deve permanecer em repouso por <strong>${certificateData.days} dias</strong>, a partir de <strong>${new Date(certificateData.startDate).toLocaleDateString('pt-BR')}</strong>, devido a <strong>${certificateData.reason}</strong>.` :
                `Necessitou de acompanhante durante consulta/procedimento médico no dia <strong>${new Date(certificateData.startDate).toLocaleDateString('pt-BR')}</strong>, por motivo de <strong>${certificateData.reason}</strong>.`
              }
            </p>
            
            ${certificateData.observations ? `
              <p><strong>Observações:</strong> ${certificateData.observations}</p>
            ` : ''}
          </div>
          
          <div class="signature">
            <p>_________________________________</p>
            <p><strong>Dr(a). [Nome do Médico]</strong></p>
            <p>CRM: [Número do CRM]</p>
            <p>Data: ${currentDate}</p>
          </div>
          
          <div class="footer">
            <p style="font-size: 12px; color: #666;">
              Salus Healthcare Platform - Saúde e inovação em suas mãos!<br>
              Este documento foi gerado eletronicamente em ${currentDate}
            </p>
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
            <FileText className="mr-2 h-5 w-5" />
            Atestado Médico - {patientName}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePrint}
            disabled={!certificateData.reason || !certificateData.type}
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de Atestado</Label>
            <Select 
              value={certificateData.type} 
              onValueChange={(value) => setCertificateData({...certificateData, type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {certificateTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data de Início</Label>
            <Input
              type="date"
              value={certificateData.startDate}
              onChange={(e) => setCertificateData({...certificateData, startDate: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Motivo/Diagnóstico</Label>
            <Select 
              value={certificateData.reason} 
              onValueChange={(value) => setCertificateData({...certificateData, reason: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione ou digite o motivo" />
              </SelectTrigger>
              <SelectContent>
                {commonReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>CID (opcional)</Label>
            <Input
              value={certificateData.cid}
              onChange={(e) => setCertificateData({...certificateData, cid: e.target.value})}
              placeholder="Ex: M54.5"
            />
          </div>
        </div>

        {(certificateData.type === 'medical' || certificateData.type === 'rest') && (
          <div className="space-y-2">
            <Label>Número de Dias</Label>
            <Select 
              value={certificateData.days} 
              onValueChange={(value) => setCertificateData({...certificateData, days: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione os dias" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5, 7, 10, 15, 30].map((days) => (
                  <SelectItem key={days} value={days.toString()}>
                    {days} {days === 1 ? 'dia' : 'dias'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Observações Adicionais</Label>
          <Textarea
            value={certificateData.observations}
            onChange={(e) => setCertificateData({...certificateData, observations: e.target.value})}
            placeholder="Informações complementares, restrições específicas..."
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!certificateData.reason || !certificateData.type}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Gerar Atestado
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalCertificate;
