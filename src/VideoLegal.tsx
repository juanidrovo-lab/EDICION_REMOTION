/**
 * VIDEO LEGAL — Cobro de Deudas
 * Tono: profesional, serio, viral
 * Plataforma: TikTok / Reels 9:16 (1080×1920)
 * Duración: 50 segundos
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

// ─── PALETA Y TIPOGRAFÍA ──────────────────────────────────────────────────────

const NAVY     = "#0A1628";
const GOLD     = "#C9A227";
const GOLD_DIM = "rgba(201,162,39,0.85)";
const WHITE    = "#FFFFFF";
const PHONE    = "0958 607 184";

const FONT_TITLE = "Georgia, 'Times New Roman', serif";
const FONT_BODY  = "Arial, sans-serif";
const FONT_BOLD  = "Arial Black, sans-serif";

const FPS = 30;
const s   = (sec: number) => Math.round(sec * FPS);

// ─── CLIPS ────────────────────────────────────────────────────────────────────
// Cada clip: { from, duration } en segundos

const CLIPS = [
  { file: "1.MOV", from: 0,  dur: 7  },  // Hook visual
  { file: "2.MOV", from: 7,  dur: 5  },  // El problema
  { file: "3.MOV", from: 12, dur: 6  },  // Presentación abogado
  { file: "4.MOV", from: 18, dur: 6  },  // PASO 1
  { file: "5.MOV", from: 24, dur: 6  },  // PASO 2
  { file: "6.MOV", from: 30, dur: 6  },  // PASO 3
  { file: "7.MOV", from: 36, dur: 5  },  // Resultados
  { file: "8.MOV", from: 41, dur: 4  },  // Credibilidad
  { file: "9.MOV", from: 45, dur: 5  },  // CTA final
];

const TOTAL_SEC = 50;

// ─── COMPONENTES AUXILIARES ───────────────────────────────────────────────────

/** Clip de video con fade in / fade out */
const ClipLayer: React.FC<{ file: string; from: number; dur: number }> = ({
  file, from, dur,
}) => {
  const frame = useCurrentFrame();
  const FADE = s(0.4);

  const opacity = interpolate(
    frame,
    [0, FADE, s(dur) - FADE, s(dur)],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Ken Burns: zoom muy sutil para dinamismo
  const scale = interpolate(frame, [0, s(dur)], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <OffthreadVideo
        src={staticFile(`imagenes/${file}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
        muted
      />
    </AbsoluteFill>
  );
};

/** Overlay de gradiente — da look cinematográfico y hace el texto legible */
const CinematicGrade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {/* Viñeta perimetral */}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,10,20,0.7) 100%)",
      }}
    />
    {/* Degradado inferior oscuro */}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to top, rgba(5,10,20,0.92) 0%, rgba(5,10,20,0.55) 35%, transparent 60%)",
      }}
    />
    {/* Degradado superior leve */}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(5,10,20,0.6) 0%, transparent 25%)",
      }}
    />
  </AbsoluteFill>
);

/** Línea dorada + texto inferior estilo lower-third */
const LowerThird: React.FC<{
  label: string;
  subtitle?: string;
  startFrame: number;
  endFrame: number;
}> = ({ label, subtitle, startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;
  const appear = spring({ frame: relFrame, fps, config: { stiffness: 180, damping: 20 }, durationInFrames: 14 });
  const disappear = interpolate(frame, [endFrame - s(0.4), endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(appear, disappear);
  const slideX = interpolate(appear, [0, 1], [-60, 0]);

  if (frame < startFrame || frame > endFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 340,
        left: 60,
        right: 60,
        opacity,
        transform: `translateX(${slideX}px)`,
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <div style={{ width: 6, height: 44, backgroundColor: GOLD, borderRadius: 3, flexShrink: 0 }} />
        <span
          style={{
            fontFamily: FONT_BOLD,
            fontSize: 30,
            fontWeight: 900,
            color: GOLD,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      {subtitle && (
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 26,
            color: "rgba(255,255,255,0.8)",
            paddingLeft: 20,
            lineHeight: 1.3,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};

/** Badge de paso numerado (PASO 1 DE 3) */
const StepBadge: React.FC<{
  step: number;
  total: number;
  text: string;
  startFrame: number;
  endFrame: number;
}> = ({ step, total, text, startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;
  const pop = spring({ frame: relFrame, fps, config: { stiffness: 250, damping: 18 }, durationInFrames: 12 });
  const disappear = interpolate(frame, [endFrame - s(0.5), endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(pop, disappear);
  const scale = interpolate(pop, [0, 1], [0.6, 1]);

  if (frame < startFrame || frame > endFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 180,
        left: "50%",
        transform: `translateX(-50%) scale(${scale})`,
        opacity,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Número */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          backgroundColor: GOLD,
          border: `4px solid ${WHITE}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 30px ${GOLD}88`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_BOLD,
            fontSize: 48,
            fontWeight: 900,
            color: NAVY,
            lineHeight: 1,
          }}
        >
          {step}
        </span>
      </div>

      {/* "PASO X DE Y" */}
      <div
        style={{
          backgroundColor: NAVY,
          border: `2px solid ${GOLD}`,
          borderRadius: 8,
          padding: "6px 18px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: 22,
            fontWeight: 700,
            color: GOLD,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          PASO {step} DE {total}
        </span>
      </div>

      {/* Texto del paso */}
      <div
        style={{
          maxWidth: 700,
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_BOLD,
            fontSize: 52,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 1.15,
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/** Texto grande de hook — primeros segundos */
const HookText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ frame, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 20 });
  const disappear = interpolate(frame, [s(4.5), s(5.5)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(appear, disappear);
  const slideY = interpolate(appear, [0, 1], [50, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 70px",
        opacity,
        transform: `translateY(${slideY}px)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: FONT_BOLD,
          fontSize: 92,
          fontWeight: 900,
          color: WHITE,
          textAlign: "center",
          lineHeight: 1.1,
          textShadow: "0 6px 30px rgba(0,0,0,0.95)",
        }}
      >
        Si te deben dinero
      </div>
      <div
        style={{
          fontFamily: FONT_BOLD,
          fontSize: 92,
          fontWeight: 900,
          color: GOLD,
          textAlign: "center",
          lineHeight: 1.1,
          marginTop: 8,
          textShadow: `0 0 40px ${GOLD}66, 0 6px 20px rgba(0,0,0,0.9)`,
        }}
      >
        esto es lo que
      </div>
      <div
        style={{
          fontFamily: FONT_BOLD,
          fontSize: 92,
          fontWeight: 900,
          color: WHITE,
          textAlign: "center",
          lineHeight: 1.1,
          textShadow: "0 6px 30px rgba(0,0,0,0.95)",
        }}
      >
        debes hacer
      </div>
    </div>
  );
};

/** CTA final con número de teléfono */
const PhoneCTA: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;
  const appear = spring({ frame: relFrame, fps, config: { stiffness: 150, damping: 18 }, durationInFrames: 18 });
  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const scale  = interpolate(appear, [0, 1], [0.8, 1]);

  // Pulsate en el número
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 2.2) * 0.02;

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 260,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        opacity,
        transform: `scale(${scale})`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: 34,
          fontWeight: 700,
          color: "rgba(255,255,255,0.9)",
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        ✅ Consulta GRATUITA · Llámanos ahora
      </div>

      {/* Número */}
      <div
        style={{
          backgroundColor: GOLD,
          borderRadius: 16,
          padding: "22px 60px",
          transform: `scale(${pulse})`,
          boxShadow: `0 0 0 6px ${GOLD}44, 0 12px 40px rgba(0,0,0,0.6)`,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 42 }}>📞</span>
        <span
          style={{
            fontFamily: FONT_BOLD,
            fontSize: 58,
            fontWeight: 900,
            color: NAVY,
            letterSpacing: 2,
          }}
        >
          {PHONE}
        </span>
      </div>

      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: 28,
          fontWeight: 600,
          color: "rgba(255,255,255,0.75)",
          textAlign: "center",
        }}
      >
        También por WhatsApp
      </div>
    </div>
  );
};

/** Badge pequeño con teléfono persistente desde el minuto 1 */
const PhoneBadge: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;
  const appear = spring({ frame: relFrame, fps, config: { stiffness: 180, damping: 20 }, durationInFrames: 12 });
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 140,
        right: 40,
        opacity,
        backgroundColor: "rgba(10,22,40,0.85)",
        border: `2px solid ${GOLD}`,
        borderRadius: 12,
        padding: "10px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <span style={{ fontSize: 16, color: GOLD, fontFamily: FONT_BODY, fontWeight: 700, letterSpacing: 1 }}>
        LLAMA YA
      </span>
      <span style={{ fontSize: 24, color: WHITE, fontFamily: FONT_BOLD, fontWeight: 900 }}>
        {PHONE}
      </span>
    </div>
  );
};

/** Logo en esquina superior izquierda */
const LogoOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ frame, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 18 });
  const opacity = interpolate(appear, [0, 1], [0, 0.9]);

  return (
    <div
      style={{
        position: "absolute",
        top: 140,
        left: 40,
        opacity,
        pointerEvents: "none",
        width: 160,
        height: 80,
      }}
    >
      <Img
        src={staticFile("imagenes/LOGO1.png")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

// ─── COMPOSICIÓN PRINCIPAL ────────────────────────────────────────────────────

export const VideoLegal: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080F" }}>

      {/* ── CLIPS DE VIDEO ─────────────────────────── */}
      {CLIPS.map((clip) => (
        <Sequence key={clip.file} from={s(clip.from)} durationInFrames={s(clip.dur)} layout="none">
          <ClipLayer file={clip.file} from={clip.from} dur={clip.dur} />
        </Sequence>
      ))}

      {/* ── GRADING CINEMATOGRÁFICO ─────────────────── */}
      <CinematicGrade />

      {/* ── HOOK (0–6s) ─────────────────────────────── */}
      <Sequence from={0} durationInFrames={s(6)} layout="none">
        <HookText />
      </Sequence>

      {/* ── LOWER THIRD — EL PROBLEMA (7–12s) ──────── */}
      <LowerThird
        label="¿TE HAN DEJADO DE PAGAR?"
        subtitle="Miles de personas pierden su dinero por no saber cómo actuar"
        startFrame={s(7)}
        endFrame={s(12)}
      />

      {/* ── LOWER THIRD — CREDIBILIDAD (12–18s) ─────── */}
      <LowerThird
        label="Tenés derechos. Usálos."
        subtitle="La ley te protege y existen herramientas legales para recuperar lo tuyo"
        startFrame={s(12)}
        endFrame={s(18)}
      />

      {/* ── PASO 1 (18–24s) ─────────────────────────── */}
      <StepBadge
        step={1} total={3}
        text="Reúne toda la documentación de la deuda"
        startFrame={s(18)} endFrame={s(24)}
      />
      <LowerThird
        label="PASO 1"
        subtitle="Contratos, facturas, mensajes o cualquier prueba del dinero adeudado"
        startFrame={s(18)} endFrame={s(24)}
      />

      {/* ── PASO 2 (24–30s) ─────────────────────────── */}
      <StepBadge
        step={2} total={3}
        text="Envía una carta documento certificada"
        startFrame={s(24)} endFrame={s(30)}
      />
      <LowerThird
        label="PASO 2"
        subtitle="Es el primer paso legal obligatorio para exigir el pago formalmente"
        startFrame={s(24)} endFrame={s(30)}
      />

      {/* ── PASO 3 (30–36s) ─────────────────────────── */}
      <StepBadge
        step={3} total={3}
        text="Inicia acción judicial para recuperar tu dinero"
        startFrame={s(30)} endFrame={s(36)}
      />
      <LowerThird
        label="PASO 3"
        subtitle="Con nuestro respaldo legal recuperás lo que te deben con intereses"
        startFrame={s(30)} endFrame={s(36)}
      />

      {/* ── RESULTADOS (36–45s) ──────────────────────── */}
      <LowerThird
        label="YA RECUPERAMOS MILLONES"
        subtitle="Más de 500 casos exitosos de cobro de deudas en los últimos 3 años"
        startFrame={s(36)} endFrame={s(42)}
      />
      <LowerThird
        label="NO COBRO — NO PAGAS"
        subtitle="Solo cobramos honorarios cuando recuperás tu dinero"
        startFrame={s(42)} endFrame={s(45)}
      />

      {/* ── CTA FINAL (45–50s) ───────────────────────── */}
      <Sequence from={s(45)} durationInFrames={s(5)} layout="none">
        <AbsoluteFill style={{ backgroundColor: "rgba(5,8,15,0.65)" }} />
      </Sequence>
      <PhoneCTA startFrame={s(45)} />

      {/* ── BADGE DE TELÉFONO PERSISTENTE (desde 18s) ── */}
      <PhoneBadge startFrame={s(18)} />

      {/* ── LOGO (siempre visible) ───────────────────── */}
      <LogoOverlay />

    </AbsoluteFill>
  );
};
