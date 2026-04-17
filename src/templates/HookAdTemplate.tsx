import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ProgressBar } from "../components/ProgressBar";
import { WordCaption } from "../components/WordCaption";
import { CTAOverlay } from "../components/CTAOverlay";
import type { WordEntry, WordCaptionStyle, CTAType } from "../types";
import type { PlatformId } from "../presets/platforms";
import { getPlatform } from "../presets/platforms";

export interface HookAdProps {
  platform: PlatformId;

  // ── Imágenes de fondo (1-3 escenas) ──────────────────────────────────────
  scenes: Array<{
    src: string;
    durationSec: number;
    /** Zoom in leve sobre la imagen */
    kenBurns?: boolean;
  }>;

  // ── Hook text (primeros 2-3 seg) ─────────────────────────────────────────
  hookText: string;
  hookSubtext?: string;

  // ── Captions palabra por palabra ─────────────────────────────────────────
  words: WordEntry[];
  captionStyle?: WordCaptionStyle;

  // ── CTA ───────────────────────────────────────────────────────────────────
  ctaText: string;
  ctaSubtext?: string;
  ctaStartSec: number;
  ctaType?: CTAType;
  ctaColor?: string;

  // ── Overlay de color (para consistencia de marca) ─────────────────────────
  brandColor?: string;
  overlayOpacity?: number;

  // ── Barra de progreso (Stories) ───────────────────────────────────────────
  showProgressBar?: boolean;
}

const sec = (s: number, fps: number) => Math.round(s * fps);

export const HookAdTemplate: React.FC<HookAdProps> = ({
  platform,
  scenes,
  hookText,
  hookSubtext,
  words,
  captionStyle = "tiktok",
  ctaText,
  ctaSubtext,
  ctaStartSec,
  ctaType = "button",
  ctaColor = "#FF3B5C",
  brandColor,
  overlayOpacity = 0,
  showProgressBar = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const preset = getPlatform(platform);
  const isVertical = preset.orientation === "vertical";

  // Calcular qué escena renderizar
  let sceneAccum = 0;
  let currentScene = scenes[0];
  let sceneLocalFrame = frame;
  for (const scene of scenes) {
    const sceneDur = sec(scene.durationSec, fps);
    if (frame < sceneAccum + sceneDur) {
      currentScene = scene;
      sceneLocalFrame = frame - sceneAccum;
      break;
    }
    sceneAccum += sceneDur;
  }

  // Ken Burns: zoom leve
  const kenBurnsScale = currentScene.kenBurns
    ? interpolate(sceneLocalFrame, [0, sec(currentScene.durationSec, fps)], [1, 1.08], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Hook text animations
  const hookFadeIn = interpolate(frame, [0, sec(0.4, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hookSlide = interpolate(frame, [0, sec(0.5, fps)], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hookFadeOut = interpolate(
    frame,
    [sec(2.2, fps), sec(2.8, fps)],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const hookOpacity = Math.min(hookFadeIn, hookFadeOut);

  // CTA
  const ctaStartFrame = sec(ctaStartSec, fps);
  const ctaSpring = spring({
    frame: Math.max(0, frame - ctaStartFrame),
    fps,
    config: { stiffness: 180, damping: 16 },
    durationInFrames: 15,
  });
  const ctaOpacity = frame >= ctaStartFrame ? ctaSpring : 0;
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.75, 1]);

  // Posiciones ajustadas a safe zone
  const sz = preset.safeZone;
  const hookTop = isVertical ? sz.top + 60 : sz.top + 20;
  const hookFontSize = isVertical ? 80 : 56;
  const subFontSize = isVertical ? 40 : 28;

  // Captions: posición en zona segura
  const captionBottom = sz.bottom + 40;

  // CTA: centrado, justo encima de la zona bloqueada inferior
  const ctaBottom = sz.bottom + 60;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Fondo / escena */}
      <AbsoluteFill
        style={{
          transform: `scale(${kenBurnsScale})`,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={currentScene.src}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Overlay de marca */}
      {brandColor && overlayOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: brandColor,
            opacity: overlayOpacity,
          }}
        />
      )}

      {/* Degradado inferior para legibilidad */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 65%)`,
        }}
      />

      {/* Hook text */}
      <div
        style={{
          position: "absolute",
          top: hookTop,
          left: sz.left + 40,
          right: sz.right + 40,
          opacity: hookOpacity,
          transform: `translateY(${hookSlide}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Arial Black, sans-serif",
            fontSize: hookFontSize,
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            WebkitTextStroke: "1px rgba(0,0,0,0.3)",
          }}
        >
          {hookText}
        </div>
        {hookSubtext && (
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: subFontSize,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
              marginTop: 12,
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {hookSubtext}
          </div>
        )}
      </div>

      {/* Word-by-word captions */}
      <WordCaption
        clip={{
          id: "wc",
          type: "text",
          subtitleType: "word_caption",
          startFrame: 0,
          durationInFrames,
          trackIndex: 2,
          words,
          captionStyle,
          position: "bottom",
          verticalOffset: captionBottom,
          fontSize: isVertical ? 58 : 40,
          fontFamily: "Arial Black, sans-serif",
        }}
      />

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: ctaBottom,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
          transformOrigin: "center bottom",
        }}
      >
        <CTAOverlay
          clip={{
            id: "cta",
            type: "text",
            subtitleType: "cta",
            startFrame: ctaStartFrame,
            durationInFrames: durationInFrames - ctaStartFrame,
            trackIndex: 3,
            text: ctaText,
            subtext: ctaSubtext,
            ctaType,
            backgroundColor: ctaColor,
            icon: "arrow",
            pulsate: true,
            x: 50,
            y: 50,
          }}
        />
      </div>

      {/* Progress bar (Stories) */}
      {showProgressBar && (
        <ProgressBar
          segments={scenes.length}
          topOffset={sz.top > 100 ? sz.top - 40 : 20}
          color="#ffffff"
          backgroundColor="rgba(255,255,255,0.35)"
          height={4}
        />
      )}
    </AbsoluteFill>
  );
};
