import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import axios from 'axios'

import { useContextS } from './cart/Function';


import Video from './video'
import 'videojs-errors';
import 'video.js/dist/video-js.css';




function SingleProduct() {
  let {  addToCart , cart , addToList } =  useContextS();

  const [details , setDetails] = useState([]);
  const [src2 , setSrc2] = useState('');

  const [loading , setLoading] = useState(true);
  const [loading2 , setLoading2] = useState(false);
  const [loading3 , setLoading3] = useState(false);


  const[ np,  setNp] = useState('')
  const[ ql,  setQl] = useState('')
  const[ total,  setTotal] = useState()


  let params = useParams();

useEffect(() => { 
  fetchDetails()
 
},[])



const play = () =>{
  const data5 = details.episodesList[details.episodesList.length - 1].episodeId
      const data6 = details.episodesList[details.episodesList.length - 1].episodeNum
      getEpisode(data5,data6,details,0)
}

const fetchDetails = async () =>{



     await axios(`https://gogoanime.consumet.stream/anime-details/${params.name}`)
    .then(data2 => { const data = data2.data
      addToCart(data)

      setDetails(data)
      setTotal(data?.episodesList?.length)

     
      const cartItems = cart.map((cart) => cart ).filter((val)=> {
        return val.animeTitle   === data.animeTitle
        })
        const data3 = cartItems[0].lastEP
        const data4 = cartItems[0].lastEP2

        if(cartItems[0].lastEP){
          setLoading2(true)
          getEpisode(data3,data4,data,0)
        }
 
    })  
  // }


  

}
const [details2 , setDetails2] = useState([]);

const getEpisode = (id,num, full) =>{
  
    setLoading2(true)
    setLoading3(false)
    console.log(id)
    // setId2(index)

  
  if(full === undefined){
    const cartItems = cart.map((cart) => cart ).filter((val)=> {
      return val.animeTitle   === details.animeTitle
      })
      cartItems[0].lastEP = id 
  cartItems[0].lastEP2 = num
  const np = cartItems[0]
  addToCart(np)


if(cartItems[0].lastEP){
  axios(`https://api.consumet.org/anime/gogoanime/watch/${cartItems[0].lastEP}?server=gogocdn`)
  .then(data2 => { const data = data2.data  
    setDetails2(data)
 

    setSrc2(data.sources[1].url)
    setQl(data.sources[1].quality)

  console.log(data.sources[1].quality)
  setNp(`Episode ${cartItems[0].lastEP2}`)
  setLoading(true)
  setLoading3(true)

  }).catch(error => {
    const rslt = error;
    console.log('error', rslt)
  });
     
}

 
  }else{
   
    const cartItems = cart.map((cart) => cart ).filter((val)=> {
      return val.animeTitle   === full.animeTitle
      })
      cartItems[0].lastEP = id
  cartItems[0].lastEP2 = num
  const np = cartItems[0]
  addToCart(np)
      
  if(cartItems[0].lastEP){
    axios(`https://api.consumet.org/anime/gogoanime/watch/${cartItems[0].lastEP}?server=gogocdn`)
  .then(data2 => { const data = data2.data  
    setDetails2(data)
    setSrc2(data.sources[1].url)
  setLoading3(true)
  setQl(data.sources[1].quality)


  setNp(`Episode ${cartItems[0].lastEP2}`)



  setLoading(true)
  }).catch(error => {
    const rslt = error;
    console.log('error', rslt)
  });
     

  }
  
  }
}

const qual = (url, type) =>{
  setQl(type)
  setLoading3(false)
    setSrc2(url)
  
    setTimeout(() => setLoading3(true) , 500)
    
}

const play2 = {
  fill: true,
  fluid: true,
  playbackRates: [0.5, 1, 1.5, 2],
  autoplay: true,
  controls: true,
  preload: "metadata",
  sources: 
    
    {
      src: src2,
      type: "application/x-mpegURL",
      label: "720P  ",
    },
  
};

const next = () => {
 
  console.log(np)
  var newStr = np.replace('Episode','')
  document.getElementById(`${Number(newStr)+1}`).click();
  const ey=newStr.replace(/ /g," ")
  console.log(newStr, ey)
}


  return (
    
    <div >
    
{
  loading ? 
  <div className='cart-page'>
       

  <div className=' prodtSingle__inner'>
  {loading2 ?
    <>
     <div className='container'>
    <div className="load-anime">

    {loading3 ? 
    <>
    <Video {...play2} />

    <p>Current Quality : {ql}</p>
    <p className='inline'>Change  Quality: </p> {details2?.sources?.map((qls) =>{
      return <button className='btn btn-ep2' key={qls.quality} onClick={() => qual(qls.url, qls.quality)}> {qls.quality}</button>
    })} 
  
  <button className="btn  btn-ep2"  onClick={() => next()}> 
      <i className="fa fa-play" aria-hidden="true">  </i>

           Play Next Episode</button>

  </>
    
    : <div className="spinnerdiv"><ReactBootstrap.Spinner animation="border" /> </div>}

</div>
  

  </div > 
  
    </>: <div className='productSingle__image'>
      <img  src={details.animeImg} alt="" />
      <button className="btn  play" onClick={() => play()}>
      <i className="fa fa-play" aria-hidden="true">  </i>

           Play</button>

{/* 
           <button className="btn  play" onClick={() => addToList(details)}>
      <i className="fa fa-play" aria-hidden="true">  </i>

           Add To WatchList</button> */}

    
    </div>}
<div className='productSingle__details  single-page'> 
 {/* <p>Quality {details2?.sources?.map((type) => {
  return <span className='margin-left'>{type?.quality}</span>
})}</p> */}
<p className='productSingle__name'>{details.animeTitle} {np}</p>




  
    
   
  </div>
 </div> 

<div className='single-page'>
<button className="btn  btn-primary" onClick={() => addToList(details, params)}>
      <i className="fa fa-play" aria-hidden="true">  </i>

           Add To WacthList</button>
<p className='top-line2'>Episodes</p>
</div>

<div className=' episodes '> 
<div className="ep-button">
{details.episodesList?.map((ep,index) => {
return  <button key={total - index} className='btn btn-ep' id={total - index} onClick={() => getEpisode(ep.episodeId,ep.episodeNum)}>{ep.episodeNum}</button>
})}

</div>
</div>
</div>

:<div className="spinnerdiv"><ReactBootstrap.Spinner animation="border" /> </div>}
        </div>     
  )
}

export default SingleProduct