

import React, { useEffect, useState } from 'react'
import Plyr from "plyr-react";
// import "plyr-react/dist/plyr.css";
import "plyr-react/plyr.css"
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Video from './video'
import 'videojs-errors';
import 'video.js/dist/video-js.css';



const Animewatch = () => {
  const useQuery = () => {
    return new URLSearchParams (useLocation().search)
  }
    let query = useQuery()
 
    let params = useParams();
    const [details , setDetails] = useState([]);
    const[ total,  setTotal] = useState()
    const[ ql,  setQl] = useState('')
    const[ np,  setNp] = useState('')
    const [details2 , setDetails2] = useState(true);

    const [src2 , setSrc2] = useState('');
    const [loading3 , setLoading3] = useState(false);
    const getInfo = async () =>{

        await axios(`https://api.consumet.org/movies/flixhq/info?id=${params.type}/${params.term} `)
       .then(data2 => { const data = data2.data
      
        console.log(data)
        console.log(query.get('ep'))
         setDetails(data)
         setTotal(data?.episodes?.length)
   
        
        
       })  
     // }
   
   
     
   
   }

const getEp = () => {
       
    axios(`https://api.consumet.org/movies/flixhq/watch?episodeId=${query.get('ep')}&mediaId=${params.type}/${params.term}`)
    .then(data2 => { const data = data2.data  
      setDetails2(data)
 
     console.log(data.sources[1].url)
     setSrc2(data.sources[1].url)
     setQl(data.sources[1].quality)
     setLoading3(true)
    }).catch(error => {
      const rslt = error;
      console.log('error', rslt)
    });

}


const getEp2 = (id) => {
  // params2.pathname = id
  setLoading3(false)
       console.log( id)
  axios(`https://api.consumet.org/movies/flixhq/watch?episodeId=${id}&mediaId=${params.type}/${params.term}`)
  .then(data2 => { const data = data2.data  
    setLoading3(true)
   console.log(data.sources[1].url)
   setSrc2(data.sources[1].url)

  }).catch(error => {
    const rslt = error;
    console.log('error', rslt)
  });

}
const qual = (url, type) =>{
  setQl(type)
  setLoading3(false)
    setSrc2(url)
  
    setTimeout(() => setLoading3(true) , 500)
    
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
       <div className='container'>
    <div className="load-anime">

        {loading3 ? 
    <>
    <Video {...play2} />

   
    <p>Current Quality : {ql}</p>
    <p className='inline'>Change  Quality: </p> {details2?.sources?.map((qls, index) =>{
      return <button className='btn btn-ep2' key={index + 1} onClick={() => qual(qls.url, qls.quality)}> {qls.quality}</button>
    })} 
  
  
      



  </> : <><p>loading  </p>
  
  
  </>}

    </div>
    
    
    <div className=' episodes '> 
<div className="ep-button">
{details.episodes?.map((ep,index) => {
return  <button key={ index} className='btn btn-ep' id={total - index} onClick={() => getEp2(ep.id)}>{ep.number}</button>
})}

</div>
</div>
    
    </div></div>
  )
}

export default Animewatch
