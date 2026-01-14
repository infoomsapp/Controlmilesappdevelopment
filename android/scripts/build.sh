#!/bin/bash

# ControlMiles - Android Build Helper Script
# Usage: ./scripts/build.sh [debug|release|clean|sync|open]

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ControlMiles - Android Builder    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# Navigate to project root
cd "$(dirname "$0")/../.."

case "$1" in
  debug)
    echo -e "${GREEN}→ Building debug APK...${NC}"
    npm run build
    npx cap sync android
    cd android
    ./gradlew assembleDebug
    echo -e "${GREEN}✓ Debug APK created!${NC}"
    echo -e "${BLUE}Location: android/app/build/outputs/apk/debug/app-debug.apk${NC}"
    ;;
    
  release)
    echo -e "${GREEN}→ Building release APK...${NC}"
    npm run build
    npx cap sync android
    cd android
    ./gradlew assembleRelease
    echo -e "${GREEN}✓ Release APK created!${NC}"
    echo -e "${BLUE}Location: android/app/build/outputs/apk/release/app-release.apk${NC}"
    ;;
    
  bundle)
    echo -e "${GREEN}→ Building app bundle (for Play Store)...${NC}"
    npm run build
    npx cap sync android
    cd android
    ./gradlew bundleRelease
    echo -e "${GREEN}✓ App bundle created!${NC}"
    echo -e "${BLUE}Location: android/app/build/outputs/bundle/release/app-release.aab${NC}"
    ;;
    
  clean)
    echo -e "${GREEN}→ Cleaning build files...${NC}"
    cd android
    ./gradlew clean
    rm -rf .gradle
    rm -rf build
    rm -rf app/build
    echo -e "${GREEN}✓ Clean complete!${NC}"
    ;;
    
  sync)
    echo -e "${GREEN}→ Syncing Capacitor...${NC}"
    npm run build
    npx cap sync android
    echo -e "${GREEN}✓ Sync complete!${NC}"
    ;;
    
  open)
    echo -e "${GREEN}→ Opening Android Studio...${NC}"
    npx cap open android
    ;;
    
  install)
    echo -e "${GREEN}→ Installing debug APK to connected device...${NC}"
    npm run build
    npx cap sync android
    cd android
    ./gradlew installDebug
    echo -e "${GREEN}✓ App installed!${NC}"
    ;;
    
  run)
    echo -e "${GREEN}→ Building and running app...${NC}"
    npm run build
    npx cap sync android
    npx cap run android
    ;;
    
  *)
    echo "Usage: $0 {debug|release|bundle|clean|sync|open|install|run}"
    echo ""
    echo "Commands:"
    echo "  debug    - Build debug APK"
    echo "  release  - Build release APK (requires signing)"
    echo "  bundle   - Build app bundle for Play Store"
    echo "  clean    - Clean build files"
    echo "  sync     - Sync Capacitor with Android"
    echo "  open     - Open project in Android Studio"
    echo "  install  - Install debug APK to device"
    echo "  run      - Build and run on device/emulator"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}Done! 🚀${NC}"
