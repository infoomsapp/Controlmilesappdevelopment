package com.olympusmont.controlmiles;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.location.Location;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.os.Looper;
import androidx.core.app.NotificationCompat;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;

/**
 * TrackingForegroundService
 * 
 * A Foreground Service that keeps the app alive while tracking GPS location.
 * This prevents Android from killing the app in the background and ensures
 * continuous tracking even when the user navigates away or switches apps.
 * 
 * Features:
 * - Persistent notification (required for foreground services)
 * - Continuous GPS tracking
 * - Survives app backgrounding
 * - Survives navigation within app
 * - Broadcasts location updates to WebView
 */
public class TrackingForegroundService extends Service {
    
    private static final String CHANNEL_ID = "ControlMilesTrackingChannel";
    private static final int NOTIFICATION_ID = 1001;
    private static final String ACTION_START_TRACKING = "START_TRACKING";
    private static final String ACTION_STOP_TRACKING = "STOP_TRACKING";
    private static final String ACTION_UPDATE_STATS = "UPDATE_STATS";
    
    // Location tracking
    private FusedLocationProviderClient fusedLocationClient;
    private LocationCallback locationCallback;
    private boolean isTracking = false;
    
    // Tracking stats
    private double totalMiles = 0.0;
    private Location lastLocation = null;
    private String gigApp = "Unknown";
    
    // Binder for local binding
    private final IBinder binder = new LocalBinder();
    
    public class LocalBinder extends Binder {
        TrackingForegroundService getService() {
            return TrackingForegroundService.this;
        }
    }
    
    @Override
    public void onCreate() {
        super.onCreate();
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        createNotificationChannel();
    }
    
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String action = intent.getAction();
            
            if (ACTION_START_TRACKING.equals(action)) {
                String app = intent.getStringExtra("gigApp");
                if (app != null) {
                    gigApp = app;
                }
                startTracking();
            } else if (ACTION_STOP_TRACKING.equals(action)) {
                stopTracking();
            } else if (ACTION_UPDATE_STATS.equals(action)) {
                double miles = intent.getDoubleExtra("miles", 0.0);
                totalMiles = miles;
                updateNotification();
            }
        }
        
        // START_STICKY ensures service restarts if killed by system
        return START_STICKY;
    }
    
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }
    
    /**
     * Start GPS tracking and move service to foreground
     */
    private void startTracking() {
        if (isTracking) {
            return;
        }
        
        isTracking = true;
        totalMiles = 0.0;
        lastLocation = null;
        
        // Start foreground service with notification
        startForeground(NOTIFICATION_ID, createNotification());
        
        // Create location request
        LocationRequest locationRequest = new LocationRequest.Builder(
                Priority.PRIORITY_HIGH_ACCURACY,
                15000 // 15 seconds
            )
            .setMinUpdateIntervalMillis(10000) // 10 seconds minimum
            .setMaxUpdateDelayMillis(30000) // 30 seconds maximum
            .build();
        
        // Create location callback
        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) {
                    return;
                }
                
                for (Location location : locationResult.getLocations()) {
                    handleLocationUpdate(location);
                }
            }
        };
        
        // Start location updates
        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                Looper.getMainLooper()
            );
        } catch (SecurityException e) {
            e.printStackTrace();
            stopTracking();
        }
    }
    
    /**
     * Stop GPS tracking and remove foreground status
     */
    private void stopTracking() {
        if (!isTracking) {
            return;
        }
        
        isTracking = false;
        
        // Stop location updates
        if (fusedLocationClient != null && locationCallback != null) {
            fusedLocationClient.removeLocationUpdates(locationCallback);
        }
        
        // Stop foreground service
        stopForeground(true);
        stopSelf();
    }
    
    /**
     * Handle new location update
     */
    private void handleLocationUpdate(Location location) {
        if (location == null) {
            return;
        }
        
        // Calculate distance if we have a previous location
        if (lastLocation != null) {
            float distance = lastLocation.distanceTo(location); // meters
            double miles = distance * 0.000621371; // Convert to miles
            totalMiles += miles;
            
            // Update notification with new stats
            updateNotification();
            
            // Broadcast location update to WebView
            broadcastLocationUpdate(location, miles);
        }
        
        lastLocation = location;
    }
    
    /**
     * Broadcast location update to JavaScript via Bridge
     */
    private void broadcastLocationUpdate(Location location, double miles) {
        Intent intent = new Intent("com.olympusmont.controlmiles.LOCATION_UPDATE");
        intent.putExtra("latitude", location.getLatitude());
        intent.putExtra("longitude", location.getLongitude());
        intent.putExtra("accuracy", location.getAccuracy());
        intent.putExtra("speed", location.getSpeed());
        intent.putExtra("timestamp", location.getTime());
        intent.putExtra("miles", miles);
        intent.putExtra("totalMiles", totalMiles);
        sendBroadcast(intent);
    }
    
    /**
     * Create notification channel (required for Android 8.0+)
     */
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "GPS Tracking",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Keeps ControlMiles tracking your mileage in the background");
            channel.setShowBadge(false);
            
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
    
    /**
     * Create foreground notification
     */
    private Notification createNotification() {
        // Intent to open app when notification is tapped
        Intent notificationIntent = new Intent(this, MainActivity.class);
        notificationIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_IMMUTABLE
        );
        
        // Stop tracking action
        Intent stopIntent = new Intent(this, TrackingForegroundService.class);
        stopIntent.setAction(ACTION_STOP_TRACKING);
        PendingIntent stopPendingIntent = PendingIntent.getService(
            this,
            0,
            stopIntent,
            PendingIntent.FLAG_IMMUTABLE
        );
        
        // Build notification
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("🚗 Tracking Active - " + gigApp)
            .setContentText(String.format("Miles: %.2f | Tap to open", totalMiles))
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .addAction(
                android.R.drawable.ic_menu_close_clear_cancel,
                "Stop Tracking",
                stopPendingIntent
            )
            .build();
    }
    
    /**
     * Update notification with current stats
     */
    private void updateNotification() {
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager != null && isTracking) {
            manager.notify(NOTIFICATION_ID, createNotification());
        }
    }
    
    /**
     * Get current tracking status
     */
    public boolean isTracking() {
        return isTracking;
    }
    
    /**
     * Get total miles
     */
    public double getTotalMiles() {
        return totalMiles;
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
        stopTracking();
    }
}
