
import { saveAs } from 'file-saver';

export function exportPatientsCSV(patients: any[]) {
  const headers = Object.keys(patients[0] || {});
  const rows = patients.map(p => headers.map(h => `"${(p[h] ?? '').toString().replace(/"/g, '""')}"`));
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'pacientes.csv');
}
