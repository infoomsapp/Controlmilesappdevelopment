// foregroundService.ts - Bridge to native Foreground Service

import { registerPlugin } from '@capacitor/core';

interface TrackingServicePlugin {
  startTracking(options: { gigApp: string }): Promise<{ success: boolean; message: string }>;
  stopTracking(): Promise<{ success: boolean; message: string }>;
  updateStats(options: { miles: number }): Promise<{ success: boolean }>;
  isTracking(): Promise<{ isTracking: boolean }>;
  addListener(
    eventName: 'locationUpdate',
    listenerFunc: (data: LocationUpdate) => void
  ): Promise<any>;
  removeAllListeners(): Promise<void>;
}

interface LocationUpdate {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  timestamp: number;
  miles: number;
  totalMiles: number;
}

// Register the plugin (works with Capacitor)
const TrackingService = registerPlugin<TrackingServicePlugin>('TrackingService');

/**
 * Foreground Service Manager
 * 
 * Manages the native Android Foreground Service for GPS tracking.
 * Prevents app from being killed in background and maintains tracking state.
 */
export class ForegroundServiceManager {
  private static instance: ForegroundServiceManager;
  private isNativeAvailable: boolean = false;
  private listeners: Array<(data: LocationUpdate) => void> = [];

  private constructor() {
    this.checkNativeAvailability();
  }

  static getInstance(): ForegroundServiceManager {
    if (!ForegroundServiceManager.instance) {
      ForegroundServiceManager.instance = new ForegroundServiceManager();
    }
    return ForegroundServiceManager.instance;
  }

  /**
   * Check if native plugin is available (Android only)
   */
  private checkNativeAvailability() {
    try {
      // Check if Capacitor and the plugin are available
      this.isNativeAvailable = 
        typeof (window as any).Capacitor !== 'undefined' &&
        (window as any).Capacitor.getPlatform() === 'android';
    } catch (error) {
      console.log('Native foreground service not available (web mode)');
      this.isNativeAvailable = false;
    }
  }

  /**
   * Start foreground service with GPS tracking
   */
  async startTracking(gigApp: string): Promise<boolean> {
    if (!this.isNativeAvailable) {
      console.log('Foreground service not available - running in fallback mode');
      return false;
    }

    try {
      const result = await TrackingService.startTracking({ gigApp });
      console.log('Foreground service started:', result.message);
      return result.success;
    } catch (error) {
      console.error('Failed to start foreground service:', error);
      return false;
    }
  }

  /**
   * Stop foreground service
   */
  async stopTracking(): Promise<boolean> {
    if (!this.isNativeAvailable) {
      return false;
    }

    try {
      const result = await TrackingService.stopTracking();
      console.log('Foreground service stopped:', result.message);
      return result.success;
    } catch (error) {
      console.error('Failed to stop foreground service:', error);
      return false;
    }
  }

  /**
   * Update notification stats
   */
  async updateStats(miles: number): Promise<void> {
    if (!this.isNativeAvailable) {
      return;
    }

    try {
      await TrackingService.updateStats({ miles });
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  }

  /**
   * Check if tracking is active
   */
  async isTracking(): Promise<boolean> {
    if (!this.isNativeAvailable) {
      return false;
    }

    try {
      const result = await TrackingService.isTracking();
      return result.isTracking;
    } catch (error) {
      console.error('Failed to check tracking status:', error);
      return false;
    }
  }

  /**
   * Listen for location updates from native service
   */
  addLocationListener(callback: (data: LocationUpdate) => void): void {
    if (!this.isNativeAvailable) {
      return;
    }

    this.listeners.push(callback);

    // Register native listener if first listener
    if (this.listeners.length === 1) {
      TrackingService.addListener('locationUpdate', (data) => {
        this.listeners.forEach(listener => listener(data));
      });
    }
  }

  /**
   * Remove location listener
   */
  removeLocationListener(callback: (data: LocationUpdate) => void): void {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }

    // Remove native listener if no listeners left
    if (this.listeners.length === 0) {
      TrackingService.removeAllListeners();
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners = [];
    if (this.isNativeAvailable) {
      TrackingService.removeAllListeners();
    }
  }

  /**
   * Check if native service is available
   */
  isAvailable(): boolean {
    return this.isNativeAvailable;
  }
}

// Export singleton instance
export const foregroundService = ForegroundServiceManager.getInstance();

// Export types
export type { LocationUpdate };
