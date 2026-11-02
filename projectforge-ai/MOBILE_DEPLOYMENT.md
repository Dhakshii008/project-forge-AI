# ProjectForge AI — Mobile Deployment & Release Guide

## 1. Release Configuration

- **Application Name**: ProjectForge AI
- **Android Package Identifier**: `ai.projectforge.app`
- **Scheme**: `projectforge://`
- **Expo SDK Version**: 51.0.38
- **React Native Version**: 0.74.5
- **Version Code**: 1
- **Version**: 1.0.0
- **EAS Project ID**: `7d440d7f-5331-4c93-abe7-640f0e09a0fe`
- **Expo Account Owner**: `monishhhh`

---

## 2. Generating Standalone Android APK

To generate a standalone development or preview APK via Expo Application Services (EAS):

```bash
cd mobile

# 1. Verify TypeScript types
npx tsc --noEmit

# 2. Run mobile test suite
npm run test

# 3. Trigger EAS Cloud Build for Android APK
eas build --platform android --profile preview
```

The completed build will output a direct download link on [expo.dev](https://expo.dev/accounts/monishhhh/projects/projectforge-ai/builds) where the `.apk` file can be downloaded directly onto any physical Android device or emulator.

---

## 3. Generating Production Google Play AAB (App Bundle)

To produce the production Android App Bundle (`.aab`) ready for Google Play Store submission:

```bash
cd mobile
eas build --platform android --profile production-aab
```

---

## 4. Running Locally with Expo Go

To run and test instantly on your physical phone with the Expo Go app:

```bash
cd mobile
npx expo start --lan
```

Scan the QR code with the Expo Go app on Android. Ensure your mobile device is connected to the same Wi-Fi network (`192.168.1.4:5000`).

---

## 5. Environment Variables & Network Configuration

The mobile application automatically detects network state and connects to the backend API:
- Default LAN Base: `http://192.168.1.4:5000/api`
- Production Cloud Base: `https://api.projectforge.ai/api`
- In-App Setting: On the login or settings screen, tap **Change Endpoint URL** to point the device to any custom backend server.
