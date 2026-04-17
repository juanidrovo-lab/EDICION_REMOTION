import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";
import type { TransitionType } from "../types";

interface TransitionRendererProps {
  type: TransitionType;
  durationInFrames: number;
  fromContent: React.ReactNode;
  toContent: React.ReactNode;
  /** Frame relativo al inicio de la transición (0 a durationInFrames) */
  transitionFrame: number;
}

export const TransitionRenderer: React.FC<TransitionRendererProps> = ({
  type,
  durationInFrames,
  fromContent,
  toContent,
  transitionFrame,
}) => {
  const { fps } = useVideoConfig();
  const p = Math.min(Math.max(transitionFrame / durationInFrames, 0), 1);

  switch (type) {
    case "cut":
      return (
        <AbsoluteFill>
          {p < 0.5 ? fromContent : toContent}
        </AbsoluteFill>
      );

    case "crossfade":
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{ opacity: 1 - p }}>{fromContent}</AbsoluteFill>
          <AbsoluteFill style={{ opacity: p }}>{toContent}</AbsoluteFill>
        </AbsoluteFill>
      );

    case "wipeLeft": {
      const clipX = interpolate(p, [0, 1], [100, 0]);
      return (
        <AbsoluteFill>
          <AbsoluteFill>{fromContent}</AbsoluteFill>
          <AbsoluteFill
            style={{ clipPath: `inset(0 ${clipX}% 0 0)` }}
          >
            {toContent}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }

    case "wipeRight": {
      const clipX = interpolate(p, [0, 1], [100, 0]);
      return (
        <AbsoluteFill>
          <AbsoluteFill>{fromContent}</AbsoluteFill>
          <AbsoluteFill
            style={{ clipPath: `inset(0 0 0 ${clipX}%)` }}
          >
            {toContent}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }

    case "wipeUp": {
      const clipY = interpolate(p, [0, 1], [100, 0]);
      return (
        <AbsoluteFill>
          <AbsoluteFill>{fromContent}</AbsoluteFill>
          <AbsoluteFill
            style={{ clipPath: `inset(0 0 ${clipY}% 0)` }}
          >
            {toContent}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }

    case "wipeDown": {
      const clipY = interpolate(p, [0, 1], [100, 0]);
      return (
        <AbsoluteFill>
          <AbsoluteFill>{fromContent}</AbsoluteFill>
          <AbsoluteFill
            style={{ clipPath: `inset(${clipY}% 0 0 0)` }}
          >
            {toContent}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }

    case "zoomCross": {
      const fromScale = interpolate(p, [0, 1], [1, 1.5]);
      const toScale = interpolate(p, [0, 1], [0.5, 1]);
      return (
        <AbsoluteFill>
          <AbsoluteFill
            style={{
              opacity: 1 - p,
              transform: `scale(${fromScale})`,
            }}
          >
            {fromContent}
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              opacity: p,
              transform: `scale(${toScale})`,
            }}
          >
            {toContent}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }

    case "slidePush": {
      const offsetFrom = interpolate(p, [0, 1], [0, -100]);
      const offsetTo = interpolate(p, [0, 1], [100, 0]);
      return (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <AbsoluteFill
            style={{ transform: `translateX(${offsetFrom}%)` }}
          >
            {fromContent}
          </AbsoluteFill>
          <AbsoluteFill
            style={{ transform: `translateX(${offsetTo}%)` }}
          >
            {toContent}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }

    case "circleReveal": {
      const size = interpolate(p, [0, 1], [0, 200]);
      return (
        <AbsoluteFill>
          <AbsoluteFill>{fromContent}</AbsoluteFill>
          <AbsoluteFill
            style={{
              clipPath: `circle(${size}% at 50% 50%)`,
            }}
          >
            {toContent}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }

    case "glitch": {
      const glitchIntensity = Math.sin(transitionFrame * 2.5) * interpolate(p, [0, 0.5, 1], [0, 1, 0]) * 15;
      const hueFrom = interpolate(p, [0, 1], [0, 20]);
      return (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <AbsoluteFill
            style={{
              opacity: 1 - p,
              transform: `translateX(${glitchIntensity}px)`,
              filter: `hue-rotate(${hueFrom}deg)`,
            }}
          >
            {fromContent}
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              opacity: p,
              transform: `translateX(${-glitchIntensity}px)`,
            }}
          >
            {toContent}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }

    default:
      return <AbsoluteFill>{p < 0.5 ? fromContent : toContent}</AbsoluteFill>;
  }
};
