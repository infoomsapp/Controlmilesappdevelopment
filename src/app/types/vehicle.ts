// Vehicle type definitions

export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  initialOdometer: number;
  currentOdometer: number;
  fuelType?: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  bluetoothDeviceId?: string; // For automatic detection
  bluetoothDeviceName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFormData {
  name: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  initialOdometer: number;
  fuelType?: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
}
