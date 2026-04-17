import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { TextClip, TextStyle } from "../types";
import { useAnimation } from "../animations";

interface TextOverlayProps {
  clip: TextClip;
}

const DEFAULT_TEXT_STYLE: Required<TextStyle> = {
  fontFamily: "Arial, sans-serif",
  fontSize: 60,
  fontWeight: "bold",
  color: "#ffffff",
  textAlign: "center",
  lineHeight: 1.2,
  letterSpacing: 0,
  strokeColor: "transparent",
  strokeWidth: 0,
  shadowColor: "rgba(0,0,0,0.5)",
  shadowBlur: 6,
  gradient: { from: "#ffffff", to: "#ffffff", direction: "horizontal" },
};

function buildGradient(style: Required<TextStyle>): string | undefined {
  const g = style.gradient;
  if (!g || g.from === g.to) return undefined;
  const dir =
    g.direction === "vertical"
      ? "to bottom"
      : g.direction === "diagonal"
      ? "135deg"
      : "to right";
  return `linear-gradient(${dir}, ${g.from}, ${g.to})`;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({ clip }) => {
  const frame = useCurrentFrame();
  const style = { ...DEFAULT_TEXT_STYLE, ...(clip.style ?? {}) };
  const enterAnim = useAnimation(clip.enterAnimation, clip.durationInFrames);
  const exitAnim = useAnimation(clip.exitAnimation, clip.durationInFrames, true);

  // Typewriter effect
  const isTypewriter = clip.enterAnimation?.type === "typewriter";
  const visibleChars = isTypewriter
    ? Math.floor(
        interpolate(
          frame,
          [0, clip.enterAnimation!.durationInFrames],
          [0, clip.text.length],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      )
    : clip.text.length;

  const displayText = clip.text.slice(0, visibleChars);

  const opacity = Math.min(enterAnim.opacity, exitAnim.opacity) * (clip.opacity ?? 1);
  const transform =
    enterAnim.transform !== "none" ? enterAnim.transform : exitAnim.transform;

  const gradient = buildGradient(style);
  const fontWeightMap: Record<string, number> = {
    light: 300,
    normal: 400,
    bold: 700,
    extrabold: 800,
  };

  const x = clip.x ?? 50;
  const y = clip.y ?? 50;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) ${transform}`,
        opacity,
        textAlign: style.textAlign as React.CSSProperties["textAlign"],
        maxWidth: "80%",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: fontWeightMap[style.fontWeight] ?? 700,
          color: gradient ? "transparent" : style.color,
          background: gradient ?? undefined,
          WebkitBackgroundClip: gradient ? "text" : undefined,
          backgroundClip: gradient ? "text" : undefined,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
          WebkitTextStroke:
            style.strokeWidth > 0
              ? `${style.strokeWidth}px ${style.strokeColor}`
              : undefined,
          textShadow:
            style.shadowBlur > 0
              ? `0 2px ${style.shadowBlur}px ${style.shadowColor}`
              : undefined,
          whiteSpace: "pre-wrap",
          display: "block",
        }}
      >
        {displayText}
      </span>
    </div>
  );
};
