/**
 * OUTRO CARD — Juan Idrovo Abogado
 * Animación de cierre profesional · 8 segundos · 30fps
 *
 * Estructura:
 *   0.0–0.5s  Barrido de luz dorada (transición de entrada)
 *   0.0–0.8s  Fondo oscuro aparece
 *   0.6–1.4s  Logo escala con glow
 *   1.2–1.8s  Línea dorada se dibuja
 *   1.6–2.2s  JUAN IDROVO sube
 *   2.0–2.5s  ABOGADO sube
 *   2.4–3.0s  Teléfono aparece
 *   2.8–3.4s  Dirección aparece
 *   3.4–7.0s  Hold con animaciones sutiles
 *   7.0–8.0s  Fade out a negro
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
const GOLD      = "#A89F7E";   // khaki del logo JI
const GOLD_GLOW = "rgba(168,159,126,0.35)";
const WHITE     = "#FFFFFF";

const FONT_TITLE = "Arial Black, sans-serif";
const FONT_SERIF = "Georgia, 'Times New Roman', serif";
const FONT_BODY  = "Arial, sans-serif";

const PHONE   = "0958 607 184";
const ADDRESS = "Av. José Peralta y Cornelio Merchan";

// ─── Barrido de luz dorada ────────────────────────────────────────────────────

const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();

  const x = interpolate(frame, [0, 14], [-30, 115], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 2, 10, 14], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{
      position: "absolute", top: 0, bottom: 0,
      left: `${x}%`, width: "20%",
      background: `linear-gradient(to right, transparent, ${GOLD_GLOW}, rgba(255,255,255,0.12), ${GOLD_GLOW}, transparent)`,
      opacity,
      pointerEvents: "none",
      zIndex: 10,
    }} />
  );
};

// ─── Fondo animado con detalles decorativos ───────────────────────────────────

const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rotación suave de las líneas decorativas
  const rotate = interpolate(frame, [0, 240], [0, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: bgOpacity, overflow: "hidden" }}>
      {/* Fondo base */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 38%, ${NAVY_MID} 0%, ${NAVY} 70%)`,
      }} />

      {/* Líneas decorativas diagonales (muy sutiles) */}
      <AbsoluteFill style={{ transform: `rotate(${rotate}deg)`, transformOrigin: "center" }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            top: `${-10 + i * 22}%`,
            left: "-20%",
            right: "-20%",
            height: 1,
            background: `linear-gradient(to right, transparent, ${GOLD}22, transparent)`,
            transform: "rotate(-35deg)",
          }} />
        ))}
      </AbsoluteFill>

      {/* Resplandor central dorado muy sutil */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 42%, ${GOLD_GLOW} 0%, transparent 55%)`,
      }} />

      {/* Marco elegante */}
      <div style={{
        position: "absolute", top: 60, left: 50, right: 50, bottom: 60,
        border: `1px solid rgba(201,162,39,0.2)`,
        borderRadius: 4,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

// ─── Logo con glow dorado ─────────────────────────────────────────────────────

const LogoBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START = 18; // frame en que empieza
  const sp = spring({ frame: Math.max(0, frame - START), fps, config: { stiffness: 90, damping: 16 }, durationInFrames: 22 });
  const scale   = interpolate(sp, [0, 1], [0.55, 1]);
  const opacity = interpolate(sp, [0, 1], [0, 1]);

  // Brillo pulsante suave sobre el logo
  const glow = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.2),
    [-1, 1], [0.6, 1]
  );

  if (frame < START) return null;

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      display: "flex",
      justifyContent: "center",
      marginBottom: 8,
    }}>
      <div style={{
        width: 300,
        height: 300,
        filter: `drop-shadow(0 0 ${18 * glow}px ${GOLD}88) drop-shadow(0 4px 20px rgba(0,0,0,0.8))`,
      }}>
        <Img
          src={staticFile("imagenes/LOGO1.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

// ─── Línea dorada animada ─────────────────────────────────────────────────────

const GoldLine: React.FC = () => {
  const frame = useCurrentFrame();

  const START = 36;
  const width = interpolate(frame, [START, START + 22], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [START, START + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < START) return null;

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 28, opacity }}>
      <div style={{
        height: 2,
        width: `${width}%`,
        background: `linear-gradient(to right, transparent, ${GOLD}, ${GOLD}, transparent)`,
        borderRadius: 1,
        boxShadow: `0 0 8px ${GOLD}88`,
      }} />
    </div>
  );
};

// ─── Nombre del abogado ───────────────────────────────────────────────────────

const NameBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START1 = 48;
  const START2 = 60;

  const sp1 = spring({ frame: Math.max(0, frame - START1), fps, config: { stiffness: 130, damping: 20 }, durationInFrames: 16 });
  const sp2 = spring({ frame: Math.max(0, frame - START2), fps, config: { stiffness: 130, damping: 20 }, durationInFrames: 16 });

  const y1 = interpolate(sp1, [0, 1], [30, 0]);
  const y2 = interpolate(sp2, [0, 1], [22, 0]);

  if (frame < START1) return null;

  return (
    <div style={{ textAlign: "center", marginBottom: 36 }}>
      <div style={{
        fontFamily: FONT_SERIF,
        fontSize: 68,
        fontWeight: 900,
        color: WHITE,
        letterSpacing: 4,
        lineHeight: 1,
        opacity: sp1,
        transform: `translateY(${y1}px)`,
        textShadow: "0 4px 20px rgba(0,0,0,0.7)",
      }}>
        JUAN IDROVO
      </div>
      <div style={{
        fontFamily: FONT_BODY,
        fontSize: 30,
        fontWeight: 600,
        color: GOLD,
        letterSpacing: 10,
        marginTop: 10,
        opacity: sp2,
        transform: `translateY(${y2}px)`,
      }}>
        A B O G A D O
      </div>
    </div>
  );
};

// ─── Separador con diamante ───────────────────────────────────────────────────

const Separator: React.FC = () => {
  const frame = useCurrentFrame();
  const START = 75;
  const opacity = interpolate(frame, [START, START + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < START) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 32, opacity }}>
      <div style={{ height: 1, width: 80, backgroundColor: `${GOLD}55` }} />
      <div style={{ width: 8, height: 8, backgroundColor: GOLD, transform: "rotate(45deg)", boxShadow: `0 0 8px ${GOLD}` }} />
      <div style={{ height: 1, width: 80, backgroundColor: `${GOLD}55` }} />
    </div>
  );
};

// ─── Teléfono ─────────────────────────────────────────────────────────────────

const PhoneBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START = 80;
  const sp = spring({ frame: Math.max(0, frame - START), fps, config: { stiffness: 150, damping: 18 }, durationInFrames: 16 });
  const y = interpolate(sp, [0, 1], [20, 0]);

  // Pulso continuo suave
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 1.8) * 0.018;

  if (frame < START) return null;

  return (
    <div style={{
      opacity: sp,
      transform: `translateY(${y}px) scale(${pulse})`,
      marginBottom: 20,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
    }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: 22, color: `${WHITE}88`, letterSpacing: 2 }}>
        CONTÁCTENOS
      </span>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        backgroundColor: "rgba(201,162,39,0.12)",
        border: `1.5px solid ${GOLD}88`,
        borderRadius: 12,
        padding: "14px 32px",
        boxShadow: `0 0 20px ${GOLD}22, inset 0 1px 0 ${GOLD}44`,
      }}>
        <span style={{ fontSize: 34 }}>📞</span>
        <span style={{
          fontFamily: FONT_TITLE,
          fontSize: 52,
          fontWeight: 900,
          color: GOLD,
          letterSpacing: 2,
          textShadow: `0 0 20px ${GOLD}66`,
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

  const START = 100;
  const sp = spring({ frame: Math.max(0, frame - START), fps, config: { stiffness: 140, damping: 20 }, durationInFrames: 16 });
  const y = interpolate(sp, [0, 1], [16, 0]);

  if (frame < START) return null;

  return (
    <div style={{
      opacity: sp,
      transform: `translateY(${y}px)`,
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "0 60px",
    }}>
      <span style={{ fontSize: 28, marginTop: 2, flexShrink: 0 }}>📍</span>
      <span style={{
        fontFamily: FONT_BODY,
        fontSize: 30,
        fontWeight: 600,
        color: "rgba(255,255,255,0.82)",
        lineHeight: 1.4,
        textAlign: "center",
      }}>
        {ADDRESS}
      </span>
    </div>
  );
};

// ─── Fade out final ───────────────────────────────────────────────────────────

const FadeOut: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [totalFrames - 28, totalFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", opacity, pointerEvents: "none" }} />
  );
};

// ─── OUTRO CARD PRINCIPAL ─────────────────────────────────────────────────────

export const OUTRO_DURATION_FRAMES = 240; // 8 segundos a 30fps

export const OutroCard: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <LightSweep />

      {/* Contenido centrado verticalmente */}
      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 40px",
        gap: 0,
      }}>
        <LogoBlock />
        <GoldLine />
        <NameBlock />
        <Separator />
        <PhoneBlock />
        <AddressBlock />
      </AbsoluteFill>

      <FadeOut totalFrames={OUTRO_DURATION_FRAMES} />
    </AbsoluteFill>
  );
};
