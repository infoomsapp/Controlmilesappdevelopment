// Cryptographic hashing service using SHA-256

export async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function generateRecordHash(record: {
  date: string;
  odometerStart: number;
  odometerEnd: number;
  income: number;
  timestamp: number;
}): Promise<string> {
  const data = `${record.date}|${record.odometerStart}|${record.odometerEnd}|${record.income}|${record.timestamp}`;
  return generateHash(data);
}

export async function generateLogHash(log: {
  timestamp: number;
  latitude: number;
  longitude: number;
  milesAccumulated: number;
}): Promise<string> {
  const data = `${log.timestamp}|${log.latitude}|${log.longitude}|${log.milesAccumulated}`;
  return generateHash(data);
}
