
# SmartCashTrack - Crash Fix Guide

## Issue
The app was crashing on iOS with a TurboModule exception during startup.

## Root Cause
The crash was caused by enabling the React Native New Architecture (`newArchEnabled: true`) which has compatibility issues with some dependencies, particularly:
- `react-native-reanimated`
- `react-native-worklets`
- `expo-glass-effect`

## Changes Made

### 1. Disabled New Architecture
**File: `app.json`**
- Changed `"newArchEnabled": true` to `"newArchEnabled": false`
- The New Architecture is still experimental and can cause crashes with certain native modules

### 2. Fixed Babel Plugin Order
**File: `babel.config.js`**
- Moved `react-native-reanimated/plugin` to the end of the plugins array
- Removed `react-native-worklets/plugin` as it conflicts with reanimated
- This is critical because reanimated's plugin must be the last plugin

### 3. Enhanced Metro Configuration
**File: `metro.config.js`**
- Added proper resolver configuration for better module resolution
- Added transformer configuration with inline requires
- This helps prevent module resolution issues

### 4. Added Error Boundaries
**File: `components/ErrorBoundary.tsx`**
- Created a new ErrorBoundary component to catch and display errors gracefully
- Prevents the entire app from crashing when errors occur

**File: `app/_layout.tsx`**
- Wrapped the app with ErrorBoundary
- Added error handling for font loading
- Added proper error logging

### 5. Improved Supabase Client
**File: `app/integrations/supabase/client.ts`**
- Added try-catch around client initialization
- Better error logging

## Next Steps

### 1. Clean Build (REQUIRED)
You MUST perform a clean build for these changes to take effect:

```bash
# Delete build artifacts
rm -rf node_modules
rm -rf ios
rm -rf android
rm -rf .expo
rm package-lock.json  # or yarn.lock if using yarn

# Reinstall dependencies
npm install  # or yarn install

# Regenerate native projects
npx expo prebuild --clean

# Start fresh
npx expo start --clear
```

### 2. Test on Device
After the clean build:
1. Run the app on your physical iOS device
2. Check the console for any error messages
3. Test all tabs and navigation

### 3. If Still Crashing

If the app still crashes after the clean build, try these additional steps:

#### Option A: Update react-native-reanimated
```bash
npm install react-native-reanimated@latest
npx expo prebuild --clean
```

#### Option B: Temporarily Disable Reanimated
If you're not using animations heavily, you can temporarily disable reanimated:

1. Comment out the reanimated plugin in `babel.config.js`:
```javascript
// "react-native-reanimated/plugin",
```

2. Remove the import from `app/_layout.tsx`:
```javascript
// import "react-native-reanimated";
```

#### Option C: Check for Conflicting Dependencies
Run this command to check for dependency conflicts:
```bash
npm ls react-native-reanimated
npm ls react-native-worklets
```

### 4. Enable Detailed Logging

To get more information about crashes, you can:

1. Check iOS device logs:
   - Open Xcode
   - Go to Window > Devices and Simulators
   - Select your device
   - Click "Open Console"
   - Run the app and look for crash logs

2. Enable React Native debugging:
   - Shake your device
   - Enable "Debug JS Remotely" or "Open Debugger"
   - Check the browser console for errors

## Common Issues and Solutions

### Issue: "Cannot find module 'react-native-reanimated'"
**Solution:** Run `npm install` and `npx expo prebuild --clean`

### Issue: "Invariant Violation: TurboModuleRegistry.getEnforcing"
**Solution:** This is fixed by disabling the New Architecture. Make sure you've done a clean build.

### Issue: App crashes immediately on launch
**Solution:** 
1. Check that all native dependencies are properly linked
2. Ensure you've run `npx expo prebuild --clean`
3. Try deleting the app from your device and reinstalling

### Issue: "Hermes engine error"
**Solution:** Hermes is enabled by default in Expo. The fixes above should resolve Hermes-related issues.

## Prevention

To avoid similar issues in the future:

1. **Always test on physical devices** after enabling experimental features like New Architecture
2. **Keep dependencies updated** but test thoroughly after updates
3. **Use Error Boundaries** to prevent full app crashes
4. **Monitor console logs** for warnings that might indicate future issues
5. **Perform clean builds** after major configuration changes

## Support

If you continue to experience issues:
1. Check the console logs for specific error messages
2. Look for the exact line where the crash occurs
3. Check if any specific native module is mentioned in the crash log
4. Consider temporarily removing recently added dependencies to isolate the issue

## References

- [React Native New Architecture](https://reactnative.dev/docs/new-architecture-intro)
- [React Native Reanimated Installation](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation)
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)
- [Metro Bundler Configuration](https://docs.expo.dev/guides/customizing-metro/)
