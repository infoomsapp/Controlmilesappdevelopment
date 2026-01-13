// LocalStorage service for offline-first data persistence

import { DailyLedger, IRSLogEntry, Settings } from '@/app/types';

const LEDGERS_KEY = 'controlmiles_ledgers';
const LOGS_KEY = 'controlmiles_logs';
const SETTINGS_KEY = 'controlmiles_settings';

// Default settings
const DEFAULT_SETTINGS: Settings = {
  autoStartTracking: false,
  detectGigApps: true,
  taxEstimation: true,
  language: 'es',
  backupEnabled: true,
  standardMileageRate: 0.67, // IRS 2024 rate
};

// Daily Ledgers
export function getAllLedgers(): DailyLedger[] {
  const data = localStorage.getItem(LEDGERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getLedgerById(id: string): DailyLedger | null {
  const ledgers = getAllLedgers();
  return ledgers.find(l => l.id === id) || null;
}

export function getLedgerByDate(date: string): DailyLedger | null {
  const ledgers = getAllLedgers();
  return ledgers.find(l => l.date === date) || null;
}

export function saveLedger(ledger: DailyLedger): void {
  const ledgers = getAllLedgers();
  const index = ledgers.findIndex(l => l.id === ledger.id);
  
  if (index >= 0) {
    ledgers[index] = ledger;
  } else {
    ledgers.push(ledger);
  }
  
  localStorage.setItem(LEDGERS_KEY, JSON.stringify(ledgers));
}

export function deleteLedger(id: string): void {
  const ledgers = getAllLedgers();
  const filtered = ledgers.filter(l => l.id !== id);
  localStorage.setItem(LEDGERS_KEY, JSON.stringify(filtered));
}

// IRS Log Entries
export function getAllLogs(): IRSLogEntry[] {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getLogsByLedgerId(ledgerId: string): IRSLogEntry[] {
  const logs = getAllLogs();
  return logs.filter(l => l.dailyLedgerId === ledgerId);
}

export function saveLog(log: IRSLogEntry): void {
  const logs = getAllLogs();
  logs.push(log);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function deleteLogs(ledgerId: string): void {
  const logs = getAllLogs();
  const filtered = logs.filter(l => l.dailyLedgerId !== ledgerId);
  localStorage.setItem(LOGS_KEY, JSON.stringify(filtered));
}

// Settings
export function getSettings(): Settings {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Utility functions
export function getLedgersByDateRange(startDate: string, endDate: string): DailyLedger[] {
  const ledgers = getAllLedgers();
  return ledgers.filter(l => l.date >= startDate && l.date <= endDate);
}

export function getLogsByDateRange(startDate: string, endDate: string): IRSLogEntry[] {
  const ledgers = getLedgersByDateRange(startDate, endDate);
  const ledgerIds = ledgers.map(l => l.id);
  const logs = getAllLogs();
  return logs.filter(l => ledgerIds.includes(l.dailyLedgerId));
}
