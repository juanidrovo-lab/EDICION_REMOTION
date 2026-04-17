/**
 * Presets de plataformas de redes sociales.
 *
 * Cada preset define resolución, fps, duración máxima y zonas
 * seguras (safe zones) donde el contenido no queda tapado por la
 * interfaz de la plataforma (botones, username, descripción, etc.)
 */

export type PlatformId =
  | "tiktok"
  | "reels"          // Instagram Reels / Facebook Reels
  | "stories"        // Instagram Stories / Facebook Stories
  | "youtube_shorts"
  | "instagram_feed_square"
  | "instagram_feed_portrait"
  | "facebook_feed"
  | "meta_ads_horizontal"
  | "meta_ads_square"
  | "meta_ads_vertical";

export interface SafeZone {
  top: number;    // px desde arriba
  bottom: number; // px desde abajo
  left: number;
  right: number;
}

export interface PlatformPreset {
  id: PlatformId;
  name: string;
  width: number;
  height: number;
  fps: number;
  /** Duración máxima en segundos permitida por la plataforma */
  maxDurationSec: number;
  /** Duración recomendada en segundos para mejor rendimiento */
  recommendedDurationSec: number;
  safeZone: SafeZone;
  /** Orientación resultante */
  orientation: "vertical" | "horizontal" | "square";
  /** Notas de la plataforma para el editor */
  notes: string;
}

export const PLATFORMS: Record<PlatformId, PlatformPreset> = {
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    width: 1080,
    height: 1920,
    fps: 30,
    maxDurationSec: 180,
    recommendedDurationSec: 30,
    safeZone: { top: 120, bottom: 380, left: 60, right: 200 },
    orientation: "vertical",
    notes: "Zona inferior bloqueada por botones de interacción y descripción.",
  },
  reels: {
    id: "reels",
    name: "Instagram / Facebook Reels",
    width: 1080,
    height: 1920,
    fps: 30,
    maxDurationSec: 90,
    recommendedDurationSec: 15,
    safeZone: { top: 120, bottom: 320, left: 60, right: 180 },
    orientation: "vertical",
    notes: "Zona derecha bloqueada por iconos. Descripción cubre parte inferior.",
  },
  stories: {
    id: "stories",
    name: "Instagram / Facebook Stories",
    width: 1080,
    height: 1920,
    fps: 30,
    maxDurationSec: 15,
    recommendedDurationSec: 10,
    safeZone: { top: 200, bottom: 300, left: 60, right: 60 },
    orientation: "vertical",
    notes: "Barra de progreso en la parte superior. Botones en la parte inferior.",
  },
  youtube_shorts: {
    id: "youtube_shorts",
    name: "YouTube Shorts",
    width: 1080,
    height: 1920,
    fps: 60,
    maxDurationSec: 60,
    recommendedDurationSec: 30,
    safeZone: { top: 120, bottom: 360, left: 60, right: 200 },
    orientation: "vertical",
    notes: "Zona derecha bloqueada por botones. Barra de progreso abajo.",
  },
  instagram_feed_square: {
    id: "instagram_feed_square",
    name: "Instagram Feed (Cuadrado)",
    width: 1080,
    height: 1080,
    fps: 30,
    maxDurationSec: 60,
    recommendedDurationSec: 15,
    safeZone: { top: 40, bottom: 40, left: 40, right: 40 },
    orientation: "square",
    notes: "Formato cuadrado 1:1. Ideal para feed de Instagram y Facebook.",
  },
  instagram_feed_portrait: {
    id: "instagram_feed_portrait",
    name: "Instagram Feed (Retrato 4:5)",
    width: 1080,
    height: 1350,
    fps: 30,
    maxDurationSec: 60,
    recommendedDurationSec: 15,
    safeZone: { top: 40, bottom: 40, left: 40, right: 40 },
    orientation: "vertical",
    notes: "Formato 4:5. Ocupa más espacio en el feed y genera más engagement.",
  },
  facebook_feed: {
    id: "facebook_feed",
    name: "Facebook Feed",
    width: 1280,
    height: 720,
    fps: 30,
    maxDurationSec: 240,
    recommendedDurationSec: 15,
    safeZone: { top: 40, bottom: 40, left: 40, right: 40 },
    orientation: "horizontal",
    notes: "Formato 16:9. Se reproduce automáticamente sin sonido; usa textos.",
  },
  meta_ads_horizontal: {
    id: "meta_ads_horizontal",
    name: "Meta Ads — Horizontal (16:9)",
    width: 1920,
    height: 1080,
    fps: 30,
    maxDurationSec: 240,
    recommendedDurationSec: 15,
    safeZone: { top: 60, bottom: 60, left: 60, right: 60 },
    orientation: "horizontal",
    notes: "Usar para anuncios en Facebook Feed y YouTube pre-roll.",
  },
  meta_ads_square: {
    id: "meta_ads_square",
    name: "Meta Ads — Cuadrado (1:1)",
    width: 1080,
    height: 1080,
    fps: 30,
    maxDurationSec: 240,
    recommendedDurationSec: 15,
    safeZone: { top: 60, bottom: 60, left: 60, right: 60 },
    orientation: "square",
    notes: "Versatil: funciona en feed, stories y reels con pequeños ajustes.",
  },
  meta_ads_vertical: {
    id: "meta_ads_vertical",
    name: "Meta Ads — Vertical (9:16)",
    width: 1080,
    height: 1920,
    fps: 30,
    maxDurationSec: 240,
    recommendedDurationSec: 15,
    safeZone: { top: 150, bottom: 300, left: 60, right: 60 },
    orientation: "vertical",
    notes: "Máximo alcance en mobile. Funciona en Stories, Reels y TikTok.",
  },
};

/** Devuelve el preset de una plataforma por id */
export function getPlatform(id: PlatformId): PlatformPreset {
  return PLATFORMS[id];
}

/** Plataformas verticales (la mayoría en 2024) */
export const VERTICAL_PLATFORMS: PlatformId[] = [
  "tiktok",
  "reels",
  "stories",
  "youtube_shorts",
  "instagram_feed_portrait",
  "meta_ads_vertical",
];
