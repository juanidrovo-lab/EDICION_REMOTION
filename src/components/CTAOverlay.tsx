import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { CTAClip } from "../types";
import { useAnimation } from "../animations";

const ICONS: Record<string, string> = {
  arrow:  "→",
  cart:   "🛒",
  star:   "⭐",
  fire:   "🔥",
  check:  "✓",
  link:   "🔗",
};

interface CTAOverlayProps {
  clip: CTAClip;
}

export const CTAOverlay: React.FC<CTAOverlayProps> = ({ clip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterAnim = useAnimation(clip.enterAnimation, clip.durationInFrames);

  const bg      = clip.backgroundColor ?? "#FF3B5C";
  const color   = clip.textColor       ?? "#ffffff";
  const accent  = clip.accentColor     ?? "#ffffff";

  const x = clip.x ?? 50;
  const y = clip.y ?? 85;

  // Pulsate: escala que oscila suavemente para llamar la atención
  const pulseScale = clip.pulsate
    ? 1 + Math.sin((frame / fps) * Math.PI * 2) * 0.025
    : 1;

  const opacity = enterAnim.opacity * (clip.opacity ?? 1);
  const enterTransform = enterAnim.transform !== "none" ? enterAnim.transform : "";

  // Pequeño efecto de entrada por spring independientemente del enterAnimation
  const entrySpring = spring({ frame, fps, config: { stiffness: 180, damping: 14 }, durationInFrames: 18 });
  const entryScale  = interpolate(entrySpring, [0, 1], [0.7, 1]);

  const combinedTransform = `translate(-50%, -50%) scale(${pulseScale * entryScale}) ${enterTransform}`.trim();

  const ctaType = clip.ctaType ?? "button";

  if (ctaType === "badge") {
    return (
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          top:  `${y}%`,
          transform: combinedTransform,
          opacity,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            background: `radial-gradient(circle at 35% 35%, ${bg}ee, ${bg})`,
            color,
            borderRadius: "50%",
            width: 180,
            height: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 0 6px ${accent}44, 0 8px 32px ${bg}88`,
            border: `3px solid ${accent}66`,
          }}
        >
          {clip.icon && (
            <span style={{ fontSize: 36, lineHeight: 1 }}>{ICONS[clip.icon]}</span>
          )}
          <span style={{ fontSize: 30, fontWeight: 900, fontFamily: "Arial Black, sans-serif", textAlign: "center", padding: "0 12px", lineHeight: 1.1 }}>
            {clip.text}
          </span>
          {clip.subtext && (
            <span style={{ fontSize: 18, fontWeight: 600, opacity: 0.9, marginTop: 4 }}>
              {clip.subtext}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (ctaType === "sticker") {
    return (
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          top:  `${y}%`,
          transform: combinedTransform,
          opacity,
          pointerEvents: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: bg,
          color,
          borderRadius: 16,
          padding: "14px 28px",
          border: `3px solid ${accent}`,
          boxShadow: `4px 4px 0px ${accent}`,
          fontFamily: "Arial Black, sans-serif",
          fontWeight: 900,
          fontSize: 36,
          whiteSpace: "nowrap",
        }}
      >
        {clip.icon && <span style={{ fontSize: 38 }}>{ICONS[clip.icon]}</span>}
        <span>{clip.text}</span>
        {clip.subtext && (
          <span style={{ fontSize: 22, fontWeight: 700, opacity: 0.85 }}>
            {clip.subtext}
          </span>
        )}
      </div>
    );
  }

  if (ctaType === "pill") {
    return (
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          top:  `${y}%`,
          transform: combinedTransform,
          opacity,
          pointerEvents: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          background: `linear-gradient(135deg, ${bg}, ${accent === "#ffffff" ? bg + "bb" : accent})`,
          color,
          borderRadius: 100,
          padding: "18px 44px",
          boxShadow: `0 8px 32px ${bg}99`,
          fontFamily: "Arial, sans-serif",
          fontWeight: 800,
          fontSize: 40,
          whiteSpace: "nowrap",
        }}
      >
        {clip.icon && <span style={{ fontSize: 40 }}>{ICONS[clip.icon]}</span>}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span>{clip.text}</span>
          {clip.subtext && (
            <span style={{ fontSize: 22, fontWeight: 500, opacity: 0.9 }}>
              {clip.subtext}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: button
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top:  `${y}%`,
        transform: combinedTransform,
        opacity,
        pointerEvents: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        backgroundColor: bg,
        color,
        borderRadius: 14,
        padding: "20px 48px",
        boxShadow: `0 8px 24px ${bg}88`,
        fontFamily: "Arial Black, sans-serif",
        fontWeight: 900,
        fontSize: 42,
        whiteSpace: "nowrap",
        minWidth: 320,
        justifyContent: "center",
      }}
    >
      {clip.icon && <span style={{ fontSize: 42 }}>{ICONS[clip.icon]}</span>}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span>{clip.text}</span>
        {clip.subtext && (
          <span style={{ fontSize: 22, fontWeight: 600, opacity: 0.85 }}>
            {clip.subtext}
          </span>
        )}
      </div>
    </div>
  );
};
