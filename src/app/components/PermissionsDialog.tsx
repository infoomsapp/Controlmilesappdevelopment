// PermissionsDialog - Request permissions for physical activity tracking

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  MapPin, 
  Activity, 
  Camera, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Shield
} from 'lucide-react';
import { 
  requestPhysicalActivityPermissions,
  requestCameraPermission,
  type PermissionStatus,
  checkPermissionStatus,
  supportsMotionDetection
} from '@/app/services/permissions';
import { toast } from 'sonner';

interface PermissionsDialogProps {
  onComplete: (granted: boolean) => void;
  onCancel: () => void;
}

export function PermissionsDialog({ onComplete, onCancel }: PermissionsDialogProps) {
  const [requesting, setRequesting] = useState(false);
  const [permissions, setPermissions] = useState<PermissionStatus | null>(null);
  const [step, setStep] = useState<'intro' | 'requesting' | 'complete'>('intro');

  async function handleRequestPermissions() {
    setRequesting(true);
    setStep('requesting');

    try {
      // Request physical activity permissions (location, motion, orientation)
      const activityPerms = await requestPhysicalActivityPermissions();
      
      // Request camera permission
      const cameraGranted = await requestCameraPermission();

      // Check final status
      const finalStatus = await checkPermissionStatus();
      setPermissions(finalStatus);

      const allGranted = 
        activityPerms.location && 
        activityPerms.motion && 
        activityPerms.orientation &&
        cameraGranted;

      setStep('complete');
      setRequesting(false);

      if (allGranted) {
        toast.success('✅ Todos los permisos concedidos');
        setTimeout(() => {
          onComplete(true);
        }, 1500);
      } else {
        toast.warning('⚠️ Algunos permisos fueron denegados');
        setTimeout(() => {
          onComplete(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      toast.error('Error al solicitar permisos');
      setRequesting(false);
      setStep('intro');
    }
  }

  const getPermissionIcon = (status: 'granted' | 'denied' | 'prompt') => {
    if (status === 'granted') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (status === 'denied') return <XCircle className="h-5 w-5 text-red-600" />;
    return <AlertCircle className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Permisos Requeridos</CardTitle>
              <CardDescription>Para rastrear tu actividad física</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 'intro' && (
            <>
              {/* Permissions List */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Ubicación GPS</p>
                    <p className="text-sm text-gray-600">
                      Para rastrear las millas recorridas durante tu jornada
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Actividad Física y Movimiento</p>
                    <p className="text-sm text-gray-600">
                      Para detectar cuando estás conduciendo y mejorar la precisión del rastreo
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Camera className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Cámara</p>
                    <p className="text-sm text-gray-600">
                      Para capturar fotos del odómetro (evidencia legal para auditorías IRS)
                    </p>
                  </div>
                </div>
              </div>

              {/* Device Support Info */}
              {!supportsMotionDetection() && (
                <Card className="bg-yellow-50 border-yellow-300">
                  <CardContent className="pt-4">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-900">
                        <p className="font-semibold">Nota:</p>
                        <p>Tu dispositivo puede no soportar detección de movimiento avanzada, pero aún puedes usar el rastreo GPS básico.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Privacy Notice */}
              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded border border-blue-200">
                <p className="font-semibold text-blue-900 mb-1">🔒 Privacidad y Seguridad</p>
                <p>Todos los datos se almacenan localmente en tu dispositivo. ControlMiles no envía tu ubicación ni datos personales a servidores externos. La información solo se usa para generar reportes de auditoría del IRS.</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={requesting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleRequestPermissions}
                  disabled={requesting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Permitir Acceso
                </Button>
              </div>
            </>
          )}

          {step === 'requesting' && (
            <div className="py-8 text-center">
              <div className="mb-4 inline-flex p-4 bg-blue-100 rounded-full">
                <Activity className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <p className="text-lg font-medium mb-2">Solicitando permisos...</p>
              <p className="text-sm text-gray-600">
                Por favor, permite el acceso en los diálogos del navegador
              </p>
            </div>
          )}

          {step === 'complete' && permissions && (
            <div className="space-y-3">
              <div className="text-center mb-4">
                <div className="inline-flex p-4 bg-green-100 rounded-full mb-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium">Permisos Procesados</p>
              </div>

              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Ubicación</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPermissionIcon(permissions.location)}
                    <Badge variant={permissions.location === 'granted' ? 'default' : 'destructive'}>
                      {permissions.location === 'granted' ? 'Concedido' : 
                       permissions.location === 'denied' ? 'Denegado' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm">Movimiento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPermissionIcon(permissions.motion)}
                    <Badge variant={permissions.motion === 'granted' ? 'default' : 'destructive'}>
                      {permissions.motion === 'granted' ? 'Concedido' : 
                       permissions.motion === 'denied' ? 'Denegado' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <span className="text-sm">Cámara</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPermissionIcon(permissions.camera)}
                    <Badge variant={permissions.camera === 'granted' ? 'default' : 'destructive'}>
                      {permissions.camera === 'granted' ? 'Concedido' : 
                       permissions.camera === 'denied' ? 'Denegado' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>
              </div>

              {(permissions.location === 'denied' || permissions.motion === 'denied' || permissions.camera === 'denied') && (
                <Card className="bg-red-50 border-red-300">
                  <CardContent className="pt-4">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-900">
                        <p className="font-semibold mb-1">Algunos permisos fueron denegados</p>
                        <p>Para habilitar los permisos, ve a la configuración de tu navegador o dispositivo y permite el acceso a ControlMiles.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
