

import "./styles.css";
import Plyr from "plyr-react";
import "plyr-react/plyr.css"
import HLS from "./HLS.tsx";

// learn more https://github.com/sampotts/plyr#the-source-setter
const videoSrc: Plyr.SourceInfo = {
  type: "video",
  sources: [
    {
      src: "yWtFb9LJs3o",
      provider: "youtube"
    }
  ]
};

const MyComponent = () => {
  return (
    <>
      {/* <Plyr source={videoSrc} />
       */}
       <HLS />
    </>
  );
};

export default function PlyrContainer() {
  return (
    <div>
      <MyComponent />
    </div>
  );
}
