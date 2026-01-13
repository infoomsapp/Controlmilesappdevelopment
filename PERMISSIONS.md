# ControlMiles - Platform Permissions Documentation

## 📱 Android Permissions (ControlMiles)

### Location & Motion

#### `ACCESS_FINE_LOCATION` ⭐ **CRITICAL**
- **Purpose:** Precise GPS tracking for accurate mileage calculation
- **Usage:** Real-time location logging during active trips
- **User Benefit:** Accurate mileage records for IRS deductions
- **Declaration:**
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

#### `ACCESS_COARSE_LOCATION` ⭐ **CRITICAL**
- **Purpose:** Approximate location fallback when GPS unavailable
- **Usage:** Provides location data in low-GPS environments (tunnels, buildings)
- **User Benefit:** Ensures continuous tracking even with weak GPS signal
- **Declaration:**
```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

#### `ACCESS_BACKGROUND_LOCATION` ⭐ **CRITICAL**
- **Purpose:** Continuous tracking while app is closed/minimized
- **Usage:** Enables mileage logging during entire shift without keeping app open
- **User Benefit:** Set-and-forget tracking - drivers don't need to keep app open
- **Special Requirements:** 
  - Requires educational screen explaining why needed
  - Must be requested separately from foreground location
  - Google Play requires explicit justification
- **Declaration:**
```xml
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```
- **Educational Message:**
```
ControlMiles needs background location access to track your 
mileage throughout your entire shift, even when the app is 
closed. This ensures you never miss deductible miles for 
accurate IRS reporting.
```

#### `ACTIVITY_RECOGNITION` ⭐ **CRITICAL**
- **Purpose:** Detects whether user is driving, walking, or idle
- **Usage:** Auto-start/stop tracking when driving begins/ends
- **User Benefit:** Automatic trip detection - no manual start/stop needed
- **Declaration:**
```xml
<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
```

#### `FOREGROUND_SERVICE` ⭐ **CRITICAL**
- **Purpose:** Required for persistent tracking notifications
- **Usage:** Shows ongoing notification while tracking is active
- **User Benefit:** Visible indicator that tracking is running
- **Declaration:**
```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
```

---

### Camera & Evidence

#### `CAMERA` ⭐ **CRITICAL**
- **Purpose:** Captures odometer photos for IRS evidence
- **Usage:** Takes photos at start/end of shift showing mileage
- **User Benefit:** Visual proof of miles driven for audit protection
- **Declaration:**
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

#### `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE` ❌ **NOT RECOMMENDED**
- **Purpose:** Store photos outside app sandbox
- **Recommendation:** ❌ **DO NOT USE** - Use scoped storage instead
- **Alternative:** Store photos in app-private directory
- **Reason:** Privacy concerns, Play Store restrictions

---

### Files & Export

#### Storage Access Framework (SAF) ✅ **RECOMMENDED**
- **Purpose:** Export reports (PDF/CSV/JSON) to user-chosen location
- **Usage:** No special permissions required
- **User Benefit:** Export tax reports to any location (Drive, Downloads, etc.)
- **Implementation:** Use `Intent.ACTION_CREATE_DOCUMENT`

#### `MANAGE_EXTERNAL_STORAGE` ❌ **NOT RECOMMENDED**
- **Purpose:** Full filesystem access
- **Recommendation:** ❌ **AVOID** - Google Play restrictions
- **Use Only If:** Absolutely necessary (it's not for ControlMiles)

---

### Optional / Advanced

#### `PACKAGE_USAGE_STATS` ⚠️ **OPTIONAL**
- **Purpose:** Detects active gig apps (Uber, Lyft, DoorDash, etc.)
- **Usage:** Auto-select which gig app is currently running
- **User Benefit:** Automatic app detection - less manual input
- **Special Requirements:**
  - ⚠️ Requires **mandatory educational screen** per Google Play policy
  - Must request via Settings screen (not runtime permission)
  - User must grant in device Settings > Special app access
- **Declaration:**
```xml
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS"
    tools:ignore="ProtectedPermissions" />
```
- **Educational Message:**
```
ControlMiles can automatically detect when you're using 
Uber, Lyft, or other gig apps to make tracking easier. 

This requires "Usage Access" permission, which you'll 
grant in your device Settings. ControlMiles only checks 
which gig apps are running - no other data is accessed.

This is optional - you can still select your gig app manually.
```

---

## 🍏 iOS Permissions (ControlMiles)

### Location & Motion

#### `NSLocationWhenInUseUsageDescription` ⭐ **CRITICAL**
- **Purpose:** Location access while app is open
- **Usage:** Initial location tracking during active use
- **User Message:**
```
ControlMiles needs your location to accurately track 
mileage while you drive. This ensures precise records 
for IRS tax deductions.
```
- **Info.plist:**
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>ControlMiles tracks your location to calculate accurate mileage for IRS tax deductions.</string>
```

#### `NSLocationAlwaysAndWhenInUseUsageDescription` ⭐ **CRITICAL**
- **Purpose:** Continuous tracking in background
- **Usage:** Enables full-shift tracking without keeping app open
- **User Message:**
```
ControlMiles needs background location access to track 
your entire shift automatically, even when the app is 
closed. This ensures you never miss deductible miles.
```
- **Info.plist:**
```xml
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>ControlMiles tracks your location in the background to automatically log mileage throughout your entire shift for accurate IRS reporting.</string>
```

#### `NSLocationAlwaysUsageDescription` ⭐ **CRITICAL** (iOS 10 compatibility)
- **Purpose:** Required for full background mileage tracking (iOS 10+)
- **Info.plist:**
```xml
<key>NSLocationAlwaysUsageDescription</key>
<string>ControlMiles tracks your location continuously to provide accurate mileage records for tax purposes.</string>
```

#### `NSMotionUsageDescription` ⭐ **CRITICAL**
- **Purpose:** Detects driving vs. walking
- **Usage:** Auto-start tracking when driving begins
- **User Message:**
```
ControlMiles uses motion sensors to detect when you're 
driving, allowing automatic trip tracking without manual 
start/stop.
```
- **Info.plist:**
```xml
<key>NSMotionUsageDescription</key>
<string>ControlMiles detects when you're driving to automatically start and stop mileage tracking.</string>
```

---

### Camera & Evidence

#### `NSCameraUsageDescription` ⭐ **CRITICAL**
- **Purpose:** Captures odometer photos for IRS evidence
- **User Message:**
```
ControlMiles needs camera access to capture odometer 
photos as visual proof of your mileage for IRS audits.
```
- **Info.plist:**
```xml
<key>NSCameraUsageDescription</key>
<string>ControlMiles needs camera access to capture odometer photos for IRS-compliant mileage documentation.</string>
```

#### `NSPhotoLibraryAddUsageDescription` ⚠️ **OPTIONAL**
- **Purpose:** Saves photos to user's photo library
- **Recommendation:** Optional - only if user wants to save to Photos app
- **Info.plist:**
```xml
<key>NSPhotoLibraryAddUsageDescription</key>
<string>ControlMiles can save odometer photos to your photo library for backup purposes.</string>
```

#### `NSPhotoLibraryUsageDescription` ⚠️ **OPTIONAL**
- **Purpose:** Reads photos from library
- **Recommendation:** Not needed unless allowing photo import
- **Info.plist:**
```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>ControlMiles can import existing odometer photos from your photo library.</string>
```

---

### Notifications

#### `UNUserNotificationCenter` authorization ⭐ **RECOMMENDED**
- **Purpose:** Shows tracking alerts and reminders
- **Usage:** 
  - "Tracking started" notification
  - "Don't forget to stop tracking" reminder
  - Daily mileage summary
- **User Benefit:** Never forget to start/stop tracking
- **Implementation:**
```swift
UNUserNotificationCenter.current().requestAuthorization(
    options: [.alert, .sound, .badge]
) { granted, error in
    // Handle authorization
}
```

---

## 🧩 Module-by-Module Permission Summary

### 📍 Mileage Tracking

**Android Permissions:**
- ✅ `ACCESS_FINE_LOCATION` — Precise GPS
- ✅ `ACCESS_COARSE_LOCATION` — Fallback location
- ✅ `ACCESS_BACKGROUND_LOCATION` — Background tracking
- ✅ `ACTIVITY_RECOGNITION` — Driving detection
- ✅ `FOREGROUND_SERVICE` — Persistent notification
- ✅ `FOREGROUND_SERVICE_LOCATION` — Location service type

**iOS Permissions:**
- ✅ `NSLocationWhenInUseUsageDescription` — Foreground location
- ✅ `NSLocationAlwaysAndWhenInUseUsageDescription` — Background location
- ✅ `NSLocationAlwaysUsageDescription` — iOS 10 compatibility
- ✅ `NSMotionUsageDescription` — Activity detection

---

### 📷 Odometer Photos

**Android Permissions:**
- ✅ `CAMERA` — Photo capture
- ❌ Storage permissions — **NOT NEEDED** (use app sandbox)

**iOS Permissions:**
- ✅ `NSCameraUsageDescription` — Photo capture
- ⚠️ `NSPhotoLibraryAddUsageDescription` — Optional save to Photos
- ⚠️ `NSPhotoLibraryUsageDescription` — Optional import from Photos

---

### 📊 Exporting Reports

**Android:**
- ✅ **Storage Access Framework (SAF)** — No permissions needed
- User selects export location via system picker
- Supports: PDF, CSV, JSON exports

**iOS:**
- ✅ **Share Sheet (UIActivityViewController)** — No permissions needed
- User shares to Files, Drive, Email, etc.
- Supports: PDF, CSV, JSON exports

---

### 🚗 Gig App Detection

**Android:**
- ⚠️ `PACKAGE_USAGE_STATS` — Optional, requires Settings access
- **Educational screen required by Google Play**
- Detects: Uber, Lyft, DoorDash, UberEats, Grubhub, Instacart, etc.

**iOS:**
- ❌ **Not allowed by Apple**
- Manual selection required
- No API to detect running apps

---

## 📋 Implementation Checklist

### Android (`AndroidManifest.xml`)

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Location & Motion - CRITICAL -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
    <uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
    
    <!-- Foreground Service -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
    
    <!-- Camera - CRITICAL -->
    <uses-permission android:name="android.permission.CAMERA" />
    
    <!-- Notifications -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <!-- Gig App Detection - OPTIONAL -->
    <uses-permission android:name="android.permission.PACKAGE_USAGE_STATS"
        tools:ignore="ProtectedPermissions" />
    
    <!-- Hardware Features -->
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.location.gps" android:required="true" />

    <application>
        <!-- Foreground Service Declaration -->
        <service
            android:name=".TrackingService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="location" />
    </application>
</manifest>
```

---

### iOS (`Info.plist`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Location Permissions - CRITICAL -->
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>ControlMiles tracks your location to calculate accurate mileage for IRS tax deductions.</string>
    
    <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
    <string>ControlMiles tracks your location in the background to automatically log mileage throughout your entire shift for accurate IRS reporting.</string>
    
    <key>NSLocationAlwaysUsageDescription</key>
    <string>ControlMiles tracks your location continuously to provide accurate mileage records for tax purposes.</string>
    
    <!-- Motion Permission - CRITICAL -->
    <key>NSMotionUsageDescription</key>
    <string>ControlMiles detects when you're driving to automatically start and stop mileage tracking.</string>
    
    <!-- Camera Permission - CRITICAL -->
    <key>NSCameraUsageDescription</key>
    <string>ControlMiles needs camera access to capture odometer photos for IRS-compliant mileage documentation.</string>
    
    <!-- Photo Library - OPTIONAL -->
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>ControlMiles can save odometer photos to your photo library for backup purposes.</string>
    
    <key>NSPhotoLibraryUsageDescription</key>
    <string>ControlMiles can import existing odometer photos from your photo library.</string>
    
    <!-- Background Modes -->
    <key>UIBackgroundModes</key>
    <array>
        <string>location</string>
        <string>processing</string>
    </array>
    
    <!-- Location Accuracy -->
    <key>NSLocationDefaultAccuracyReduced</key>
    <false/>
</dict>
</plist>
```

---

## 🛡️ Privacy & Compliance

### Google Play Store Requirements

1. **Data Safety Form:**
   - Location data: Collected, not shared, used for app functionality
   - Photos: Stored locally, not shared, used for user records
   - No personal data leaves device

2. **Background Location Justification:**
   ```
   ControlMiles requires background location access to automatically 
   track mileage throughout a driver's entire shift for accurate IRS 
   tax deduction records. This is the core functionality of the app 
   and cannot be accomplished without background location access.
   ```

3. **Usage Access (PACKAGE_USAGE_STATS):**
   - Must have prominent educational screen
   - Must be clearly optional
   - Must explain what data is accessed

---

### App Store Review Requirements

1. **Purpose String Clarity:**
   - All purpose strings must clearly explain why permission is needed
   - Must mention specific feature enabled by permission
   - Must be user-friendly language

2. **Background Location:**
   - Must show blue status bar when using location in background
   - Must provide in-app explanation before requesting permission
   - Must have Settings toggle to disable background tracking

3. **Camera Access:**
   - Must only request when user initiates photo capture
   - Must not access camera without user action

---

## 📱 User-Facing Educational Screens

### First Launch - Permission Request Flow

**Step 1: Welcome Screen**
```
Welcome to ControlMiles!

To track your mileage accurately for IRS reporting, 
ControlMiles needs access to:

📍 Your location (for GPS tracking)
📷 Your camera (for odometer photos)
💪 Motion sensors (to detect driving)

All data stays on your device - nothing is sent to servers.
```

**Step 2: Location Permission**
```
📍 Location Access Required

ControlMiles needs precise location access to:
• Track your driving routes automatically
• Calculate exact mileage for IRS deductions
• Create audit-proof GPS logs

Your location data is stored locally and never shared.

[Allow While Using App] [Allow Once]
```

**Step 3: Background Location (Android)**
```
📍 Background Tracking

To track your entire shift automatically, ControlMiles 
needs to access your location even when the app is closed.

This means you can:
✅ Start tracking once and forget about it
✅ Never miss deductible miles
✅ Keep your phone in your pocket while driving

[Allow All the Time] [Allow Only While Using App]
```

**Step 4: Activity Recognition**
```
💪 Motion Detection

ControlMiles uses motion sensors to:
• Detect when you start driving
• Auto-start mileage tracking
• Distinguish driving from walking

This creates fully automatic tracking with no manual input.

[Allow] [Don't Allow]
```

**Step 5: Camera Permission**
```
📷 Camera Access

ControlMiles needs camera access to:
• Capture odometer photos at start/end of shift
• Create visual evidence for IRS audits
• Verify your reported mileage

Photos are stored privately on your device.

[Allow] [Don't Allow]
```

---

## 🔧 Runtime Permission Best Practices

### Android (Kotlin Example)

```kotlin
// Request location permissions
when {
    ContextCompat.checkSelfPermission(
        context,
        Manifest.permission.ACCESS_FINE_LOCATION
    ) == PackageManager.PERMISSION_GRANTED -> {
        // Permission already granted
        startTracking()
    }
    
    shouldShowRequestPermissionRationale(
        Manifest.permission.ACCESS_FINE_LOCATION
    ) -> {
        // Show educational dialog
        showLocationPermissionRationale()
    }
    
    else -> {
        // Request permission
        requestPermissions(
            arrayOf(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ),
            LOCATION_PERMISSION_REQUEST_CODE
        )
    }
}

// Background location (must be requested separately)
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
    requestPermissions(
        arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION),
        BACKGROUND_LOCATION_REQUEST_CODE
    )
}
```

---

### iOS (Swift Example)

```swift
import CoreLocation

class LocationManager: NSObject, CLLocationManagerDelegate {
    let locationManager = CLLocationManager()
    
    func requestPermissions() {
        // Request when-in-use first
        locationManager.requestWhenInUseAuthorization()
        
        // Then request always (background) authorization
        locationManager.requestAlwaysAuthorization()
    }
    
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        switch manager.authorizationStatus {
        case .authorizedAlways:
            // Full background tracking enabled
            startBackgroundTracking()
        case .authorizedWhenInUse:
            // Foreground tracking only
            startForegroundTracking()
        case .denied, .restricted:
            // Show settings prompt
            showPermissionDeniedAlert()
        case .notDetermined:
            // Initial state
            break
        @unknown default:
            break
        }
    }
}
```

---

## 📊 Permission Analytics

Track permission grant rates to optimize request flow:

```typescript
// Example analytics events
analytics.track('permission_requested', {
  permission: 'location',
  platform: 'android',
  context: 'first_launch'
});

analytics.track('permission_granted', {
  permission: 'location',
  platform: 'android',
  duration_to_grant: '3s'
});

analytics.track('permission_denied', {
  permission: 'location',
  platform: 'android',
  reason: 'user_declined'
});
```

---

## ✅ Final Checklist

### Before Submission

- [ ] All permissions declared in manifest/Info.plist
- [ ] Educational screens implemented for all critical permissions
- [ ] Permission requests only when feature is used (not on launch)
- [ ] Clear purpose strings explaining why each permission is needed
- [ ] Fallback UI when permissions denied (graceful degradation)
- [ ] Settings page to review/change permission grants
- [ ] Data Safety form completed (Play Store)
- [ ] Privacy policy updated with permission usage
- [ ] App Store Review questions answered
- [ ] Background location justification prepared

---

**Built with privacy and compliance in mind** 🔒
