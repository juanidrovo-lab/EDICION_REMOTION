import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {
  MainCompositionProps,
  Track,
  VideoClip,
  ImageClip,
  AudioClip,
  AnyTextClip,
  SubtitleClip,
  TextClip,
  Transition,
} from "../types";
import {
  VideoClipRenderer,
  ImageClipRenderer,
  AudioTrack,
  SubtitleTrack,
  TextOverlay,
} from "../components";
import { TransitionRenderer } from "../transitions";

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
      if ((tc as SubtitleClip).subtitleType === "subtitle") {
        return <SubtitleTrack clip={tc as SubtitleClip} />;
      }
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
        // Buscar si este clip tiene una transición de entrada
        const incomingTransition = transitions.find(
          (t) => t.toClipId === clip.id
        );
        const outgoingTransition = transitions.find(
          (t) => t.fromClipId === clip.id
        );

        let startFrame = clip.startFrame;
        let duration = clip.durationInFrames;

        // Si hay transición de entrada, el clip empieza antes visualmente
        if (incomingTransition) {
          startFrame = Math.max(
            0,
            clip.startFrame - incomingTransition.durationInFrames
          );
          duration += incomingTransition.durationInFrames;
        }

        const fromClip = incomingTransition
          ? allClips.find((c) => c.id === incomingTransition.fromClipId)
          : undefined;

        return (
          <Sequence
            key={clip.id}
            from={startFrame}
            durationInFrames={duration}
            layout="none"
          >
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
  const transitionFrame = frame; // relativo al inicio de la secuencia

  return (
    <TransitionRenderer
      type={transition.type}
      durationInFrames={transition.durationInFrames}
      transitionFrame={transitionFrame}
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
  } = props;

  // Aplanar todos los clips para búsquedas de transición
  const allClips = tracks.flatMap((t) => t.clips);

  // Separar pistas por tipo de renderizado (el orden importa para z-index)
  const videoTracks = tracks.filter(
    (t) => t.type === "video" || t.type === "overlay"
  );
  const textTracks = tracks.filter((t) => t.type === "text");
  const audioTracks = tracks.filter((t) => t.type === "audio");

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Pistas de video e imagen */}
      {videoTracks.map((track) => (
        <TrackLayer
          key={track.id}
          track={track}
          transitions={transitions}
          allClips={allClips as Array<VideoClip | ImageClip | AudioClip | AnyTextClip>}
        />
      ))}

      {/* Pistas de texto y subtítulos (encima del video) */}
      {textTracks.map((track) => (
        <TrackLayer
          key={track.id}
          track={track}
          transitions={transitions}
          allClips={allClips as Array<VideoClip | ImageClip | AudioClip | AnyTextClip>}
        />
      ))}

      {/* Pistas de audio */}
      {audioTracks.map((track) => (
        <TrackLayer
          key={track.id}
          track={track}
          transitions={transitions}
          allClips={allClips as Array<VideoClip | ImageClip | AudioClip | AnyTextClip>}
        />
      ))}

      {/* Audio global (música de fondo) */}
      {globalAudio.map((audioClip) => (
        <Sequence
          key={audioClip.id}
          from={audioClip.startFrame}
          durationInFrames={audioClip.durationInFrames}
          layout="none"
        >
          <AudioTrack clip={audioClip} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
