package com.olympusmont.controlmiles;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * TrackingServicePlugin
 * 
 * Capacitor plugin that bridges JavaScript and the native Foreground Service.
 * Allows React app to start/stop tracking and receive location updates.
 */
@CapacitorPlugin(name = "TrackingService")
public class TrackingServicePlugin extends Plugin {
    
    private BroadcastReceiver locationReceiver;
    
    @Override
    public void load() {
        super.load();
        registerLocationReceiver();
    }
    
    /**
     * Start tracking with foreground service
     */
    @PluginMethod
    public void startTracking(PluginCall call) {
        String gigApp = call.getString("gigApp", "Unknown");
        
        Intent serviceIntent = new Intent(getContext(), TrackingForegroundService.class);
        serviceIntent.setAction("START_TRACKING");
        serviceIntent.putExtra("gigApp", gigApp);
        
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            getContext().startForegroundService(serviceIntent);
        } else {
            getContext().startService(serviceIntent);
        }
        
        JSObject result = new JSObject();
        result.put("success", true);
        result.put("message", "Tracking started with foreground service");
        call.resolve(result);
    }
    
    /**
     * Stop tracking and remove foreground service
     */
    @PluginMethod
    public void stopTracking(PluginCall call) {
        Intent serviceIntent = new Intent(getContext(), TrackingForegroundService.class);
        serviceIntent.setAction("STOP_TRACKING");
        getContext().startService(serviceIntent);
        
        JSObject result = new JSObject();
        result.put("success", true);
        result.put("message", "Tracking stopped");
        call.resolve(result);
    }
    
    /**
     * Update stats in notification
     */
    @PluginMethod
    public void updateStats(PluginCall call) {
        double miles = call.getDouble("miles", 0.0);
        
        Intent serviceIntent = new Intent(getContext(), TrackingForegroundService.class);
        serviceIntent.setAction("UPDATE_STATS");
        serviceIntent.putExtra("miles", miles);
        getContext().startService(serviceIntent);
        
        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }
    
    /**
     * Check if tracking is active
     */
    @PluginMethod
    public void isTracking(PluginCall call) {
        // This would require binding to the service
        // For now, we'll let JavaScript manage state
        JSObject result = new JSObject();
        result.put("isTracking", false);
        call.resolve(result);
    }
    
    /**
     * Register broadcast receiver for location updates
     */
    private void registerLocationReceiver() {
        locationReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if ("com.olympusmont.controlmiles.LOCATION_UPDATE".equals(intent.getAction())) {
                    double latitude = intent.getDoubleExtra("latitude", 0.0);
                    double longitude = intent.getDoubleExtra("longitude", 0.0);
                    float accuracy = intent.getFloatExtra("accuracy", 0.0f);
                    float speed = intent.getFloatExtra("speed", 0.0f);
                    long timestamp = intent.getLongExtra("timestamp", 0);
                    double miles = intent.getDoubleExtra("miles", 0.0);
                    double totalMiles = intent.getDoubleExtra("totalMiles", 0.0);
                    
                    JSObject data = new JSObject();
                    data.put("latitude", latitude);
                    data.put("longitude", longitude);
                    data.put("accuracy", accuracy);
                    data.put("speed", speed);
                    data.put("timestamp", timestamp);
                    data.put("miles", miles);
                    data.put("totalMiles", totalMiles);
                    
                    notifyListeners("locationUpdate", data);
                }
            }
        };
        
        IntentFilter filter = new IntentFilter("com.olympusmont.controlmiles.LOCATION_UPDATE");
        getContext().registerReceiver(locationReceiver, filter);
    }
    
    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
        if (locationReceiver != null) {
            getContext().unregisterReceiver(locationReceiver);
        }
    }
}
