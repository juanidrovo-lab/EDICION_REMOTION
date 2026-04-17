import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { WordCaption } from "../components/WordCaption";
import { CTAOverlay } from "../components/CTAOverlay";
import type { WordEntry, WordCaptionStyle } from "../types";
import type { PlatformId } from "../presets/platforms";
import { getPlatform } from "../presets/platforms";

/**
 * Template UGC (User Generated Content) style.
 * Imita videos orgánicos de creadores con captions animadas,
 * sin aspecto de anuncio formal — muy efectivo en TikTok y Reels.
 *
 * Estructura:
 *   0s–2s   : Hook visual + texto llamativo
 *   2s–N    : Video/imagen de fondo + captions palabra por palabra
 *   N–fin   : CTA con urgencia
 */

export interface UGCAdProps {
  platform: PlatformId;

  // ── Escenas ────────────────────────────────────────────────────────────────
  backgroundSrc: string;

  // ── Hook ──────────────────────────────────────────────────────────────────
  hookEmoji?: string;
  hookLine1: string;
  hookLine2?: string;

  // ── Captions ──────────────────────────────────────────────────────────────
  words: WordEntry[];
  captionStyle?: WordCaptionStyle;

  // ── CTA ───────────────────────────────────────────────────────────────────
  ctaText: string;
  ctaEmoji?: string;
  ctaStartSec: number;
  ctaColor?: string;

  // ── Indicadores sociales (social proof) ────────────────────────────────────
  socialProof?: string;
  socialProofIcon?: string;
}

const sec = (s: number, fps: number) => Math.round(s * fps);

export const UGCAdTemplate: React.FC<UGCAdProps> = ({
  platform,
  backgroundSrc,
  hookEmoji = "🔥",
  hookLine1,
  hookLine2,
  words,
  captionStyle = "bold_pop",
  ctaText,
  ctaEmoji = "👇",
  ctaStartSec,
  ctaColor = "#25D366",
  socialProof,
  socialProofIcon = "⭐",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const preset = getPlatform(platform);
  const sz = preset.safeZone;
  const isVertical = preset.orientation === "vertical";

  // Ken Burns suave durante todo el video
  const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hook: visible solo primeros ~2.5 seg
  const hookInSpring = spring({ frame, fps, config: { stiffness: 250, damping: 18 }, durationInFrames: 10 });
  const hookScale = interpolate(hookInSpring, [0, 1], [1.4, 1]);
  const hookOpacity = Math.min(
    interpolate(hookInSpring, [0, 1], [0, 1]),
    interpolate(frame, [sec(2.0, fps), sec(2.6, fps)], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Social proof: aparece a los 1.5 seg
  const spDelay = sec(1.5, fps);
  const spOpacity = interpolate(
    frame,
    [spDelay, spDelay + 8, sec(ctaStartSec - 0.5, fps), sec(ctaStartSec, fps)],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // CTA
  const ctaStartFrame = sec(ctaStartSec, fps);
  const ctaSpring = spring({
    frame: Math.max(0, frame - ctaStartFrame),
    fps,
    config: { stiffness: 200, damping: 15 },
    durationInFrames: 12,
  });
  const ctaOpacity = frame >= ctaStartFrame ? ctaSpring : 0;
  const ctaTranslate = interpolate(ctaSpring, [0, 1], [60, 0]);

  const hookFontSize = isVertical ? 86 : 60;
  const hookPadding = isVertical ? { left: sz.left + 40, right: sz.right + 40 } : { left: 40, right: 40 };
  const hookTop = sz.top + (isVertical ? 80 : 40);
  const captionBottom = sz.bottom + 50;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Fondo con Ken Burns */}
      <AbsoluteFill
        style={{
          transform: `scale(${bgScale})`,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={backgroundSrc}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Viñeta perimetral (look más cinematográfico/orgánico) */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Degradado inferior */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 35%, transparent 60%)",
        }}
      />

      {/* HOOK */}
      <div
        style={{
          position: "absolute",
          top: hookTop,
          left: hookPadding.left,
          right: hookPadding.right,
          opacity: hookOpacity,
          transform: `scale(${hookScale})`,
          transformOrigin: "center top",
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
            textShadow: "0 4px 20px rgba(0,0,0,0.95)",
          }}
        >
          {hookEmoji && (
            <span style={{ display: "block", fontSize: hookFontSize * 1.1, marginBottom: 8 }}>
              {hookEmoji}
            </span>
          )}
          {hookLine1}
        </div>
        {hookLine2 && (
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: hookFontSize * 0.55,
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
              marginTop: 10,
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            }}
          >
            {hookLine2}
          </div>
        )}
      </div>

      {/* Social proof */}
      {socialProof && (
        <div
          style={{
            position: "absolute",
            top: sz.top + (isVertical ? 200 : 80),
            left: "50%",
            transform: "translateX(-50%)",
            opacity: spOpacity,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            borderRadius: 100,
            padding: "8px 24px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 24 }}>{socialProofIcon}</span>
          <span
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {socialProof}
          </span>
        </div>
      )}

      {/* Word captions */}
      <WordCaption
        clip={{
          id: "ugc-wc",
          type: "text",
          subtitleType: "word_caption",
          startFrame: 0,
          durationInFrames,
          trackIndex: 2,
          words,
          captionStyle,
          position: "bottom",
          verticalOffset: captionBottom,
          fontSize: isVertical ? 62 : 42,
          fontFamily: "Arial Black, sans-serif",
        }}
      />

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: sz.bottom + 50,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: ctaOpacity,
          transform: `translateY(${ctaTranslate}px)`,
        }}
      >
        {/* Emoji de flecha para abajo */}
        <span style={{ fontSize: 48, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }}>
          {ctaEmoji}
        </span>
        <CTAOverlay
          clip={{
            id: "ugc-cta",
            type: "text",
            subtitleType: "cta",
            startFrame: ctaStartFrame,
            durationInFrames: durationInFrames - ctaStartFrame,
            trackIndex: 3,
            text: ctaText,
            ctaType: "pill",
            backgroundColor: ctaColor,
            icon: "check",
            pulsate: true,
            x: 50,
            y: 50,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
