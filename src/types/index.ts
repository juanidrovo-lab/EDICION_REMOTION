import type { PlatformId } from "../presets/platforms";

// ─── Tipos base del timeline ─────────────────────────────────────────────────

export type MediaType = "video" | "image" | "audio" | "text" | "shape";

// ─── Tipos de caption palabra por palabra (TikTok / CapCut style) ─────────────

export type WordCaptionStyle =
  | "tiktok"        // texto blanco, fondo negro por palabra activa
  | "karaoke"       // palabra activa en color destacado
  | "bold_pop"      // palabra activa grande y en bold
  | "highlight"     // fondo de color detrás de palabra activa
  | "outline"       // solo outline, sin fondo
  | "neon";         // efecto glow de neón

export interface WordEntry {
  word: string;
  startFrame: number;
  endFrame: number;
}

export interface WordCaptionClip extends BaseClip {
  type: "text";
  subtitleType: "word_caption";
  words: WordEntry[];
  captionStyle?: WordCaptionStyle;
  activeColor?: string;
  inactiveColor?: string;
  activeBackground?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: FontWeight;
  position?: "bottom" | "top" | "middle";
  verticalOffset?: number;
}

// ─── CTA / Badge overlay ──────────────────────────────────────────────────────

export type CTAType = "button" | "badge" | "pill" | "sticker";

export interface CTAClip extends BaseClip {
  type: "text";
  subtitleType: "cta";
  ctaType?: CTAType;
  text: string;
  subtext?: string;
  x?: number;
  y?: number;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  icon?: "arrow" | "cart" | "star" | "fire" | "check" | "link";
  pulsate?: boolean;
}

export type AnimationType =
  | "fadeIn"
  | "fadeOut"
  | "slideInLeft"
  | "slideInRight"
  | "slideInUp"
  | "slideInDown"
  | "slideOutLeft"
  | "slideOutRight"
  | "slideOutUp"
  | "slideOutDown"
  | "zoomIn"
  | "zoomOut"
  | "rotateIn"
  | "bounceIn"
  | "typewriter"
  | "none";

export type TransitionType =
  | "cut"
  | "crossfade"
  | "wipeLeft"
  | "wipeRight"
  | "wipeUp"
  | "wipeDown"
  | "zoomCross"
  | "slidePush"
  | "circleReveal"
  | "glitch";

export type EasingType =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "spring"
  | "bounce";

export type TextAlign = "left" | "center" | "right";
export type FontWeight = "normal" | "bold" | "light" | "extrabold";

// ─── Animación aplicada a un clip ─────────────────────────────────────────────

export interface ClipAnimation {
  type: AnimationType;
  durationInFrames: number;
  easing?: EasingType;
  delay?: number;
}

// ─── Clips del timeline ───────────────────────────────────────────────────────

export interface BaseClip {
  id: string;
  type: MediaType;
  startFrame: number;
  durationInFrames: number;
  trackIndex: number;
  volume?: number;
  opacity?: number;
  enterAnimation?: ClipAnimation;
  exitAnimation?: ClipAnimation;
}

export interface VideoClip extends BaseClip {
  type: "video";
  src: string;
  trimStart?: number;
  trimEnd?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  cornerRadius?: number;
}

export interface ImageClip extends BaseClip {
  type: "image";
  src: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  cornerRadius?: number;
  objectFit?: "cover" | "contain" | "fill";
}

export interface AudioClip extends BaseClip {
  type: "audio";
  src: string;
  trimStart?: number;
  trimEnd?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
}

export interface SubtitleEntry {
  startFrame: number;
  endFrame: number;
  text: string;
}

export interface SubtitleClip extends BaseClip {
  type: "text";
  subtitleType: "subtitle";
  entries: SubtitleEntry[];
  style?: SubtitleStyle;
}

export interface TextClip extends BaseClip {
  type: "text";
  subtitleType?: never;
  text: string;
  x?: number;
  y?: number;
  style?: TextStyle;
}

export type AnyTextClip = SubtitleClip | TextClip | WordCaptionClip | CTAClip;

// ─── Estilos ──────────────────────────────────────────────────────────────────

export interface SubtitleStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: FontWeight;
  color?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  borderRadius?: number;
  paddingX?: number;
  paddingY?: number;
  textAlign?: TextAlign;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  position?: "bottom" | "top" | "middle";
  verticalOffset?: number;
}

export interface TextStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: FontWeight;
  color?: string;
  textAlign?: TextAlign;
  lineHeight?: number;
  letterSpacing?: number;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  gradient?: {
    from: string;
    to: string;
    direction?: "horizontal" | "vertical" | "diagonal";
  };
}

// ─── Transición entre clips ───────────────────────────────────────────────────

export interface Transition {
  id: string;
  type: TransitionType;
  durationInFrames: number;
  fromClipId: string;
  toClipId: string;
}

// ─── Pista del timeline ───────────────────────────────────────────────────────

export interface Track {
  id: string;
  name: string;
  type: "video" | "audio" | "text" | "overlay";
  muted?: boolean;
  locked?: boolean;
  clips: Array<VideoClip | ImageClip | AudioClip | AnyTextClip>;
}

// ─── Proyecto completo ────────────────────────────────────────────────────────

export interface VideoProject {
  id: string;
  name: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  backgroundColor?: string;
  platform?: PlatformId;
  showSafeZone?: boolean;
  tracks: Track[];
  transitions?: Transition[];
  globalAudio?: AudioClip[];
}

// ─── Props de composición ─────────────────────────────────────────────────────

export type MainCompositionProps = VideoProject;

// Re-export para conveniencia
export type { PlatformId };
