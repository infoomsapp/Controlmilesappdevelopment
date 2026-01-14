# ControlMiles - Android App Configuration

## 📦 Quick Start

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or newer
- JDK 17
- Android SDK 34
- Gradle 8.2+

### Setup Steps

1. **Install dependencies**
   ```bash
   cd ..
   npm install
   ```

2. **Build web assets**
   ```bash
   npm run build
   ```

3. **Sync Capacitor**
   ```bash
   npx cap sync android
   ```

4. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

5. **Run the app**
   - Click the "Run" button (▶️) in Android Studio
   - Or use command line: `./gradlew installDebug`

---

## 🔐 Permissions Explained

### Critical Permissions for IRS Compliance

| Permission | Purpose | IRS Requirement |
|-----------|---------|-----------------|
| `ACCESS_FINE_LOCATION` | GPS tracking | ✅ Required - Accurate mileage |
| `ACCESS_BACKGROUND_LOCATION` | Track while driving | ✅ Required - Continuous tracking |
| `CAMERA` | Odometer photos | ✅ Required - Audit evidence |
| `ACTIVITY_RECOGNITION` | Detect driving | ⚠️ Important - Auto-start trips |
| `BLUETOOTH_SCAN/CONNECT` | Vehicle detection | ⚠️ Important - Auto trip detection |
| `POST_NOTIFICATIONS` | Trip alerts | ℹ️ Recommended - User awareness |

---

## 🏗️ Build Variants

### Debug Build
```bash
./gradlew assembleDebug
```
Output: `app/build/outputs/apk/debug/app-debug.apk`

### Release Build
```bash
./gradlew assembleRelease
```
Output: `app/build/outputs/apk/release/app-release.apk`

**Note**: Release builds require a signing key (see Signing section)

---

## 🔑 App Signing (Production)

### Generate Keystore
```bash
keytool -genkey -v -keystore controlmiles-release.jks \
  -alias controlmiles \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### Configure Signing
1. Create `keystore.properties` in `/android/` folder:
   ```properties
   storePassword=YOUR_STORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=controlmiles
   storeFile=controlmiles-release.jks
   ```

2. Update `app/build.gradle` (already configured)

3. Build signed APK:
   ```bash
   ./gradlew assembleRelease
   ```

---

## 🧪 Testing

### Run Unit Tests
```bash
./gradlew test
```

### Run Instrumented Tests
```bash
./gradlew connectedAndroidTest
```

### Manual Testing Checklist
- [ ] GPS tracking works
- [ ] Background location tracking
- [ ] Camera captures odometer
- [ ] Bluetooth detects vehicle
- [ ] Notifications appear
- [ ] App survives background kill
- [ ] Data persists offline
- [ ] Export generates CSV/PDF

---

## 📱 Supported Android Versions

| Version | API Level | Support |
|---------|-----------|---------|
| Android 14 | 34 | ✅ Full |
| Android 13 | 33 | ✅ Full |
| Android 12/12L | 31-32 | ✅ Full |
| Android 11 | 30 | ✅ Full |
| Android 10 | 29 | ✅ Full |
| Android 9 | 28 | ✅ Full |
| Android 8/8.1 | 26-27 | ✅ Full |
| Android 7/7.1 | 24-25 | ✅ Minimum |
| < Android 7 | < 24 | ❌ Not supported |

---

## 🐛 Troubleshooting

### Common Issues

**1. Gradle sync fails**
```bash
# Clear Gradle cache
./gradlew clean
rm -rf .gradle
rm -rf build
```

**2. Capacitor not synced**
```bash
npx cap sync android
```

**3. Missing dependencies**
```bash
cd ..
npm install
npx cap sync android
```

**4. Android SDK not found**
- Open Android Studio → Tools → SDK Manager
- Install Android SDK 34
- Set ANDROID_SDK_ROOT environment variable

**5. JDK version mismatch**
- Android Studio → File → Project Structure
- Set JDK to version 17

---

## 📊 APK Size Optimization

Current configuration:
- ✅ R8 minification enabled for release
- ✅ ProGuard rules configured
- ✅ Vector drawables used
- ✅ WebP images recommended

Expected APK sizes:
- Debug: ~15-20 MB
- Release: ~8-12 MB (after minification)

---

## 🚀 Deployment

### Google Play Console

1. **Create App**
   - Go to Google Play Console
   - Create new application
   - Select "ControlMiles"

2. **Upload APK/Bundle**
   ```bash
   # Build App Bundle (recommended)
   ./gradlew bundleRelease
   ```
   Upload: `app/build/outputs/bundle/release/app-release.aab`

3. **Complete Store Listing**
   - App name: ControlMiles
   - Short description: IRS-compliant mileage tracker
   - Full description: (see marketing docs)
   - Screenshots: Minimum 2 (phone), 1 (tablet)
   - Icon: 512x512 PNG

4. **Data Safety**
   - Location data: YES (for mileage tracking)
   - Personal info: YES (user account)
   - Photos: YES (odometer evidence)
   - Encryption: YES (SHA-256 hashing)
   - Data deletion: Available on request

5. **Content Rating**
   - Complete questionnaire
   - Expected rating: Everyone

6. **Pricing**
   - Free (with potential in-app purchases)

---

## 📄 Required Documentation

Before publishing:
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] Support email
- [ ] App screenshots (2-8 images)
- [ ] Feature graphic (1024x500)
- [ ] App icon (512x512)
- [ ] Data Safety form completed

---

## 🔔 Background Services

### Foreground Service for Location Tracking

The app uses a foreground service to track location in the background:
- Shows persistent notification while tracking
- Prevents system from killing the service
- Complies with Android 12+ restrictions

Implementation in `android/app/src/main/java/`:
```java
// Create ForegroundService class
// Register in AndroidManifest.xml
// Start from Capacitor plugin
```

---

## 🎨 Customization

### Change App Icon
1. Right-click `res` folder
2. New → Image Asset
3. Select "Launcher Icons"
4. Upload your icon (512x512 PNG)
5. Generate all densities

### Change App Name
Edit `res/values/strings.xml`:
```xml
<string name="app_name">ControlMiles</string>
```

### Change Theme Colors
Edit `res/values/colors.xml`:
```xml
<color name="colorPrimary">#2563EB</color>
```

---

## 📞 Support

For Android-specific issues:
- Check Capacitor docs: https://capacitorjs.com/docs/android
- Android developer guide: https://developer.android.com
- StackOverflow: Tag with `capacitor` + `android`

---

## ✅ Pre-Launch Checklist

- [ ] All permissions work correctly
- [ ] GPS tracking accurate
- [ ] Background tracking works
- [ ] Camera captures odometer
- [ ] Bluetooth detects vehicle
- [ ] App doesn't crash
- [ ] Data persists after app restart
- [ ] Export functions work
- [ ] Tested on Android 7, 10, 12, 14
- [ ] Release APK signed
- [ ] Privacy policy created
- [ ] Store listing completed
- [ ] Screenshots uploaded

---

**Ready for Production! 🚀**
