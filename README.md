# 🚗 ControlMiles - Mileage & Income Tracker for Gig Drivers

> Offline-first, encrypted, and IRS audit-ready mileage tracking application for gig economy drivers.

## 🌟 Features

### ✅ **Core Functionality**
- 📍 **Real-time GPS Tracking** - Track your driving miles automatically
- 📸 **Odometer Photo Evidence** - Camera-only capture (no file upload) for IRS compliance
- 💰 **Income Tracking** - Log earnings and calculate deductions
- 🔒 **Immutable Records** - Protected mileage with auditable correction system
- 📊 **IRS-Ready Reports** - Export to PDF, CSV, and JSON
- 🌐 **Offline-First** - Works without internet connection
- 🔐 **Encrypted Data** - SHA-256 hashing for data integrity

### 🚀 **Gig App Support**
- 🚗 **Uber**
- 🚙 **Lyft** 
- 🍔 **DoorDash**
- 🍕 **UberEats**
- 🥡 **Grubhub**
- 🛒 **Instacart**
- 📦 **Postmates**
- 💪 **Empower**
- 📦 **Amazon Flex**
- 🚕 **Taxi** (with app detection)
- 🚶‍♂️ **Personal Commute** (for employees using personal vehicle)

### 🌍 **7 Languages Supported**
- 🇺🇸 English (Default)
- 🇪🇸 Español
- 🇨🇳 中文 (Chinese)
- 🇪🇹 አማርኛ (Amharic/Ethiopian)
- 🇸🇦 العربية (Arabic)
- 🇫🇷 Français
- 🇧🇷 Português

### 🔐 **Required Permissions**
- 📍 **Location/GPS** - Track mileage automatically
- 💪 **Physical Activity & Motion** - Detect when driving
- 📷 **Camera** - Capture odometer photos for IRS evidence

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### First Time Setup

1. **Open the app** - Navigate to `http://localhost:5173`
2. **Grant permissions** - Allow location, camera, and motion access
3. **Select language** - Choose from 7 available languages (top-right corner)
4. **Capture odometer photo** - Take a photo of your starting odometer reading
5. **Select gig app** - Choose which app you're working with
6. **Start tracking** - Begin GPS tracking for your shift

## 📱 Workflow

### Daily Routine:

1. **Morning:**
   - Open ControlMiles
   - Capture starting odometer photo
   - Select active gig app (Uber, DoorDash, etc.)
   - Start GPS tracking

2. **During Shift:**
   - App runs in background
   - Automatically logs GPS coordinates
   - Calculates miles in real-time

3. **End of Shift:**
   - Stop tracking
   - Log daily income
   - Review mileage and deductions

4. **Weekly/Monthly:**
   - View history in Ledger
   - Export reports for tax season
   - Apply corrections if needed (with documentation)

## 🔧 Mileage Correction System

### How It Works:

- ✅ **Original miles are IMMUTABLE** - Never directly edited
- ✅ **Apply corrections separately** - Adjustment system with mandatory reason
- ✅ **Complete audit trail** - Every correction is logged with timestamp
- ✅ **IRS-compliant** - Transparent documentation for audits

### Applying a Correction:

1. Click "Apply Correction" button
2. Enter adjustment value (+/- miles)
3. Provide detailed reason (min. 10 characters)
4. System logs:
   - Original miles
   - Adjustment amount
   - Reason
   - Timestamp
   - Previous/new values

**Example:**
```
Original Miles: 52.3 (PROTECTED)
Correction: +3.2 miles
Reason: "GPS error in Lincoln Tunnel. Route verified via Google Maps Timeline."
Final Miles: 55.5
```

## 🌐 Deployment (For Testing with Real Drivers)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment guide.

### Recommended: Netlify (Easiest)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

Your app will be live at: `https://controlmiles.netlify.app`

### Other Options:
- **Vercel** - Best performance
- **GitHub Pages** - 100% free
- **Firebase Hosting** - Google infrastructure

## 📱 Install as PWA (Progressive Web App)

### iOS (Safari):
1. Open app URL in Safari
2. Tap Share button
3. "Add to Home Screen"
4. App works offline!

### Android (Chrome):
1. Open app URL in Chrome
2. Tap menu (three dots)
3. "Add to Home screen"
4. App installs like native app!

## 🔒 Privacy & Security

### Data Storage:
- ✅ **100% Local** - All data stored in browser localStorage
- ✅ **No Server** - No data sent to external servers
- ✅ **Encrypted** - SHA-256 hashing for integrity
- ✅ **Private** - Your data stays on your device

### Important:
- Not designed for collecting PII (Personally Identifiable Information)
- Not for securing highly sensitive data
- Designed for IRS tax compliance only

## 📊 Export & Reports

### Available Formats:
- **PDF** - Professional IRS-ready reports
- **CSV** - Import into Excel/Google Sheets
- **JSON** - Complete data backup

### What's Included:
- Daily mileage logs
- GPS coordinates & timestamps
- Income records
- Odometer photos
- Correction history
- SHA-256 integrity hashes

## 🧪 Testing Checklist

Before deploying to drivers:

- [ ] Test GPS tracking accuracy
- [ ] Verify camera capture works
- [ ] Test offline functionality
- [ ] Check permission requests (iOS & Android)
- [ ] Test all gig app selections
- [ ] Verify correction system
- [ ] Test language switching
- [ ] Export reports in all formats
- [ ] Test on multiple devices
- [ ] Verify PWA installation

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Storage:** localStorage (IndexedDB planned)
- **Geolocation:** Navigator API
- **Camera:** MediaDevices API
- **Encryption:** Web Crypto API (SHA-256)

## 📄 License

MIT License - Feel free to use and modify for your needs.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide

---

**Built for gig drivers, by developers who care about your tax compliance** 🚗💼
