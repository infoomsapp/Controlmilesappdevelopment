// Export service for generating reports

import { DailyLedger, IRSLogEntry, ExportData } from '@/app/types';

export function exportToCSV(data: ExportData): string {
  const headers = [
    'Fecha',
    'Odómetro Inicio',
    'Odómetro Fin',
    'Millas',
    'Ingresos',
    'Hash',
    'Dispositivo',
  ];

  const rows = data.ledgers.map(ledger => [
    ledger.date,
    ledger.odometerStart.toString(),
    ledger.odometerEnd.toString(),
    ledger.originalMiles.toFixed(2),
    ledger.income.toFixed(2),
    ledger.recordHash,
    ledger.device,
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  return csv;
}

export function exportToJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

export function exportToIRSLog(data: ExportData): string {
  const lines = [
    'REGISTRO IRS - MILLAS DE NEGOCIO',
    `Período: ${data.startDate} - ${data.endDate}`,
    `Total Millas: ${data.totalMiles.toFixed(2)}`,
    `Total Ingresos: $${data.totalIncome.toFixed(2)}`,
    `Deducción Estimada: $${(data.totalMiles * 0.67).toFixed(2)}`,
    `Generado: ${new Date(data.generatedAt).toLocaleString('es-ES')}`,
    '',
    'DETALLE DIARIO:',
    '',
  ];

  data.ledgers.forEach(ledger => {
    lines.push(`Fecha: ${ledger.date}`);
    lines.push(`  Odómetro: ${ledger.odometerStart} - ${ledger.odometerEnd}`);
    lines.push(`  Millas: ${ledger.originalMiles.toFixed(2)}`);
    lines.push(`  Ingresos: $${ledger.income.toFixed(2)}`);
    lines.push(`  Hash: ${ledger.recordHash}`);
    
    if (ledger.corrections.length > 0) {
      lines.push('  Correcciones:');
      ledger.corrections.forEach(c => {
        lines.push(`    - ${c.reason}: $${c.amount.toFixed(2)}`);
      });
    }
    lines.push('');
  });

  return lines.join('\n');
}

export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCSV(data: ExportData): void {
  const csv = exportToCSV(data);
  const filename = `controlmiles_${data.startDate}_${data.endDate}.csv`;
  downloadFile(csv, filename, 'text/csv');
}

export function exportJSON(data: ExportData): void {
  const json = exportToJSON(data);
  const filename = `controlmiles_${data.startDate}_${data.endDate}.json`;
  downloadFile(json, filename, 'application/json');
}

export function exportIRSLog(data: ExportData): void {
  const log = exportToIRSLog(data);
  const filename = `controlmiles_irs_${data.startDate}_${data.endDate}.txt`;
  downloadFile(log, filename, 'text/plain');
}
