// Bluetooth Vehicle Detection Service
// Automatically start/stop tracking when connected to car Bluetooth

import { getVehicleByBluetoothDevice, pairBluetoothDevice, unpairBluetoothDevice } from './vehicleService';

export interface BluetoothDevice {
  id: string;
  name: string;
  connected: boolean;
}

export interface BluetoothSettings {
  enabled: boolean;
  autoStartOnConnect: boolean;
  autoStopOnDisconnect: boolean;
  lastConnectedDevice: string | null;
}

const STORAGE_KEY_SETTINGS = 'controlmiles_bluetooth_settings';
const STORAGE_KEY_DEVICES = 'controlmiles_bluetooth_devices';

const DEFAULT_SETTINGS: BluetoothSettings = {
  enabled: false,
  autoStartOnConnect: true,
  autoStopOnDisconnect: true,
  lastConnectedDevice: null,
};

export function getBluetoothSettings(): BluetoothSettings {
  const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (!data) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
}

export function saveBluetoothSettings(settings: Partial<BluetoothSettings>): void {
  const current = getBluetoothSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
}

export function getKnownDevices(): BluetoothDevice[] {
  const data = localStorage.getItem(STORAGE_KEY_DEVICES);
  if (!data) return [];
  return JSON.parse(data);
}

function saveKnownDevices(devices: BluetoothDevice[]): void {
  localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(devices));
}

// Check if Web Bluetooth API is supported
export function isBluetoothSupported(): boolean {
  return typeof navigator !== 'undefined' && 
         'bluetooth' in navigator &&
         typeof (navigator as any).bluetooth !== 'undefined';
}

// Check if we're in a secure context (required for Bluetooth)
export function isSecureContext(): boolean {
  return typeof window !== 'undefined' && 
         (window.isSecureContext || window.location.protocol === 'https:');
}

// Get Bluetooth availability status with detailed info
export function getBluetoothAvailability(): {
  supported: boolean;
  secureContext: boolean;
  available: boolean;
  reason?: string;
} {
  const supported = isBluetoothSupported();
  const secureContext = isSecureContext();
  
  if (!supported) {
    return {
      supported: false,
      secureContext,
      available: false,
      reason: 'Web Bluetooth API is not supported in this browser. Try using Chrome, Edge, or Opera.'
    };
  }
  
  if (!secureContext) {
    return {
      supported: true,
      secureContext: false,
      available: false,
      reason: 'Bluetooth requires HTTPS or localhost. Please use a secure connection.'
    };
  }
  
  return {
    supported: true,
    secureContext: true,
    available: true
  };
}

// Scan for Bluetooth devices - NATIVE ANDROID VERSION
export async function scanBluetoothDevicesNative(): Promise<BluetoothDevice[]> {
  // This will be implemented with Capacitor Bluetooth plugin for native Android
  // For now, return empty array and show appropriate message
  console.warn('Native Bluetooth scanning will be implemented with Capacitor plugin');
  return [];
}

// Scan for Bluetooth devices - WEB VERSION
export async function scanBluetoothDevices(): Promise<BluetoothDevice[]> {
  const availability = getBluetoothAvailability();
  
  if (!availability.available) {
    throw new Error(availability.reason || 'Bluetooth not available');
  }

  try {
    // Request any Bluetooth device
    const device = await (navigator.bluetooth as any).requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service', 'device_information'],
    });

    const bluetoothDevice: BluetoothDevice = {
      id: device.id || crypto.randomUUID(),
      name: device.name || 'Unknown Device',
      connected: device.gatt?.connected || false,
    };

    // Save to known devices
    const knownDevices = getKnownDevices();
    const exists = knownDevices.find(d => d.id === bluetoothDevice.id);
    if (!exists) {
      knownDevices.push(bluetoothDevice);
      saveKnownDevices(knownDevices);
    }

    return [bluetoothDevice];
  } catch (error: any) {
    console.error('Bluetooth scan error:', error);
    
    // Provide user-friendly error messages
    if (error.name === 'NotFoundError') {
      throw new Error('No Bluetooth device selected');
    } else if (error.name === 'SecurityError') {
      throw new Error('Bluetooth access denied. Please check browser permissions and ensure you are using HTTPS.');
    } else if (error.name === 'NotAllowedError') {
      throw new Error('Bluetooth permission denied by user');
    } else {
      throw new Error(`Bluetooth error: ${error.message}`);
    }
  }
}

// Pair device with vehicle
export async function pairDeviceWithVehicle(
  vehicleId: string,
  deviceId: string,
  deviceName: string
): Promise<boolean> {
  const success = pairBluetoothDevice(vehicleId, deviceId, deviceName);
  
  if (success) {
    // Update device list
    const devices = getKnownDevices();
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      device.connected = true;
      saveKnownDevices(devices);
    }
  }
  
  return success;
}

// Unpair device from vehicle
export function unpairDeviceFromVehicle(vehicleId: string): boolean {
  return unpairBluetoothDevice(vehicleId);
}

// SIMPLIFIED Monitor for Native Android (using Capacitor)
// This will work better in the actual Android app
export class BluetoothMonitor {
  private connectedDevices: Set<string> = new Set();
  private connectCallback: ((deviceId: string, deviceName: string) => void) | null = null;
  private disconnectCallback: ((deviceId: string) => void) | null = null;
  private monitorInterval: number | null = null;

  constructor(
    onConnect?: (deviceId: string, deviceName: string) => void,
    onDisconnect?: (deviceId: string) => void
  ) {
    this.connectCallback = onConnect || null;
    this.disconnectCallback = onDisconnect || null;
  }

  // Start monitoring
  async start(): Promise<void> {
    const settings = getBluetoothSettings();
    const availability = getBluetoothAvailability();
    
    if (!settings.enabled) {
      console.log('Bluetooth monitoring not enabled');
      return;
    }
    
    if (!availability.available) {
      console.warn('Bluetooth monitoring unavailable:', availability.reason);
      console.log('💡 Tip: Bluetooth will work properly in the Android app via Capacitor');
      return;
    }

    console.log('🔵 Starting Bluetooth monitoring...');

    // Check connection status every 10 seconds (less aggressive)
    this.monitorInterval = window.setInterval(() => {
      this.checkConnectionStatus();
    }, 10000);

    // Initial check
    await this.checkConnectionStatus();
  }

  // Stop monitoring
  stop(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    console.log('🔵 Bluetooth monitoring stopped');
  }

  // Check current connection status
  private async checkConnectionStatus(): Promise<void> {
    const settings = getBluetoothSettings();
    if (!settings.enabled) return;

    try {
      // For web version, we can only check previously paired devices
      // In native Android, this will use actual Bluetooth APIs
      
      if (typeof (navigator.bluetooth as any)?.getDevices === 'function') {
        const devices = await (navigator.bluetooth as any).getDevices();
        
        const currentlyConnected = new Set<string>();

        for (const device of devices) {
          if (device.gatt?.connected) {
            currentlyConnected.add(device.id);

            // New connection detected
            if (!this.connectedDevices.has(device.id)) {
              console.log('🔵 Bluetooth device connected:', device.name);
              this.handleConnect(device.id, device.name);
            }
          }
        }

        // Check for disconnections
        for (const deviceId of this.connectedDevices) {
          if (!currentlyConnected.has(deviceId)) {
            console.log('🔵 Bluetooth device disconnected:', deviceId);
            this.handleDisconnect(deviceId);
          }
        }

        this.connectedDevices = currentlyConnected;
      } else {
        console.log('💡 Bluetooth.getDevices() not available - will work in Android app');
      }
    } catch (error) {
      // Silently fail - this is expected in non-secure contexts
      console.debug('Bluetooth status check skipped (expected in development)');
    }
  }

  private handleConnect(deviceId: string, deviceName: string): void {
    const settings = getBluetoothSettings();
    
    // Save last connected device
    saveBluetoothSettings({ lastConnectedDevice: deviceId });

    // Check if this device is paired with a vehicle
    const vehicle = getVehicleByBluetoothDevice(deviceId);
    
    if (vehicle && settings.autoStartOnConnect) {
      console.log('🚗 Auto-starting trip for vehicle:', vehicle.name);
      if (this.connectCallback) {
        this.connectCallback(deviceId, deviceName);
      }
    }
  }

  private handleDisconnect(deviceId: string): void {
    const settings = getBluetoothSettings();
    
    // Check if this device is paired with a vehicle
    const vehicle = getVehicleByBluetoothDevice(deviceId);
    
    if (vehicle && settings.autoStopOnDisconnect) {
      console.log('🛑 Auto-stopping trip for vehicle:', vehicle.name);
      if (this.disconnectCallback) {
        this.disconnectCallback(deviceId);
      }
    }
  }

  // Get currently connected devices
  getConnectedDevices(): string[] {
    return Array.from(this.connectedDevices);
  }
}

// Initialize Bluetooth monitoring
export function initBluetoothMonitor(
  onConnect: (deviceId: string, deviceName: string) => void,
  onDisconnect: (deviceId: string) => void
): BluetoothMonitor {
  return new BluetoothMonitor(onConnect, onDisconnect);
}

// Request Bluetooth permission (gracefully handles errors)
export async function requestBluetoothPermission(): Promise<{
  granted: boolean;
  error?: string;
}> {
  const availability = getBluetoothAvailability();
  
  if (!availability.available) {
    return {
      granted: false,
      error: availability.reason
    };
  }

  try {
    // Requesting a device will also request permission
    await (navigator.bluetooth as any).requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service', 'device_information'],
    });
    return { granted: true };
  } catch (error: any) {
    console.error('Bluetooth permission error:', error);
    
    let errorMessage = 'Bluetooth permission denied';
    
    if (error.name === 'NotFoundError') {
      errorMessage = 'No device selected';
    } else if (error.name === 'SecurityError') {
      errorMessage = 'Bluetooth blocked by browser policy. This will work in the Android app.';
    } else if (error.name === 'NotAllowedError') {
      errorMessage = 'Permission denied by user';
    }
    
    return {
      granted: false,
      error: errorMessage
    };
  }
}

// Check connection to specific device
export async function isDeviceConnected(deviceId: string): Promise<boolean> {
  if (!isBluetoothSupported()) return false;

  try {
    if (typeof (navigator.bluetooth as any)?.getDevices === 'function') {
      const devices = await (navigator.bluetooth as any).getDevices();
      const device = devices.find((d: any) => d.id === deviceId);
      return device?.gatt?.connected || false;
    }
    return false;
  } catch (error) {
    console.debug('Device connection check skipped');
    return false;
  }
}

// Manual Bluetooth pairing (for user-triggered pairing)
export async function manualPairBluetoothDevice(): Promise<{
  success: boolean;
  device?: { id: string; name: string };
  error?: string;
}> {
  const availability = getBluetoothAvailability();
  
  if (!availability.available) {
    return {
      success: false,
      error: availability.reason || 'Bluetooth not available in this browser. Please use the Android app for full Bluetooth support.'
    };
  }

  try {
    const devices = await scanBluetoothDevices();
    if (devices.length > 0) {
      return {
        success: true,
        device: {
          id: devices[0].id,
          name: devices[0].name
        }
      };
    }
    return {
      success: false,
      error: 'No device found'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to scan for Bluetooth devices'
    };
  }
}
