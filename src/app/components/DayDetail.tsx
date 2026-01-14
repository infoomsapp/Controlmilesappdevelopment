// Day Detail - Complete evidence and calculations for a specific day

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { ArrowLeft, Hash, MapPin, DollarSign, Image as ImageIcon, Plus, Download } from 'lucide-react';
import { DailyLedger, Correction, IRSLogEntry } from '@/app/types';
import { saveLedger, getLogsByLedgerId } from '@/app/services/storage';
import { generateRecordHash } from '@/app/services/crypto';

interface DayDetailProps {
  ledger: DailyLedger;
  onNavigate: (screen: string, data?: any) => void;
}

export function DayDetail({ ledger: initialLedger, onNavigate }: DayDetailProps) {
  const [ledger, setLedger] = useState(initialLedger);
  const [logs, setLogs] = useState<IRSLogEntry[]>([]);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [newIncome, setNewIncome] = useState(ledger.income.toString());
  const [isAddingCorrection, setIsAddingCorrection] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionAmount, setCorrectionAmount] = useState('');

  useEffect(() => {
    const logEntries = getLogsByLedgerId(ledger.id);
    setLogs(logEntries);
  }, [ledger.id]);

  async function handleUpdateIncome() {
    const income = parseFloat(newIncome) || 0;
    
    const hash = await generateRecordHash({
      date: ledger.date,
      odometerStart: ledger.odometerStart,
      odometerEnd: ledger.odometerEnd,
      income,
      timestamp: Date.now(),
    });

    const updated = {
      ...ledger,
      income,
      recordHash: hash,
      timestamp: Date.now(),
    };

    saveLedger(updated);
    setLedger(updated);
    setIsEditingIncome(false);
  }

  async function handleAddCorrection() {
    const amount = parseFloat(correctionAmount) || 0;
    
    const correction: Correction = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reason: correctionReason,
      amount,
      timestamp: Date.now(),
      type: 'income',
    };

    const corrections = [...ledger.corrections, correction];
    const totalIncome = ledger.income + amount;

    const hash = await generateRecordHash({
      date: ledger.date,
      odometerStart: ledger.odometerStart,
      odometerEnd: ledger.odometerEnd,
      income: totalIncome,
      timestamp: Date.now(),
    });

    const updated = {
      ...ledger,
      corrections,
      income: totalIncome,
      recordHash: hash,
      timestamp: Date.now(),
    };

    saveLedger(updated);
    setLedger(updated);
    setIsAddingCorrection(false);
    setCorrectionReason('');
    setCorrectionAmount('');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('ledger')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detalle del Día</h1>
            <p className="text-gray-600">
              {new Date(ledger.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Odometer Section */}
        <Card>
          <CardHeader>
            <CardTitle>Odómetro</CardTitle>
            <CardDescription>Lecturas del día</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Inicio</Label>
                <div className="text-2xl font-bold">{ledger.odometerStart}</div>
              </div>
              <div>
                <Label>Fin</Label>
                <div className="text-2xl font-bold">{ledger.odometerEnd}</div>
              </div>
            </div>
            <Separator />
            <div>
              <Label>Millas Originales</Label>
              <div className="text-3xl font-bold text-blue-600">{ledger.originalMiles.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Income Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ingresos</CardTitle>
              <CardDescription>Ganancias del día</CardDescription>
            </div>
            <Dialog open={isEditingIncome} onOpenChange={setIsEditingIncome}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Ingresos</DialogTitle>
                  <DialogDescription>Actualiza los ingresos del día</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newIncome}
                      onChange={(e) => setNewIncome(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditingIncome(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateIncome}>Guardar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-green-600">${ledger.income.toFixed(2)}</div>
            <div className="text-sm text-gray-600">
              ${ledger.originalMiles > 0 ? (ledger.income / ledger.originalMiles).toFixed(2) : '0.00'} por milla
            </div>
          </CardContent>
        </Card>

        {/* Corrections Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Correcciones Legales</CardTitle>
              <CardDescription>{ledger.corrections.length} correcciones aplicadas</CardDescription>
            </div>
            <Dialog open={isAddingCorrection} onOpenChange={setIsAddingCorrection}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir Corrección</DialogTitle>
                  <DialogDescription>Registra una corrección legal</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Razón</Label>
                    <Input
                      value={correctionReason}
                      onChange={(e) => setCorrectionReason(e.target.value)}
                      placeholder="e.g. Additional tip"
                    />
                  </div>
                  <div>
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={correctionAmount}
                      onChange={(e) => setCorrectionAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingCorrection(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddCorrection}>Añadir</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {ledger.corrections.length === 0 ? (
              <p className="text-sm text-gray-500">No hay correcciones registradas</p>
            ) : (
              <div className="space-y-2">
                {ledger.corrections.map((correction) => (
                  <div key={correction.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{correction.reason}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(correction.timestamp).toLocaleString('es-ES')}
                      </div>
                    </div>
                    <Badge variant="secondary">${correction.amount.toFixed(2)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photos Section */}
        <Card>
          <CardHeader>
            <CardTitle>Fotos del Odómetro</CardTitle>
            <CardDescription>Evidencia fotográfica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {ledger.startPhotoPath ? (
                  <img src={ledger.startPhotoPath} alt="Inicio" className="w-full h-32 object-cover rounded" />
                ) : (
                  <div className="text-gray-400">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Foto inicial</p>
                  </div>
                )}
              </div>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {ledger.endPhotoPath ? (
                  <img src={ledger.endPhotoPath} alt="Fin" className="w-full h-32 object-cover rounded" />
                ) : (
                  <div className="text-gray-400">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Foto final</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GPS Logs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Registros GPS</CardTitle>
            <CardDescription>{logs.length} puntos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-sm text-gray-500">No hay registros GPS disponibles</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="text-xs p-2 bg-gray-50 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-mono">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {log.latitude.toFixed(6)}, {log.longitude.toFixed(6)}
                        </div>
                        <div className="text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleTimeString('es-ES')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{log.milesAccumulated.toFixed(2)} mi</div>
                        {log.gigApp && <Badge variant="outline" className="text-xs mt-1">{log.gigApp}</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hash Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Hash className="h-5 w-5 inline mr-2" />
              Integridad Criptográfica
            </CardTitle>
            <CardDescription>Hash SHA-256 del registro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <code className="text-xs bg-gray-100 p-3 rounded block overflow-x-auto font-mono">
              {ledger.recordHash}
            </code>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Timestamp:</span>
                <div className="font-medium">{new Date(ledger.timestamp).toLocaleString('es-ES')}</div>
              </div>
              <div>
                <span className="text-gray-600">Dispositivo:</span>
                <div className="font-medium text-xs truncate">{ledger.device}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Button className="w-full" variant="outline" onClick={() => onNavigate('export')}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Este Día
        </Button>
      </div>
    </div>
  );
}