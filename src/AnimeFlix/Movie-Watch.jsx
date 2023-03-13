import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import VideoPlayer from '../PLYR/HLS.tsx';
import EpisodeModal from './EpisodeModal';

const FlixWAtch = () => {
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
    const [page, setPage] = React.useState('');

    const handleChange = (event) => {
      setPage(event.target.value);
    };

    const fetchData =async () => {
        await axios(`https://api.animeflix.live/v2/watch/${params.name}/${ep ? ep : 1}`)
    .then(data2 => { const data = data2.data
     
      console.log(data)
    
  

      setTimeout(() => {
        setDetails(data)
        setLoading(true)
        console.log("Delayed for 1 second.");
      }, "500");
 
    
    }
    )}
    const fetchEpisode =async () => {
      await axios(`https://api-pewds.vercel.app/episode-movie/${params.type}/${params.name}/${ep}`)
  .then(data2 => { const data = data2.data
  
    console.log(data)
    setSrc(data.sources[data.sources.length - 1].url)
    setSub(data.subtitles)
    setTimeout(() => {
        
        setLoading(true)
        console.log("Delayed for 1 second.");
      }, "1000");
    // setLoading(true)
    // setDetails(data)
    
  
  }
  )}
  
    useEffect(() => {
      console.log(ep, ts)
        // fetchData()
        fetchEpisode()
      
        const handler = (ev: MessageEvent<{ type: string, message: string }>) => {
          // console.log('ev', ev)  
          console.log(ev.data)
          if(ev.data === 'backbutton-clicked')( navigate(`/?title=${params.type}/${params.name}`))
          if(ev.data === 'nextepisode-pressed')(handleOpen())
          if(ev.data.type === 'watchprogress')(   window.history.replaceState(null, "Okay", `/watch/${params.type}/${params.name}?episode=${ep}&ts=${ev.data.position.toFixed(0)}`))
          if (typeof ev.data !== 'object') return
          if (!ev.data.type) return
          if (ev.data.type !== 'message') return
          if (!ev.data.message) return      
        
        }
        window.addEventListener('message', handler)
        return () => window.removeEventListener('message', handler)
        
    }, [ep, params.name, params.type, ts, navigate])
  return (
    <div className='player-page'>


        {loading   && 
       <>
       <VideoPlayer src={src} sub={sub} ts={ts ?  ts : 0}/>
            <EpisodeModal item={params.name} handleOpen={handleOpen} isMovie={true}  handleClose={handleClose} setOpen={setOpen} open={open} />
            
       </>
            

        }
    </div>
  )
}

export default FlixWAtch
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,

  // border: '2px solid #000',
  
  boxShadow: 24,
  p: 4,
  backgroundColor: '#151515'
};
