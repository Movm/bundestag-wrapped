# iOS App Store Deployment

This document explains how to deploy the iOS app to the App Store via TestFlight.

## Overview

The app uses GitHub Actions to build and optionally deploy to TestFlight. The workflow supports three build types:

| Build Type | Signing | Upload | Use Case |
|------------|---------|--------|----------|
| `development` | Unsigned | Artifact only | CI validation |
| `testflight` | Signed | TestFlight | Beta testing |
| `app-store` | Signed | Artifact only | Manual App Store submission |

## Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

### Code Signing Secrets

| Secret | Description |
|--------|-------------|
| `BUILD_CERTIFICATE_BASE64` | Base64-encoded .p12 distribution certificate |
| `P12_PASSWORD` | Password for the .p12 certificate |
| `BUILD_PROVISION_PROFILE_BASE64` | Base64-encoded .mobileprovision file |
| `KEYCHAIN_PASSWORD` | Any password (used for temporary keychain) |
| `APPLE_TEAM_ID` | Your Apple Developer Team ID |

### App Store Connect API Secrets (for TestFlight upload)

| Secret | Description |
|--------|-------------|
| `APP_STORE_CONNECT_API_KEY_ID` | API Key ID from App Store Connect |
| `APP_STORE_CONNECT_API_ISSUER_ID` | Issuer ID from App Store Connect |
| `APP_STORE_CONNECT_API_KEY_BASE64` | Base64-encoded .p8 API key file |

## Setting Up Secrets

### 1. Export Distribution Certificate

In **Keychain Access** on macOS:

1. Find your "Apple Distribution" certificate
2. Right-click → Export → Save as .p12 with a password
3. Encode it:
   ```bash
   base64 -i certificate.p12 | tr -d '\n'
   ```
4. Save as `BUILD_CERTIFICATE_BASE64`, password as `P12_PASSWORD`

### 2. Download Provisioning Profile

In [Apple Developer Portal](https://developer.apple.com/account/resources/profiles/list):

1. Create/download an App Store distribution profile for `de.bundestag.wrapped`
2. Encode it:
   ```bash
   base64 -i profile.mobileprovision | tr -d '\n'
   ```
3. Save as `BUILD_PROVISION_PROFILE_BASE64`

### 3. Get Team ID

Find your Team ID at [Apple Developer Membership](https://developer.apple.com/account/#/membership) → Team ID

### 4. Create App Store Connect API Key

In [App Store Connect → Users and Access → Keys](https://appstoreconnect.apple.com/access/api):

1. Click **+** to create a new key
2. Name: `GitHub Actions`
3. Access: `App Manager` or `Developer`
4. Download the .p8 file (only available once!)
5. Note the **Key ID** and **Issuer ID** shown on the page
6. Encode the key:
   ```bash
   base64 -i AuthKey_XXXXXXXXXX.p8 | tr -d '\n'
   ```

## Deploying

### Via GitHub Actions UI

1. Go to **Actions** → **iOS Build**
2. Click **Run workflow**
3. Select build type:
   - `development` - Unsigned build (CI only)
   - `testflight` - Build and upload to TestFlight
   - `app-store` - Signed build, manual upload

### Via CLI

```bash
# TestFlight deployment
gh workflow run "iOS Build" -f build_type=testflight

# Development build only
gh workflow run "iOS Build" -f build_type=development
```

### Automatic Builds

The workflow runs automatically on:
- Push to `main` (development build)
- Pull requests to `main` (development build)

When these paths change:
- `src/**`
- `public/**`
- `ios/**`
- `package*.json`
- `capacitor.config.ts`

## Workflow File

Located at `.github/workflows/ios.yml`

## Versioning

iOS versioning is managed in Xcode:
- **Version** (CFBundleShortVersionString): Marketing version (e.g., 1.0.0)
- **Build** (CFBundleVersion): Build number (must increment for each upload)

To update, edit `ios/App/App/Info.plist` or use Xcode.

## Troubleshooting

### "No signing certificate found"

Ensure `BUILD_CERTIFICATE_BASE64` is correctly encoded and `P12_PASSWORD` matches.

### "Provisioning profile doesn't match"

The provisioning profile must:
- Be for App Store distribution
- Match the bundle ID `de.bundestag.wrapped`
- Include the distribution certificate

### "Unable to upload to App Store Connect"

Verify API key secrets:
- `APP_STORE_CONNECT_API_KEY_ID` matches the Key ID
- `APP_STORE_CONNECT_API_ISSUER_ID` matches the Issuer ID
- `APP_STORE_CONNECT_API_KEY_BASE64` is the full .p8 file, base64 encoded

### Build number already exists

Increment the build number in `ios/App/App/Info.plist`:
```xml
<key>CFBundleVersion</key>
<string>2</string>  <!-- Increment this -->
```

## Manual App Store Submission

For `app-store` builds:

1. Download the IPA artifact from the workflow run
2. Open **Transporter** app on macOS
3. Drag the IPA file into Transporter
4. Click **Deliver**
