// Core types for ControlMiles

export type Language = 'es' | 'en' | 'zh' | 'am' | 'ar' | 'fr' | 'pt';

export interface DailyLedger {
  id: string;
  date: string; // ISO date
  odometerStart: number;
  odometerEnd: number;
  originalMiles: number;
  income: number;
  corrections: Correction[];
  startPhotoPath?: string;
  endPhotoPath?: string;
  recordHash: string;
  timestamp: number;
  device: string;
}

export interface IRSLogEntry {
  id: string;
  dailyLedgerId: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  milesAccumulated: number;
  gigApp?: string;
  hash: string;
}

export interface Correction {
  id: string;
  reason: string;
  amount: number;
  timestamp: number;
  type: 'income' | 'mileage';
}

export interface TrackingState {
  isTracking: boolean;
  startTime?: number;
  currentMiles: number;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  gigApp?: string;
}

export interface Settings {
  autoStartTracking: boolean;
  detectGigApps: boolean;
  taxEstimation: boolean;
  language: Language;
  backupEnabled: boolean;
  standardMileageRate: number; // IRS rate
}

export interface EarningsData {
  totalIncome: number;
  totalMiles: number;
  incomePerMile: number;
  taxDeduction: number;
  period: 'day' | 'week' | 'month' | 'year';
}

export interface ExportData {
  ledgers: DailyLedger[];
  logs: IRSLogEntry[];
  startDate: string;
  endDate: string;
  totalMiles: number;
  totalIncome: number;
  generatedAt: number;
}