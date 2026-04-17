import React from "react";
import { Audio, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { AudioClip } from "../types";

interface AudioTrackProps {
  clip: AudioClip;
}

export const AudioTrack: React.FC<AudioTrackProps> = ({ clip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fadeInFrames = 0, fadeOutFrames = 0, durationInFrames, volume = 1 } = clip;

  // Fade in / fade out de volumen
  const computedVolume = interpolate(
    frame,
    [
      0,
      fadeInFrames,
      durationInFrames - fadeOutFrames,
      durationInFrames,
    ],
    [fadeInFrames > 0 ? 0 : volume, volume, volume, fadeOutFrames > 0 ? 0 : volume],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={clip.src}
      startFrom={clip.trimStart ?? 0}
      endAt={clip.trimEnd}
      volume={computedVolume}
    />
  );
};
