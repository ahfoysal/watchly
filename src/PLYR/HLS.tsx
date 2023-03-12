import Plyr from 'plyr';
import Hls from 'hls.js';
import {useEffect} from 'react';
// import "plyr/dist/plyr.css";
import "plyr-react/plyr.css"
import './css.css'

const VideoPlayer = ({src, sub}) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const options = {
        seekTime: 5,
        keyboard: {focused: true, global: true},
        captions: {active: true, update: true},
        quality: {default: 1080, forced: true, options: [1080, 720, 480, 360]},
        storage: {enabled: true, key: 'plyr'},
        controls: [
            'play-large', 'rewind', 'play', 'fast-forward', 'progress', 'mute', 'volume', 'current-time', 'duration', 'settings', 'fullscreen'
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
                        var elem = document.getElementsByClassName("plyr__menu");
                        console.log(elem)
                        if (elem.length === 1) elem[0].insertAdjacentHTML("beforebegin", `
                        <button type="button" class="plyr__control plyr__control--pressed" id="nextepisode" onclick="parent.postMessage('nextepisode-pressed', '*')">
                          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-skip-end-fill" viewBox="3 2.5 11 11">
                            <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z"/>
                          </svg>
                          <span class="plyr__sr-only">Skip Episode</span>
                        </button>
                        `);
                         
        //    window.parent.postMessage({type: "watchprogress", position: player.currentTime, duration: player.duration}, "*");
        
  
        
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
                return  <track key={index}
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