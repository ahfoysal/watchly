import Plyr from 'plyr';
import Hls from 'hls.js';
import {useEffect} from 'react';
// import "plyr/dist/plyr.css";
import "plyr-react/plyr.css"
import './css.css'
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

const VideoPlayer = ({src, sub, ts}) => {
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
                        
                     
                         
           
        
  
        
                        if (hls.autoLevelEnabled) {
                            span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`
                        } else {
                            span.innerHTML = `AUTO`
                        }
                    })
                    

                    const player = new Plyr(video, options);
                    //  plyrplayer.addEventListener('ready', (event) => {
                    //     var player = event.detail.plyr;
                    //     player.play().then(() => {
                    //      player.currentTime = Number(ts);
                        
                    //     })
                    //   })
                 
                   
     
                     
                   
     
                 
                      
                    player.on('ready', () => {
                        player.currentTime = Number(ts)
                        setTimeout(() => {
        
                            player.currentTime = Number(ts)
                            console.log("Delayed  ts .");
                          }, "2000");
                      console.log('test', ts)

 
                      });
                    player.on('play', () => {
                        // player.currentTime = Number(ts)

                        setInterval( function() {
                            window.parent.postMessage({type: "watchprogress", position: player.currentTime, duration: player.duration}, "*");
                        }, 20000);
                    
                      
                      });
                    
                   
                 
                    if (elem.length > 0) elem[0].insertAdjacentHTML("beforebegin", `
                    <button type="button" class="plyr__control plyr__control--pressed" id="nextepisode" onclick="parent.postMessage('nextepisode-pressed', '*')">
                    <svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M22 3H20V21H22V3ZM4.28615 3.61729C3.28674 3.00228 2 3.7213 2 4.89478V19.1052C2 20.2787 3.28674 20.9977 4.28615 20.3827L15.8321 13.2775C16.7839 12.6918 16.7839 11.3082 15.8321 10.7225L4.28615 3.61729ZM4 18.2104V5.78956L14.092 12L4 18.2104Z" fill="currentColor"></path></svg>
                      <span class="plyr__sr-only">Skip Episode</span>
                    </button>
                    `);
                    if (elem.length > 0) elem[0].insertAdjacentHTML("beforebegin", `
                    <button type="button" class="plyr__control plyr__control--pressed" id="nextepisode" onclick="parent.postMessage('nextepisode-pressed', '*')">
                    <svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 5H22V13H24V5C24 3.89543 23.1046 3 22 3H8V5ZM18 9H4V7H18C19.1046 7 20 7.89543 20 9V17H18V9ZM0 13C0 11.8954 0.895431 11 2 11H14C15.1046 11 16 11.8954 16 13V19C16 20.1046 15.1046 21 14 21H2C0.895431 21 0 20.1046 0 19V13ZM14 19V13H2V19H14Z" fill="currentColor"></path></svg>
                    
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
            
console.log(sub, src, ts)
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
                
              {sub?.length > 0 && sub?.slice(0,10).map((pro, index) => {
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