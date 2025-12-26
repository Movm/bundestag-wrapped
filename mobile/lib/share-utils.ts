/**
 * Shared utilities for image sharing and downloading
 * Uses modern Expo SDK 54 FileSystem API (File, Directory, Paths)
 */

import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

// API base URL for OG image generation
export const OG_API_URL = process.env.EXPO_PUBLIC_OG_API_URL || 'https://bundestag-wrapped.de';

/**
 * Generate URL for quiz result sharepic
 */
export function getQuizImageUrl(score: number, total: number, name?: string): string {
  const params = new URLSearchParams({
    score: String(score),
    total: String(total),
  });
  if (name?.trim()) {
    params.set('name', name.trim());
  }
  return `${OG_API_URL}/api/og/quiz?${params}`;
}

/**
 * Generate URL for speaker sharepic
 */
export function getSpeakerImageUrl(slug: string): string {
  return `${OG_API_URL}/api/og/speaker/${slug}`;
}

/**
 * Convert name to URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[äöü]/g, (m) => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[m] || m))
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Generate cache filename for quiz images
 */
export function getQuizCacheFilename(score: number, total: number, name?: string): string {
  const slug = name?.trim() ? slugify(name) : 'anon';
  return `bundestag-wrapped-quiz-${score}-${total}-${slug}.png`;
}

/**
 * Generate cache filename for speaker images
 */
export function getSpeakerCacheFilename(slug: string): string {
  return `bundestag-wrapped-${slug}.png`;
}

/**
 * Download image from URL and cache locally
 * Uses modern Expo SDK 54 File API
 * Returns the local URI of the cached image
 */
export async function downloadAndCacheImage(
  url: string,
  filename: string
): Promise<string> {
  const file = new File(Paths.cache, filename);

  // Check if already cached
  if (file.exists) {
    return file.uri;
  }

  // Download the image using the static method
  const downloaded = await File.downloadFileAsync(url, file);
  return downloaded.uri;
}

/**
 * Share an image using the native share dialog
 */
export async function shareImage(uri: string, dialogTitle: string): Promise<boolean> {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    Alert.alert('Teilen nicht verfügbar', 'Teilen wird auf diesem Gerät nicht unterstützt.');
    return false;
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    dialogTitle,
  });

  return true;
}

/**
 * Save an image to the device's media library (photo gallery)
 */
export async function saveToGallery(uri: string): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Berechtigung erforderlich',
      'Bitte erlaube den Zugriff auf deine Fotos, um das Bild zu speichern.'
    );
    return false;
  }

  try {
    await MediaLibrary.saveToLibraryAsync(uri);
    Alert.alert('Gespeichert!', 'Das Bild wurde in deiner Galerie gespeichert.');
    return true;
  } catch (error) {
    console.error('Failed to save to gallery:', error);
    Alert.alert('Fehler', 'Das Bild konnte nicht gespeichert werden.');
    return false;
  }
}
