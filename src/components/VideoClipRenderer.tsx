import React from "react";
import {
  OffthreadVideo,
  Img,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoClip, ImageClip } from "../types";
import { useAnimation } from "../animations";

interface VideoClipRendererProps {
  clip: VideoClip;
}

interface ImageClipRendererProps {
  clip: ImageClip;
}

export const VideoClipRenderer: React.FC<VideoClipRendererProps> = ({ clip }) => {
  const { width, height } = useVideoConfig();
  const enterAnim = useAnimation(clip.enterAnimation, clip.durationInFrames);
  const exitAnim = useAnimation(clip.exitAnimation, clip.durationInFrames, true);

  const opacity =
    Math.min(enterAnim.opacity, exitAnim.opacity) * (clip.opacity ?? 1);
  const transform =
    enterAnim.transform !== "none" ? enterAnim.transform : exitAnim.transform;

  const w = clip.width ?? width;
  const h = clip.height ?? height;
  const x = clip.x ?? 0;
  const y = clip.y ?? 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity,
        transform,
        overflow: "hidden",
        borderRadius: clip.cornerRadius ?? 0,
      }}
    >
      <OffthreadVideo
        src={clip.src}
        startFrom={clip.trimStart ?? 0}
        endAt={clip.trimEnd}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export const ImageClipRenderer: React.FC<ImageClipRendererProps> = ({ clip }) => {
  const { width, height } = useVideoConfig();
  const enterAnim = useAnimation(clip.enterAnimation, clip.durationInFrames);
  const exitAnim = useAnimation(clip.exitAnimation, clip.durationInFrames, true);

  const opacity =
    Math.min(enterAnim.opacity, exitAnim.opacity) * (clip.opacity ?? 1);
  const transform =
    enterAnim.transform !== "none" ? enterAnim.transform : exitAnim.transform;

  const w = clip.width ?? width;
  const h = clip.height ?? height;
  const x = clip.x ?? 0;
  const y = clip.y ?? 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity,
        transform,
        overflow: "hidden",
        borderRadius: clip.cornerRadius ?? 0,
      }}
    >
      <Img
        src={clip.src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: clip.objectFit ?? "cover",
        }}
      />
    </div>
  );
};
