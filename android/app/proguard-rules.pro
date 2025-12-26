# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ===== Capacitor =====
# Keep all Capacitor core classes
-keep class com.getcapacitor.** { *; }

# Keep Capacitor plugin annotations and annotated classes
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * { *; }
-keep @com.getcapacitor.annotation.Permission public class * { *; }

# Keep all classes that extend Capacitor Plugin
-keep class * extends com.getcapacitor.Plugin { *; }

# Keep JavaScript interface methods (critical for WebView bridge)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ===== WebView =====
# Keep WebView and WebViewClient methods
-keepclassmembers class * extends android.webkit.WebView {
    public *;
}

-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String);
    public boolean *(android.webkit.WebView, java.lang.String);
    public void *(android.webkit.WebView, android.graphics.Bitmap);
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
}

-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(android.webkit.WebView, java.lang.String, java.lang.String);
    public boolean *(android.webkit.WebView, java.lang.String);
}

# ===== AndroidX / Support Libraries =====
-keep class androidx.** { *; }
-keep interface androidx.** { *; }

# ===== Debugging =====
# Keep line numbers for better crash reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ===== Serialization =====
# Keep Gson/JSON serialization (if used by plugins)
-keepattributes Signature
-keepattributes *Annotation*
