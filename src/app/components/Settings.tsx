// Settings - App configuration and preferences

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Separator } from '@/app/components/ui/separator';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Settings as SettingsType, Language } from '@/app/types';
import { getSettings, saveSettings } from '@/app/services/storage';
import { toast } from 'sonner';

interface SettingsProps {
  onNavigate: (screen: string, data?: any) => void;
}

const languageOptions: { code: Language; name: string; nativeName: string }[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

export function Settings({ onNavigate }: SettingsProps) {
  const [settings, setSettings] = useState<SettingsType>(getSettings());
  const [mileageRate, setMileageRate] = useState(settings.standardMileageRate.toString());

  function handleSave() {
    const rate = parseFloat(mileageRate) || 0.67;
    const updated = { ...settings, standardMileageRate: rate };
    saveSettings(updated);
    setSettings(updated);
    toast.success('Configuración guardada correctamente');
  }

  function handleClearData() {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.clear();
      toast.success('Todos los datos han sido eliminados');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
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
            <h1 className="text-3xl font-bold">Configuración</h1>
            <p className="text-gray-600">Preferencias y ajustes del sistema</p>
          </div>
        </div>

        {/* Tracking Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Rastreo GPS</CardTitle>
            <CardDescription>Configuración del seguimiento de ubicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-iniciar rastreo</Label>
                <div className="text-sm text-gray-500">
                  Iniciar rastreo automáticamente al abrir la app
                </div>
              </div>
              <Switch
                checked={settings.autoStartTracking}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoStartTracking: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Detectar apps gig</Label>
                <div className="text-sm text-gray-500">
                  Identificar automáticamente apps como Uber, Lyft, etc.
                </div>
              </div>
              <Switch
                checked={settings.detectGigApps}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, detectGigApps: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración Fiscal</CardTitle>
            <CardDescription>Ajustes para cálculos de deducción</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mostrar estimación fiscal</Label>
                <div className="text-sm text-gray-500">
                  Calcular deducción estimada del IRS
                </div>
              </div>
              <Switch
                checked={settings.taxEstimation}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, taxEstimation: checked })
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="mileage-rate">Tasa estándar de millas (IRS)</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="mileage-rate"
                    type="number"
                    step="0.01"
                    value={mileageRate}
                    onChange={(e) => setMileageRate(e.target.value)}
                    className="pl-6"
                  />
                </div>
                <span className="flex items-center text-gray-500">/ milla</span>
              </div>
              <p className="text-xs text-gray-500">
                Tasa estándar del IRS para 2024: $0.67/milla
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Datos y Privacidad</CardTitle>
            <CardDescription>Gestión de información almacenada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Backup local</Label>
                <div className="text-sm text-gray-500">
                  Mantener copia de seguridad en el navegador
                </div>
              </div>
              <Switch
                checked={settings.backupEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, backupEnabled: checked })
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Almacenamiento local</Label>
              <p className="text-sm text-gray-500">
                Todos los datos se almacenan localmente en tu dispositivo de forma cifrada.
                No se envía información a servidores externos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle>Idioma</CardTitle>
            <CardDescription>Preferencia de idioma de la aplicación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {languageOptions.map((option) => (
                <Button
                  key={option.code}
                  variant={settings.language === option.code ? 'default' : 'outline'}
                  className="h-auto py-3 flex flex-col items-center gap-1"
                  onClick={() => setSettings({ ...settings, language: option.code })}
                >
                  <span className="text-base">{option.nativeName}</span>
                  <span className="text-xs opacity-70">{option.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>Acerca de ControlMiles</CardTitle>
            <CardDescription>Información de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Versión:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base de datos:</span>
              <span className="font-medium">LocalStorage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cifrado:</span>
              <span className="font-medium">SHA-256</span>
            </div>
            <Separator className="my-4" />
            <p className="text-xs text-gray-500">
              ControlMiles es una aplicación offline-first diseñada para conductores gig.
              Todos los datos se cifran criptográficamente y son audit-ready para el IRS.
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full" size="lg" onClick={handleSave}>
          <Save className="mr-2 h-5 w-5" />
          Guardar Configuración
        </Button>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
            <CardDescription>Acciones irreversibles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleClearData}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar Todos los Datos
            </Button>
            <p className="text-xs text-gray-500">
              Esta acción eliminará permanentemente todos los registros, fotos y configuraciones.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}