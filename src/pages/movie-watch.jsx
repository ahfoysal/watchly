

import React, { useEffect, useState } from 'react'
import Plyr from "plyr-react";
// import "plyr-react/dist/plyr.css";
import "plyr-react/plyr.css"
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Video from './video'
import 'videojs-errors';
import 'video.js/dist/video-js.css';
import Alert from 'react-bootstrap/Alert';



const Animewatch = () => {
  const useQuery = () => {
    return new URLSearchParams (useLocation().search)
  }
    let query = useQuery()
    const ep = query.get('ep')

    let params = useParams();
    const [details , setDetails] = useState([]);
    const [sub , setSub] = useState([]);

    const[ total,  setTotal] = useState()
    const[ ql,  setQl] = useState('')
    const[ np,  setNp] = useState('')
    const [details2 , setDetails2] = useState(true);
    const [loading2 , setLoading2] = useState(true);
    const[ err,  setErr] = useState(false)

    const [src2 , setSrc2] = useState('');
    const [loading3 , setLoading3] = useState(false);
    const getInfo = async () =>{

        await axios(`https://api.consumet.org/movies/flixhq/info?id=${params.type}/${params.term} `)
       .then(data2 => { const data = data2.data
      
        console.log(data.episodes[0].id, data)
        console.log(data?.episodes?.length)
         setDetails(data)
         setTotal(data?.episodes?.length)
        //  setSrc2(data.sources[1].url) 
        
       
       })  
     // }
   
   
     
   
   }
const getEp = () => {
  if( !ep ){
   return console.log("hi")
  }

  

    axios(`https://api.consumet.org/movies/flixhq/watch?episodeId=${query.get('ep')}&mediaId=${params.type}/${params.term}`)
    .then(data2 => { const data = data2.data  
      setDetails2(data)
 
     console.log(data)
     setSrc2(data.sources[1].url)
     setQl(data.sources[1].quality)
     setNp(`Episode ${data.sources[1].number}`)
     const test =  data?.subtitles?.map(sub =>  {
      return {kind:"captions", src:`${sub.url}`, label:`${sub.lang}`}
  
      })
      setSub(test)
     setLoading3(true)
    }).catch(error => {
      const rslt = error;
      console.log('error', rslt)
      setErr(true)
    });

}


const getEp2 = (id, number) => {
  // params2.pathname = id
  setLoading3(false)
       console.log( id)
  axios(`https://api.consumet.org/movies/flixhq/watch?episodeId=${id}&mediaId=${params.type}/${params.term}`)
  .then(data2 => { const data = data2.data  
    setLoading3(true)
    setLoading2(false)
    setDetails2(data)
   console.log(data.subtitles)
   
   setSrc2(data.sources[1].url)
   setNp(`Episode ${number}`)
   const test =  data?.subtitles?.map(sub =>  {
    return {kind:"captions", src:`${sub.url}`, label:`${sub.lang}`}

    })
    setSub(test)
   console.log( test);
   
   setQl(data.sources[1].quality)

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
      //  console.log(params)
       getInfo()
       getEp()
       if (ep){
        console.log('hi')
        setLoading2(false)
       }
       
      },[])
      


const play2 = {
    fill: true,
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2, 4],
    autoplay: true,
    controls: true,
    tracks: sub,
    preload: "metadata",

    sources: 
      {
        src: src2,
        type: "application/x-mpegURL",
     
      },
     
  };

  const play = () =>{

    document.getElementById(`${total}`).click();
  }
  
      
  return (
    <div>
       <div className='container'>
    <div className="load-anime">

      {loading2 ? <div className='productSingle__image'>
      <img  src={details.image} alt="" />
      <button className="btn  play" onClick={() => play()}>
      <i className="fa fa-play" aria-hidden="true">  </i>

           Play</button>

{/* 
           <button className="btn  play" onClick={() => addToList(details)}>
      <i className="fa fa-play" aria-hidden="true">  </i>

           Add To WatchList</button> */}

    
    </div>: <>
      
      
      
      
      
      {loading3 ? 
    <>
    <Video {...play2} />
 


   
    <p>Current Quality : {ql}</p>
    <p className='inline'>Change  Quality: </p> {details2?.sources?.map((qls, index) =>{
      return <button className='btn btn-ep2' key={index + 1} onClick={() => qual(qls.url, qls.quality)}> {qls.quality}</button>
    })} 
  
  
      



  </> :<> loading</>}
      
      
      
      </>}

    </div>
    
    <div className='productSingle__details  single-page'> 
    {err ? <><Alert  variant="warning" > Error </Alert></> : <></>}
<p className='productSingle__name'>{details.title} {np}</p>
   
  </div>  
    <div className=' episodes '> 
<div className="ep-button">
{ details.episodes?.map((ep,index) => {
return  <button key={ index} className='btn btn-ep' id={total - index} onClick={() => getEp2(ep.id, ep.number)}>{ ep?.number}  </button>
})}

</div>
</div>
    
    </div></div>
  )
}

export default Animewatch
