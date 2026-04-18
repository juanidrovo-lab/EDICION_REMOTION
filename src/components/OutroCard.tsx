/**
 * OUTRO CARD — Juan Idrovo Abogado
 * Logo como elemento dominante · sin texto duplicado
 * 8 segundos · 30fps · 1080×1920
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
} from "remotion";

const NAVY      = "#060C18";
const NAVY_MID  = "#0A1628";
const KHAKI     = "#A89F7E";
const KHAKI_DIM = "rgba(168,159,126,0.3)";
const WHITE     = "#FFFFFF";
const PHONE     = "0958 607 184";
const ADDRESS   = "Av. José Peralta y Cornelio Merchan";
const FONT_TITLE = "Arial Black, sans-serif";
const FONT_BODY  = "Arial, sans-serif";

// ─── Barrido de luz ───────────────────────────────────────────────────────────

const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 14], [-30, 115], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 2, 10, 14], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", top: 0, bottom: 0,
      left: `${x}%`, width: "20%",
      background: `linear-gradient(to right, transparent, ${KHAKI_DIM}, rgba(255,255,255,0.1), ${KHAKI_DIM}, transparent)`,
      opacity, pointerEvents: "none", zIndex: 10,
    }} />
  );
};

// ─── Fondo ────────────────────────────────────────────────────────────────────

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotate = interpolate(frame, [0, 240], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: bgOpacity, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, ${NAVY_MID} 0%, ${NAVY} 70%)` }} />
      <AbsoluteFill style={{ transform: `rotate(${rotate}deg)`, transformOrigin: "center" }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", top: `${-10 + i * 22}%`,
            left: "-20%", right: "-20%", height: 1,
            background: `linear-gradient(to right, transparent, ${KHAKI}18, transparent)`,
            transform: "rotate(-35deg)",
          }} />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, ${KHAKI_DIM} 0%, transparent 55%)` }} />
      <div style={{
        position: "absolute", top: 60, left: 50, right: 50, bottom: 60,
        border: `1px solid rgba(168,159,126,0.18)`, borderRadius: 4, pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

// ─── LOGO — elemento dominante ────────────────────────────────────────────────

const LogoBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START = 18;
  const sp = spring({ frame: Math.max(0, frame - START), fps, config: { stiffness: 80, damping: 16 }, durationInFrames: 25 });
  const scale   = interpolate(sp, [0, 1], [0.5, 1]);
  const opacity = interpolate(sp, [0, 1], [0, 1]);

  // Glow pulsante
  const glow = interpolate(Math.sin((frame / fps) * Math.PI * 1.2), [-1, 1], [12, 28]);

  if (frame < START) return null;

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      display: "flex",
      justifyContent: "center",
      marginBottom: 36,
    }}>
      <div style={{
        width: 580,
        height: 580,
        filter: `drop-shadow(0 0 ${glow}px ${KHAKI}99) drop-shadow(0 8px 40px rgba(0,0,0,0.7))`,
      }}>
        <Img
          src={staticFile("imagenes/LOGO1.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

// ─── Línea separadora ─────────────────────────────────────────────────────────

const GoldLine: React.FC = () => {
  const frame = useCurrentFrame();
  const START = 50;
  const w = interpolate(frame, [START, START + 22], [0, 75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [START, START + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < START) return null;
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 32, opacity }}>
      <div style={{
        height: 2, width: `${w}%`,
        background: `linear-gradient(to right, transparent, ${KHAKI}, ${KHAKI}, transparent)`,
        borderRadius: 1, boxShadow: `0 0 8px ${KHAKI}66`,
      }} />
    </div>
  );
};

// ─── Teléfono ─────────────────────────────────────────────────────────────────

const PhoneBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START = 60;
  const sp = spring({ frame: Math.max(0, frame - START), fps, config: { stiffness: 150, damping: 18 }, durationInFrames: 16 });
  const y = interpolate(sp, [0, 1], [20, 0]);
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 1.8) * 0.018;

  if (frame < START) return null;

  return (
    <div style={{
      opacity: sp, transform: `translateY(${y}px) scale(${pulse})`,
      marginBottom: 18,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: 24, color: `${WHITE}77`, letterSpacing: 3 }}>
        CONTÁCTENOS
      </span>
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        backgroundColor: "rgba(168,159,126,0.1)",
        border: `1.5px solid ${KHAKI}88`,
        borderRadius: 12, padding: "14px 36px",
        boxShadow: `0 0 20px ${KHAKI}22, inset 0 1px 0 ${KHAKI}33`,
      }}>
        <span style={{ fontSize: 36 }}>📞</span>
        <span style={{
          fontFamily: FONT_TITLE, fontSize: 56, fontWeight: 900,
          color: KHAKI, letterSpacing: 2,
          textShadow: `0 0 20px ${KHAKI}55`,
        }}>
          {PHONE}
        </span>
      </div>
    </div>
  );
};

// ─── Dirección ────────────────────────────────────────────────────────────────

const AddressBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START = 80;
  const sp = spring({ frame: Math.max(0, frame - START), fps, config: { stiffness: 140, damping: 20 }, durationInFrames: 16 });
  const y = interpolate(sp, [0, 1], [16, 0]);

  if (frame < START) return null;

  return (
    <div style={{
      opacity: sp, transform: `translateY(${y}px)`,
      display: "flex", alignItems: "center", gap: 12, padding: "0 70px",
    }}>
      <span style={{ fontSize: 28, flexShrink: 0 }}>📍</span>
      <span style={{
        fontFamily: FONT_BODY, fontSize: 30, fontWeight: 600,
        color: "rgba(255,255,255,0.78)", lineHeight: 1.4, textAlign: "center",
      }}>
        {ADDRESS}
      </span>
    </div>
  );
};

// ─── Fade out ─────────────────────────────────────────────────────────────────

const FadeOut: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [totalFrames - 28, totalFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity, pointerEvents: "none" }} />;
};

// ─── COMPOSICIÓN ─────────────────────────────────────────────────────────────

export const OUTRO_DURATION_FRAMES = 240; // 8 segundos

export const OutroCard: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <LightSweep />

    <AbsoluteFill style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 40px",
    }}>
      <LogoBlock />
      <GoldLine />
      <PhoneBlock />
      <AddressBlock />
    </AbsoluteFill>

    <FadeOut totalFrames={OUTRO_DURATION_FRAMES} />
  </AbsoluteFill>
);
