// Vehicle Management Service

import { Vehicle, VehicleFormData } from '@/app/types/vehicle';

const STORAGE_KEY = 'controlmiles_vehicles';

export function getAllVehicles(): Vehicle[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export function getActiveVehicle(): Vehicle | null {
  const vehicles = getAllVehicles();
  return vehicles.find(v => v.isActive) || null;
}

export function getVehicleById(id: string): Vehicle | null {
  const vehicles = getAllVehicles();
  return vehicles.find(v => v.id === id) || null;
}

export function createVehicle(data: VehicleFormData): Vehicle {
  const vehicles = getAllVehicles();
  
  // Deactivate all other vehicles if this is the first or being set as active
  const isFirstVehicle = vehicles.length === 0;
  
  const newVehicle: Vehicle = {
    id: crypto.randomUUID(),
    ...data,
    currentOdometer: data.initialOdometer,
    isActive: isFirstVehicle, // First vehicle is automatically active
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  vehicles.push(newVehicle);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  
  return newVehicle;
}

export function updateVehicle(id: string, data: Partial<VehicleFormData>): Vehicle | null {
  const vehicles = getAllVehicles();
  const index = vehicles.findIndex(v => v.id === id);
  
  if (index === -1) return null;
  
  vehicles[index] = {
    ...vehicles[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  return vehicles[index];
}

export function updateVehicleOdometer(id: string, newOdometer: number): Vehicle | null {
  const vehicles = getAllVehicles();
  const index = vehicles.findIndex(v => v.id === id);
  
  if (index === -1) return null;
  
  vehicles[index].currentOdometer = newOdometer;
  vehicles[index].updatedAt = new Date().toISOString();
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  return vehicles[index];
}

export function setActiveVehicle(id: string): boolean {
  const vehicles = getAllVehicles();
  
  // Deactivate all vehicles
  vehicles.forEach(v => v.isActive = false);
  
  // Activate the selected vehicle
  const vehicle = vehicles.find(v => v.id === id);
  if (!vehicle) return false;
  
  vehicle.isActive = true;
  vehicle.updatedAt = new Date().toISOString();
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  return true;
}

export function deleteVehicle(id: string): boolean {
  const vehicles = getAllVehicles();
  const index = vehicles.findIndex(v => v.id === id);
  
  if (index === -1) return false;
  
  const wasActive = vehicles[index].isActive;
  vehicles.splice(index, 1);
  
  // If deleted vehicle was active, activate the first remaining vehicle
  if (wasActive && vehicles.length > 0) {
    vehicles[0].isActive = true;
    vehicles[0].updatedAt = new Date().toISOString();
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  return true;
}

export function pairBluetoothDevice(vehicleId: string, deviceId: string, deviceName: string): boolean {
  const vehicles = getAllVehicles();
  const vehicle = vehicles.find(v => v.id === vehicleId);
  
  if (!vehicle) return false;
  
  vehicle.bluetoothDeviceId = deviceId;
  vehicle.bluetoothDeviceName = deviceName;
  vehicle.updatedAt = new Date().toISOString();
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  return true;
}

export function unpairBluetoothDevice(vehicleId: string): boolean {
  const vehicles = getAllVehicles();
  const vehicle = vehicles.find(v => v.id === vehicleId);
  
  if (!vehicle) return false;
  
  vehicle.bluetoothDeviceId = undefined;
  vehicle.bluetoothDeviceName = undefined;
  vehicle.updatedAt = new Date().toISOString();
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  return true;
}

export function getVehicleByBluetoothDevice(deviceId: string): Vehicle | null {
  const vehicles = getAllVehicles();
  return vehicles.find(v => v.bluetoothDeviceId === deviceId) || null;
}

export function getTotalMilesDriven(vehicleId: string): number {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return 0;
  return vehicle.currentOdometer - vehicle.initialOdometer;
}
