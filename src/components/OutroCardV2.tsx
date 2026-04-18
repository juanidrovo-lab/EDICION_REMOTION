/**
 * OUTRO CARD V2 — Juan Idrovo Abogado
 * Animaciones suaves · escritura con tinta · audio sincronizado
 * 8 segundos · 30fps · 1080×1920
 *
 * SONIDOS (opcionales):
 *   Poné estos archivos en public/audio/ para activar el audio:
 *   - sfx-whoosh.mp3  → barrido inicial  (freesound.org ID: 519341)
 *   - sfx-chime.mp3   → aparición logo   (freesound.org ID: 536108)
 *   - sfx-pen.mp3     → escritura        (freesound.org ID: 244943)
 *   Descargar gratis en: freesound.org
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
  Audio,
  Sequence,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/GreatVibes";

const { fontFamily: FONT_SCRIPT } = loadFont();

// ─── Constantes ───────────────────────────────────────────────────────────────

const NAVY      = "#060C18";
const NAVY_MID  = "#0A1628";
const KHAKI     = "#A89F7E";
const KHAKI_DIM = "rgba(168,159,126,0.25)";
const WHITE     = "#FFFFFF";
const PHONE     = "0958 607 184";
const ADDRESS   = "Av. José Peralta y Cornelio Merchan";
const FONT_TITLE = "Arial Black, sans-serif";
const FONT_BODY  = "Arial, sans-serif";

export const OUTRO_V2_DURATION = 240; // 8 segundos

// ✏️ Cambiá a true cuando tengas los archivos de audio en public/audio/
const SOUNDS_ENABLED = false;

// ─── Suavizado natural (no lineal) ───────────────────────────────────────────

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ─── Fondo ────────────────────────────────────────────────────────────────────

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const rotate = interpolate(frame, [0, 240], [0, 2.5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 42%, ${NAVY_MID} 0%, ${NAVY} 72%)`,
      }} />
      <AbsoluteFill style={{ transform: `rotate(${rotate}deg)`, transformOrigin: "center" }}>
        {[...Array(7)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", top: `${-5 + i * 20}%`,
            left: "-20%", right: "-20%", height: 1,
            background: `linear-gradient(to right, transparent, ${KHAKI}12, transparent)`,
            transform: "rotate(-32deg)",
          }} />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 40%, ${KHAKI_DIM} 0%, transparent 52%)`,
      }} />
      <div style={{
        position: "absolute", top: 55, left: 45, right: 45, bottom: 55,
        border: `1px solid rgba(168,159,126,0.12)`, borderRadius: 6, pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

// ─── Barrido de luz ───────────────────────────────────────────────────────────

const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 16], [-35, 118], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 3, 12, 16], [0, 0.9, 0.9, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <div style={{
      position: "absolute", top: 0, bottom: 0,
      left: `${x}%`, width: "18%",
      background: `linear-gradient(to right, transparent, ${KHAKI_DIM}, rgba(255,255,255,0.06), ${KHAKI_DIM}, transparent)`,
      opacity, pointerEvents: "none", zIndex: 10,
    }} />
  );
};

// ─── LOGO con blur-in suave ───────────────────────────────────────────────────

const LogoBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START = 20;
  const rel = Math.max(0, frame - START);

  // Spring suave — stiffness bajo para que entre sin rebote
  const sp = spring({ frame: rel, fps, config: { stiffness: 55, damping: 16 }, durationInFrames: 32 });
  const scale   = interpolate(sp, [0, 1], [0.82, 1]);
  const opacity = interpolate(sp, [0, 1], [0, 1]);
  // Blur que se despeja conforme aparece
  const blur    = interpolate(sp, [0, 1], [10, 0]);

  // Glow pulsante suave
  const glow = interpolate(Math.sin((frame / fps) * Math.PI * 1.1), [-1, 1], [10, 24]);

  if (frame < START) return null;

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      filter: `blur(${blur}px)`,
      display: "flex",
      justifyContent: "center",
      marginBottom: 32,
    }}>
      <div style={{
        width: 560, height: 560,
        filter: `drop-shadow(0 0 ${glow}px ${KHAKI}77) drop-shadow(0 8px 36px rgba(0,0,0,0.65))`,
      }}>
        <Img
          src={staticFile("imagenes/LOGO2.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

// ─── Línea separadora ─────────────────────────────────────────────────────────

const GoldLine: React.FC = () => {
  const frame = useCurrentFrame();
  const START = 52;
  const rel = frame - START;
  const w = interpolate(rel, [0, 26], [0, 70], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });
  const opacity = interpolate(rel, [0, 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (frame < START) return null;
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 24, opacity }}>
      <div style={{
        height: 1.5, width: `${w}%`,
        background: `linear-gradient(to right, transparent, ${KHAKI}bb, ${KHAKI}bb, transparent)`,
        boxShadow: `0 0 6px ${KHAKI}44`,
      }} />
    </div>
  );
};

// ─── ESCRITURA con máscara de gradiente (efecto tinta) ────────────────────────

const HandwritingText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START        = 60;
  const WRITE_FRAMES = 85; // ~2.8 segundos
  const rel = Math.max(0, frame - START);

  // Easing tipo tinta: arranca suave, fluye, termina suave
  const rawP = interpolate(rel, [0, WRITE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const progress = easeInOutCubic(rawP) * 100;

  // Máscara con gradiente suave — simula el frente de tinta fluyendo
  // La zona derecha no revelada tiene una transición suave de ~7%
  const maskReveal   = Math.max(0, progress - 7).toFixed(1);
  const maskFeather  = Math.min(100, progress + 1).toFixed(1);
  const gradientMask = `linear-gradient(to right,
    black 0%,
    black ${maskReveal}%,
    rgba(0,0,0,0.15) ${(progress - 0.5).toFixed(1)}%,
    transparent ${maskFeather}%
  )`;

  // Contenedor aparece con fade-in antes de que empiece a escribir
  const containerOp = interpolate(rel, [0, 8], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const penVisible = rel > 3 && progress < 99;

  if (frame < START) return null;

  return (
    <div style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      marginBottom: 30,
      opacity: containerOp,
      padding: "0 50px",
    }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Texto en fuente caligráfica — revelado con máscara de gradiente */}
        <span style={{
          fontFamily: FONT_SCRIPT,
          fontSize: 96,
          fontWeight: 400,
          color: KHAKI,
          display: "block",
          lineHeight: 1.5,
          whiteSpace: "nowrap",
          textShadow: `0 0 9px rgba(168,159,126,0.38), 0 2px 10px rgba(0,0,0,0.55)`,
          // Máscara gradiente — efecto tinta
          WebkitMaskImage: gradientMask,
          maskImage: gradientMask,
        }}>
          Abg. Juan Idrovo Ochoa
        </span>

        {/* Punto de pluma — pequeño glow en el frente del trazo */}
        {penVisible && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: `${progress.toFixed(1)}%`,
            transform: "translate(-50%, -50%)",
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: `0 0 7px 4px rgba(168,159,126,0.5), 0 0 14px 6px rgba(168,159,126,0.2)`,
            pointerEvents: "none",
          }} />
        )}
      </div>
    </div>
  );
};

// ─── Teléfono con blur-in ─────────────────────────────────────────────────────

const PhoneBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START = 152;
  const rel = Math.max(0, frame - START);
  const sp = spring({ frame: rel, fps, config: { stiffness: 100, damping: 20 }, durationInFrames: 20 });
  const y    = interpolate(sp, [0, 1], [18, 0]);
  const blur = interpolate(sp, [0, 1], [5, 0]);
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 1.7) * 0.015;

  if (frame < START) return null;
  return (
    <div style={{
      opacity: sp,
      transform: `translateY(${y}px) scale(${pulse})`,
      filter: `blur(${blur}px)`,
      marginBottom: 16,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: 22, color: `${WHITE}55`, letterSpacing: 3 }}>
        CONTÁCTENOS
      </span>
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        backgroundColor: "rgba(168,159,126,0.08)",
        border: `1.5px solid ${KHAKI}66`,
        borderRadius: 12, padding: "14px 36px",
        boxShadow: `0 0 18px ${KHAKI}18`,
      }}>
        <span style={{ fontSize: 34 }}>📞</span>
        <span style={{
          fontFamily: FONT_TITLE, fontSize: 54, fontWeight: 900,
          color: KHAKI, letterSpacing: 2,
          textShadow: `0 0 16px ${KHAKI}38`,
        }}>
          {PHONE}
        </span>
      </div>
    </div>
  );
};

// ─── Dirección con blur-in ────────────────────────────────────────────────────

const AddressBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START = 168;
  const rel = Math.max(0, frame - START);
  const sp = spring({ frame: rel, fps, config: { stiffness: 90, damping: 20 }, durationInFrames: 20 });
  const y    = interpolate(sp, [0, 1], [14, 0]);
  const blur = interpolate(sp, [0, 1], [4, 0]);

  if (frame < START) return null;
  return (
    <div style={{
      opacity: sp,
      transform: `translateY(${y}px)`,
      filter: `blur(${blur}px)`,
      display: "flex", alignItems: "center", gap: 12, padding: "0 70px",
    }}>
      <span style={{ fontSize: 28, flexShrink: 0 }}>📍</span>
      <span style={{
        fontFamily: FONT_BODY, fontSize: 28, fontWeight: 600,
        color: "rgba(255,255,255,0.72)", lineHeight: 1.4, textAlign: "center",
      }}>
        {ADDRESS}
      </span>
    </div>
  );
};

// ─── Audio sincronizado ───────────────────────────────────────────────────────

const AudioEffects: React.FC = () => {
  if (!SOUNDS_ENABLED) return null;
  return (
    <>
      {/* Barrido inicial */}
      <Sequence from={0} durationInFrames={20} layout="none">
        <Audio src={staticFile("audio/sfx-whoosh.mp3")} volume={0.35} />
      </Sequence>
      {/* Aparición del logo */}
      <Sequence from={20} durationInFrames={40} layout="none">
        <Audio src={staticFile("audio/sfx-chime.mp3")} volume={0.5} />
      </Sequence>
      {/* Escritura del nombre */}
      <Sequence from={60} durationInFrames={85} layout="none">
        <Audio src={staticFile("audio/sfx-pen.mp3")} volume={0.3} />
      </Sequence>
    </>
  );
};

// ─── Fade out ─────────────────────────────────────────────────────────────────

const FadeOut: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame, [OUTRO_V2_DURATION - 30, OUTRO_V2_DURATION],
    [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity, pointerEvents: "none" }} />;
};

// ─── COMPOSICIÓN ─────────────────────────────────────────────────────────────

export const OutroCardV2: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <LightSweep />
    <AudioEffects />

    <AbsoluteFill style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 40px",
    }}>
      <LogoBlock />
      <GoldLine />
      <HandwritingText />
      <PhoneBlock />
      <AddressBlock />
    </AbsoluteFill>

    <FadeOut />
  </AbsoluteFill>
);
