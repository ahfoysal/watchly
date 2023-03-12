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
      }, "2000");
    // setLoading(true)
    // setDetails(data)
    
  
  }
  )}
  
    useEffect(() => {
      console.log(ep, params.name, params.type)
        // fetchData()
        fetchEpisode()
      
        
        
    }, [ep])
  return (
    <div className='player-page'>


        {loading   && 
       <>
       <VideoPlayer src={src} sub={sub}/>
            {/* <EpisodeModal item={params.name} handleOpen={handleOpen}  handleClose={handleClose} setOpen={setOpen} open={open} /> */}
            
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
