// Dashboard - Main screen showing daily status

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Play, Square, Camera, FileText, DollarSign, AlertCircle, CheckCircle, Edit3 } from 'lucide-react';
import { DailyLedger, IRSLogEntry } from '@/app/types';
import { getLedgerByDate, getLogsByLedgerId, saveLedger } from '@/app/services/storage';
import { generateRecordHash } from '@/app/services/crypto';
import { useTracking } from '@/app/hooks/useTracking';
import { CameraCapture } from '@/app/components/CameraCapture';
import { PermissionsDialog } from '@/app/components/PermissionsDialog';
import { MileageCorrection } from '@/app/components/MileageCorrection';
import { 
  isGigAppActive, 
  getActiveGigApp, 
  declareGigApp, 
  getGigAppsList,
  getGigAppInfo,
  recordGigSession,
  type GigApp 
} from '@/app/services/gigApps';
import { checkPermissionStatus, loadPermissionStatus } from '@/app/services/permissions';
import { t } from '@/app/services/i18n';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface DashboardProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const today = new Date().toISOString().split('T')[0];
  const [todayLedger, setTodayLedger] = useState<DailyLedger | null>(null);
  const [todayLogs, setTodayLogs] = useState<IRSLogEntry[]>([]);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [showMileageCorrection, setShowMileageCorrection] = useState(false);
  const [selectedGigApp, setSelectedGigApp] = useState<GigApp | null>(getActiveGigApp());
  const [hasStartPhoto, setHasStartPhoto] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);

  const { trackingState, startTracking, stopTracking } = useTracking(todayLedger?.id || '');

  useEffect(() => {
    loadTodayData();
    checkInitialPermissions();
  }, []);

  async function checkInitialPermissions() {
    const status = await checkPermissionStatus();
    const granted = status.location === 'granted' && status.motion === 'granted';
    setHasPermissions(granted);
  }

  async function loadTodayData() {
    let ledger = getLedgerByDate(today);
    
    if (!ledger) {
      // Create new ledger for today
      const hash = await generateRecordHash({
        date: today,
        odometerStart: 0,
        odometerEnd: 0,
        income: 0,
        timestamp: Date.now(),
      });

      ledger = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: today,
        odometerStart: 0,
        odometerEnd: 0,
        originalMiles: 0,
        income: 0,
        corrections: [],
        recordHash: hash,
        timestamp: Date.now(),
        device: navigator.userAgent,
      };
      
      saveLedger(ledger);
    }

    setTodayLedger(ledger);
    setHasStartPhoto(!!ledger.startPhotoPath);
    const logs = getLogsByLedgerId(ledger.id);
    setTodayLogs(logs);
  }

  async function handleCameraCapture(photoDataUrl: string, odometerReading: number) {
    if (!todayLedger) return;

    const hash = await generateRecordHash({
      date: todayLedger.date,
      odometerStart: odometerReading,
      odometerEnd: todayLedger.odometerEnd,
      income: todayLedger.income,
      timestamp: Date.now(),
    });

    const updated: DailyLedger = {
      ...todayLedger,
      odometerStart: odometerReading,
      startPhotoPath: photoDataUrl,
      recordHash: hash,
      timestamp: Date.now(),
    };

    saveLedger(updated);
    setTodayLedger(updated);
    setHasStartPhoto(true);
    setShowCameraCapture(false);
    
    toast.success('✅ Initial odometer photo captured');
  }

  function handleGigAppSelect(app: string) {
    const gigApp = app as GigApp;
    setSelectedGigApp(gigApp);
    declareGigApp(gigApp);
  }

  const handleStartTracking = () => {
    if (!todayLedger) return;
    
    // Check mandatory requirements
    if (!hasStartPhoto) {
      toast.error('⚠️ You must capture the initial odometer photo first');
      return;
    }

    if (!selectedGigApp) {
      toast.error('⚠️ You must select the active gig app first');
      return;
    }

    // Check permissions before starting
    if (!hasPermissions) {
      setShowPermissionsDialog(true);
      return;
    }

    // Start tracking
    recordGigSession(selectedGigApp, Date.now());
    startTracking();
    toast.success(`🚗 Tracking started with ${selectedGigApp}`);
  };

  const handleStopTracking = () => {
    stopTracking();
    loadTodayData(); // Reload to show updated miles
  };

  // Calculate total miles including corrections
  const originalMiles = todayLedger?.originalMiles || 0;
  const totalCorrections = todayLedger?.corrections.reduce((sum, c) => sum + c.adjustment, 0) || 0;
  const totalMilesToday = (trackingState.currentMiles || originalMiles) + totalCorrections;
  const canStartTracking = hasStartPhoto && selectedGigApp !== null && !trackingState.isTracking;

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">ControlMiles</h1>
              <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-3">
              {trackingState.isTracking && (
                <Badge variant="default" className="bg-green-500">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  {t('tracking')}
                </Badge>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center justify-between">
                  <span>Miles Today</span>
                  {totalCorrections !== 0 && (
                    <Badge variant="outline" className="text-xs">
                      {totalCorrections > 0 ? '+' : ''}{totalCorrections.toFixed(2)} corr.
                    </Badge>
                  )}</CardDescription>
                <CardTitle className="text-3xl">{totalMilesToday.toFixed(2)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{todayLogs.length} GPS points</p>
                {totalCorrections !== 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Original: {originalMiles.toFixed(2)} miles
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Income Today</CardDescription>
                <CardTitle className="text-3xl">${todayLedger?.income.toFixed(2) || '0.00'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {totalMilesToday > 0 ? `$${(todayLedger?.income || 0) / totalMilesToday} per mile` : 'No data'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Estimated Deduction</CardDescription>
                <CardTitle className="text-3xl">${(totalMilesToday * 0.67).toFixed(2)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">IRS $0.67/mile</p>
              </CardContent>
            </Card>
          </div>

          {/* Tracking Status */}
          {trackingState.isTracking && trackingState.currentLocation && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Tracking Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-mono">
                    {trackingState.currentLocation.lat.toFixed(6)}, {trackingState.currentLocation.lng.toFixed(6)}
                  </span>
                </div>
                {trackingState.gigApp && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Detected App:</span>
                    <Badge>{trackingState.gigApp}</Badge>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time:</span>
                  <span className="text-sm">{Math.floor((Date.now() - (trackingState.startTime || 0)) / 60000)} min</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requirements to Start Tracking */}
          {!trackingState.isTracking && (
            <Card className={!hasStartPhoto || !selectedGigApp ? 'border-yellow-300 bg-yellow-50' : 'border-green-300 bg-green-50'}>
              <CardHeader>
                <CardTitle className="text-lg">Requirements to Start Tracking</CardTitle>
                <CardDescription>Complete these steps before starting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  {hasStartPhoto ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">1. Initial Odometer Photo</p>
                    <p className="text-sm text-gray-600">
                      {hasStartPhoto 
                        ? `✓ Photo captured - Odometer: ${todayLedger?.odometerStart || 0}` 
                        : 'Capture odometer photo at the start of your shift'}
                    </p>
                  </div>
                  {!hasStartPhoto && (
                    <Button size="sm" onClick={() => setShowCameraCapture(true)}>
                      <Camera className="h-4 w-4 mr-1" />
                      Capture
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {selectedGigApp ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">2. Active Gig App</p>
                    <p className="text-sm text-gray-600">
                      {selectedGigApp 
                        ? `✓ ${selectedGigApp} selected` 
                        : 'Select the gig app you\'re using'}
                    </p>
                  </div>
                </div>

                {canStartTracking && (
                  <div className="pt-2 border-t border-green-200">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ All set to start GPS tracking
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Gig App Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Select Active Gig App
                {selectedGigApp && (
                  <Badge className={getGigAppInfo(selectedGigApp).color}>
                    {getGigAppInfo(selectedGigApp).emoji} {selectedGigApp}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleGigAppSelect} value={selectedGigApp || ''}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a gig app" />
                </SelectTrigger>
                <SelectContent>
                  {getGigAppsList().map(app => {
                    const info = getGigAppInfo(app);
                    return (
                      <SelectItem key={app} value={app}>
                        {info.emoji} {app}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {!trackingState.isTracking ? (
              <Button onClick={handleStartTracking} size="lg" className="w-full col-span-2" disabled={!canStartTracking}>
                <Play className="mr-2 h-5 w-5" />
                Start Tracking
              </Button>
            ) : (
              <Button onClick={handleStopTracking} size="lg" variant="destructive" className="w-full col-span-2">
                <Square className="mr-2 h-5 w-5" />
                Stop Tracking
              </Button>
            )}

            <Button 
              onClick={() => todayLedger && setShowMileageCorrection(true)} 
              size="lg" 
              variant="outline" 
              className="w-full"
              disabled={!todayLedger || totalMilesToday === 0}
            >
              <Edit3 className="mr-2 h-5 w-5" />
              Apply Correction
            </Button>

            <Button onClick={() => onNavigate('earnings')} size="lg" variant="outline" className="w-full">
              <DollarSign className="mr-2 h-5 w-5" />
              Earnings
            </Button>

            <Button onClick={() => onNavigate('ledger')} size="lg" variant="outline" className="w-full col-span-2">
              <FileText className="mr-2 h-5 w-5" />
              View History
            </Button>
          </div>

          {/* Camera Capture */}
          {showCameraCapture && (
            <CameraCapture 
              onCapture={handleCameraCapture} 
              onCancel={() => setShowCameraCapture(false)} 
            />
          )}

          {/* Permissions Dialog */}
          {showPermissionsDialog && (
            <PermissionsDialog 
              onComplete={(granted) => {
                setHasPermissions(granted);
                setShowPermissionsDialog(false);
                if (granted) {
                  toast.success('✅ Permissions granted successfully');
                }
              }}
              onCancel={() => setShowPermissionsDialog(false)}
            />
          )}

          {/* Mileage Correction */}
          {showMileageCorrection && todayLedger && (
            <MileageCorrection
              ledger={todayLedger}
              onClose={() => setShowMileageCorrection(false)}
              onUpdate={loadTodayData}
            />
          )}
        </div>
      </div>
    </>
  );
}