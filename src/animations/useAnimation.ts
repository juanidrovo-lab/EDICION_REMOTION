import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type { ClipAnimation, AnimationType } from "../types";

export interface AnimationStyle {
  opacity: number;
  transform: string;
}

function getAnimationStyle(
  frame: number,
  fps: number,
  animation: ClipAnimation,
  clipDurationInFrames: number
): AnimationStyle {
  const { type, durationInFrames, easing = "easeOut", delay = 0 } = animation;
  const localFrame = Math.max(0, frame - delay);
  const progress = Math.min(localFrame / durationInFrames, 1);

  const springValue = spring({
    frame: localFrame,
    fps,
    config: { stiffness: 80, damping: 14 },
    durationInFrames,
  });

  const useSpring = easing === "spring" || easing === "bounce";
  const p = useSpring ? springValue : progress;

  const pIn = interpolate(localFrame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  switch (type as AnimationType) {
    case "fadeIn":
      return { opacity: pIn, transform: "none" };

    case "fadeOut": {
      const startFade = clipDurationInFrames - durationInFrames;
      const pOut = interpolate(frame, [startFade, clipDurationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return { opacity: pOut, transform: "none" };
    }

    case "slideInLeft": {
      const x = interpolate(p, [0, 1], [-100, 0]);
      return { opacity: pIn, transform: `translateX(${x}%)` };
    }

    case "slideInRight": {
      const x = interpolate(p, [0, 1], [100, 0]);
      return { opacity: pIn, transform: `translateX(${x}%)` };
    }

    case "slideInUp": {
      const y = interpolate(p, [0, 1], [100, 0]);
      return { opacity: pIn, transform: `translateY(${y}%)` };
    }

    case "slideInDown": {
      const y = interpolate(p, [0, 1], [-100, 0]);
      return { opacity: pIn, transform: `translateY(${y}%)` };
    }

    case "slideOutLeft": {
      const startOut = clipDurationInFrames - durationInFrames;
      const pOut = interpolate(frame, [startOut, clipDurationInFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const x = interpolate(pOut, [0, 1], [0, -100]);
      return { opacity: 1 - pOut, transform: `translateX(${x}%)` };
    }

    case "slideOutRight": {
      const startOut = clipDurationInFrames - durationInFrames;
      const pOut = interpolate(frame, [startOut, clipDurationInFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const x = interpolate(pOut, [0, 1], [0, 100]);
      return { opacity: 1 - pOut, transform: `translateX(${x}%)` };
    }

    case "slideOutUp": {
      const startOut = clipDurationInFrames - durationInFrames;
      const pOut = interpolate(frame, [startOut, clipDurationInFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const y = interpolate(pOut, [0, 1], [0, -100]);
      return { opacity: 1 - pOut, transform: `translateY(${y}%)` };
    }

    case "slideOutDown": {
      const startOut = clipDurationInFrames - durationInFrames;
      const pOut = interpolate(frame, [startOut, clipDurationInFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const y = interpolate(pOut, [0, 1], [0, 100]);
      return { opacity: 1 - pOut, transform: `translateY(${y}%)` };
    }

    case "zoomIn": {
      const scale = interpolate(p, [0, 1], [0.3, 1]);
      return { opacity: pIn, transform: `scale(${scale})` };
    }

    case "zoomOut": {
      const startOut = clipDurationInFrames - durationInFrames;
      const pOut = interpolate(frame, [startOut, clipDurationInFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const scale = interpolate(pOut, [0, 1], [1, 0.3]);
      return { opacity: 1 - pOut, transform: `scale(${scale})` };
    }

    case "rotateIn": {
      const rotate = interpolate(p, [0, 1], [-180, 0]);
      const scale = interpolate(p, [0, 1], [0.5, 1]);
      return { opacity: pIn, transform: `rotate(${rotate}deg) scale(${scale})` };
    }

    case "bounceIn": {
      const bounceSpring = spring({
        frame: localFrame,
        fps,
        config: { stiffness: 300, damping: 10, mass: 0.8 },
        durationInFrames,
      });
      const scale = interpolate(bounceSpring, [0, 1], [0.3, 1]);
      return { opacity: Math.min(pIn * 3, 1), transform: `scale(${scale})` };
    }

    default:
      return { opacity: 1, transform: "none" };
  }
}

export function useAnimation(
  animation: ClipAnimation | undefined,
  clipDurationInFrames: number,
  isExit = false
): AnimationStyle {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!animation || animation.type === "none") {
    return { opacity: 1, transform: "none" };
  }

  return getAnimationStyle(frame, fps, animation, clipDurationInFrames);
}
