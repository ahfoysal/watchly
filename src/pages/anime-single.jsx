import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom';
import React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import axios from 'axios'

import { useContextS } from './cart/Function';

import Iframe from 'react-iframe'




function SingleProduct() {
  let {  addToCart , cart , addToList,  list } =  useContextS();

  const [details , setDetails] = useState([]);
  const [src , setSrc] = useState('');

  const [loading , setLoading] = useState(true);
  const [loading2 , setLoading2] = useState(false);
  const [loading3 , setLoading3] = useState(false);


  const[ np,  setNp] = useState('')


  let params = useParams();

useEffect(() => { 
  fetchDetails()
  console.log('watchlist', list)
},[])

const play = () =>{
  const data5 = details.episodesList[details.episodesList.length - 1].episodeId
      const data6 = details.episodesList[details.episodesList.length - 1].episodeNum
      getEpisode(data5,data6,details)
}

const fetchDetails = () =>{



    axios(`https://pewds-anime1-api.herokuapp.com/anime-details/${params.name}`)
    .then(data2 => { const data = data2.data
      setDetails(data)
      console.log(details)
     
      const cartItems = cart.map((cart) => cart ).filter((val)=> {
        return val.animeTitle   === data.animeTitle
        })
        const data3 = cartItems[0].lastEP
        const data4 = cartItems[0].lastEP2

        if(cartItems[0].lastEP){
          setLoading2(true)
          getEpisode(data3,data4,data)
        }
 
    })  
  // }


  

}
const [details2 , setDetails2] = useState(true);

const getEpisode = (id,num,full) =>{
  
    setLoading2(true)
    setLoading3(false)

  
  if(full === undefined){
    const cartItems = cart.map((cart) => cart ).filter((val)=> {
      return val.animeTitle   === details.animeTitle
      })
      console.log(cartItems[0].lastEP2)
      cartItems[0].lastEP = id
  cartItems[0].lastEP2 = num
  const np = cartItems[0]
  addToCart(np)


if(cartItems[0].lastEP){
  axios(`https://api.consumet.org/anime/gogoanime/watch/${cartItems[0].lastEP}?server=gogocdn`)
  .then(data2 => { const data = data2.data  
    setDetails2(data)
 

    setSrc(data.headers.Referer)
  console.log(data)
  setNp(`Episode-${cartItems[0].lastEP2}`)
  setLoading(true)
  setLoading3(true)

  })  
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
    axios(`https://pewds-api.herokuapp.com/anime/gogoanime/watch/${cartItems[0].lastEP}?server=gogocdn`)
  .then(data2 => { const data = data2.data  
   
    setDetails2(data)
    setSrc(data.headers.Referer)
  setLoading3(true)

  setNp(`Episode-${cartItems[0].lastEP2}`)



  setLoading(true)
  })  

  }
  
  }
   

}




  return (
    
    <div >
    
{
  loading ? 
  <div className='cart-page'>

  <div className=' prodtSingle__inner'>
  {loading2 ?
    <>
     <div className='load-anime'>
    <div className="responsiveas">

    {loading3 ? 
    
   
      <Iframe src={src}  
      width="100%"
      height='300px'
      id="myId"
      className="responsive-iframe"
    allowFullScreen
      scrolling="no" 
      autoplay='true'
      autostart= 'true'
      styles={{backgroundImage: `url(${details.animeImg})`}}
       /> 
    

  
    
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
<button className="btn  btn-primary" onClick={() => addToList(details)}>
      <i className="fa fa-play" aria-hidden="true">  </i>

           Add To WacthList</button>
<p className='top-line2'>Episodes</p>
</div>

<div className=' episodes '> 
<div className="ep-button">
{details.episodesList?.map((ep) => {
return  <button className='btn btn-ep' onClick={() => getEpisode(ep.episodeId,ep.episodeNum)}>{ep.episodeNum}</button>
})}

</div>
</div>
</div>

:<div className="spinnerdiv"><ReactBootstrap.Spinner animation="border" /> </div>}
        </div>     
  )
}

export default SingleProduct