// Auto-Detection Settings Component

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import { Zap, Bluetooth, Info, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import * as autoDetection from '@/app/services/autoDetection';
import * as bluetooth from '@/app/services/bluetoothDetection';

export function AutoDetectionSettings() {
  const [autoSettings, setAutoSettings] = useState(autoDetection.getAutoDetectionSettings());
  const [bluetoothSettings, setBluetoothSettings] = useState(bluetooth.getBluetoothSettings());
  const [motionSupported, setMotionSupported] = useState(false);
  const [bluetoothAvailability, setBluetoothAvailability] = useState(bluetooth.getBluetoothAvailability());

  useEffect(() => {
    setMotionSupported(autoDetection.isMotionSupported());
    setBluetoothAvailability(bluetooth.getBluetoothAvailability());
  }, []);

  async function handleEnableAutoDetection(enabled: boolean) {
    if (enabled && motionSupported) {
      const granted = await autoDetection.requestMotionPermission();
      if (!granted) {
        toast.error('Motion permission denied');
        return;
      }
    }

    const updated = { ...autoSettings, enabled };
    setAutoSettings(updated);
    autoDetection.saveAutoDetectionSettings(updated);
    toast.success(enabled ? 'Auto-detection enabled' : 'Auto-detection disabled');
  }

  async function handleEnableBluetooth(enabled: boolean) {
    if (enabled) {
      if (!bluetoothAvailability.available) {
        toast.error(bluetoothAvailability.reason || 'Bluetooth not available', {
          description: 'Bluetooth will work properly in the Android app',
          duration: 5000,
        });
        return;
      }
      
      const result = await bluetooth.requestBluetoothPermission();
      if (!result.granted) {
        toast.error(result.error || 'Bluetooth permission denied', {
          description: 'Full Bluetooth support is available in the Android app',
          duration: 5000,
        });
        return;
      }
    }

    const updated = { ...bluetoothSettings, enabled };
    setBluetoothSettings(updated);
    bluetooth.saveBluetoothSettings(updated);
    toast.success(enabled ? 'Bluetooth detection enabled' : 'Bluetooth detection disabled');
  }

  function handleSensitivityChange(sensitivity: 'low' | 'medium' | 'high') {
    const updated = { ...autoSettings, sensitivity };
    setAutoSettings(updated);
    autoDetection.saveAutoDetectionSettings(updated);
    toast.success('Sensitivity updated');
  }

  function handleStopTimeChange(minutes: number) {
    const updated = { ...autoSettings, stopTimeThreshold: minutes * 60 };
    setAutoSettings(updated);
    autoDetection.saveAutoDetectionSettings(updated);
    toast.success('Stop time threshold updated');
  }

  function handleAutomaticModeChange(automaticMode: boolean) {
    const updated = { ...autoSettings, automaticMode };
    setAutoSettings(updated);
    autoDetection.saveAutoDetectionSettings(updated);
    toast.success(automaticMode ? 'Automatic mode enabled' : 'Automatic mode disabled');
  }

  function handleBluetoothAutoStart(autoStartOnConnect: boolean) {
    const updated = { ...bluetoothSettings, autoStartOnConnect };
    setBluetoothSettings(updated);
    bluetooth.saveBluetoothSettings(updated);
    toast.success('Setting updated');
  }

  function handleBluetoothAutoStop(autoStopOnDisconnect: boolean) {
    const updated = { ...bluetoothSettings, autoStopOnDisconnect };
    setBluetoothSettings(updated);
    bluetooth.saveBluetoothSettings(updated);
    toast.success('Setting updated');
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Automatic Detection</h2>
        <p className="text-gray-600">Configure automatic trip start/stop detection</p>
      </div>

      {/* Auto-Detection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Motion & GPS Detection
          </CardTitle>
          <CardDescription>
            Automatically detect when you start and stop driving
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-detection">Enable Auto-Detection</Label>
              <p className="text-sm text-gray-600">
                {motionSupported 
                  ? 'Uses motion sensors and GPS to detect trips'
                  : 'Motion sensors not available on this device'}
              </p>
            </div>
            <Switch
              id="auto-detection"
              checked={autoSettings.enabled}
              onCheckedChange={handleEnableAutoDetection}
              disabled={!motionSupported}
            />
          </div>

          {autoSettings.enabled && (
            <>
              {/* Sensitivity */}
              <div className="space-y-2">
                <Label htmlFor="sensitivity">Detection Sensitivity</Label>
                <Select 
                  value={autoSettings.sensitivity}
                  onValueChange={handleSensitivityChange}
                >
                  <SelectTrigger id="sensitivity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      Low - Requires clear driving (15+ mph)
                    </SelectItem>
                    <SelectItem value="medium">
                      Medium - Standard detection (10+ mph)
                    </SelectItem>
                    <SelectItem value="high">
                      High - Very sensitive (5+ mph)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">
                  Higher sensitivity may detect more trips but could have false positives
                </p>
              </div>

              {/* Stop Time Threshold */}
              <div className="space-y-2">
                <Label htmlFor="stop-time">Stop Time Before Trip End</Label>
                <Select 
                  value={(autoSettings.stopTimeThreshold / 60).toString()}
                  onValueChange={(value) => handleStopTimeChange(parseInt(value))}
                >
                  <SelectTrigger id="stop-time">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="3">3 minutes</SelectItem>
                    <SelectItem value="5">5 minutes (recommended)</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">
                  How long to wait after stopping before ending the trip
                </p>
              </div>

              {/* Automatic Mode */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="automatic-mode">Automatic Mode</Label>
                  <p className="text-sm text-gray-600">
                    Start tracking without selecting a gig app
                  </p>
                </div>
                <Switch
                  id="automatic-mode"
                  checked={autoSettings.automaticMode}
                  onCheckedChange={handleAutomaticModeChange}
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">How it works</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>GPS monitors your speed and movement</li>
                    <li>Motion sensors detect when you start driving</li>
                    <li>Trip automatically ends after you stop for the set time</li>
                    <li>Minimum accuracy required for reliable detection</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Bluetooth Detection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bluetooth className="h-5 w-5" />
            Bluetooth Detection
          </CardTitle>
          <CardDescription>
            Start/stop tracking based on car Bluetooth connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="bluetooth-detection">Enable Bluetooth Detection</Label>
              <p className="text-sm text-gray-600">
                {bluetoothAvailability.available 
                  ? 'Pair with your car Bluetooth to auto-track'
                  : 'Bluetooth not available on this device'}
              </p>
            </div>
            <Switch
              id="bluetooth-detection"
              checked={bluetoothSettings.enabled}
              onCheckedChange={handleEnableBluetooth}
              disabled={!bluetoothAvailability.available}
            />
          </div>

          {bluetoothSettings.enabled && (
            <>
              {/* Auto-Start on Connect */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="bluetooth-auto-start">Auto-Start on Connect</Label>
                  <p className="text-sm text-gray-600">
                    Start tracking when connected to paired device
                  </p>
                </div>
                <Switch
                  id="bluetooth-auto-start"
                  checked={bluetoothSettings.autoStartOnConnect}
                  onCheckedChange={handleBluetoothAutoStart}
                />
              </div>

              {/* Auto-Stop on Disconnect */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="bluetooth-auto-stop">Auto-Stop on Disconnect</Label>
                  <p className="text-sm text-gray-600">
                    Stop tracking when disconnected from paired device
                  </p>
                </div>
                <Switch
                  id="bluetooth-auto-stop"
                  checked={bluetoothSettings.autoStopOnDisconnect}
                  onCheckedChange={handleBluetoothAutoStop}
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">How to set up</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Go to "My Vehicles" to pair Bluetooth devices</li>
                    <li>Each vehicle can have one paired device</li>
                    <li>Tracking starts when you connect to car Bluetooth</li>
                    <li>Works best combined with motion detection</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Feature Compatibility */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Feature Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Motion Sensors</span>
              <div className="flex items-center gap-2">
                {motionSupported ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Available</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Not Available</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Bluetooth</span>
              <div className="flex items-center gap-2">
                {bluetoothAvailability.available ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Available</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Not Available</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">GPS Tracking</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Available</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}