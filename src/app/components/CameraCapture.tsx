// CameraCapture - Mandatory camera capture for odometer start photo

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Camera, X, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onCapture: (photoDataUrl: string, odometerReading: number) => void;
  onCancel?: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [odometerReading, setOdometerReading] = useState('');
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraError(false);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError(true);
      toast.error('No se pudo acceder a la cámara. Por favor, permite el acceso a la cámara.');
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }

  function capturePhoto() {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedPhoto(dataUrl);
        stopCamera();
      }
    }
  }

  function retakePhoto() {
    setCapturedPhoto(null);
    startCamera();
  }

  function handleConfirm() {
    if (!capturedPhoto) {
      toast.error('Debes tomar una foto del odómetro');
      return;
    }

    const reading = parseFloat(odometerReading);
    if (!reading || reading <= 0) {
      toast.error('Ingresa una lectura v��lida del odómetro');
      return;
    }

    onCapture(capturedPhoto, reading);
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">📸 Foto Inicial Obligatoria</CardTitle>
                <CardDescription>Captura el odómetro al inicio de la jornada</CardDescription>
              </div>
              {onCancel && (
                <Button variant="ghost" size="icon" onClick={onCancel}>
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Instructions */}
            <Card className="bg-yellow-50 border-yellow-300">
              <CardContent className="pt-4 pb-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900">
                  <p className="font-semibold mb-1">⚠️ Requisito de Auditoría del IRS</p>
                  <p>Debes tomar una foto clara del odómetro usando la cámara ANTES de iniciar el rastreo GPS. Esta es evidencia legal obligatoria.</p>
                </div>
              </CardContent>
            </Card>

            {/* Camera/Photo Display */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {cameraError ? (
                <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                  <div>
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">No se pudo acceder a la cámara</p>
                    <p className="text-sm opacity-75">Por favor, permite el acceso a la cámara en la configuración del navegador</p>
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={startCamera}
                    >
                      Intentar de nuevo
                    </Button>
                  </div>
                </div>
              ) : capturedPhoto ? (
                <img
                  src={capturedPhoto}
                  alt="Odómetro capturado"
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-4 border-white/50 rounded-lg w-3/4 h-3/4" />
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-2">
                    Alinea el odómetro dentro del marco
                  </div>
                </>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Controls */}
            {!cameraError && !capturedPhoto && (
              <Button
                className="w-full"
                size="lg"
                onClick={capturePhoto}
                disabled={!stream}
              >
                <Camera className="mr-2 h-5 w-5" />
                Capturar Foto del Odómetro
              </Button>
            )}

            {/* Photo Confirmation */}
            {capturedPhoto && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="odometer-reading" className="text-base">
                    Lectura del Odómetro *
                  </Label>
                  <Input
                    id="odometer-reading"
                    type="number"
                    step="0.1"
                    placeholder="Ej: 12345.6"
                    value={odometerReading}
                    onChange={(e) => setOdometerReading(e.target.value)}
                    className="text-lg"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500">
                    Ingresa exactamente lo que se ve en la foto
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={retakePhoto}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Tomar de nuevo
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!odometerReading}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar
                  </Button>
                </div>
              </>
            )}

            {/* Legal Notice */}
            <div className="text-xs text-gray-500 text-center pt-2 border-t">
              🔒 La foto se almacena localmente y se incluirá en reportes de auditoría
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}