

import React, { useEffect, useState } from 'react'
import Plyr from "plyr-react";
// import "plyr-react/dist/plyr.css";
import "plyr-react/plyr.css"
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Video from './video'
import 'videojs-errors';
import 'video.js/dist/video-js.css';



const Animewatch = () => {

   
    let params = useParams();
    const [details , setDetails] = useState([]);
    const[ total,  setTotal] = useState()

    const [src2 , setSrc2] = useState('');
    const [loading3 , setLoading3] = useState(false);
    const getInfo = async () =>{

        await axios(`https://gogoanime.consumet.org/anime-details/${params.name}`)
       .then(data2 => { const data = data2.data
        //  addToCart(data)
        console.log(data)
         setDetails(data)
         setTotal(data?.episodesList?.length)
   
        
        //  const cartItems = cart.map((cart) => cart ).filter((val)=> {
        //    return val.animeTitle   === data.animeTitle
        //    })
        //    const data3 = cartItems[0].lastEP
        //    const data4 = cartItems[0].lastEP2
   
        //    if(cartItems[0].lastEP){
        //      setLoading2(true)
        //      getEpisode(data3,data4,data,0)
        //    }
    
       })  
     // }
   
   
     
   
   }

const getEp = () => {
       
    axios(`https://api.consumet.org/anime/gogoanime/watch/${params.id}?server=gogocdn`)
    .then(data2 => { const data = data2.data  
    
     console.log(data.sources[1].url)
     setSrc2(data.sources[1].url)
     setLoading3(true)
    }).catch(error => {
      const rslt = error;
      console.log('error', rslt)
    });

}


    useEffect(() => { 
       console.log(params)
       getInfo()
       getEp()
     
      


       
      },[])
      
const play2 = {
    fill: true,
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2],
    autoplay: true,
    controls: true,
    preload: "metadata",
    sources: [
      {
        src: src2,
        type: "application/x-mpegURL",
        label: "480P",
      }
    ]
  };

      
  return (
    <div>
        {loading3 ? 
    <>
    <Video {...play2} />

   
    <p className='inline'>Change  Quality: </p>
  
  
      
<div className=' episodes '> 
<div className="ep-button">
{details.episodesList?.map((ep,index) => {
return  <Link key={total - index} className='btn btn-ep' id={total - index} to={`/anime/watch/${params.name}/${ep.episodeId}/`}>{ep.episodeNum}</Link>
})}

</div>
</div>


  </> : <></>}

    </div>
  )
}

export default Animewatch
