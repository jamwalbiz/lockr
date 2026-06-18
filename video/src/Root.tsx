import { Composition } from "remotion";
import { LockrVSL, VSL_FPS, VSL_DURATION } from "./LockrVSL";

export const Root = () => (
  <Composition
    id="LockrVSL"
    component={LockrVSL}
    durationInFrames={VSL_DURATION}
    fps={VSL_FPS}
    width={1920}
    height={1080}
  />
);
