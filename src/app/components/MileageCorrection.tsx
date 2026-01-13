// MileageCorrection - Apply corrections to daily mileage without editing immutable records

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { AlertTriangle, Shield, FileText, X } from 'lucide-react';
import { DailyLedger, MileageCorrection as ICorrectionType } from '@/app/types';
import { saveLedger } from '@/app/services/storage';
import { generateRecordHash } from '@/app/services/crypto';
import { toast } from 'sonner';

interface MilageCorrectionProps {
  ledger: DailyLedger;
  onClose: () => void;
  onUpdate: () => void;
}

export function MileageCorrection({ ledger, onClose, onUpdate }: MilageCorrectionProps) {
  const [adjustmentValue, setAdjustmentValue] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const originalMiles = ledger.originalMiles;
  const totalCorrections = ledger.corrections.reduce((sum, c) => sum + c.adjustment, 0);
  const currentDisplayedMiles = originalMiles + totalCorrections;

  async function handleApplyCorrection() {
    const adjustment = parseFloat(adjustmentValue);
    
    if (isNaN(adjustment)) {
      toast.error('Ingresa un valor numérico válido');
      return;
    }

    if (adjustment === 0) {
      toast.error('El ajuste no puede ser cero');
      return;
    }

    if (!reason.trim()) {
      toast.error('Debes proporcionar una razón para la corrección');
      return;
    }

    if (reason.trim().length < 10) {
      toast.error('La razón debe tener al menos 10 caracteres');
      return;
    }

    setSubmitting(true);

    try {
      const correction: ICorrectionType = {
        timestamp: Date.now(),
        adjustment,
        reason: reason.trim(),
        appliedBy: 'user',
        previousValue: currentDisplayedMiles,
        newValue: currentDisplayedMiles + adjustment,
      };

      const updatedCorrections = [...ledger.corrections, correction];

      // Generate new hash including the correction
      const hash = await generateRecordHash({
        date: ledger.date,
        odometerStart: ledger.odometerStart,
        odometerEnd: ledger.odometerEnd,
        income: ledger.income,
        corrections: updatedCorrections,
        timestamp: Date.now(),
      });

      const updatedLedger: DailyLedger = {
        ...ledger,
        corrections: updatedCorrections,
        recordHash: hash,
        timestamp: Date.now(),
      };

      saveLedger(updatedLedger);
      
      toast.success(`✅ Corrección aplicada: ${adjustment > 0 ? '+' : ''}${adjustment.toFixed(2)} millas`);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error applying correction:', error);
      toast.error('Error al aplicar la corrección');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Aplicar Corrección de Millaje</CardTitle>
                <CardDescription>Sistema de correcciones inmutables y auditables</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Immutable Records Notice */}
          <Card className="bg-blue-50 border-blue-300">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">🔒 Registros Inmutables Protegidos</p>
                  <p>Las millas originales NUNCA se editan directamente. Las correcciones se registran como ajustes separados, manteniendo un historial completo y auditable para el IRS.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">Millas Originales (Inmutables)</p>
              <p className="text-2xl font-bold text-gray-900">{originalMiles.toFixed(2)}</p>
              <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-300">
                <Shield className="h-3 w-3 mr-1" />
                Protegidas
              </Badge>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Correcciones</p>
              <p className={`text-2xl font-bold ${totalCorrections >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalCorrections > 0 ? '+' : ''}{totalCorrections.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{ledger.corrections.length} corrección(es)</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Millas Mostradas</p>
              <p className="text-2xl font-bold text-blue-600">{currentDisplayedMiles.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Original + Correcciones</p>
            </div>
          </div>

          {/* Correction History */}
          {ledger.corrections.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <p className="font-semibold text-sm">Historial de Correcciones</p>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {ledger.corrections.map((correction, idx) => (
                  <Card key={idx} className="bg-gray-50">
                    <CardContent className="pt-3 pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={correction.adjustment >= 0 ? 'default' : 'destructive'} className="text-xs">
                              {correction.adjustment > 0 ? '+' : ''}{correction.adjustment.toFixed(2)} millas
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(correction.timestamp).toLocaleString('es-ES')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{correction.reason}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {correction.previousValue.toFixed(2)} → {correction.newValue.toFixed(2)} millas
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Apply New Correction */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Nueva Corrección</h3>
            
            <div className="space-y-2">
              <Label htmlFor="adjustment">Ajuste de Millas</Label>
              <div className="flex gap-2">
                <Input
                  id="adjustment"
                  type="number"
                  step="0.01"
                  placeholder="Ej: +5.50 o -2.30"
                  value={adjustmentValue}
                  onChange={(e) => setAdjustmentValue(e.target.value)}
                  className="flex-1"
                />
                {adjustmentValue && !isNaN(parseFloat(adjustmentValue)) && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded border">
                    <span className="text-sm text-gray-600">Resultado:</span>
                    <span className="font-bold text-blue-600">
                      {(currentDisplayedMiles + parseFloat(adjustmentValue)).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Ingresa un número positivo para agregar millas, o negativo para reducir
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Razón de la Corrección (Mínimo 10 caracteres)</Label>
              <Textarea
                id="reason"
                placeholder="Ej: Error de GPS en túnel causó registro incorrecto de 3.2 millas. Corrección basada en ruta real verificada en Google Maps."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                {reason.length} caracteres - Esta razón quedará registrada permanentemente
              </p>
            </div>

            {/* Warning */}
            <Card className="bg-yellow-50 border-yellow-300">
              <CardContent className="pt-4">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-semibold mb-1">⚠️ Advertencia</p>
                    <p>Las correcciones son permanentes y auditables. Asegúrate de que el ajuste y la razón sean precisos y honestos para cumplir con los requisitos del IRS.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApplyCorrection}
              disabled={submitting || !adjustmentValue || !reason.trim() || reason.trim().length < 10}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {submitting ? 'Aplicando...' : 'Aplicar Corrección'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
