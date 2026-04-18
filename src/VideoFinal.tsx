/**
 * VIDEO FINAL — Juan Idrovo Abogado
 * Cobro de deudas | TikTok / Reels 9:16
 *
 * ✏️ PARA CONFIGURAR:
 *   1. Cambiá DURACION_SEG por la duración real de tu video
 *   2. Completá el array SUBTITULOS con lo que dice el abogado
 */

import React from "react";
import {
  AbsoluteFill,
  Sequence,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
} from "remotion";
import { OutroCard, OUTRO_DURATION_FRAMES } from "./components/OutroCard";

// ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────

const DURACION_SEG = 50;          // ✏️ cambiá por la duración real del video
const FPS          = 30;
const s            = (sec: number) => Math.round(sec * FPS);
const TOTAL_FRAMES = s(DURACION_SEG) + OUTRO_DURATION_FRAMES;

const NAVY    = "#0A1628";
const GOLD    = "#C9A227";
const WHITE   = "#FFFFFF";
const PHONE   = "0958 607 184";

const FONT_TITLE = "Arial Black, sans-serif";
const FONT_BODY  = "Arial, sans-serif";

// ─── SUBTÍTULOS ───────────────────────────────────────────────────────────────
// ✏️ Completá el texto con lo que dice el abogado en el video
// El tiempo va en segundos

interface Sub { desde: number; hasta: number; texto: string }

const SUBTITULOS: Sub[] = [
  { desde: 1,  hasta: 4,  texto: "Si alguien le debe dinero, usted tiene derechos." },
  { desde: 4,  hasta: 8,  texto: "No importa el monto — la ley le protege." },
  { desde: 8,  hasta: 12, texto: "El primer paso es reunir toda la documentación." },
  { desde: 12, hasta: 16, texto: "Contratos, mensajes, facturas — todo cuenta." },
  { desde: 16, hasta: 20, texto: "Luego enviamos una carta documento formal." },
  { desde: 20, hasta: 24, texto: "Esto obliga al deudor a responder legalmente." },
  { desde: 24, hasta: 28, texto: "Si no paga, iniciamos la acción judicial." },
  { desde: 28, hasta: 33, texto: "Hemos recuperado millones para nuestros clientes." },
  { desde: 33, hasta: 38, texto: "Solo cobramos cuando usted recupera su dinero." },
  { desde: 38, hasta: 42, texto: "Contáctenos hoy para una consulta gratuita." },
  // Agregue más líneas aquí según el guión real
];

// ─── COMPONENTE: GRADING CINEMATOGRÁFICO ─────────────────────────────────────

const CinematicGrade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,10,20,0.65) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(5,10,20,0.95) 0%, rgba(5,10,20,0.5) 30%, transparent 55%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(5,10,20,0.55) 0%, transparent 20%)" }} />
  </AbsoluteFill>
);

// ─── COMPONENTE: HOOK INICIAL ─────────────────────────────────────────────────

const HookOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ frame, fps, config: { stiffness: 100, damping: 18 }, durationInFrames: 18 });
  const fadeOut = interpolate(frame, [s(3.8), s(5)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(appear, fadeOut);
  const y = interpolate(appear, [0, 1], [40, 0]);

  if (frame > s(5)) return null;

  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "0 70px",
      opacity, transform: `translateY(${y}px)`, pointerEvents: "none",
    }}>
      <div style={{ fontFamily: FONT_TITLE, fontSize: 88, fontWeight: 900, color: WHITE, textAlign: "center", lineHeight: 1.1, textShadow: "0 6px 30px rgba(0,0,0,0.95)" }}>
        ¿Le deben dinero?
      </div>
      <div style={{ fontFamily: FONT_TITLE, fontSize: 88, fontWeight: 900, color: GOLD, textAlign: "center", lineHeight: 1.1, marginTop: 10, textShadow: `0 0 40px ${GOLD}55, 0 6px 20px rgba(0,0,0,0.9)` }}>
        Esto es lo que
      </div>
      <div style={{ fontFamily: FONT_TITLE, fontSize: 88, fontWeight: 900, color: WHITE, textAlign: "center", lineHeight: 1.1, textShadow: "0 6px 30px rgba(0,0,0,0.95)" }}>
        debe hacer.
      </div>
    </div>
  );
};

// ─── COMPONENTE: SUBTÍTULOS ───────────────────────────────────────────────────

const SubtitleTrack: React.FC = () => {
  const frame = useCurrentFrame();

  const active = SUBTITULOS.find(
    (sub) => frame >= s(sub.desde) && frame < s(sub.hasta)
  );

  if (!active) return null;

  const durFrames = s(active.hasta - active.desde);
  const relFrame  = frame - s(active.desde);

  const opacity = interpolate(
    relFrame,
    [0, 5, durFrames - 5, durFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div style={{
      position: "absolute", bottom: 200, left: 60, right: 60,
      display: "flex", justifyContent: "center",
      opacity, pointerEvents: "none",
    }}>
      <div style={{
        backgroundColor: "rgba(10,22,40,0.82)",
        borderLeft: `5px solid ${GOLD}`,
        borderRadius: 10,
        padding: "14px 28px",
        maxWidth: "92%",
      }}>
        <span style={{
          fontFamily: FONT_BODY,
          fontSize: 40,
          fontWeight: 700,
          color: WHITE,
          lineHeight: 1.35,
          textAlign: "center",
          display: "block",
        }}>
          {active.texto}
        </span>
      </div>
    </div>
  );
};

// ─── COMPONENTE: BADGE TELÉFONO ───────────────────────────────────────────────

const PhoneBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START = s(20);
  const appear = spring({ frame: Math.max(0, frame - START), fps, config: { stiffness: 200, damping: 20 }, durationInFrames: 12 });
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  if (frame < START) return null;

  return (
    <div style={{
      position: "absolute", top: 140, right: 36,
      opacity, pointerEvents: "none",
      backgroundColor: "rgba(10,22,40,0.88)",
      border: `2px solid ${GOLD}`,
      borderRadius: 12,
      padding: "10px 18px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
    }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: 18, color: GOLD, fontWeight: 700, letterSpacing: 1 }}>LLAME AHORA</span>
      <span style={{ fontFamily: FONT_TITLE, fontSize: 26, color: WHITE, fontWeight: 900 }}>{PHONE}</span>
    </div>
  );
};

// ─── COMPONENTE: REVEAL FINAL DEL LOGO ───────────────────────────────────────

const LogoReveal: React.FC<{ startSeg: number }> = ({ startSeg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START = s(startSeg);
  const relFrame = frame - START;

  if (frame < START) return null;

  // Overlay oscuro progresivo
  const overlayOpacity = interpolate(relFrame, [0, s(1)], [0, 0.92], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Logo
  const logoSpring = spring({ frame: Math.max(0, relFrame - s(0.4)), fps, config: { stiffness: 100, damping: 16 }, durationInFrames: 20 });
  const logoScale  = interpolate(logoSpring, [0, 1], [0.6, 1]);
  const logoOp     = interpolate(logoSpring, [0, 1], [0, 1]);

  // Línea dorada
  const lineWidth = interpolate(Math.max(0, relFrame - s(0.8)), [0, s(0.7)], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Nombre
  const nameSpring = spring({ frame: Math.max(0, relFrame - s(1.2)), fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 18 });
  const nameOp  = interpolate(nameSpring, [0, 1], [0, 1]);
  const nameY   = interpolate(nameSpring, [0, 1], [20, 0]);

  // Teléfono final
  const phoneOp = interpolate(relFrame, [s(2.2), s(2.8)], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Pulso CTA
  const pulse = 1 + Math.sin((relFrame / fps) * Math.PI * 2) * 0.022;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Overlay oscuro */}
      <AbsoluteFill style={{ backgroundColor: NAVY, opacity: overlayOpacity }} />

      {/* Contenido centrado */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "0 80px" }}>

        {/* Logo */}
        <div style={{ opacity: logoOp, transform: `scale(${logoScale})`, width: 280, height: 140 }}>
          <Img
            src={staticFile("imagenes/LOGO1.png")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        {/* Línea dorada */}
        <div style={{
          height: 3, width: `${lineWidth}%`,
          background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
          borderRadius: 2,
        }} />

        {/* Nombre del estudio */}
        <div style={{ opacity: nameOp, transform: `translateY(${nameY}px)`, textAlign: "center" }}>
          <div style={{ fontFamily: FONT_TITLE, fontSize: 58, fontWeight: 900, color: WHITE, letterSpacing: 2, lineHeight: 1.15 }}>
            JUAN IDROVO
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 34, fontWeight: 600, color: GOLD, letterSpacing: 5, marginTop: 6 }}>
            A B O G A D O
          </div>
        </div>

        {/* CTA teléfono final */}
        <div style={{ opacity: phoneOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: 10 }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 28, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
            ✅ Consulta gratuita · Sin compromiso
          </div>
          <div style={{
            backgroundColor: GOLD, borderRadius: 14, padding: "20px 52px",
            transform: `scale(${pulse})`,
            boxShadow: `0 0 0 5px ${GOLD}44, 0 10px 36px rgba(0,0,0,0.6)`,
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <span style={{ fontSize: 38 }}>📞</span>
            <span style={{ fontFamily: FONT_TITLE, fontSize: 52, fontWeight: 900, color: NAVY, letterSpacing: 2 }}>
              {PHONE}
            </span>
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: "rgba(255,255,255,0.65)" }}>
            WhatsApp disponible
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── COMPOSICIÓN PRINCIPAL ────────────────────────────────────────────────────

export const VideoFinal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#05080F" }}>

      {/* ── VIDEO PRINCIPAL (duración real) ── */}
      <Sequence from={0} durationInFrames={s(DURACION_SEG)} layout="none">
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile("imagenes/vid_edc.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <CinematicGrade />
          <HookOverlay />
          <SubtitleTrack />
          <PhoneBadge />
        </AbsoluteFill>
      </Sequence>

      {/* ── OUTRO CARD — 8 segundos al final ── */}
      <Sequence from={s(DURACION_SEG)} durationInFrames={OUTRO_DURATION_FRAMES} layout="none">
        <OutroCard />
      </Sequence>

    </AbsoluteFill>
  );
};
