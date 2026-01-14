// Vehicle Management Component

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/app/components/ui/alert-dialog';
import { Car, Plus, Edit, Trash2, Check, Bluetooth, Info, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Vehicle, VehicleFormData } from '@/app/types/vehicle';
import * as vehicleService from '@/app/services/vehicleService';
import * as bluetooth from '@/app/services/bluetoothDetection';

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  function loadVehicles() {
    setVehicles(vehicleService.getAllVehicles());
  }

  function handleSetActive(vehicleId: string) {
    const success = vehicleService.setActiveVehicle(vehicleId);
    if (success) {
      loadVehicles();
      toast.success('Active vehicle changed');
    } else {
      toast.error('Failed to change active vehicle');
    }
  }

  function handleDelete(vehicleId: string) {
    const success = vehicleService.deleteVehicle(vehicleId);
    if (success) {
      loadVehicles();
      toast.success('Vehicle deleted');
    } else {
      toast.error('Failed to delete vehicle');
    }
  }

  const activeVehicle = vehicles.find(v => v.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">My Vehicles</h2>
        <p className="text-gray-600">Manage your vehicles and track mileage per car</p>
      </div>

      {/* Active Vehicle Summary */}
      {activeVehicle && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-blue-600" />
              Active Vehicle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{activeVehicle.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Make & Model</p>
                <p className="font-semibold">{activeVehicle.make} {activeVehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Odometer</p>
                <p className="font-semibold">{activeVehicle.currentOdometer.toLocaleString()} mi</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Miles Tracked</p>
                <p className="font-semibold">
                  {vehicleService.getTotalMilesDriven(activeVehicle.id).toLocaleString()} mi
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicle List */}
      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vehicles yet</h3>
            <p className="text-gray-600 mb-4">
              Add your first vehicle to start tracking mileage
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Vehicle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className={vehicle.isActive ? 'border-blue-500' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      {vehicle.name}
                      {vehicle.isActive && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Active
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setEditingVehicle(vehicle)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <VehicleForm 
                          vehicle={vehicle}
                          onSuccess={() => {
                            setEditingVehicle(null);
                            loadVehicles();
                          }}
                          onCancel={() => setEditingVehicle(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{vehicle.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(vehicle.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {vehicle.licensePlate && (
                    <div>
                      <p className="text-xs text-gray-600">License Plate</p>
                      <p className="text-sm font-semibold">{vehicle.licensePlate}</p>
                    </div>
                  )}
                  {vehicle.color && (
                    <div>
                      <p className="text-xs text-gray-600">Color</p>
                      <p className="text-sm font-semibold">{vehicle.color}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-600">Current Odometer</p>
                    <p className="text-sm font-semibold">{vehicle.currentOdometer.toLocaleString()} mi</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Miles Tracked</p>
                    <p className="text-sm font-semibold">
                      {vehicleService.getTotalMilesDriven(vehicle.id).toLocaleString()} mi
                    </p>
                  </div>
                </div>

                {vehicle.bluetoothDeviceName && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 mb-4">
                    <Bluetooth className="h-4 w-4" />
                    <span>Paired: {vehicle.bluetoothDeviceName}</span>
                  </div>
                )}

                {!vehicle.isActive && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleSetActive(vehicle.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Set as Active Vehicle
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Box */}
      <Card className="bg-gray-50">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">About Vehicle Tracking</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The active vehicle is used for all new trips</li>
                <li>Each vehicle tracks mileage independently</li>
                <li>Pair Bluetooth devices for automatic trip detection</li>
                <li>Odometer readings are vehicle-specific</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <VehicleForm 
            onSuccess={() => {
              setIsAddDialogOpen(false);
              loadVehicles();
            }}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Vehicle Form Component
interface VehicleFormProps {
  vehicle?: Vehicle;
  onSuccess: () => void;
  onCancel: () => void;
}

function VehicleForm({ vehicle, onSuccess, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    name: vehicle?.name || '',
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    color: vehicle?.color || '',
    licensePlate: vehicle?.licensePlate || '',
    vin: vehicle?.vin || '',
    initialOdometer: vehicle?.initialOdometer || 0,
    fuelType: vehicle?.fuelType || undefined,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (vehicle) {
      // Update existing vehicle
      const updated = vehicleService.updateVehicle(vehicle.id, formData);
      if (updated) {
        toast.success('Vehicle updated successfully');
        onSuccess();
      } else {
        toast.error('Failed to update vehicle');
      }
    } else {
      // Create new vehicle
      vehicleService.createVehicle(formData);
      toast.success('Vehicle added successfully');
      onSuccess();
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
        <DialogDescription>
          {vehicle 
            ? 'Update your vehicle information' 
            : 'Add a new vehicle to track mileage separately'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="name">Vehicle Name *</Label>
            <Input
              id="name"
              placeholder="e.g., My Honda Civic"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="make">Make *</Label>
            <Input
              id="make"
              placeholder="e.g., Honda"
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              placeholder="e.g., Civic"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              type="number"
              min="1900"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              placeholder="e.g., Blue"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="licensePlate">License Plate</Label>
            <Input
              id="licensePlate"
              placeholder="e.g., ABC1234"
              value={formData.licensePlate}
              onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
            />
          </div>

          <div>
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select 
              value={formData.fuelType} 
              onValueChange={(value: any) => setFormData({ ...formData, fuelType: value })}
            >
              <SelectTrigger id="fuelType">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gasoline">Gasoline</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="vin">VIN (Vehicle Identification Number)</Label>
            <Input
              id="vin"
              placeholder="e.g., 1HGBH41JXMN109186"
              value={formData.vin}
              onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
              maxLength={17}
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="initialOdometer">
              {vehicle ? 'Current Odometer Reading *' : 'Initial Odometer Reading *'}
            </Label>
            <Input
              id="initialOdometer"
              type="number"
              min="0"
              placeholder="e.g., 50000"
              value={formData.initialOdometer}
              onChange={(e) => setFormData({ ...formData, initialOdometer: parseInt(e.target.value) || 0 })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {vehicle 
                ? 'Update the current odometer reading for this vehicle' 
                : 'Enter the current mileage shown on your odometer'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
          </Button>
        </div>
      </form>
    </>
  );
}