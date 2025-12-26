# ADB Wireless Debugging mit WSL

## Problem
ADB in WSL hat keinen direkten Zugriff auf Netzwerk-Geräte. Die Lösung: Windows-ADB nutzen.

## Voraussetzungen
- Android-Gerät mit aktiviertem **Wireless Debugging** (Entwickleroptionen)
- Android SDK Platform-Tools in Windows installiert (`C:\Users\<USER>\AppData\Local\Android\Sdk\platform-tools\`)

## Setup (einmalig)

### 1. ADB-Server in Windows starten
```bash
/mnt/c/Users/<USER>/AppData/Local/Android/Sdk/platform-tools/adb.exe kill-server
/mnt/c/Users/<USER>/AppData/Local/Android/Sdk/platform-tools/adb.exe start-server
```

### 2. Gerät pairen (einmalig pro Gerät)
Auf dem Handy: **Entwickleroptionen → Wireless Debugging → Mit Pairing-Code koppeln**

Notiere:
- Pairing IP:Port (z.B. `192.168.0.105:37707`)
- 6-stelliger Code (z.B. `329356`)

```bash
/mnt/c/Users/<USER>/AppData/Local/Android/Sdk/platform-tools/adb.exe pair <IP:PAIRING_PORT> <CODE>
```

### 3. Verbinden
Verbindungs-Port aus Wireless Debugging Hauptbildschirm (nicht Pairing-Port!):

```bash
/mnt/c/Users/<USER>/AppData/Local/Android/Sdk/platform-tools/adb.exe connect <IP:PORT>
```

## Tägliche Nutzung

```bash
# Alias für einfachere Nutzung (in ~/.bashrc)
alias adb='/mnt/c/Users/morit/AppData/Local/Android/Sdk/platform-tools/adb.exe'

# Verbinden (Port ändert sich bei jeder Session!)
adb connect 192.168.0.105:<AKTUELLER_PORT>

# APK installieren
adb install -r pfad/zur/app.apk

# Geräte anzeigen
adb devices
```

## Wichtig
- **Port ändert sich** bei jeder neuen Wireless-Debugging-Session
- **Pairing** muss nur einmal pro Gerät gemacht werden
- Beide Geräte müssen im **selben WLAN** sein
