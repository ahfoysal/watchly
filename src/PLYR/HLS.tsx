import Plyr from 'plyr';
import Hls from 'hls.js';
import {useEffect} from 'react';
// import "plyr/dist/plyr.css";
import "plyr-react/plyr.css"
import './css.css'
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

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
    var elem = document.getElementsByClassName("plyr__menu");

    function backbutton() {
        window.parent.postMessage("backbutton-clicked", "*");
      }


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
                        
                     
                         
        //    window.parent.postMessage({type: "watchprogress", position: player.currentTime, duration: player.duration}, "*");
        
  
        
                        if (hls.autoLevelEnabled) {
                            span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`
                        } else {
                            span.innerHTML = `AUTO`
                        }
                    })

                    const player = new Plyr(video, options);
                    if (elem.length > 0) elem[0].insertAdjacentHTML("beforebegin", `
                    <button type="button" class="plyr__control plyr__control--pressed" id="nextepisode" onclick="parent.postMessage('nextepisode-pressed', '*')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-skip-end-fill" viewBox="3 2.5 11 11">
                        <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z"/>
                      </svg>
                      <span class="plyr__sr-only">Skip Episode</span>
                    </button>
                    `);
                    if (elem.length > 0) elem[0].insertAdjacentHTML("beforebegin", `
                    <button type="button" class="plyr__control plyr__control--pressed" id="nextepisode" onclick="parent.postMessage('nextepisode-pressed', '*')">
                    <svg className="backicon back-icon" onClick={backbutton} focusable="false"  viewBox="0 0 24 24" aria-hidden="true" id="backbutton" >
                    <path d="M16.62 2.99c-.49-.49-1.28-.49-1.77 0L6.54 11.3c-.39.39-.39 1.02 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z"></path>
                    </svg>
                      <span class="plyr__sr-only">Skip Episode</span>
                    </button>
                    `);
                    player.on('controlshidden', () => {
                        document.getElementById("backbutton").style.opacity=0;
                      });
                      player.on('controlsshown', () => {
                        document.getElementById("backbutton").style.opacity=1;
                      });
                      player.on('ended', () => {
                        window.parent.postMessage('nextepisode-pressed', '*');
                      });
                    
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
        // eslint-disable-next-line     
    }, [ src, sub, elem]);

    return (
        <div style={{
            //keep in center
            position: 'relative',
            width: '100%',
        }}>
            
{/* <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="backicon back-icon" id="backbutton" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21v-2z"></path></svg> */}
<svg className="backicon back-icon" onClick={backbutton} focusable="false"  viewBox="0 0 24 24" aria-hidden="true" id="backbutton" >
  <path d="M16.62 2.99c-.49-.49-1.28-.49-1.77 0L6.54 11.3c-.39.39-.39 1.02 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z"></path>
  </svg>
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