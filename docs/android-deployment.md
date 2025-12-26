# Android Play Store Deployment

This document explains how to deploy the Android app to the Google Play Store.

## Overview

The app uses GitHub Actions to automatically build and deploy to the Play Store. The workflow handles:

1. Building web assets (`npm run build`)
2. Syncing to Android (`npx cap sync android`)
3. Building a signed AAB (Android App Bundle)
4. Uploading to Play Store

## Versioning Strategy

| Environment | Version Code | Source |
|-------------|--------------|--------|
| CI (GitHub Actions) | `GITHUB_RUN_NUMBER + 100` | Unique per workflow run |
| Local builds | `git commit count + 1` | For testing only |

The +100 offset ensures CI builds always have higher version codes than local builds.

**Version name** is read from `package.json` (e.g., `1.0.0`).

## Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded keystore file |
| `KEYSTORE_PASSWORD` | Keystore password |
| `KEY_PASSWORD` | Key password |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | Google Play API service account JSON |

### Generating the keystore secret

```bash
base64 -w 0 android/app/bundestag-wrapped-release.keystore
```

### Setting up the Play Store service account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Google Play Android Developer API**
3. Create a **Service Account** (APIs & Services → Credentials)
4. Download the JSON key
5. In [Play Console](https://play.google.com/console) → Users and permissions → Invite the service account email with **Release manager** permissions
6. Paste the entire JSON file as the `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` secret

## Deploying

### Via GitHub Actions (recommended)

1. Go to **Actions** → **Android Build & Deploy**
2. Click **Run workflow**
3. Select track:
   - `internal` - Internal testing (immediate)
   - `alpha` - Closed testing
   - `beta` - Open testing
   - `production` - Public release

### Via CLI

```bash
gh workflow run "Android Build & Deploy" -f track=production
```

### Automatic builds

The workflow also runs on push to `main` when these paths change:
- `src/**`
- `public/**`
- `android/**`
- `package*.json`
- `capacitor.config.ts`

Push builds create a debug APK (not uploaded to Play Store).

## Workflow File

Located at `.github/workflows/android.yml`

## Troubleshooting

### "Version code already used"

Each Play Store upload requires a unique version code. The workflow uses `GITHUB_RUN_NUMBER + 100` to ensure uniqueness. If you see this error, simply re-run the workflow.

### "Failed to read keystore"

The `ANDROID_KEYSTORE_BASE64` secret may have formatting issues. Regenerate it:

```bash
base64 -w 0 android/app/bundestag-wrapped-release.keystore
```

Ensure no newlines or spaces are included when pasting.

### Service account permissions

If upload fails with permission errors, verify in Play Console that the service account has **Release manager** access to the app.
