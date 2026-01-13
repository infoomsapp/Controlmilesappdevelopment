// Permissions Service
// Handles device permissions for location, motion, and physical activity

export interface PermissionStatus {
  location: 'granted' | 'denied' | 'prompt';
  motion: 'granted' | 'denied' | 'prompt';
  camera: 'granted' | 'denied' | 'prompt';
}

/**
 * Request location permission
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    if (result.state === 'granted') {
      return true;
    }

    // Try to get location to trigger permission prompt
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { timeout: 5000 }
      );
    });
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
}

/**
 * Request motion and orientation permission (iOS 13+)
 * This is required for physical activity detection
 */
export async function requestMotionPermission(): Promise<boolean> {
  try {
    // Check if DeviceMotionEvent.requestPermission exists (iOS 13+)
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      const permissionState = await (DeviceMotionEvent as any).requestPermission();
      return permissionState === 'granted';
    }
    
    // For Android and older iOS, permission is implicit
    return true;
  } catch (error) {
    console.error('Error requesting motion permission:', error);
    return false;
  }
}

/**
 * Request orientation permission (iOS 13+)
 */
export async function requestOrientationPermission(): Promise<boolean> {
  try {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      const permissionState = await (DeviceOrientationEvent as any).requestPermission();
      return permissionState === 'granted';
    }
    return true;
  } catch (error) {
    console.error('Error requesting orientation permission:', error);
    return false;
  }
}

/**
 * Request camera permission
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    // Stop the stream immediately - we just wanted to check permission
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
}

/**
 * Request all permissions needed for physical activity tracking
 */
export async function requestPhysicalActivityPermissions(): Promise<{
  location: boolean;
  motion: boolean;
  orientation: boolean;
}> {
  const [location, motion, orientation] = await Promise.all([
    requestLocationPermission(),
    requestMotionPermission(),
    requestOrientationPermission(),
  ]);

  return { location, motion, orientation };
}

/**
 * Check current permission status
 */
export async function checkPermissionStatus(): Promise<PermissionStatus> {
  const status: PermissionStatus = {
    location: 'prompt',
    motion: 'prompt',
    camera: 'prompt',
  };

  try {
    // Check location
    const locationPermission = await navigator.permissions.query({ name: 'geolocation' });
    status.location = locationPermission.state as 'granted' | 'denied' | 'prompt';
  } catch {
    // Fallback - assume prompt
  }

  try {
    // Check camera
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.some(device => device.kind === 'videoinput');
    if (hasCamera && devices[0].label) {
      status.camera = 'granted';
    }
  } catch {
    // Fallback
  }

  // Motion permission doesn't have a query API
  // We'll check by trying to add an event listener
  try {
    if ('DeviceMotionEvent' in window) {
      status.motion = 'granted'; // Assume granted if API exists
    }
  } catch {
    status.motion = 'denied';
  }

  return status;
}

/**
 * Get permission status as a readable string
 */
export function getPermissionStatusText(status: PermissionStatus): string {
  const granted = [];
  const denied = [];
  const pending = [];

  if (status.location === 'granted') granted.push('Ubicación');
  else if (status.location === 'denied') denied.push('Ubicación');
  else pending.push('Ubicación');

  if (status.motion === 'granted') granted.push('Movimiento');
  else if (status.motion === 'denied') denied.push('Movimiento');
  else pending.push('Movimiento');

  if (status.camera === 'granted') granted.push('Cámara');
  else if (status.camera === 'denied') denied.push('Cámara');
  else pending.push('Cámara');

  return `Concedidos: ${granted.length > 0 ? granted.join(', ') : 'Ninguno'} | Pendientes: ${pending.length > 0 ? pending.join(', ') : 'Ninguno'}`;
}

/**
 * Check if device supports motion detection
 */
export function supportsMotionDetection(): boolean {
  return 'DeviceMotionEvent' in window && 'DeviceOrientationEvent' in window;
}

/**
 * Save permission status to localStorage
 */
export function savePermissionStatus(status: PermissionStatus): void {
  localStorage.setItem('controlmiles_permissions', JSON.stringify(status));
}

/**
 * Load permission status from localStorage
 */
export function loadPermissionStatus(): PermissionStatus | null {
  try {
    const stored = localStorage.getItem('controlmiles_permissions');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
