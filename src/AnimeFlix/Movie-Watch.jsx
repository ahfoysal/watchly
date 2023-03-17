import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import VideoPlayer from '../PLYR/HLS.tsx';
import EpisodeModal from './EpisodeModal';
import queryString  from 'query-string';
import * as ReactBootstrap from 'react-bootstrap'

const FlixWAtch = ({handleAddToWatchlist}) => {
    let params = useParams();
    const useQuery = () => {
      return new URLSearchParams (useLocation().search)
    }
      let query = useQuery()
      const ep = query.get('episode')
      const ts = query.get('ts')

    
    const navigate = useNavigate();
    const [details, setDetails] = useState({})
    const [src, setSrc] = useState({})
    const [sub, setSub] = useState({})
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
   

  
  
    const fetchData =async () => {
      await axios(`https://api-pewds.vercel.app/episode-movie/${params.type}/${params.name}/${ep}`)
  .then(data2 => { const data = data2.data
  
    // console.log(data)  
    setSrc(data.sources[data.sources.length - 1].url)
    setSub(data?.subtitles)
    setTimeout(() => {
        
        setLoading(true)
        console.log("Delayed for 1 second.");
      }, "1000");
   
    
    
  
  }
  )}
  const fetchEpisode =async () => {
    
    await axios(`https://api-pewds.vercel.app/info/${params.type}/${params.name}`)
.then(data2 => { const data = data2.data
  // console.log(data)
  setDetails(data)
  fetchData()
  handleAddToWatchlist(data)

  if(data.episodes.length > 1){
    const next =  getPrevAndNext(data.episodes, ep)
  const parsed = queryString.parse(window.location.search);
  // console.log(parsed);
  parsed.next = next.id;
  const stringified = queryString.stringify(parsed);


   window.history.replaceState(null, "Okay", `/watch/${params.type}/${params.name}?${stringified}`)
  // window.history.replaceState(null, "Okay", `/watch/${params.type}/${params.name}?episode=${ep}&next=${next.id}&ts=${ts}`)
  }


  

  
 
 

}
)}

const getPrevAndNext = (arr, activeID) => {
 
  const index = arr.findIndex((a) => a.id === activeID)
  if (index === -1) {
 
    return undefined
  }

  const next = arr[index + 1]
  if (!next) {
    return undefined
  }
  


  return next
}
const nextEpHandle = () => {
  const parsed = queryString.parse(window.location.search);
console.log(parsed);

if(parsed.next){
  navigate(`/watch/${params.type}/${params.name}?episode=${parsed.next}`)
    window.location.reload(false);
}
    

}
const tsHandler = (time, duration) => {
  const parsed = queryString.parse(window.location.search);
parsed.ts = time;
const stringified = queryString.stringify(parsed);

window.history.replaceState(null, "Okay", `/watch/${params.type}/${params.name}?${stringified}`)
// console.log(stringified)
const storedWatchlist = JSON.parse(localStorage.getItem("cwList"));
if (storedWatchlist) {
  // console.log(storedWatchlist)
  const myObjects = storedWatchlist.find(item => item.id === `${params.type}/${params.name}`);
 
  if(!myObjects){
    return console.log('no data')
  }
  const myObject = {}
  const currentEp = myObjects.episodes.find(item => item.id === `${ep}`);

  myObject.position = time
  myObject.total = duration
  myObject.season = currentEp?.season
  myObject.cwid = currentEp.id
  if(currentEp.season)( myObject.cw =`s${currentEp?.season}: ${currentEp?.title}`)
  else( myObject.cw =currentEp?.title)
 
  localStorage.setItem(`${params.type}/${params.name}`, JSON.stringify(myObject));

console.log(myObject)


}

}
const tabshandle = () => {
  const parsed = queryString.parse(window.location.search);
console.log(parsed);

if(parsed.next){
  handleOpen()
}
}
useEffect(() => {
    
  
  // return () => {
    fetchEpisode() 
  // }
}, [])
    useEffect(() => {
  
        
        const handler = (ev: MessageEvent<{ type: string, message: string }>) => {
          // console.log('ev', ev)  
          // console.log(ev.data)
          if(ev.data === 'backbutton-clicked'){
             navigate(`/?title=${params.type}/${params.name}`)
             window.location.reload(false);
            }
          if(ev.data === 'tabs')(tabshandle())
          if(ev.data === 'nextepisode-pressed'){
            nextEpHandle()
          }
          if(ev.data.type === 'watchprogress')( 
            tsHandler(ev.data.position.toFixed(0), ev.data.duration.toFixed(0))
              // window.history.replaceState(null, "Okay", `/watch/${params.type}/${params.name}?episode=${ep}&next=${nextEp}&ts=${ev.data.position.toFixed(0)}`)
              )
          if (typeof ev.data !== 'object') return
          if (!ev.data.type) return
          if (ev.data.type !== 'message') return
          if (!ev.data.message) return      
        
        }
        window.addEventListener('message', handler)
        return () => window.removeEventListener('message', handler)
        
    }, [ep ,params.name, params.type, ts, navigate])
  return (
    <div className='player-page'>


        {loading   ? 
       <>
       <>
       <VideoPlayer src={src} sub={sub} ts={ts ?  ts : 0}/>
       </>
            <EpisodeModal details={details} handleAddToWatchlist={handleAddToWatchlist}  handleOpen={handleOpen}   setOpen={setOpen} open={open} />
            
       </>
            

        : <><div className="spinnerdiv"><ReactBootstrap.Spinner animation="border" /> </div></>}
    </div>
  )
}

export default FlixWAtch
