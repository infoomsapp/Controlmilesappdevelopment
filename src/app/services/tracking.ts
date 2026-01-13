// GPS Tracking service (simulated for web)

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number;
}

export interface TrackingCallback {
  onLocationUpdate: (location: LocationPoint) => void;
  onError: (error: string) => void;
}

let watchId: number | null = null;

export function startTracking(callback: TrackingCallback): void {
  if (!navigator.geolocation) {
    callback.onError('Geolocation no está disponible en este navegador');
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      callback.onLocationUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: Date.now(),
        accuracy: position.coords.accuracy,
      });
    },
    (error) => {
      callback.onError(error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

export function stopTracking(): void {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Haversine formula to calculate distance in miles
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Simulated gig app detection (would use actual app detection on Android)
export function detectGigApp(): string | undefined {
  const gigApps = ['Uber', 'Lyft', 'DoorDash', 'Uber Eats', 'Instacart'];
  // Random detection for demo purposes
  if (Math.random() > 0.7) {
    return gigApps[Math.floor(Math.random() * gigApps.length)];
  }
  return undefined;
}
