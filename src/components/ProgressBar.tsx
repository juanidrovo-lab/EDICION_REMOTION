import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";

interface ProgressBarProps {
  /** Número total de segmentos (ej: 3 clips = 3 segmentos) */
  segments?: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  topOffset?: number;
  /** Si true, muestra barra continua en lugar de segmentos */
  continuous?: boolean;
}

/**
 * Barra de progreso estilo Instagram/Facebook Stories.
 * Siempre se renderiza en la parte superior del video.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  segments = 1,
  color = "#ffffff",
  backgroundColor = "rgba(255,255,255,0.35)",
  height = 4,
  topOffset = 20,
  continuous = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const totalProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (continuous) {
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: topOffset,
            left: 20,
            right: 20,
            height,
            backgroundColor,
            borderRadius: height / 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${totalProgress * 100}%`,
              backgroundColor: color,
              borderRadius: height / 2,
            }}
          />
        </div>
      </AbsoluteFill>
    );
  }

  // Segmentos individuales
  const segmentWidth = 100 / segments;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: topOffset,
          left: 20,
          right: 20,
          display: "flex",
          gap: 4,
        }}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const segStart = i / segments;
          const segEnd = (i + 1) / segments;
          const segProgress = interpolate(
            totalProgress,
            [segStart, segEnd],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height,
                backgroundColor,
                borderRadius: height / 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${segProgress * 100}%`,
                  backgroundColor: color,
                  borderRadius: height / 2,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
