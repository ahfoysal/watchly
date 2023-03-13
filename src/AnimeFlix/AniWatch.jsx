import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import EpisodeModal from './EpisodeModal';

const AniWatch = () => {
    let params = useParams();
    const useQuery = () => {
      return new URLSearchParams (useLocation().search)
    }
      let query = useQuery()
      const ep = query.get('episode')

    
    const navigate = useNavigate();
    const [details, setDetails] = useState({})
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [page, setPage] = React.useState('');

    const handleChange = (event) => {
      setPage(event.target.value);
    };

    const fetchData =async () => {
        await axios(`https://cors.delusionz.xyz/https://api.animeflix.live/v2/watch/${params.name}/${ep ? ep : 1}`)
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
      await axios(`https://cors.delusionz.xyz/https://api.animeflix.live/v2/episodes?id=${params.name}&dub=false`)
  .then(data2 => { const data = data2.data
    handleClose()
    // console.log(data)

    setDetails(data)
    
  
  }
  )}
  
    useEffect(() => {
      console.log(ep)
        fetchData()
        fetchEpisode()
        const handler = (ev: MessageEvent<{ type: string, message: string }>) => {
          console.log('ev', ev)
          console.log(ev.data)
          if(ev.data === 'backbutton-clicked')( navigate(`/`))
          if(ev.data === 'nextepisode-pressed')(handleOpen())
        
          if (typeof ev.data !== 'object') return
          if (!ev.data.type) return
          if (ev.data.type !== 'message') return
          if (!ev.data.message) return      
        
        }
        window.addEventListener('message', handler)
        return () => window.removeEventListener('message', handler)
        
        
    }, [ep])
  return (
    <div className='player-page'>


        {loading   && 
       <>
             <iframe className='iframe-plyr' 
            title="player" allow="autoplay; fullscreen" id="iframee" allowFullScreen="" 
            src={details.source} __idm_id__="1040385">
         
            </iframe> 
            <EpisodeModal item={params.name} handleOpen={handleOpen}  handleClose={handleClose} setOpen={setOpen} open={open} />
            
       </>
            

        }
    </div>
  )
}

export default AniWatch

