import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import VideoPlayer from '../PLYR/HLS.tsx';
import EpisodeModal from './EpisodeModal';
import queryString  from 'query-string';
import * as ReactBootstrap from 'react-bootstrap'

const AniWatch = ({handleAddToWatchlist}) => {
    let params = useParams();
    const useQuery = () => {
      return new URLSearchParams (useLocation().search)
    }
      let query = useQuery()
      const ep = query.get('episode')
      let ts = query.get('ts')
      

    
    const navigate = useNavigate();
    const [details, setDetails] = useState({})
    const [src, setSrc] = useState({})
    const [sub, setSub] = useState({})
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = React.useState(false);
   
   

    const handleOpen = () => setOpen(true);


    const fetchData =async () => {
        await axios(`https://api-pewds.vercel.app/get/${ep}`)
    .then(data2 => { const data = data2?.data
     
      setSrc(data?.sources[data?.sources?.length - 1]?.url)
      setSub(data?.subtitles)
      setTimeout(() => {  
        setLoading(true)
        console.log("Delayed for 1 second.");
      }, "2000");
 
    
    }
    )}
    const fetchEpisode =async () => {
      await axios(`https://api-pewds.vercel.app/info/${params.name}`)
  .then(data2 => { const data = data2.data
    // console.log(data)
    setDetails(data)
    console.log(data)
    fetchData()  
    handleAddToWatchlist(data)
   
    
     const next =  getPrevAndNext(data.episodes, ep)  
     console.log(next.id)
     const parsed = queryString.parse(window.location.search);
     console.log(parsed);
     parsed.next = next.id;
     const stringified = queryString.stringify(parsed);


      window.history.replaceState(null, "Okay", `/watch/${params.name}?${stringified}`)
      
    
    
   

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
      navigate(`/watch/${params.name}?episode=${parsed.next}`)
      window.location.reload(false);

  }
  const tsHandler = (time, duration) => {
    const parsed = queryString.parse(window.location.search);
// console.log(time);
parsed.ts = time;
const stringified = queryString.stringify(parsed);
window.history.replaceState(null, "Okay", `/watch/${params.name}?${stringified}`)
const storedWatchlist = JSON.parse(localStorage.getItem("cwList"));
if (storedWatchlist) {
  // console.log(storedWatchlist)
  const myObjects = storedWatchlist.find(item => item.id === `${params.name}`);
  // console.log(myObject)
  if(!myObjects){
    return console.log('no data')
  }
  const myObject = {}
  const currentEp = myObjects.episodes.find(item => item.id === `${ep}`);
  myObject.position = time
  myObject.total = duration
  myObject.cwid = currentEp.id
  myObject.cw = currentEp?.title?.english  || currentEp?.title?.native ||  currentEp?.title?.userPreferred || currentEp?.title?.romaji || currentEp?.title
  localStorage.setItem(`${params.name}`, JSON.stringify(myObject));

console.log(myObject)


}

  }
  useEffect(() => {
    
  
    // return () => {
      fetchEpisode() 
    // }
  }, [])
  
  // const nextEp = query.get('next')
    useEffect(() => {
   
        
         
        const handler = (ev: MessageEvent<{ type: string, message: string }>) => {
          // console.log('ev', ev)
          // console.log(ev.data)
          if(ev.data === 'backbutton-clicked'){
             navigate(`/?title=${params.name}`)
             window.location.reload(false);
            }
          if(ev.data === 'tabs')(handleOpen())
          if(ev.data === 'nextepisode-pressed')(
            nextEpHandle()

    )
          if(ev.data.type === 'watchprogress')( 
            tsHandler(ev.data.position.toFixed(0), ev.data.duration.toFixed(0))
          
          )
       
       
            
          if (typeof ev.data !== 'object') return
          if (!ev.data.type) return
          if (ev.data.type !== 'message') return
          if (!ev.data.message) return      
        
        }
        window.addEventListener('message', handler)
        return () => window.removeEventListener('message', handler)       
    }, [ep, params, navigate])
  return (
    <div className='player-page'>
        {loading   ? 
       <>
       <VideoPlayer src={`https://proxy.vnxservers.com/`+src} sub={sub} ts={ts ?  ts : 0}/>
            <EpisodeModal details={details}  handleOpen={handleOpen} setOpen={setOpen} open={open} />           
       </>
            
       : <><div className="spinnerdiv"><ReactBootstrap.Spinner animation="border" /> </div></>
        }
    </div>
  )
}

export default AniWatch

