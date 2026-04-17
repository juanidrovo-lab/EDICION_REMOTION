import { interpolate, spring } from "remotion";
import type { EasingType } from "../types";

export function applyEasing(
  frame: number,
  fps: number,
  progress: number,
  easing: EasingType = "easeOut"
): number {
  if (easing === "spring") {
    return spring({ frame, fps, config: { stiffness: 100, damping: 12 } });
  }
  if (easing === "bounce") {
    return spring({ frame, fps, config: { stiffness: 200, damping: 8, mass: 0.5 } });
  }

  const easingFns: Record<string, (t: number) => number> = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  };

  const fn = easingFns[easing] ?? easingFns.easeOut;
  return fn(progress);
}

export function interpolateWithEasing(
  frame: number,
  fps: number,
  inputRange: [number, number],
  outputRange: [number, number],
  easing: EasingType = "easeOut"
): number {
  const rawProgress = interpolate(frame, inputRange, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const easedProgress = applyEasing(frame - inputRange[0], fps, rawProgress, easing);
  return outputRange[0] + easedProgress * (outputRange[1] - outputRange[0]);
}
