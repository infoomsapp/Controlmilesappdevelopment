# ControlMiles - Professional Mileage Tracking

**A Software by Olympus Mont Systems LLC**

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-green)
![License](https://img.shields.io/badge/license-Proprietary-red)

</div>

---

## 🚗 Overview

**ControlMiles** is a professional, offline-first, encrypted mileage tracking application designed specifically for gig economy drivers. Built with compliance, security, and ease of use in mind, it provides comprehensive tracking with IRS audit-ready reports.

### Key Features

- ✅ **Offline-First Architecture** - Works without internet connection
- 🔒 **SHA-256 Encryption** - Secure data integrity
- 📊 **IRS Audit-Ready** - Compliant export formats
- 🚙 **Multi-Vehicle Support** - Track different cars independently
- 🤖 **Automatic Detection** - Motion + GPS trip detection
- 📱 **Bluetooth Integration** - Auto-start with car connection
- 📸 **Photo Evidence** - Odometer and trip documentation
- 💰 **Earnings Tracking** - Income per platform
- 🔄 **Immutable Corrections** - Full audit trail

---

## 🎯 New Features

### 1. **Vehicle Management**
- Add multiple vehicles
- Track mileage per vehicle
- Vehicle-specific odometer readings
- Switch between vehicles seamlessly
- Vehicle details (Make, Model, Year, VIN, License Plate)

### 2. **Automatic Trip Detection**
- **Motion Sensor Integration** - Detects driving movement
- **GPS Speed Monitoring** - Tracks vehicle speed
- **Smart Stop Detection** - Distinguishes between traffic lights and trip end
- **Configurable Sensitivity** - Low, Medium, High settings
- **Automatic Mode** - No gig app selection required

### 3. **Bluetooth Vehicle Detection**
- **Auto-Start on Connect** - Trip starts when connected to car Bluetooth
- **Auto-Stop on Disconnect** - Trip ends when Bluetooth disconnects
- **Device Pairing** - Link Bluetooth devices to specific vehicles
- **Background Monitoring** - Works even when app is closed

### 4. **Stop & Traffic Detection**
- Differentiates between temporary stops (traffic lights) and trip end
- Configurable stop time threshold (1-15 minutes)
- Smart acceleration detection
- Prevents false trip endings in traffic

---

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **UI Framework**: Tailwind CSS v4 + Radix UI
- **Mobile**: Capacitor 8
- **State**: localStorage (offline-first)
- **Security**: SHA-256 hashing

### Project Structure

```
controlmiles/
├── src/
│   └── app/
│       ├── components/
│       │   ├── Dashboard.tsx
│       │   ├── VehicleManagement.tsx      # NEW
│       │   ├── AutoDetectionSettings.tsx  # NEW
│       │   ├── Ledger.tsx
│       │   ├── Photos.tsx
│       │   ├── Earnings.tsx
│       │   ├── Export.tsx
│       │   └── Settings.tsx
│       ├── services/
│       │   ├── tracking.ts
│       │   ├── vehicleService.ts          # NEW
│       │   ├── autoDetection.ts           # NEW
│       │   ├── bluetoothDetection.ts      # NEW
│       │   ├── auth.ts
│       │   └── corrections.ts
│       └── types/
│           ├── index.ts
│           └── vehicle.ts                 # NEW
├── android/                               # Android Studio project
├── capacitor.config.ts                    # Capacitor configuration
└── package.json
```

---

## 🚀 Quick Start

### For Android Studio Development

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Build Web App

```bash
npm run build
```

#### 3. Initialize Capacitor (First Time Only)

```bash
npm run cap:init
```

#### 4. Add Android Platform (First Time Only)

```bash
npm run cap:add:android
```

#### 5. Open in Android Studio

```bash
npm run cap:open:android
```

Or use the shortcut:

```bash
npm run android
```

### Development Workflow

#### Make Changes → Build → Sync → Run

```bash
# 1. Make your changes to React components
# 2. Build and sync to Android
npm run cap:sync:android

# 3. Android Studio will detect changes automatically
```

---

## 📱 Android Studio Setup

### Prerequisites

- **Android Studio** (Latest version recommended)
- **Java JDK 17+**
- **Android SDK** (API 33 or higher)
- **Node.js 18+**

### First-Time Setup

1. **Open Project**
   ```bash
   npm run cap:open:android
   ```

2. **Wait for Gradle Sync** (5-10 minutes first time)

3. **Select Device/Emulator**
   - Physical device via USB debugging
   - Android Virtual Device (AVD)

4. **Run App**
   - Click the green "Play" button
   - App will install and launch automatically

### Building APK for Production

1. In Android Studio: **Build → Generate Signed Bundle/APK**
2. Select **APK**
3. Create/use keystore (save securely!)
4. Choose **release** variant
5. Find APK in: `android/app/build/outputs/apk/release/`

---

## 🔧 Configuration

### Capacitor Configuration

File: `/capacitor.config.ts`

```typescript
{
  appId: 'com.olympusmont.controlmiles',
  appName: 'ControlMiles',
  webDir: 'dist',
  plugins: {
    Geolocation: { permissions: ['location', 'coarseLocation'] },
    Camera: { permissions: ['camera', 'photos'] },
    LocalNotifications: { iconColor: '#3B82F6' },
  }
}
```

### Android Permissions

Auto-configured in `AndroidManifest.xml`:

- **GPS**: Background location tracking
- **Camera**: Odometer photos
- **Motion**: Activity detection
- **Bluetooth**: Car connection detection
- **Notifications**: Trip alerts
- **Storage**: Photo storage

---

## 📖 Feature Documentation

### Vehicle Management

**Location**: Settings → Vehicles

- **Add Vehicle**: Click "Add Vehicle" button
- **Edit Vehicle**: Click edit icon on vehicle card
- **Delete Vehicle**: Click delete icon (confirmation required)
- **Set Active**: Click "Set as Active Vehicle" button
- **Pair Bluetooth**: In vehicle details, pair Bluetooth device

**Data Tracked Per Vehicle**:
- Make, Model, Year
- Color, License Plate, VIN
- Initial/Current Odometer
- Total Miles Driven
- Fuel Type
- Paired Bluetooth Device

### Automatic Trip Detection

**Location**: Settings → Auto Detection

**How It Works**:
1. **Motion Sensor** detects acceleration
2. **GPS** monitors speed and movement
3. **Trip starts** when speed > threshold (5-15 mph based on sensitivity)
4. **Trip ends** after stopped for configured time (1-15 minutes)

**Configuration**:
- **Sensitivity**: Low, Medium, High
- **Stop Time**: 1-15 minutes before trip end
- **Automatic Mode**: Start without gig app selection

**Best Practices**:
- Use **Medium** sensitivity for city driving
- Use **Low** sensitivity for highway driving
- Set **5 minutes** stop time to avoid false endings in traffic

### Bluetooth Detection

**Location**: Settings → Vehicles → [Vehicle] → Pair Bluetooth

**Setup**:
1. Enable Bluetooth on your phone
2. Connect to car Bluetooth
3. Open ControlMiles → Vehicles
4. Select vehicle → "Pair Bluetooth Device"
5. Choose your car from the list

**Features**:
- **Auto-Start**: Trip begins when connected
- **Auto-Stop**: Trip ends when disconnected
- **Background**: Works even when app is closed
- **Multi-Vehicle**: Different devices for different cars

---

## 🗺️ Roadmap

### Future Features

- [ ] iOS Support
- [ ] Cloud Backup (optional)
- [ ] AI-powered route suggestions
- [ ] Expense tracking
- [ ] Team/Fleet management
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Widget for quick trip start

---

## 🔐 Security & Privacy

- ✅ **All data stored locally** - No cloud servers
- ✅ **SHA-256 hashing** - Data integrity verification
- ✅ **No analytics** - Complete privacy
- ✅ **No tracking** - Your data stays on your device
- ✅ **Offline-first** - Internet not required
- ✅ **GDPR compliant** - User owns all data

---

## 🛠️ Troubleshooting

### Common Issues

**Issue**: Gradle sync failed  
**Solution**: File → Invalidate Caches → Restart

**Issue**: App not loading  
**Solution**: Run `npm run build` before `npm run cap:sync`

**Issue**: Permissions not working  
**Solution**: Check `AndroidManifest.xml` and request at runtime

**Issue**: GPS not accurate  
**Solution**: Enable "High Accuracy" mode in Android location settings

**Issue**: Bluetooth not detecting  
**Solution**: Grant Bluetooth permission in Android Settings

### Debug Tools

- **Chrome DevTools**: `chrome://inspect` (for web debugging)
- **Android Studio Logcat**: View native logs
- **Console Logs**: Available in Chrome DevTools

---

## 📄 License

**Proprietary License**  
© 2025 Olympus Mont Systems LLC. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 📞 Support

For support, please contact:  
**Olympus Mont Systems LLC**

---

## ✅ Checklist Before Deployment

- [ ] All features implemented
- [ ] No mock data
- [ ] All permissions configured
- [ ] Signed APK generated
- [ ] Tested on physical device
- [ ] GPS tracking verified
- [ ] Bluetooth detection tested
- [ ] Motion sensors working
- [ ] Camera functioning
- [ ] Local storage persistent
- [ ] IRS export format verified

---

**Built with ❤️ by Olympus Mont Systems LLC**

*Professional mileage tracking for the modern gig economy driver*
