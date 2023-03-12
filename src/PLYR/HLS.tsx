import Plyr from 'plyr';
import Hls from 'hls.js';
import {useEffect} from 'react';
// import "plyr/dist/plyr.css";
import "plyr-react/plyr.css"

const VideoPlayer = ({src, sub}) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const options = {
        seekTime: 5,
        keyboard: {focused: true, global: true},
        captions: {active: true, update: true},
        quality: {default: 1080, forced: true, options: [1080, 720, 480, 360]},
        storage: {enabled: true, key: 'plyr'},
        controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'duration',
            'rewind',
            'fast-forward',
            'mute',
            'volume',
            // 'captions',
            'settings',
            // 'pip',
            // 'airplay',
            'fullscreen'
        ],
    };


    useEffect(() => {
        (() => {
            const source = src
            const video = document.querySelector('#player');

            if (!Hls.isSupported()) {
                video.src = source;
                const player = new Plyr(video, options);
            } else {
                const hls = new Hls();
                hls.loadSource(source);

                hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                    const availableQualities = hls.levels.map((l) => l.height)
                    availableQualities.unshift(0)

                    options.quality = {
                        default: 0,
                        options: availableQualities,
                        forced: true,
                        onChange: (e) => updateQuality(e),
                    }
                    options.i18n = {
                        qualityLabel: {
                            0: 'Auto',
                        },
                    }

                    hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
                        const span = document.querySelector(".plyr__menu__container [data-plyr='quality'][value='0'] span")
                        if (hls.autoLevelEnabled) {
                            span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`
                        } else {
                            span.innerHTML = `AUTO`
                        }
                    })

                    const player = new Plyr(video, options);
                });

                hls.attachMedia(video);
                window.hls = hls;
            }
console.log(sub, src)
            function updateQuality(newQuality) {
                if (newQuality === 0) {
                    window.hls.currentLevel = -1;
                } else {
                    window.hls.levels.forEach((level, levelIndex) => {
                        if (level.height === newQuality) {
                            window.hls.currentLevel = levelIndex;
                        }
                    });
                }
            }
        })()
        //eslint-disable-next-line
    }, []);

    return (
        <div style={{
            //keep in center
            position: 'relative',
            width: '100%',
        }}>
            <video className='js-plyr plyr' id='player' key={src} crossOrigin="anonymous">
              {sub?.slice(0,10).map((pro, index) => {
                return  <track
                kind="captions"
                label={`${pro.label || pro.lang}`}
                srcLang={`${index} `}
                src={pro.src || pro.url}
            />
              })}
              
          
            </video>
        </div>
    )
}

export default VideoPlayer;