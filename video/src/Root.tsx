import "./index.css";
import { Composition, Folder, Still } from "remotion";
import { EPISODES } from "./episodes";
import { ItemSheet } from "./picto/ItemIcon";
import { PoseSheet } from "./picto/PoseSheet";
import { FPS, fontsReady, HEIGHT, WIDTH } from "./theme";

// Make sure fonts are registered before any frame renders.
void fontsReady;

export const RemotionRoot: React.FC = () => (
  <>
    {EPISODES.map(({ id, Comp, frames }) => (
      <Composition key={id} id={`EP-${id}`} component={Comp} durationInFrames={frames} fps={FPS} width={WIDTH} height={HEIGHT} />
    ))}
    <Folder name="Checks">
      <Still id="PoseSheet" component={PoseSheet} width={WIDTH} height={HEIGHT} />
      <Still id="ItemSheet" component={ItemSheet} width={WIDTH} height={HEIGHT} />
    </Folder>
  </>
);
