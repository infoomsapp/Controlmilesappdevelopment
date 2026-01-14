// Automatic Trip Detection Service
// Uses Motion Sensors + GPS to automatically detect trip start/end

import { getActiveVehicle } from './vehicleService';

export interface AutoDetectionSettings {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  stopTimeThreshold: number; // seconds before considering trip ended
  minimumTripDistance: number; // miles
  automaticMode: boolean; // Start without gig app selection
}

export interface MotionState {
  isMoving: boolean;
  speed: number; // mph
  confidence: number; // 0-1
  lastUpdate: string;
}

const STORAGE_KEY_SETTINGS = 'controlmiles_auto_detection_settings';
const STORAGE_KEY_STATE = 'controlmiles_motion_state';

// Default settings
const DEFAULT_SETTINGS: AutoDetectionSettings = {
  enabled: false,
  sensitivity: 'medium',
  stopTimeThreshold: 300, // 5 minutes
  minimumTripDistance: 0.1, // 0.1 miles
  automaticMode: false,
};

// Sensitivity thresholds
const SENSITIVITY_THRESHOLDS = {
  low: {
    minSpeed: 15, // mph - minimum speed to consider moving
    stopSpeed: 5, // mph - speed below which vehicle is stopped
    accelerationThreshold: 0.5, // m/s²
  },
  medium: {
    minSpeed: 10,
    stopSpeed: 3,
    accelerationThreshold: 0.3,
  },
  high: {
    minSpeed: 5,
    stopSpeed: 1,
    accelerationThreshold: 0.1,
  },
};

export function getAutoDetectionSettings(): AutoDetectionSettings {
  const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (!data) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
}

export function saveAutoDetectionSettings(settings: Partial<AutoDetectionSettings>): void {
  const current = getAutoDetectionSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
}

export function getMotionState(): MotionState | null {
  const data = localStorage.getItem(STORAGE_KEY_STATE);
  if (!data) return null;
  return JSON.parse(data);
}

function saveMotionState(state: MotionState): void {
  localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
}

// Calculate speed from GPS coordinates
export function calculateSpeed(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  timeElapsed: number // milliseconds
): number {
  // Haversine formula for distance
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // miles
  
  // Speed = distance / time (convert ms to hours)
  const hours = timeElapsed / (1000 * 60 * 60);
  return distance / hours; // mph
}

// Detect if vehicle is moving based on motion sensors
export function detectMotion(acceleration: { x: number; y: number; z: number }): boolean {
  const settings = getAutoDetectionSettings();
  const threshold = SENSITIVITY_THRESHOLDS[settings.sensitivity];
  
  // Calculate total acceleration magnitude
  const magnitude = Math.sqrt(
    acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
  );
  
  // Remove gravity (approximately 9.8 m/s²)
  const netAcceleration = Math.abs(magnitude - 9.8);
  
  return netAcceleration > threshold.accelerationThreshold;
}

// Analyze GPS speed to determine if vehicle is moving
export function analyzeSpeed(currentSpeed: number): {
  isMoving: boolean;
  isStopped: boolean;
  isInTraffic: boolean;
} {
  const settings = getAutoDetectionSettings();
  const threshold = SENSITIVITY_THRESHOLDS[settings.sensitivity];
  
  return {
    isMoving: currentSpeed >= threshold.minSpeed,
    isStopped: currentSpeed < threshold.stopSpeed,
    isInTraffic: currentSpeed >= threshold.stopSpeed && currentSpeed < threshold.minSpeed,
  };
}

// Main auto-detection logic
export class TripAutoDetector {
  private lastPosition: { lat: number; lon: number; timestamp: number } | null = null;
  private stopStartTime: number | null = null;
  private tripStartCallback: (() => void) | null = null;
  private tripEndCallback: (() => void) | null = null;
  private isTracking: boolean = false;

  constructor(
    onTripStart?: () => void,
    onTripEnd?: () => void
  ) {
    this.tripStartCallback = onTripStart || null;
    this.tripEndCallback = onTripEnd || null;
  }

  // Process new GPS position
  processPosition(position: GeolocationPosition): void {
    const settings = getAutoDetectionSettings();
    if (!settings.enabled) return;

    const activeVehicle = getActiveVehicle();
    if (!activeVehicle && !settings.automaticMode) return;

    const currentPos = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      timestamp: position.timestamp,
    };

    let currentSpeed = position.coords.speed 
      ? position.coords.speed * 2.23694 // Convert m/s to mph
      : 0;

    // If GPS doesn't provide speed, calculate it
    if (currentSpeed === 0 && this.lastPosition) {
      const timeElapsed = currentPos.timestamp - this.lastPosition.timestamp;
      currentSpeed = calculateSpeed(
        this.lastPosition.lat,
        this.lastPosition.lon,
        currentPos.lat,
        currentPos.lon,
        timeElapsed
      );
    }

    const speedAnalysis = analyzeSpeed(currentSpeed);

    // Update motion state
    const motionState: MotionState = {
      isMoving: speedAnalysis.isMoving,
      speed: currentSpeed,
      confidence: position.coords.accuracy ? Math.min(1, 100 / position.coords.accuracy) : 0.5,
      lastUpdate: new Date().toISOString(),
    };
    saveMotionState(motionState);

    // Trip start detection
    if (!this.isTracking && speedAnalysis.isMoving) {
      console.log('🚗 Trip start detected - Speed:', currentSpeed, 'mph');
      this.handleTripStart();
    }

    // Trip end detection (stopped for threshold time)
    if (this.isTracking && speedAnalysis.isStopped) {
      if (!this.stopStartTime) {
        this.stopStartTime = Date.now();
        console.log('⏸️ Vehicle stopped - Starting countdown');
      } else {
        const stopDuration = (Date.now() - this.stopStartTime) / 1000;
        if (stopDuration >= settings.stopTimeThreshold) {
          console.log('🛑 Trip end detected - Stopped for:', stopDuration, 'seconds');
          this.handleTripEnd();
        }
      }
    }

    // Reset stop timer if vehicle starts moving again
    if (speedAnalysis.isMoving && this.stopStartTime) {
      console.log('▶️ Vehicle moving again - Resetting stop timer');
      this.stopStartTime = null;
    }

    this.lastPosition = currentPos;
  }

  // Process motion sensor data
  processMotion(acceleration: { x: number; y: number; z: number }): void {
    const settings = getAutoDetectionSettings();
    if (!settings.enabled) return;

    const isMoving = detectMotion(acceleration);
    
    if (isMoving && !this.isTracking) {
      console.log('📱 Motion detected - Possible trip start');
      // Motion alone isn't enough, wait for GPS confirmation
    }
  }

  private handleTripStart(): void {
    this.isTracking = true;
    this.stopStartTime = null;
    
    if (this.tripStartCallback) {
      this.tripStartCallback();
    }
  }

  private handleTripEnd(): void {
    this.isTracking = false;
    this.stopStartTime = null;
    this.lastPosition = null;
    
    if (this.tripEndCallback) {
      this.tripEndCallback();
    }
  }

  reset(): void {
    this.isTracking = false;
    this.stopStartTime = null;
    this.lastPosition = null;
  }

  getIsTracking(): boolean {
    return this.isTracking;
  }
}

// Initialize auto-detection
export function initAutoDetection(
  onTripStart: () => void,
  onTripEnd: () => void
): TripAutoDetector {
  return new TripAutoDetector(onTripStart, onTripEnd);
}

// Check if device supports motion detection
export function isMotionSupported(): boolean {
  return (
    'DeviceMotionEvent' in window &&
    typeof DeviceMotionEvent.requestPermission === 'function'
  ) || ('ondevicemotion' in window);
}

// Request motion permission (iOS 13+)
export async function requestMotionPermission(): Promise<boolean> {
  if (typeof DeviceMotionEvent !== 'undefined' && 
      typeof (DeviceMotionEvent as any).requestPermission === 'function') {
    try {
      const permission = await (DeviceMotionEvent as any).requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Motion permission denied:', error);
      return false;
    }
  }
  // Permission not needed or already granted
  return true;
}
