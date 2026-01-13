// Photos - Odometer photo capture screen

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { ArrowLeft, Camera, Upload, Save } from 'lucide-react';
import { DailyLedger } from '@/app/types';
import { saveLedger } from '@/app/services/storage';
import { generateRecordHash } from '@/app/services/crypto';
import { toast } from 'sonner';

interface PhotosProps {
  ledger: DailyLedger;
  onNavigate: (screen: string, data?: any) => void;
}

export function Photos({ ledger: initialLedger, onNavigate }: PhotosProps) {
  const [ledger, setLedger] = useState(initialLedger);
  const [startPhoto, setStartPhoto] = useState<string | undefined>(ledger.startPhotoPath);
  const [endPhoto, setEndPhoto] = useState<string | undefined>(ledger.endPhotoPath);
  const [odometerStart, setOdometerStart] = useState(ledger.odometerStart.toString());
  const [odometerEnd, setOdometerEnd] = useState(ledger.odometerEnd.toString());
  
  const startFileInputRef = useRef<HTMLInputElement>(null);
  const endFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'start' | 'end'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'start') {
          setStartPhoto(result);
        } else {
          setEndPhoto(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSave() {
    const start = parseFloat(odometerStart) || 0;
    const end = parseFloat(odometerEnd) || 0;
    const miles = end - start;

    if (miles < 0) {
      toast.error('El odómetro final debe ser mayor que el inicial');
      return;
    }

    const hash = await generateRecordHash({
      date: ledger.date,
      odometerStart: start,
      odometerEnd: end,
      income: ledger.income,
      timestamp: Date.now(),
    });

    const updated: DailyLedger = {
      ...ledger,
      odometerStart: start,
      odometerEnd: end,
      originalMiles: miles,
      startPhotoPath: startPhoto,
      endPhotoPath: endPhoto,
      recordHash: hash,
      timestamp: Date.now(),
    };

    saveLedger(updated);
    setLedger(updated);
    toast.success('Fotos y odómetro guardados correctamente');
    
    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      onNavigate('dashboard');
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Fotos del Odómetro</h1>
            <p className="text-gray-600">Evidencia legal para {ledger.date}</p>
          </div>
        </div>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm">
              <strong>Importante:</strong> Toma fotos claras del odómetro al inicio y al final de tu jornada.
              Las fotos deben mostrar la lectura completa del odómetro.
            </p>
          </CardContent>
        </Card>

        {/* Odometer Readings */}
        <Card>
          <CardHeader>
            <CardTitle>Lecturas del Odómetro</CardTitle>
            <CardDescription>Ingresa las millas exactas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="odometer-start">Odómetro Inicial</Label>
                <Input
                  id="odometer-start"
                  type="number"
                  value={odometerStart}
                  onChange={(e) => setOdometerStart(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="odometer-end">Odómetro Final</Label>
                <Input
                  id="odometer-end"
                  type="number"
                  value={odometerEnd}
                  onChange={(e) => setOdometerEnd(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <div className="text-sm text-gray-600">Millas del día</div>
              <div className="text-3xl font-bold text-blue-600">
                {(parseFloat(odometerEnd) - parseFloat(odometerStart) || 0).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Foto Inicial</CardTitle>
            <CardDescription>Odómetro al inicio del día</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {startPhoto ? (
              <div className="relative">
                <img
                  src={startPhoto}
                  alt="Odómetro inicial"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => startFileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Cambiar
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => startFileInputRef.current?.click()}
              >
                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">Toca para capturar foto inicial</p>
                <p className="text-sm text-gray-500">o arrastra una imagen aquí</p>
              </div>
            )}
            <input
              ref={startFileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileChange(e, 'start')}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => startFileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar desde archivo
            </Button>
          </CardContent>
        </Card>

        {/* End Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Foto Final</CardTitle>
            <CardDescription>Odómetro al final del día</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {endPhoto ? (
              <div className="relative">
                <img
                  src={endPhoto}
                  alt="Odómetro final"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => endFileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Cambiar
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => endFileInputRef.current?.click()}
              >
                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">Toca para capturar foto final</p>
                <p className="text-sm text-gray-500">o arrastra una imagen aquí</p>
              </div>
            )}
            <input
              ref={endFileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileChange(e, 'end')}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => endFileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar desde archivo
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleSave}
          disabled={!odometerStart || !odometerEnd}
        >
          <Save className="mr-2 h-5 w-5" />
          Guardar Fotos y Odómetro
        </Button>
      </div>
    </div>
  );
}
