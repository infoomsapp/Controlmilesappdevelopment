// Settings - App configuration and preferences

import { useState } from 'react';
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
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
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
    toast.success('Settings saved successfully');
  }

  function handleClearData() {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      localStorage.clear();
      toast.success('All data has been deleted');
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
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-600">System preferences and configuration</p>
          </div>
        </div>

        {/* Tracking Settings */}
        <Card>
          <CardHeader>
            <CardTitle>GPS Tracking</CardTitle>
            <CardDescription>Location tracking configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-start tracking</Label>
                <div className="text-sm text-gray-500">
                  Automatically start tracking when opening the app
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
                <Label>Detect gig apps</Label>
                <div className="text-sm text-gray-500">
                  Automatically identify apps like Uber, Lyft, etc.
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
            <CardTitle>Tax Settings</CardTitle>
            <CardDescription>Deduction calculation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show tax estimation</Label>
                <div className="text-sm text-gray-500">
                  Calculate estimated IRS deduction
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
              <Label htmlFor="mileage-rate">IRS Standard Mileage Rate</Label>
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
                <span className="flex items-center text-gray-500">/ mile</span>
              </div>
              <p className="text-xs text-gray-500">
                IRS standard rate for 2024: $0.67/mile
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
            <CardDescription>Stored information management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Local backup</Label>
                <div className="text-sm text-gray-500">
                  Keep backup copy in browser
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
              <Label>Local storage</Label>
              <p className="text-sm text-gray-500">
                All data is stored locally on your device in encrypted form.
                No information is sent to external servers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>Application language preference</CardDescription>
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
            <CardTitle>About ControlMiles</CardTitle>
            <CardDescription>Application information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span className="font-medium">LocalStorage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Encryption:</span>
              <span className="font-medium">SHA-256</span>
            </div>
            <Separator className="my-4" />
            <p className="text-xs text-gray-500">
              ControlMiles is an offline-first application designed for gig drivers.
              All data is cryptographically encrypted and audit-ready for the IRS.
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full" size="lg" onClick={handleSave}>
          <Save className="mr-2 h-5 w-5" />
          Save Settings
        </Button>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleClearData}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Data
            </Button>
            <p className="text-xs text-gray-500">
              This action will permanently delete all records, photos, and settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
