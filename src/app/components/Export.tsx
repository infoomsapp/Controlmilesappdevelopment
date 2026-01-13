// Export - Generate audit-ready reports

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { ArrowLeft, FileText, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { ExportData } from '@/app/types';
import { getAllLedgers, getLedgersByDateRange, getLogsByDateRange } from '@/app/services/storage';
import { exportCSV, exportJSON, exportIRSLog } from '@/app/services/export';
import { toast } from 'sonner';

interface ExportProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function Export({ onNavigate }: ExportProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [format, setFormat] = useState<'csv' | 'json' | 'irs'>('csv');
  const [exportData, setExportData] = useState<ExportData | null>(null);

  useEffect(() => {
    prepareExportData();
  }, [period]);

  function prepareExportData() {
    const now = new Date();
    let startDate: string;
    let endDate = now.toISOString().split('T')[0];

    if (period === 'all') {
      const allLedgers = getAllLedgers();
      if (allLedgers.length === 0) {
        setExportData(null);
        return;
      }
      
      const dates = allLedgers.map(l => l.date).sort();
      startDate = dates[0];
      endDate = dates[dates.length - 1];
    } else {
      let daysAgo: number;
      switch (period) {
        case 'week':
          daysAgo = 7;
          break;
        case 'month':
          daysAgo = 30;
          break;
        case 'year':
          daysAgo = 365;
          break;
        default:
          daysAgo = 30;
      }
      
      const start = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      startDate = start.toISOString().split('T')[0];
    }

    const ledgers = getLedgersByDateRange(startDate, endDate);
    const logs = getLogsByDateRange(startDate, endDate);
    const totalMiles = ledgers.reduce((sum, l) => sum + l.originalMiles, 0);
    const totalIncome = ledgers.reduce((sum, l) => sum + l.income, 0);

    setExportData({
      ledgers,
      logs,
      startDate,
      endDate,
      totalMiles,
      totalIncome,
      generatedAt: Date.now(),
    });
  }

  function handleExport() {
    if (!exportData) {
      toast.error('No hay datos para exportar');
      return;
    }

    switch (format) {
      case 'csv':
        exportCSV(exportData);
        toast.success('Archivo CSV descargado');
        break;
      case 'json':
        exportJSON(exportData);
        toast.success('Archivo JSON descargado');
        break;
      case 'irs':
        exportIRSLog(exportData);
        toast.success('Reporte IRS descargado');
        break;
    }
  }

  const periodLabels = {
    week: 'Última Semana',
    month: 'Último Mes',
    year: 'Último Año',
    all: 'Todos los Registros',
  };

  const formatLabels = {
    csv: 'CSV (Excel)',
    json: 'JSON (Datos)',
    irs: 'Reporte IRS (Texto)',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Exportar Datos</h1>
            <p className="text-gray-600">Genera reportes audit-ready</p>
          </div>
        </div>

        {/* Export Summary */}
        {exportData && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle>Resumen de Exportación</CardTitle>
              <CardDescription>
                {exportData.startDate} - {exportData.endDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Días</div>
                <div className="text-2xl font-bold">{exportData.ledgers.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Millas</div>
                <div className="text-2xl font-bold">{exportData.totalMiles.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Ingresos</div>
                <div className="text-2xl font-bold">${exportData.totalIncome.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Period Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Período de Datos</CardTitle>
            <CardDescription>Selecciona el rango de fechas a exportar</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={period} onValueChange={(v) => setPeriod(v as any)}>
              <div className="space-y-3">
                {Object.entries(periodLabels).map(([value, label]) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={value} />
                    <Label htmlFor={value} className="cursor-pointer flex-1">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Format Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Formato de Exportación</CardTitle>
            <CardDescription>Elige el formato del archivo</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as any)}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="cursor-pointer flex-1 flex items-center">
                    <FileSpreadsheet className="h-5 w-5 mr-2 text-green-600" />
                    <div>
                      <div className="font-medium">CSV (Excel)</div>
                      <div className="text-sm text-gray-500">Compatible con Excel y Google Sheets</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="cursor-pointer flex-1 flex items-center">
                    <FileJson className="h-5 w-5 mr-2 text-blue-600" />
                    <div>
                      <div className="font-medium">JSON (Datos)</div>
                      <div className="text-sm text-gray-500">Formato completo con todos los datos y hashes</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="irs" id="irs" />
                  <Label htmlFor="irs" className="cursor-pointer flex-1 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-600" />
                    <div>
                      <div className="font-medium">Reporte IRS (Texto)</div>
                      <div className="text-sm text-gray-500">Formato legible para auditorías fiscales</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card>
          <CardHeader>
            <CardTitle>Datos Incluidos</CardTitle>
            <CardDescription>Información que se exportará</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Registros diarios completos (fechas, odómetro, millas)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Ingresos y correcciones legales</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Hashes criptográficos SHA-256 para integridad</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Registros GPS (timestamps, coordenadas, apps detectadas)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Información del dispositivo y timestamps</span>
              </li>
              {format === 'irs' && (
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Cálculo de deducción fiscal estimada</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Legal Notice */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-sm">
              <strong>Aviso Legal:</strong> Los archivos exportados contienen hashes criptográficos que garantizan
              la integridad de los datos. Estos registros son adecuados para auditorías del IRS y propósitos legales.
              Conserva los archivos originales y las fotos del odómetro.
            </p>
          </CardContent>
        </Card>

        {/* Export Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleExport}
          disabled={!exportData || exportData.ledgers.length === 0}
        >
          <Download className="mr-2 h-5 w-5" />
          Exportar {formatLabels[format]}
        </Button>
      </div>
    </div>
  );
}
