// Mock data generator for demo purposes

import { DailyLedger, IRSLogEntry } from '@/app/types';
import { generateRecordHash, generateLogHash } from './crypto';
import { saveLedger, saveLog, getAllLedgers } from './storage';

export async function generateMockData() {
  // Check if data already exists
  const existing = getAllLedgers();
  if (existing.length > 0) {
    return; // Don't overwrite existing data
  }

  const today = new Date();
  const mockDays = 10;

  for (let i = mockDays; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Generate random odometer readings
    const odometerStart = 50000 + (mockDays - i) * 100 + Math.floor(Math.random() * 50);
    const miles = 50 + Math.random() * 150;
    const odometerEnd = odometerStart + miles;
    const income = miles * (1.5 + Math.random() * 1.5); // $1.50 - $3.00 per mile

    const hash = await generateRecordHash({
      date: dateStr,
      odometerStart,
      odometerEnd,
      income,
      timestamp: date.getTime(),
    });

    const ledger: DailyLedger = {
      id: `${date.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
      date: dateStr,
      odometerStart: Math.floor(odometerStart),
      odometerEnd: Math.floor(odometerEnd),
      originalMiles: Math.floor(miles * 100) / 100,
      income: Math.floor(income * 100) / 100,
      corrections: [],
      recordHash: hash,
      timestamp: date.getTime(),
      device: navigator.userAgent,
    };

    saveLedger(ledger);

    // Generate some GPS logs for each day
    const numLogs = 5 + Math.floor(Math.random() * 10);
    let accumulatedMiles = 0;

    for (let j = 0; j < numLogs; j++) {
      const logTimestamp = date.getTime() + j * 3600000; // Every hour
      const latitude = 37.7749 + (Math.random() - 0.5) * 0.1;
      const longitude = -122.4194 + (Math.random() - 0.5) * 0.1;
      accumulatedMiles += miles / numLogs;

      const logHash = await generateLogHash({
        timestamp: logTimestamp,
        latitude,
        longitude,
        milesAccumulated: accumulatedMiles,
      });

      const gigApps = ['Uber', 'Lyft', 'DoorDash', 'Uber Eats', 'Instacart', undefined];
      const gigApp = Math.random() > 0.6 ? gigApps[Math.floor(Math.random() * gigApps.length)] : undefined;

      const log: IRSLogEntry = {
        id: `${logTimestamp}_${Math.random().toString(36).substr(2, 9)}`,
        dailyLedgerId: ledger.id,
        timestamp: logTimestamp,
        latitude,
        longitude,
        milesAccumulated: Math.floor(accumulatedMiles * 100) / 100,
        gigApp,
        hash: logHash,
      };

      saveLog(log);
    }
  }
}
