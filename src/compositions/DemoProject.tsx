import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import type { VideoProject } from "../types";
import { MainComposition } from "./MainComposition";

/**
 * Proyecto de demostración que muestra todas las funcionalidades:
 * - Clips de imagen con animaciones (fade, slide, zoom)
 * - Transiciones entre clips (crossfade, wipe, zoomCross, glitch)
 * - Subtítulos automáticos con estilo
 * - Texto animado (typewriter, bounceIn, slideIn)
 * - Audio de fondo con fade in/out
 *
 * Resolución: 1920x1080 @ 30fps  |  Duración: 15 seg = 450 frames
 */

const FPS = 30;
const W = 1920;
const H = 1080;

const sec = (s: number) => Math.round(s * FPS);

export const demoProject: VideoProject = {
  id: "demo-001",
  name: "Demo Remotion Editor",
  fps: FPS,
  width: W,
  height: H,
  durationInFrames: sec(15),
  backgroundColor: "#0a0a0a",

  tracks: [
    // ── Pista de video / imágenes ──────────────────────────────────────────
    {
      id: "track-video",
      name: "Video Principal",
      type: "video",
      clips: [
        // Clip 1: pantalla de título pura (fondo degradado)
        {
          id: "clip-bg-1",
          type: "image",
          src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
          startFrame: 0,
          durationInFrames: sec(5),
          trackIndex: 0,
          enterAnimation: { type: "fadeIn", durationInFrames: sec(0.6), easing: "easeOut" },
          exitAnimation: { type: "fadeOut", durationInFrames: sec(0.5), easing: "easeIn" },
        },
        // Clip 2
        {
          id: "clip-bg-2",
          type: "image",
          src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80",
          startFrame: sec(5),
          durationInFrames: sec(5),
          trackIndex: 0,
          enterAnimation: { type: "zoomIn", durationInFrames: sec(0.8), easing: "spring" },
          exitAnimation: { type: "fadeOut", durationInFrames: sec(0.4), easing: "easeIn" },
        },
        // Clip 3
        {
          id: "clip-bg-3",
          type: "image",
          src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80",
          startFrame: sec(10),
          durationInFrames: sec(5),
          trackIndex: 0,
          enterAnimation: { type: "slideInLeft", durationInFrames: sec(0.7), easing: "easeOut" },
          exitAnimation: { type: "fadeOut", durationInFrames: sec(0.6), easing: "easeIn" },
        },
      ],
    },

    // ── Pista de texto / overlays ──────────────────────────────────────────
    {
      id: "track-text",
      name: "Títulos y Textos",
      type: "text",
      clips: [
        // Título principal con typewriter
        {
          id: "clip-title",
          type: "text",
          text: "REMOTION\nVIDEO EDITOR",
          x: 50,
          y: 42,
          startFrame: sec(0.3),
          durationInFrames: sec(3.5),
          trackIndex: 1,
          enterAnimation: { type: "typewriter", durationInFrames: sec(1.2), easing: "linear" },
          exitAnimation: { type: "fadeOut", durationInFrames: sec(0.5) },
          style: {
            fontFamily: "Arial Black, sans-serif",
            fontSize: 100,
            fontWeight: "extrabold",
            color: "transparent",
            gradient: { from: "#f8f8f8", to: "#aaaaaa", direction: "vertical" },
            textAlign: "center",
            letterSpacing: 8,
            strokeColor: "#ffffff",
            strokeWidth: 1,
            shadowColor: "rgba(0,0,0,0.8)",
            shadowBlur: 20,
          },
        },
        // Subtítulo secundario — bounce in
        {
          id: "clip-subtitle-text",
          type: "text",
          text: "Animaciones · Transiciones · Música · Subtítulos",
          x: 50,
          y: 60,
          startFrame: sec(1),
          durationInFrames: sec(3),
          trackIndex: 1,
          enterAnimation: { type: "slideInUp", durationInFrames: sec(0.6), easing: "spring" },
          exitAnimation: { type: "slideOutDown", durationInFrames: sec(0.4) },
          style: {
            fontFamily: "Arial, sans-serif",
            fontSize: 36,
            fontWeight: "normal",
            color: "#cccccc",
            textAlign: "center",
            letterSpacing: 3,
            shadowBlur: 4,
            shadowColor: "rgba(0,0,0,0.6)",
          },
        },
        // Label "clip 2"
        {
          id: "clip-label-2",
          type: "text",
          text: "Montañas Nevadas",
          x: 50,
          y: 50,
          startFrame: sec(5.3),
          durationInFrames: sec(3),
          trackIndex: 1,
          enterAnimation: { type: "bounceIn", durationInFrames: sec(0.8), easing: "bounce" },
          exitAnimation: { type: "zoomOut", durationInFrames: sec(0.5) },
          style: {
            fontFamily: "Arial, sans-serif",
            fontSize: 72,
            fontWeight: "bold",
            color: "transparent",
            gradient: { from: "#74ebd5", to: "#9face6", direction: "horizontal" },
            textAlign: "center",
            shadowBlur: 15,
            shadowColor: "rgba(0,0,0,0.7)",
          },
        },
        // Label "clip 3" — slide desde la derecha
        {
          id: "clip-label-3",
          type: "text",
          text: "Ciudad de Noche",
          x: 50,
          y: 50,
          startFrame: sec(10.3),
          durationInFrames: sec(3),
          trackIndex: 1,
          enterAnimation: { type: "slideInRight", durationInFrames: sec(0.6), easing: "easeOut" },
          exitAnimation: { type: "slideOutLeft", durationInFrames: sec(0.5) },
          style: {
            fontFamily: "Arial, sans-serif",
            fontSize: 72,
            fontWeight: "bold",
            color: "transparent",
            gradient: { from: "#f7971e", to: "#ffd200", direction: "diagonal" },
            textAlign: "center",
            shadowBlur: 15,
            shadowColor: "rgba(0,0,0,0.7)",
          },
        },
        // CTA final
        {
          id: "clip-cta",
          type: "text",
          text: "¡Empieza a crear!",
          x: 50,
          y: 70,
          startFrame: sec(13),
          durationInFrames: sec(2),
          trackIndex: 1,
          enterAnimation: { type: "fadeIn", durationInFrames: sec(0.5) },
          exitAnimation: { type: "fadeOut", durationInFrames: sec(0.4) },
          style: {
            fontFamily: "Arial, sans-serif",
            fontSize: 48,
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
            strokeColor: "#f0a500",
            strokeWidth: 2,
          },
        },
      ],
    },

    // ── Pista de subtítulos ────────────────────────────────────────────────
    {
      id: "track-subs",
      name: "Subtítulos",
      type: "text",
      clips: [
        {
          id: "clip-subs",
          type: "text",
          subtitleType: "subtitle",
          startFrame: 0,
          durationInFrames: sec(15),
          trackIndex: 2,
          entries: [
            { startFrame: sec(0.5), endFrame: sec(2.5), text: "Bienvenido al editor de video con Remotion" },
            { startFrame: sec(3), endFrame: sec(4.8), text: "Crea videos increíbles con código TypeScript" },
            { startFrame: sec(5.5), endFrame: sec(7), text: "Paisajes impresionantes como telón de fondo" },
            { startFrame: sec(7.5), endFrame: sec(9.5), text: "Cada clip puede tener su propia animación" },
            { startFrame: sec(10.5), endFrame: sec(12), text: "Las transiciones dan vida a tu historia" },
            { startFrame: sec(12.5), endFrame: sec(14.5), text: "¡Remotion — el futuro del video programático!" },
          ],
          style: {
            fontFamily: "Arial, sans-serif",
            fontSize: 38,
            fontWeight: "bold",
            color: "#ffffff",
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: 8,
            paddingX: 24,
            paddingY: 10,
            position: "bottom",
            verticalOffset: 70,
            shadowBlur: 4,
            shadowColor: "rgba(0,0,0,0.9)",
          },
        } as any,
      ],
    },
  ],

  // ── Transiciones entre clips de video ─────────────────────────────────────
  transitions: [
    {
      id: "trans-1",
      type: "crossfade",
      durationInFrames: sec(0.5),
      fromClipId: "clip-bg-1",
      toClipId: "clip-bg-2",
    },
    {
      id: "trans-2",
      type: "wipeLeft",
      durationInFrames: sec(0.6),
      fromClipId: "clip-bg-2",
      toClipId: "clip-bg-3",
    },
  ],
};

export const DemoComposition: React.FC = () => {
  return <MainComposition {...demoProject} />;
};
