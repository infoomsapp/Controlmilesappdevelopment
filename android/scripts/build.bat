@echo off
REM ControlMiles - Android Build Helper Script for Windows
REM Usage: build.bat [debug|release|clean|sync|open]

echo ========================================
echo   ControlMiles - Android Builder
echo ========================================
echo.

cd ..\..

if "%1"=="debug" (
    echo Building debug APK...
    call npm run build
    call npx cap sync android
    cd android
    call gradlew.bat assembleDebug
    echo.
    echo Debug APK created!
    echo Location: android\app\build\outputs\apk\debug\app-debug.apk
    goto :end
)

if "%1"=="release" (
    echo Building release APK...
    call npm run build
    call npx cap sync android
    cd android
    call gradlew.bat assembleRelease
    echo.
    echo Release APK created!
    echo Location: android\app\build\outputs\apk\release\app-release.apk
    goto :end
)

if "%1"=="bundle" (
    echo Building app bundle...
    call npm run build
    call npx cap sync android
    cd android
    call gradlew.bat bundleRelease
    echo.
    echo App bundle created!
    echo Location: android\app\build\outputs\bundle\release\app-release.aab
    goto :end
)

if "%1"=="clean" (
    echo Cleaning build files...
    cd android
    call gradlew.bat clean
    rmdir /s /q .gradle 2>nul
    rmdir /s /q build 2>nul
    rmdir /s /q app\build 2>nul
    echo Clean complete!
    goto :end
)

if "%1"=="sync" (
    echo Syncing Capacitor...
    call npm run build
    call npx cap sync android
    echo Sync complete!
    goto :end
)

if "%1"=="open" (
    echo Opening Android Studio...
    call npx cap open android
    goto :end
)

if "%1"=="install" (
    echo Installing debug APK...
    call npm run build
    call npx cap sync android
    cd android
    call gradlew.bat installDebug
    echo App installed!
    goto :end
)

if "%1"=="run" (
    echo Building and running app...
    call npm run build
    call npx cap sync android
    call npx cap run android
    goto :end
)

echo Usage: build.bat [debug^|release^|bundle^|clean^|sync^|open^|install^|run]
echo.
echo Commands:
echo   debug    - Build debug APK
echo   release  - Build release APK (requires signing)
echo   bundle   - Build app bundle for Play Store
echo   clean    - Clean build files
echo   sync     - Sync Capacitor with Android
echo   open     - Open project in Android Studio
echo   install  - Install debug APK to device
echo   run      - Build and run on device/emulator

:end
echo.
echo Done!
