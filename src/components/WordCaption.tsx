import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import type { WordCaptionClip, WordCaptionStyle } from "../types";

interface WordCaptionProps {
  clip: WordCaptionClip;
}

interface WordStyleConfig {
  containerBg: string;
  activeBg: string;
  activeColor: string;
  inactiveColor: string;
  activeScale: number;
  activeShadow: string;
  borderRadius: number;
  activeFilter: string;
}

function getStyleConfig(
  style: WordCaptionStyle = "tiktok",
  activeColor?: string,
  inactiveColor?: string,
  activeBg?: string
): WordStyleConfig {
  const configs: Record<WordCaptionStyle, WordStyleConfig> = {
    tiktok: {
      containerBg: "transparent",
      activeBg: activeBg ?? "#ffffff",
      activeColor: activeColor ?? "#000000",
      inactiveColor: inactiveColor ?? "#ffffff",
      activeScale: 1.05,
      activeShadow: "0 2px 8px rgba(0,0,0,0.5)",
      borderRadius: 6,
      activeFilter: "none",
    },
    karaoke: {
      containerBg: "rgba(0,0,0,0.55)",
      activeBg: "transparent",
      activeColor: activeColor ?? "#FFD700",
      inactiveColor: inactiveColor ?? "#ffffff",
      activeScale: 1.1,
      activeShadow: "0 0 12px rgba(255,215,0,0.7)",
      borderRadius: 0,
      activeFilter: "none",
    },
    bold_pop: {
      containerBg: "transparent",
      activeBg: "transparent",
      activeColor: activeColor ?? "#ffffff",
      inactiveColor: inactiveColor ?? "rgba(255,255,255,0.45)",
      activeScale: 1.25,
      activeShadow: "0 4px 16px rgba(0,0,0,0.8)",
      borderRadius: 0,
      activeFilter: "none",
    },
    highlight: {
      containerBg: "transparent",
      activeBg: activeBg ?? "#FF3B5C",
      activeColor: activeColor ?? "#ffffff",
      inactiveColor: inactiveColor ?? "#ffffff",
      activeScale: 1.05,
      activeShadow: "0 2px 10px rgba(255,59,92,0.6)",
      borderRadius: 8,
      activeFilter: "none",
    },
    outline: {
      containerBg: "transparent",
      activeBg: "transparent",
      activeColor: activeColor ?? "#ffffff",
      inactiveColor: inactiveColor ?? "rgba(255,255,255,0.5)",
      activeScale: 1.1,
      activeShadow: "none",
      borderRadius: 0,
      activeFilter: "none",
    },
    neon: {
      containerBg: "transparent",
      activeBg: "transparent",
      activeColor: activeColor ?? "#00FFFF",
      inactiveColor: inactiveColor ?? "rgba(255,255,255,0.5)",
      activeScale: 1.1,
      activeShadow:
        "0 0 8px #00FFFF, 0 0 20px #00FFFF, 0 0 40px rgba(0,255,255,0.4)",
      borderRadius: 0,
      activeFilter: "brightness(1.3)",
    },
  };
  return configs[style];
}

export const WordCaption: React.FC<WordCaptionProps> = ({ clip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteFrame = clip.startFrame + frame;

  const cfg = getStyleConfig(
    clip.captionStyle,
    clip.activeColor,
    clip.inactiveColor,
    clip.activeBackground
  );

  const fontSize = clip.fontSize ?? 58;
  const fontFamily = clip.fontFamily ?? "Arial Black, sans-serif";
  const verticalOffset = clip.verticalOffset ?? 280;

  // Encontrar qué palabras están "en el pasado" (ya pasaron), cuál es activa y cuáles futuras
  const activeIndex = clip.words.findIndex(
    (w) => absoluteFrame >= w.startFrame && absoluteFrame < w.endFrame
  );

  // Si no hay palabra activa pero ya empezó, mostrar la última pasada
  const lastPastIndex =
    activeIndex === -1
      ? clip.words.filter((w) => absoluteFrame >= w.endFrame).length - 1
      : -1;

  const displayIndex = activeIndex !== -1 ? activeIndex : lastPastIndex;
  if (displayIndex < 0) return null;

  // Agrupar palabras en líneas de máx ~4-5 palabras (para no salir de pantalla)
  const wordsPerLine = 4;
  const lineIndex = Math.floor(displayIndex / wordsPerLine);
  const lineStart = lineIndex * wordsPerLine;
  const lineWords = clip.words.slice(lineStart, lineStart + wordsPerLine);

  // Spring para la entrada de una nueva línea
  const lineChangedFrame = lineWords[0]?.startFrame
    ? Math.max(0, absoluteFrame - lineWords[0].startFrame)
    : 0;
  const lineEntrySpring = spring({
    frame: lineChangedFrame,
    fps,
    config: { stiffness: 200, damping: 20 },
    durationInFrames: 8,
  });
  const lineOpacity = interpolate(lineEntrySpring, [0, 1], [0.4, 1]);
  const lineY = interpolate(lineEntrySpring, [0, 1], [20, 0]);

  const positionStyle: React.CSSProperties =
    clip.position === "top"
      ? { top: verticalOffset }
      : clip.position === "middle"
      ? { top: "50%", transform: "translateY(-50%)" }
      : { bottom: verticalOffset };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        ...positionStyle,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 60px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 14px",
          backgroundColor: cfg.containerBg,
          borderRadius: 12,
          padding: cfg.containerBg !== "transparent" ? "12px 24px" : 0,
          opacity: lineOpacity,
          transform: `translateY(${lineY}px)`,
        }}
      >
        {lineWords.map((word, i) => {
          const wordIdx = lineStart + i;
          const isActive =
            absoluteFrame >= word.startFrame && absoluteFrame < word.endFrame;
          const isPast = absoluteFrame >= word.endFrame;

          // Spring por palabra cuando se activa
          const wordFrame = isActive
            ? Math.max(0, absoluteFrame - word.startFrame)
            : 0;
          const wordSpring = spring({
            frame: wordFrame,
            fps,
            config: { stiffness: 300, damping: 18 },
            durationInFrames: 6,
          });
          const wordScale = isActive
            ? interpolate(wordSpring, [0, 1], [1, cfg.activeScale])
            : 1;

          // Para bold_pop: las palabras pasadas se atenúan
          const opacity =
            clip.captionStyle === "bold_pop" && isPast
              ? 0.35
              : 1;

          return (
            <span
              key={wordIdx}
              style={{
                fontFamily,
                fontSize,
                fontWeight: clip.fontWeight
                  ? { light: 300, normal: 400, bold: 700, extrabold: 800 }[
                      clip.fontWeight
                    ]
                  : 900,
                color: isActive ? cfg.activeColor : cfg.inactiveColor,
                backgroundColor: isActive ? cfg.activeBg : "transparent",
                padding:
                  isActive && cfg.activeBg !== "transparent"
                    ? "4px 14px"
                    : "4px 4px",
                borderRadius: cfg.borderRadius,
                transform: `scale(${wordScale})`,
                display: "inline-block",
                textShadow: isActive ? cfg.activeShadow : "0 2px 4px rgba(0,0,0,0.8)",
                filter: isActive ? cfg.activeFilter : "none",
                opacity,
                transition: "color 0.05s",
                letterSpacing: "0.02em",
                lineHeight: 1,
                WebkitTextStroke:
                  clip.captionStyle === "outline"
                    ? isActive
                      ? "2px " + cfg.activeColor
                      : "1.5px rgba(255,255,255,0.5)"
                    : undefined,
              }}
            >
              {word.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
