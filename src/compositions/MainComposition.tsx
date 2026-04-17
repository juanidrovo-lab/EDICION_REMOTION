import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type {
  MainCompositionProps,
  Track,
  VideoClip,
  ImageClip,
  AudioClip,
  AnyTextClip,
  SubtitleClip,
  TextClip,
  WordCaptionClip,
  CTAClip,
  Transition,
} from "../types";
import {
  VideoClipRenderer,
  ImageClipRenderer,
  AudioTrack,
  SubtitleTrack,
  TextOverlay,
  WordCaption,
  CTAOverlay,
  SafeZoneGuide,
} from "../components";
import { TransitionRenderer } from "../transitions";
import { getPlatform } from "../presets/platforms";

// ─── Renderizador por tipo de clip ────────────────────────────────────────────

function renderClip(
  clip: VideoClip | ImageClip | AudioClip | AnyTextClip,
  transitions: Transition[],
  allClips: Array<VideoClip | ImageClip | AudioClip | AnyTextClip>
) {
  switch (clip.type) {
    case "video":
      return <VideoClipRenderer clip={clip as VideoClip} />;
    case "image":
      return <ImageClipRenderer clip={clip as ImageClip} />;
    case "audio":
      return <AudioTrack clip={clip as AudioClip} />;
    case "text": {
      const tc = clip as AnyTextClip;
      const subtype = (tc as SubtitleClip).subtitleType;
      if (subtype === "subtitle") return <SubtitleTrack clip={tc as SubtitleClip} />;
      if (subtype === "word_caption") return <WordCaption clip={tc as WordCaptionClip} />;
      if (subtype === "cta") return <CTAOverlay clip={tc as CTAClip} />;
      return <TextOverlay clip={tc as TextClip} />;
    }
    default:
      return null;
  }
}

// ─── Pista del timeline ───────────────────────────────────────────────────────

const TrackLayer: React.FC<{
  track: Track;
  transitions: Transition[];
  allClips: Array<VideoClip | ImageClip | AudioClip | AnyTextClip>;
}> = ({ track, transitions, allClips }) => {
  if (track.muted) return null;

  return (
    <>
      {track.clips.map((clip) => {
        const incomingTransition = transitions.find((t) => t.toClipId === clip.id);

        let startFrame = clip.startFrame;
        let duration = clip.durationInFrames;

        if (incomingTransition) {
          startFrame = Math.max(0, clip.startFrame - incomingTransition.durationInFrames);
          duration += incomingTransition.durationInFrames;
        }

        const fromClip = incomingTransition
          ? allClips.find((c) => c.id === incomingTransition.fromClipId)
          : undefined;

        return (
          <Sequence key={clip.id} from={startFrame} durationInFrames={duration} layout="none">
            {incomingTransition && fromClip ? (
              <TransitionWithClips
                transition={incomingTransition}
                fromClip={fromClip as VideoClip | ImageClip | AnyTextClip}
                toClip={clip as VideoClip | ImageClip | AnyTextClip}
                transitions={transitions}
                allClips={allClips}
              />
            ) : (
              renderClip(clip, transitions, allClips)
            )}
          </Sequence>
        );
      })}
    </>
  );
};

// ─── Wrapper para clips con transición ───────────────────────────────────────

const TransitionWithClips: React.FC<{
  transition: Transition;
  fromClip: VideoClip | ImageClip | AnyTextClip;
  toClip: VideoClip | ImageClip | AnyTextClip;
  transitions: Transition[];
  allClips: Array<VideoClip | ImageClip | AudioClip | AnyTextClip>;
}> = ({ transition, fromClip, toClip, transitions, allClips }) => {
  const frame = useCurrentFrame();
  return (
    <TransitionRenderer
      type={transition.type}
      durationInFrames={transition.durationInFrames}
      transitionFrame={frame}
      fromContent={renderClip(fromClip, transitions, allClips)}
      toContent={renderClip(toClip, transitions, allClips)}
    />
  );
};

// ─── Composición principal ────────────────────────────────────────────────────

export const MainComposition: React.FC<MainCompositionProps> = (props) => {
  const {
    backgroundColor = "#000000",
    tracks,
    transitions = [],
    globalAudio = [],
    platform,
    showSafeZone = false,
  } = props;

  const allClips = tracks.flatMap((t) => t.clips);
  const videoTracks = tracks.filter((t) => t.type === "video" || t.type === "overlay");
  const textTracks  = tracks.filter((t) => t.type === "text");
  const audioTracks = tracks.filter((t) => t.type === "audio");

  const platformPreset = platform ? getPlatform(platform) : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {videoTracks.map((track) => (
        <TrackLayer key={track.id} track={track} transitions={transitions} allClips={allClips as Array<VideoClip | ImageClip | AudioClip | AnyTextClip>} />
      ))}

      {textTracks.map((track) => (
        <TrackLayer key={track.id} track={track} transitions={transitions} allClips={allClips as Array<VideoClip | ImageClip | AudioClip | AnyTextClip>} />
      ))}

      {audioTracks.map((track) => (
        <TrackLayer key={track.id} track={track} transitions={transitions} allClips={allClips as Array<VideoClip | ImageClip | AudioClip | AnyTextClip>} />
      ))}

      {globalAudio.map((audioClip) => (
        <Sequence key={audioClip.id} from={audioClip.startFrame} durationInFrames={audioClip.durationInFrames} layout="none">
          <AudioTrack clip={audioClip} />
        </Sequence>
      ))}

      {/* Safe zone overlay (solo en desarrollo) */}
      {showSafeZone && platformPreset && (
        <SafeZoneGuide
          safeZone={platformPreset.safeZone}
          platformName={platformPreset.name}
          show
        />
      )}
    </AbsoluteFill>
  );
};
