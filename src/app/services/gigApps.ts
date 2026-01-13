// Gig App Detection Service
// Detects if gig economy apps are running in the background

export type GigApp = 'Uber' | 'Lyft' | 'DoorDash' | 'UberEats' | 'Grubhub' | 'Instacart' | 'Postmates' | 'Empower' | 'AmazonFlex' | 'Taxi' | 'PersonalCommute';

interface GigAppStatus {
  isActive: boolean;
  detectedApps: GigApp[];
  timestamp: number;
}

const GIG_APPS: GigApp[] = [
  'Uber',
  'Lyft', 
  'DoorDash',
  'UberEats',
  'Grubhub',
  'Instacart',
  'Postmates',
  'Empower',
  'AmazonFlex',
  'Taxi',
  'PersonalCommute',
];

// Store detection state
let lastDetection: GigAppStatus = {
  isActive: false,
  detectedApps: [],
  timestamp: 0,
};

/**
 * Attempts to detect if gig apps are active
 * Note: Browser security limitations mean we can't directly detect other apps.
 * This uses various signals and heuristics:
 * 1. Check if user is in motion (GPS)
 * 2. Check time patterns (peak hours)
 * 3. Allow manual app selection
 * 4. Store user's declared active app
 */
export function detectGigApps(): GigAppStatus {
  // In a real implementation with native capabilities, you would:
  // - Check running processes (requires native app)
  // - Check location permissions of other apps
  // - Check network activity patterns
  
  // For web app, we use stored preference + location signals
  const storedApp = localStorage.getItem('controlmiles_active_gig_app');
  const isManuallyActive = localStorage.getItem('controlmiles_gig_active') === 'true';
  
  if (storedApp && isManuallyActive) {
    lastDetection = {
      isActive: true,
      detectedApps: [storedApp as GigApp],
      timestamp: Date.now(),
    };
  } else {
    lastDetection = {
      isActive: false,
      detectedApps: [],
      timestamp: Date.now(),
    };
  }
  
  return lastDetection;
}

/**
 * User declares which gig app they're using
 */
export function declareGigApp(app: GigApp | null) {
  if (app) {
    localStorage.setItem('controlmiles_active_gig_app', app);
    localStorage.setItem('controlmiles_gig_active', 'true');
  } else {
    localStorage.removeItem('controlmiles_active_gig_app');
    localStorage.setItem('controlmiles_gig_active', 'false');
  }
}

/**
 * Check if any gig app is currently active
 */
export function isGigAppActive(): boolean {
  const detection = detectGigApps();
  return detection.isActive && detection.detectedApps.length > 0;
}

/**
 * Get the current active gig app
 */
export function getActiveGigApp(): GigApp | null {
  const detection = detectGigApps();
  return detection.detectedApps[0] || null;
}

/**
 * Get list of available gig apps
 */
export function getGigAppsList(): GigApp[] {
  return [...GIG_APPS];
}

/**
 * Start monitoring for gig apps (passive detection)
 */
export function startGigAppMonitoring(): void {
  // In a real app, this would:
  // - Monitor location changes
  // - Check for navigation patterns
  // - Detect when user is likely working
  
  // For now, just update detection periodically
  setInterval(() => {
    detectGigApps();
  }, 30000); // Check every 30 seconds
}

/**
 * Enhanced detection with location signals
 * This provides better accuracy when combined with GPS tracking
 */
export function detectWithLocationSignals(
  isMoving: boolean,
  speed?: number, // km/h
  timeOfDay?: number // 0-23
): GigAppStatus {
  const baseDetection = detectGigApps();
  
  // If user is moving at speeds typical for driving (20-80 km/h)
  // and it's during typical gig hours (6am-11pm), likely working
  const isLikelyWorking = 
    isMoving && 
    speed !== undefined && 
    speed >= 20 && 
    speed <= 120 &&
    timeOfDay !== undefined &&
    timeOfDay >= 6 && 
    timeOfDay <= 23;
  
  if (isLikelyWorking && baseDetection.isActive) {
    return {
      ...baseDetection,
      isActive: true,
    };
  }
  
  return baseDetection;
}

/**
 * Store metadata about gig session
 */
export function recordGigSession(app: GigApp, startTime: number) {
  const sessions = getGigSessions();
  sessions.push({
    app,
    startTime,
    endTime: null,
  });
  localStorage.setItem('controlmiles_gig_sessions', JSON.stringify(sessions));
}

/**
 * End current gig session
 */
export function endGigSession() {
  const sessions = getGigSessions();
  if (sessions.length > 0) {
    const lastSession = sessions[sessions.length - 1];
    if (!lastSession.endTime) {
      lastSession.endTime = Date.now();
      localStorage.setItem('controlmiles_gig_sessions', JSON.stringify(sessions));
    }
  }
  localStorage.setItem('controlmiles_gig_active', 'false');
}

/**
 * Get all recorded gig sessions
 */
function getGigSessions(): Array<{ app: GigApp; startTime: number; endTime: number | null }> {
  try {
    const data = localStorage.getItem('controlmiles_gig_sessions');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Get gig app icon/color for UI
 */
export function getGigAppInfo(app: GigApp): { color: string; emoji: string } {
  const info: Record<GigApp, { color: string; emoji: string }> = {
    Uber: { color: 'bg-black text-white', emoji: '🚗' },
    Lyft: { color: 'bg-pink-500 text-white', emoji: '🚙' },
    DoorDash: { color: 'bg-red-500 text-white', emoji: '🍔' },
    UberEats: { color: 'bg-green-600 text-white', emoji: '🍕' },
    Grubhub: { color: 'bg-orange-500 text-white', emoji: '🥡' },
    Instacart: { color: 'bg-green-500 text-white', emoji: '🛒' },
    Postmates: { color: 'bg-gray-800 text-white', emoji: '📦' },
    Empower: { color: 'bg-blue-500 text-white', emoji: '💪' },
    AmazonFlex: { color: 'bg-yellow-500 text-black', emoji: '📦' },
    Taxi: { color: 'bg-gray-500 text-white', emoji: '🚕' },
    PersonalCommute: { color: 'bg-gray-300 text-black', emoji: '🚶‍♂️' },
  };
  return info[app] || { color: 'bg-blue-500 text-white', emoji: '🚗' };
}