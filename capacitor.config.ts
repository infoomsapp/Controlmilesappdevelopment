import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.olympusmont.controlmiles',
  appName: 'ControlMiles',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For development with live reload (optional)
    // url: 'http://192.168.1.100:5173',
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3B82F6',
      showSpinner: false,
    },
    Geolocation: {
      permissions: ['location', 'coarseLocation'],
    },
    Camera: {
      permissions: ['camera', 'photos'],
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#3B82F6',
    },
  },
};

export default config;
