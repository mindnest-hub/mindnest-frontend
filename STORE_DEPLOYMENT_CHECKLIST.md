# 📲 MindNest Store Deployment Checklist

Follow these steps to generate production-ready builds for the Apple App Store and Google Play Store.

## 1. 🏗️ Build & Sync
Prepare the web assets and sync them with the native projects.
- [ ] Run `npm run build` in the `african-edu-app` directory.
- [ ] Run `npx cap sync` to copy build assets into `ios/` and `android/`.

## 2. 🍏 iOS Deployment (Xcode)
Open the iOS project: `npx cap open ios`
- [ ] **Signing & Capabilities**: Select your Development Team and ensure "Automatically manage signing" is checked.
- [ ] **Bundle Identifier**: Verify it matches `com.mindnest.app` (or your chosen ID).
- [ ] **Version & Build**: Set Version (e.g., 1.0.0) and increment Build number for every submission.
- [ ] **App Icon**: Ensure all icons are generated in `AppIcon` in `Assets.xcassets`.
- [ ] **Privacy Keys**: Ensure `Info.plist` has descriptions for any used permissions (Camera, Location, etc. - though not currently used, standard for stores).
- [ ] **Archive**: Select "Any iOS Device (arm64)" and go to `Product > Archive` to build the `.ipa`.

## 🤖 Android Deployment (Android Studio)
Open the Android project: `npx cap open android`
- [ ] **Build.gradle**: Verify `applicationId`, `versionCode`, and `versionName` in `app/build.gradle`.
- [ ] **KeyStore**: Generate a `.jks` file for signing (`Build > Generate Signed Bundle / APK`). **KEEP THIS FILE SAFE!**
- [ ] **App Icon**: Use the Image Asset studio to generate adaptive icons.
- [ ] **Permissions**: Check `AndroidManifest.xml` for unnecessary permissions.
- [ ] **Build Bundle**: Select `Build > Generate Signed Bundle / APK > Android App Bundle (.aab)` for Play Store submission.

## 🔐 Production Environment (Critical)
Before the final build, ensure the following are correct in your code:
- [ ] `VITE_API_URL`: Points to your production backend (e.g., `https://mindnest-api.onrender.com`).
- [ ] **SSL**: Your backend MUST be on HTTPS.
- [ ] **Paystack**: Ensure you are using **Live Secret/Public Keys** in the backend and frontend.
- [ ] **OpenAI**: Ensure the Supabase Edge Function has the **Production API Key**.

---
> [!TIP]
> Use `npx @capacitor/assets generate` to automatically create all required icon and splash screen sizes from a single source image.
