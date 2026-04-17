import React from "react";
import { Composition } from "remotion";
import { MainComposition } from "./compositions/MainComposition";
import { DemoComposition, demoProject } from "./compositions/DemoProject";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnyMainComposition = MainComposition as React.FC<any>;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Composición principal configurable via props/JSON */}
      <Composition
        id="MainComposition"
        component={AnyMainComposition}
        durationInFrames={demoProject.durationInFrames}
        fps={demoProject.fps}
        width={demoProject.width}
        height={demoProject.height}
        defaultProps={demoProject}
      />

      {/* Demo lista para renderizar */}
      <Composition
        id="Demo"
        component={DemoComposition}
        durationInFrames={demoProject.durationInFrames}
        fps={demoProject.fps}
        width={demoProject.width}
        height={demoProject.height}
        defaultProps={{}}
      />
    </>
  );
};
