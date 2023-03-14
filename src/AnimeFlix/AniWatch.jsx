import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import VideoPlayer from '../PLYR/HLS.tsx';
import EpisodeModal from './EpisodeModal';

const AniWatch = () => {
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
    const [nextEp, setNextEp] = useState('');
   

    const handleOpen = () => setOpen(true);


    const fetchData =async () => {
        await axios(`https://api-pewds.vercel.app/get/${ep}`)
    .then(data2 => { const data = data2?.data
      // console.log(data)
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


    
     const next =  getPrevAndNext(data.episodes, ep)
     console.log(next.id)
     setNextEp(next.id)
    
   
   

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
    useEffect(() => {
     
        fetchData()
        fetchEpisode()  
        const handler = (ev: MessageEvent<{ type: string, message: string }>) => {
          // console.log('ev', ev)
          // console.log(ev.data)
          if(ev.data === 'backbutton-clicked')( navigate(`/?title=${params.name}`))
          if(ev.data === 'tabs')(handleOpen())
          if(ev.data === 'nextepisode-pressed'){
            console.log(nextEp)
            
            // navigate(`/watch/${params.name}?episode=${nextEp}`)
            // window.location.reload(false);
           
          }
          if(ev.data.type === 'watchprogress')(   window.history.replaceState(null, "Okay", `http://localhost:3000/watch/${params.name}?episode=${ep}&ts=${ev.data.position.toFixed(0)}`))
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
        {loading   && 
       <>
       <VideoPlayer src={`https://proxy.vnxservers.com/`+src} sub={sub} ts={ts ?  ts : 0}/>
            <EpisodeModal  details={details}  handleOpen={handleOpen} setOpen={setOpen} open={open} />           
       </>
            

        }
    </div>
  )
}

export default AniWatch

