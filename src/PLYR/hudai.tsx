import { useEffect, useRef } from "react";
import "./styles.css";
import "plyr-react/plyr.css"
import Hls from "hls.js";
import Plyr, { APITypes, PlyrProps, PlyrInstance } from "plyr-react";


const MyComponent = () => {
  
  const ref = useRef<APITypes>(null);
  useEffect(() => {
    console.log( sources.map((source) => (
      source.size
    )))
    const loadVideo = async () => {
      const video = document.getElementById("plyr") as HTMLVideoElement;
      var hls = new Hls();
      hls.loadSource(sources[0].src);
      hls.attachMedia(video);
      // @ts-ignore
      ref.current!.plyr.media = video;

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        (ref.current!.plyr as PlyrInstance).play();
      });
    };
    loadVideo();
  });

  const sources  = [
    {
      src: 'https://crunchy.animeflix.live/https://tc-040.astar-cdn.com/1ab5d45273a9183bebb58eb74d5722d8ea6384f350caf008f08cf018f1f0566d0cb82a2a799830d1af97cd3f4b6a9a81ef3aed2fb783292b1abcf1b8560a1d1aa308008b88420298522a9f761e5aa1024fbe74e5aa853cfc933cd1219327d1232e91847a185021b184c027f97ae732b3708ee6beb80ba5db6628ced43f1196fe/7c3497e5ffe97f1504e04f94d3162561/ep.1.1677814021.360.m3u8',
      label: '1080p',
      size: 720,
    },
    {
      src: 'https://crunchy.animeflix.live/https://tc-040.astar-cdn.com/1ab5d45273a9183bebb58eb74d5722d8ea6384f350caf008f08cf018f1f0566d0cb82a2a799830d1af97cd3f4b6a9a81ef3aed2fb783292b1abcf1b8560a1d1aa308008b88420298522a9f761e5aa1024fbe74e5aa853cfc933cd1219327d1232e91847a185021b184c027f97ae732b3708ee6beb80ba5db6628ced43f1196fe/7c3497e5ffe97f1504e04f94d3162561/ep.1.1677814021.480.m3u8',
      label: '720p',
      size: 480,
    },
    {
      src: 'https://crunchy.animeflix.live/https://tc-040.astar-cdn.com/1ab5d45273a9183bebb58eb74d5722d8ea6384f350caf008f08cf018f1f0566d0cb82a2a799830d1af97cd3f4b6a9a81ef3aed2fb783292b1abcf1b8560a1d1aa308008b88420298522a9f761e5aa1024fbe74e5aa853cfc933cd1219327d1232e91847a185021b184c027f97ae732b3708ee6beb80ba5db6628ced43f1196fe/7c3497e5ffe97f1504e04f94d3162561/ep.1.1677814021.360.m3u8',
      label: '480p',
      size: 360,
    },
  ];
  const qualityOptions = sources.map((source) => ({
    default: source.size === sources[0].size,
    label: `${source.size}p`,
    value: source.src,
  }));
  return (
    <Plyr
      id="plyr"
      options={{
        
        quality: {
          default: sources[0].size,
          options: qualityOptions,
          forced: true,
          onChange: (e) => {
            const videoElement = ref.current?.plyr.video;

            if (videoElement) {
              const hls = new Hls();
              hls.loadSource(e.value);
              hls.attachMedia(videoElement);
            }
          },
        },
 
      }}
      source={{} as PlyrProps["source"]}
      ref={ref}
    >
      {/* {sources.map((source) => (
        <source key={source.src} src={source.src} />
      ))} */}
      </Plyr>
  );
};

export default function App() {
  const supported = Hls.isSupported();

  return (
    <div>
      {supported ? <MyComponent /> : "HLS is not supported in your browser"}
    </div>
  );
}
