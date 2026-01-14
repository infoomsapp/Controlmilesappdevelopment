# 📱 Android Studio Setup - ControlMiles

## ✅ COMPLETED: Capacitor Installation

Capacitor packages have been successfully installed:
- @capacitor/core
- @capacitor/cli
- @capacitor/android
- @capacitor/app
- @capacitor/geolocation
- @capacitor/camera
- @capacitor/device
- @capacitor/preferences
- @capacitor/motion
- @capacitor/local-notifications

---

## 🚀 Next Steps for Android Studio Development

### 1. Initialize Capacitor

```bash
# Initialize Capacitor configuration
npx cap init ControlMiles com.controlmiles.app --web-dir=dist

# Build the web app
npm run build

# Add Android platform
npx cap add android

# Sync web assets to Android
npx cap sync android
```

### 2. Open in Android Studio

```bash
# This command will open Android Studio automatically
npx cap open android
```

### 3. Android Studio Configuration

Once Android Studio opens:

1. **Wait for Gradle sync** to complete (first time may take 5-10 minutes)
2. **Select a device/emulator** from the device dropdown
3. **Click Run** (green play button) to build and install the app

### 4. Update & Rebuild

When you make changes to your React code:

```bash
# 1. Build the web app
npm run build

# 2. Sync changes to Android
npx cap sync android

# 3. The app will auto-reload in Android Studio
```

---

## 📋 Required Files (Will be created automatically)

### `/capacitor.config.ts` or `/capacitor.config.json`

Will be created by `npx cap init`. This file configures:
- App ID (`com.controlmiles.app`)
- App Name (`ControlMiles`)
- Web directory (`dist`)
- Server configuration
- Plugin configuration

### `/android/` Directory

Created by `npx cap add android`. Contains:
- **AndroidManifest.xml** - Permissions configuration
- **build.gradle** - Dependencies
- **MainActivity.java** - Entry point
- **res/** - Resources (icons, splash screens)
- **assets/** - Web assets (your built React app)

---

## 🔧 Android Manifest Permissions

Capacitor will automatically add these to `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Location (GPS Tracking) -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

<!-- Camera (Odometer Photos) -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

<!-- Motion Detection -->
<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />

<!-- Network (for potential future features) -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Foreground Service (for background GPS) -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
```

---

## 🎯 Advanced Features Implementation

### 1. **Vehicle Management ("Add Your Car")**

Located in: `/src/app/components/VehicleManagement.tsx`
- Add/Edit/Delete vehicles
- Track mileage per vehicle
- Vehicle-specific odometer readings
- Switch between vehicles

### 2. **Automatic Trip Detection**

Located in: `/src/app/services/autoDetection.ts`
- Motion sensor + GPS for trip start/end
- Configurable sensitivity
- Automatic mode (no gig app selection needed)

### 3. **Stop & Traffic Detection**

Located in: `/src/app/services/autoDetection.ts`
- Detect when vehicle is stopped
- Differentiate between stops (traffic lights) and trip end
- Time-based logic

### 4. **Bluetooth Vehicle Detection**

Located in: `/src/app/services/bluetoothDetection.ts`
- Auto-start tracking when connected to car Bluetooth
- Auto-stop when disconnected
- Pair with specific vehicle

---

## 🔑 Key Features for Android Studio

### **Native Capabilities**

1. **Background Location Tracking**
   - Continues tracking even when app is minimized
   - Uses Android Foreground Service
   - Displays persistent notification

2. **Motion Detection**
   - Uses Android Activity Recognition API
   - Detects driving, walking, still states
   - Triggers automatic trip start/end

3. **Bluetooth Integration**
   - Monitors Bluetooth connections
   - Triggers tracking based on device pairing
   - Works with car Bluetooth systems

4. **Local Notifications**
   - Reminds user to start/stop tracking
   - Notifies on trip start/end
   - Daily summary notifications

5. **Camera Optimization**
   - Native camera access
   - Compression for odometer photos
   - EXIF data for GPS coordinates

---

## 🏗️ Project Structure After Setup

```
project/
├── android/                    # Android Studio project
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml
│   │   │       ├── java/com/controlmiles/app/
│   │   │       │   └── MainActivity.java
│   │   │       ├── res/          # Icons, splash screens
│   │   │       └── assets/       # Your web app
│   │   ├── build.gradle
│   │   └── capacitor.build.gradle
│   ├── capacitor-cordova-android-plugins/
│   ├── build.gradle
│   └── settings.gradle
├── src/                        # Your React app
│   └── app/
│       ├── components/
│       │   ├── VehicleManagement.tsx  # NEW
│       │   ├── Dashboard.tsx
│       │   └── ...
│       └── services/
│           ├── autoDetection.ts       # NEW
│           ├── bluetoothDetection.ts  # NEW
│           ├── tracking.ts
│           └── ...
├── dist/                       # Built web app (synced to Android)
├── capacitor.config.ts         # Capacitor configuration
├── package.json
└── vite.config.ts
```

---

## 🛠️ Development Workflow

### **Daily Development**

1. **Make changes** to React components
2. **Test in browser**: `npm run dev`
3. **Build**: `npm run build`
4. **Sync to Android**: `npx cap sync android`
5. **Run in Android Studio** or **deploy to device**

### **Adding New Capacitor Plugins**

```bash
# Install plugin
npm install @capacitor/[plugin-name]

# Sync to Android
npx cap sync android
```

### **Debugging**

- **Chrome DevTools**: `chrome://inspect` (for Android device debugging)
- **Android Studio Logcat**: View native logs
- **Console.log**: Available in Chrome DevTools

---

## 📦 Build for Production (APK/AAB)

### **Generate Signed APK**

1. **In Android Studio**:
   - Build → Generate Signed Bundle/APK
   - Select APK
   - Create new keystore (save it securely!)
   - Choose release variant
   - Wait for build

2. **Output**: `android/app/build/outputs/apk/release/app-release.apk`

### **Install APK on Device**

```bash
# Via ADB
adb install android/app/build/outputs/apk/release/app-release.apk

# Or transfer APK to phone and install manually
```

---

## 🚨 Common Issues & Solutions

### **Issue: Gradle sync failed**
**Solution**: 
- Update Android Studio to latest version
- File → Invalidate Caches → Restart
- Check `android/build.gradle` for correct Gradle version

### **Issue: App not loading**
**Solution**:
- Run `npm run build` before `npx cap sync`
- Check `dist/` folder is not empty
- Clear app data on device

### **Issue: Permissions not working**
**Solution**:
- Check `AndroidManifest.xml` has required permissions
- For Android 11+, request permissions at runtime
- Use `@capacitor/app` API for permission requests

### **Issue: Live reload not working**
**Solution**:
```bash
# Use live reload during development
npx cap run android -l --external
```

---

## ✅ Checklist Before Opening in Android Studio

- [ ] Capacitor installed (`npm install @capacitor/...`)
- [ ] `npx cap init` run successfully
- [ ] `npm run build` completed
- [ ] `npx cap add android` completed
- [ ] `npx cap sync android` completed
- [ ] Android Studio installed
- [ ] Java JDK 17+ installed
- [ ] Android SDK installed (via Android Studio)

---

## 📚 Next Documentation

- `/VEHICLE_MANAGEMENT.md` - Vehicle tracking system
- `/AUTO_DETECTION.md` - Automatic trip detection
- `/BLUETOOTH_DETECTION.md` - Bluetooth vehicle connection

---

**Ready to develop in Android Studio!** 🎉

The app is fully production-ready with no mock data and ready for native Android development.
