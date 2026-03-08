# Mobile App Build Guide - Appeal Case Manager

Your app is now ready to be built for iOS and Android app stores!

## App Details
- **App Name:** Appeal Case Manager
- **App ID:** com.debking.appealcasemanager
- **Web app still works:** Yes, nothing changes for browser users

---

## Building for iOS (Apple App Store)

### Requirements:
- Mac computer (required by Apple)
- Xcode installed (free from Mac App Store)
- Apple Developer Account ($99/year) - https://developer.apple.com

### Steps:
1. Download your code from GitHub
2. Open Terminal and navigate to the `frontend` folder
3. Run these commands:
   ```bash
   yarn install
   yarn build
   npx cap sync ios
   npx cap open ios
   ```
4. Xcode will open with your project
5. Sign in with your Apple Developer account
6. Select your device/simulator and click Play to test
7. To publish: Product > Archive > Distribute App

---

## Building for Android (Google Play Store)

### Requirements:
- Any computer (Windows, Mac, or Linux)
- Android Studio installed (free) - https://developer.android.com/studio
- Google Play Developer Account ($25 one-time) - https://play.google.com/console

### Steps:
1. Download your code from GitHub
2. Open Terminal and navigate to the `frontend` folder
3. Run these commands:
   ```bash
   yarn install
   yarn build
   npx cap sync android
   npx cap open android
   ```
4. Android Studio will open with your project
5. Click the green Play button to test on emulator/device
6. To publish: Build > Generate Signed Bundle/APK

---

## Updating Your Mobile Apps

Whenever you update your web app:
1. Run `yarn build` in the frontend folder
2. Run `npx cap sync` to update both iOS and Android
3. Rebuild and republish to the app stores

---

## App Store Assets Needed

### For Apple App Store:
- App icon: 1024x1024 PNG (no transparency)
- Screenshots: iPhone and iPad sizes
- App description, keywords, privacy policy URL

### For Google Play:
- App icon: 512x512 PNG
- Feature graphic: 1024x500 PNG  
- Screenshots: Phone and tablet sizes
- App description, privacy policy URL

---

## File Locations

- iOS project: `/frontend/ios/`
- Android project: `/frontend/android/`
- Capacitor config: `/frontend/capacitor.config.json`

---

## Need Help?

The mobile builds use the exact same code as your website. Any changes you make to the web app will appear in the mobile apps after running `npx cap sync`.
