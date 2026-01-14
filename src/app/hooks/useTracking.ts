// Custom hook for managing GPS tracking state

import { useState, useEffect, useCallback, useRef } from 'react';
import { TrackingState, IRSLogEntry } from '@/app/types';
import { startTracking, stopTracking, calculateDistance, detectGigApp, LocationPoint } from '@/app/services/tracking';
import { saveLog } from '@/app/services/storage';
import { generateLogHash } from '@/app/services/crypto';
import { foregroundService, LocationUpdate } from '@/app/services/foregroundService';

export function useTracking(dailyLedgerId: string, gigApp?: string) {
  const [trackingState, setTrackingState] = useState<TrackingState>({
    isTracking: false,
    currentMiles: 0,
  });

  const lastLocationRef = useRef<LocationPoint | null>(null);
  const totalMilesRef = useRef(0);
  const usingForegroundService = useRef(false);

  const handleLocationUpdate = useCallback(
    async (location: LocationPoint) => {
      if (lastLocationRef.current) {
        const distance = calculateDistance(
          lastLocationRef.current.latitude,
          lastLocationRef.current.longitude,
          location.latitude,
          location.longitude
        );

        totalMilesRef.current += distance;

        // Save log entry
        const hash = await generateLogHash({
          timestamp: location.timestamp,
          latitude: location.latitude,
          longitude: location.longitude,
          milesAccumulated: totalMilesRef.current,
        });

        const logEntry: IRSLogEntry = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          dailyLedgerId,
          timestamp: location.timestamp,
          latitude: location.latitude,
          longitude: location.longitude,
          milesAccumulated: totalMilesRef.current,
          gigApp: gigApp || detectGigApp(),
          hash,
        };

        saveLog(logEntry);

        setTrackingState((prev) => ({
          ...prev,
          currentMiles: totalMilesRef.current,
          currentLocation: { lat: location.latitude, lng: location.longitude },
          gigApp: logEntry.gigApp,
        }));

        // Update notification stats if using foreground service
        if (usingForegroundService.current) {
          foregroundService.updateStats(totalMilesRef.current);
        }
      }

      lastLocationRef.current = location;
    },
    [dailyLedgerId, gigApp]
  );

  const handleError = useCallback((error: string) => {
    console.error('Tracking error:', error);
  }, []);

  // Handle native foreground service location updates
  const handleNativeLocationUpdate = useCallback(
    async (data: LocationUpdate) => {
      const location: LocationPoint = {
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: data.timestamp,
        accuracy: data.accuracy,
        speed: data.speed,
      };

      await handleLocationUpdate(location);
    },
    [handleLocationUpdate]
  );

  const startTrackingSession = useCallback(async () => {
    setTrackingState((prev) => ({
      ...prev,
      isTracking: true,
      startTime: Date.now(),
    }));

    // Try to use foreground service if available (Android only)
    const appName = gigApp || detectGigApp() || 'Unknown';
    const serviceStarted = await foregroundService.startTracking(appName);

    if (serviceStarted) {
      console.log('✅ Using native foreground service for tracking');
      usingForegroundService.current = true;
      
      // Listen for native location updates
      foregroundService.addLocationListener(handleNativeLocationUpdate);
    } else {
      console.log('📱 Using web-based tracking (fallback)');
      usingForegroundService.current = false;
      
      // Fallback to web-based tracking
      startTracking({
        onLocationUpdate: handleLocationUpdate,
        onError: handleError,
      });
    }
  }, [handleLocationUpdate, handleError, handleNativeLocationUpdate, gigApp]);

  const stopTrackingSession = useCallback(async () => {
    if (usingForegroundService.current) {
      await foregroundService.stopTracking();
      foregroundService.removeAllListeners();
      console.log('✅ Foreground service stopped');
    } else {
      stopTracking();
    }
    
    setTrackingState((prev) => ({
      ...prev,
      isTracking: false,
    }));
    
    usingForegroundService.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackingState.isTracking) {
        if (usingForegroundService.current) {
          foregroundService.stopTracking();
          foregroundService.removeAllListeners();
        } else {
          stopTracking();
        }
      }
    };
  }, [trackingState.isTracking]);

  return {
    trackingState,
    startTracking: startTrackingSession,
    stopTracking: stopTrackingSession,
    resetMiles: () => {
      totalMilesRef.current = 0;
      setTrackingState((prev) => ({ ...prev, currentMiles: 0 }));
    },
    isUsingForegroundService: () => usingForegroundService.current,
  };
}
