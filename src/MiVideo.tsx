/**
 * =====================================================
 *  MI VIDEO — Editá solo este archivo
 * =====================================================
 *
 *  1. Poné tus archivos en la carpeta public/
 *  2. Cambiá los datos de abajo
 *  3. Guardá y el Studio se actualiza solo
 * =====================================================
 */

import React from "react";
import { Composition, staticFile } from "remotion";
import { MainComposition } from "./compositions/MainComposition";
import type { VideoProject } from "./types";

// ─────────────────────────────────────────────────────
//  CONFIGURACIÓN DEL VIDEO
// ─────────────────────────────────────────────────────

const FPS = 30;
const seg = (s: number) => Math.round(s * FPS); // convierte segundos a frames

export const miVideo: VideoProject = {
  id: "mi-video",
  name: "Mi Video",

  // Plataforma — elegí una:
  // "tiktok" | "reels" | "stories" | "instagram_feed_square" | "meta_ads_vertical" | "facebook_feed"
  platform: "tiktok",

  fps: FPS,
  width: 1080,
  height: 1920,
  durationInFrames: seg(30), // duración total del video en segundos

  backgroundColor: "#000000",
  showSafeZone: true, // ponelo en false cuando ya estés conforme con el resultado

  // ─────────────────────────────────────────────────
  //  PISTAS
  // ─────────────────────────────────────────────────
  tracks: [

    // ── PISTA DE VIDEO / IMÁGENES ─────────────────
    {
      id: "track-video",
      name: "Video",
      type: "video",
      clips: [

        // CLIP 1 — reemplazá con tu archivo
        {
          id: "clip-1",
          type: "image",                           // "image" o "video"
          src: staticFile("imagenes/foto1.jpg"),   // ruta dentro de public/
          // src: "https://url-de-tu-imagen.jpg",  // o una URL directa
          startFrame: seg(0),                      // empieza en el segundo 0
          durationInFrames: seg(10),               // dura 10 segundos
          trackIndex: 0,
          enterAnimation: { type: "fadeIn", durationInFrames: seg(0.5) },
          exitAnimation:  { type: "fadeOut", durationInFrames: seg(0.5) },
        },

        // CLIP 2 — reemplazá con tu archivo
        {
          id: "clip-2",
          type: "image",
          src: staticFile("imagenes/foto2.jpg"),
          startFrame: seg(10),
          durationInFrames: seg(10),
          trackIndex: 0,
          enterAnimation: { type: "slideInLeft", durationInFrames: seg(0.6) },
          exitAnimation:  { type: "fadeOut", durationInFrames: seg(0.5) },
        },

        // CLIP 3 — reemplazá con tu archivo
        {
          id: "clip-3",
          type: "image",
          src: staticFile("imagenes/foto3.jpg"),
          startFrame: seg(20),
          durationInFrames: seg(10),
          trackIndex: 0,
          enterAnimation: { type: "zoomIn", durationInFrames: seg(0.7), easing: "spring" },
          exitAnimation:  { type: "fadeOut", durationInFrames: seg(0.5) },
        },

        // ✏️ Para agregar más clips copiá uno de los bloques de arriba
        // y cambiá: id, src, startFrame, durationInFrames
      ],
    },

    // ── PISTA DE TEXTO ────────────────────────────
    {
      id: "track-texto",
      name: "Textos",
      type: "text",
      clips: [

        // TÍTULO PRINCIPAL
        {
          id: "titulo",
          type: "text",
          text: "Tu título acá",       // ✏️ cambiá el texto
          x: 50,                       // posición horizontal (0-100%)
          y: 40,                       // posición vertical (0-100%)
          startFrame: seg(0.5),
          durationInFrames: seg(4),
          trackIndex: 1,
          enterAnimation: { type: "slideInUp", durationInFrames: seg(0.5), easing: "spring" },
          exitAnimation:  { type: "fadeOut",   durationInFrames: seg(0.4) },
          style: {
            fontSize: 90,
            fontWeight: "extrabold",
            color: "#ffffff",
            textAlign: "center",
            shadowBlur: 15,
            shadowColor: "rgba(0,0,0,0.8)",
          },
        },

        // SUBTÍTULO
        {
          id: "subtitulo",
          type: "text",
          text: "Tu subtítulo acá",    // ✏️ cambiá el texto
          x: 50,
          y: 54,
          startFrame: seg(1),
          durationInFrames: seg(3),
          trackIndex: 1,
          enterAnimation: { type: "fadeIn", durationInFrames: seg(0.4) },
          exitAnimation:  { type: "fadeOut", durationInFrames: seg(0.3) },
          style: {
            fontSize: 42,
            fontWeight: "normal",
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
          },
        },

        // CTA FINAL — llamada a la acción
        {
          id: "cta-final",
          type: "text",
          subtitleType: "cta",
          text: "¡Seguime!",           // ✏️ cambiá el texto
          subtext: "Link en bio",
          x: 50,
          y: 82,
          startFrame: seg(26),
          durationInFrames: seg(4),
          trackIndex: 1,
          enterAnimation: { type: "bounceIn", durationInFrames: seg(0.6), easing: "bounce" },
          ctaType: "pill",
          backgroundColor: "#FF3B5C",
          icon: "arrow",
          pulsate: true,
        } as any,

        // ✏️ Para agregar más textos copiá uno de los bloques de arriba
      ],
    },

    // ── PISTA DE SUBTÍTULOS (CAPTIONS) ────────────
    {
      id: "track-subs",
      name: "Subtítulos",
      type: "text",
      clips: [
        {
          id: "subs",
          type: "text",
          subtitleType: "subtitle",
          startFrame: 0,
          durationInFrames: seg(30),
          trackIndex: 2,
          entries: [
            // ✏️ Cada línea: startFrame y endFrame en segundos (usando seg())
            { startFrame: seg(2),  endFrame: seg(5),  text: "Primer subtítulo acá" },
            { startFrame: seg(6),  endFrame: seg(9),  text: "Segundo subtítulo acá" },
            { startFrame: seg(10), endFrame: seg(13), text: "Tercer subtítulo acá" },
            // Agregá más líneas acá...
          ],
          style: {
            fontSize: 44,
            fontWeight: "bold",
            color: "#ffffff",
            backgroundColor: "rgba(0,0,0,0.6)",
            position: "bottom",
            verticalOffset: 120,
          },
        } as any,
      ],
    },

  ],

  // ── TRANSICIONES ENTRE CLIPS ──────────────────────
  transitions: [
    {
      id: "trans-1",
      type: "crossfade",       // "crossfade" | "wipeLeft" | "wipeRight" | "zoomCross" | "glitch"
      durationInFrames: seg(0.5),
      fromClipId: "clip-1",
      toClipId: "clip-2",
    },
    {
      id: "trans-2",
      type: "wipeLeft",
      durationInFrames: seg(0.5),
      fromClipId: "clip-2",
      toClipId: "clip-3",
    },
  ],

  // ── MÚSICA DE FONDO ───────────────────────────────
  globalAudio: [
    // Descomentá esto cuando tengas un archivo de audio:
    // {
    //   id: "musica",
    //   type: "audio",
    //   src: staticFile("audio/musica.mp3"),
    //   startFrame: 0,
    //   durationInFrames: seg(30),
    //   trackIndex: 3,
    //   volume: 0.4,          // 0 = silencio, 1 = volumen completo
    //   fadeInFrames: seg(1),
    //   fadeOutFrames: seg(2),
    // },
  ],
};

// ─────────────────────────────────────────────────────
//  COMPOSICIÓN — no toques esto
// ─────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnyComp = MainComposition as React.FC<any>;

export const MiVideoComposition: React.FC = () => {
  return (
    <Composition
      id="MiVideo"
      component={AnyComp}
      durationInFrames={miVideo.durationInFrames}
      fps={miVideo.fps}
      width={miVideo.width}
      height={miVideo.height}
      defaultProps={miVideo}
    />
  );
};
