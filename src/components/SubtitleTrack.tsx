import React from "react";
import { useCurrentFrame, AbsoluteFill, interpolate } from "remotion";
import type { SubtitleClip, SubtitleStyle } from "../types";

const DEFAULT_STYLE: Required<SubtitleStyle> = {
  fontFamily: "Arial, sans-serif",
  fontSize: 42,
  fontWeight: "bold",
  color: "#ffffff",
  backgroundColor: "rgba(0,0,0,0.65)",
  backgroundOpacity: 0.65,
  borderRadius: 8,
  paddingX: 20,
  paddingY: 10,
  textAlign: "center",
  strokeColor: "transparent",
  strokeWidth: 0,
  shadowColor: "rgba(0,0,0,0.8)",
  shadowBlur: 4,
  position: "bottom",
  verticalOffset: 60,
};

interface SubtitleTrackProps {
  clip: SubtitleClip;
}

export const SubtitleTrack: React.FC<SubtitleTrackProps> = ({ clip }) => {
  const frame = useCurrentFrame();
  const absoluteFrame = clip.startFrame + frame;
  const style = { ...DEFAULT_STYLE, ...(clip.style ?? {}) };

  const currentEntry = clip.entries.find(
    (e) => absoluteFrame >= e.startFrame && absoluteFrame < e.endFrame
  );

  if (!currentEntry) return null;

  const entryDuration = currentEntry.endFrame - currentEntry.startFrame;
  const entryFrame = absoluteFrame - currentEntry.startFrame;

  // Fade in / out del texto
  const opacity = interpolate(
    entryFrame,
    [0, 4, entryDuration - 4, entryDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const verticalPosition =
    style.position === "top"
      ? { top: style.verticalOffset }
      : style.position === "middle"
      ? { top: "50%", transform: "translateY(-50%)" }
      : { bottom: style.verticalOffset };

  const fontWeightMap: Record<string, number> = {
    light: 300,
    normal: 400,
    bold: 700,
    extrabold: 800,
  };

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: style.position === "middle" ? "center" : "flex-end",
        justifyContent: "center",
        padding: `0 ${style.paddingX * 2}px`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform:
            style.position === "middle"
              ? "translate(-50%, -50%)"
              : "translateX(-50%)",
          ...verticalPosition,
          opacity: opacity * (clip.opacity ?? 1),
          backgroundColor: style.backgroundColor,
          borderRadius: style.borderRadius,
          padding: `${style.paddingY}px ${style.paddingX}px`,
          maxWidth: "85%",
          textAlign: style.textAlign as React.CSSProperties["textAlign"],
        }}
      >
        <span
          style={{
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: fontWeightMap[style.fontWeight] ?? 700,
            color: style.color,
            textShadow:
              style.shadowBlur > 0
                ? `0 2px ${style.shadowBlur}px ${style.shadowColor}`
                : "none",
            WebkitTextStroke:
              style.strokeWidth > 0
                ? `${style.strokeWidth}px ${style.strokeColor}`
                : "none",
            lineHeight: 1.3,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {currentEntry.text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
