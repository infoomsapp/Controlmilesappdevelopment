// Custom hook for managing GPS tracking state

import { useState, useEffect, useCallback, useRef } from 'react';
import { TrackingState, IRSLogEntry } from '@/app/types';
import { startTracking, stopTracking, calculateDistance, detectGigApp, LocationPoint } from '@/app/services/tracking';
import { saveLog } from '@/app/services/storage';
import { generateLogHash } from '@/app/services/crypto';

export function useTracking(dailyLedgerId: string) {
  const [trackingState, setTrackingState] = useState<TrackingState>({
    isTracking: false,
    currentMiles: 0,
  });

  const lastLocationRef = useRef<LocationPoint | null>(null);
  const totalMilesRef = useRef(0);

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
          gigApp: detectGigApp(),
          hash,
        };

        saveLog(logEntry);

        setTrackingState((prev) => ({
          ...prev,
          currentMiles: totalMilesRef.current,
          currentLocation: { lat: location.latitude, lng: location.longitude },
          gigApp: logEntry.gigApp,
        }));
      }

      lastLocationRef.current = location;
    },
    [dailyLedgerId]
  );

  const handleError = useCallback((error: string) => {
    console.error('Tracking error:', error);
  }, []);

  const startTrackingSession = useCallback(() => {
    setTrackingState((prev) => ({
      ...prev,
      isTracking: true,
      startTime: Date.now(),
    }));

    startTracking({
      onLocationUpdate: handleLocationUpdate,
      onError: handleError,
    });
  }, [handleLocationUpdate, handleError]);

  const stopTrackingSession = useCallback(() => {
    stopTracking();
    setTrackingState((prev) => ({
      ...prev,
      isTracking: false,
    }));
  }, []);

  useEffect(() => {
    return () => {
      if (trackingState.isTracking) {
        stopTracking();
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
  };
}
