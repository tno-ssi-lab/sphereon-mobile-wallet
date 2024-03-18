package com.sphereon.ssi.wallet

import android.os.Build
import android.os.Bundle
import android.os.Handler
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleObserver
import androidx.lifecycle.OnLifecycleEvent
import androidx.lifecycle.ProcessLifecycleOwner
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import expo.modules.ReactActivityDelegateWrapper
import expo.modules.splashscreen.singletons.SplashScreen
import expo.modules.splashscreen.SplashScreenImageResizeMode
import com.sphereon.ssi.wallet.Constants

class MainActivity : ReactActivity() {
    // Adding a handler for the timer to lock the app
    private val backgroundHandler: Handler = Handler()
    private var backgroundRunnable: Runnable? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        // Set the theme to AppTheme BEFORE onCreate to support
        // coloring the background, status bar, and navigation bar.
        // This is required for expo-splash-screen.
        setTheme(R.style.AppTheme)
        super.onCreate(null)
        // SplashScreen.show(...) has to be called after super.onCreate(...)
        SplashScreen.show(this, SplashScreenImageResizeMode.CONTAIN, ReactRootView::class.java, false)

        // initiate background observer
        initBackgroundObserver()
    }

    private fun initBackgroundObserver() {
        backgroundRunnable = object : Runnable() {
            @Override
            fun run() {
                sendAppInBackgroundEvent("appMovingToBackground")
            }
        }

        ProcessLifecycleOwner.get().getLifecycle().addObserver(object : LifecycleObserver() {
            @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
            fun onAppBackgrounded() {
                backgroundHandler.postDelayed(backgroundRunnable, Constants.BACKGROUND_DELAY)
            }

            @OnLifecycleEvent(Lifecycle.Event.ON_START)
            fun onAppForegrounded() {
                backgroundHandler.removeCallbacks(backgroundRunnable)
            }
        })
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "main"

    /**
     * Returns the instance of the [ReactActivityDelegate]. Here we use a util class [ ] which allows you to easily enable Fabric and Concurrent React
     * (aka React 18) with two boolean flags.
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
                object : DefaultReactActivityDelegate(
                        this,
                        mainComponentName,
                        fabricEnabled
                ))
    }

    /**
     * Align the back button behavior with Android S
     * where moving root activities to background instead of finishing activities.
     * @see [](https://developer.android.com/reference/android/app/Activity.onBackPressed
    ) */
    override fun invokeDefaultOnBackPressed() {
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
            if (!moveTaskToBack(false)) {
                // For non-root activities, use the default implementation to finish them.
                super.invokeDefaultOnBackPressed()
            }
            return
        }

        // Use the default back button implementation on Android S
        // because it's doing more than {@link Activity#moveTaskToBack} in fact.
        super.invokeDefaultOnBackPressed()
    }

    private fun sendAppInBackgroundEvent(eventName: String) {
        val reactContext: ReactContext = getReactInstanceManager().getCurrentReactContext()
        if (reactContext != null) {
            val params: WritableMap = Arguments.createMap()
            params.putString("event", eventName)
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit("appStateChange", params)
        }
    }
}
