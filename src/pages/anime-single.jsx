import {useState, useEffect, useContext} from 'react'

import {useParams, useNavigate, Link} from 'react-router-dom';
import React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import axios from 'axios'
import { TestContext } from '../App';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaStar } from 'react-icons/fa';
import { useContextS } from './cart/Function';
import { orderBy } from 'firebase/firestore';
import Iframe from 'react-iframe'
import JWPlayer from '@jwplayer/jwplayer-react';



function SingleProduct() {
  let {  addToCart , cart } =  useContextS();

  const navigate = useNavigate();

  
  const [details , setDetails] = useState([]);
  const [src , setSrc] = useState('');

  const [loading , setLoading] = useState(true);
  const[ np,  setNp] = useState('')


  let params = useParams();

useEffect(() => { 
  fetchDetails()
  // console.log("cart", cart)
},[])



const fetchDetails = () =>{



    axios(`https://pewds-anime1-api.herokuapp.com/anime-details/${params.name}`)
    .then(data2 => { const data = data2.data
      setDetails(data)
      
      
      const cartItems = cart.map((cart) => cart ).filter((val)=> {
        return val.animeTitle   === data.animeTitle
        })
        const data3 = cartItems[0].lastEP
        const data4 = cartItems[0].lastEP2

        if(cartItems[0].lastEP){
          getEpisode(data3,data4,data)
        }else{
const data5 = data.episodesList[0].episodeId
      const data6 = data.episodesList[0].episodeNum
      getEpisode(data5,data6,data)

  
        }
   
 
      // console.log(data);

      setLoading(true)
    })  
  // }


  

}
const [details2 , setDetails2] = useState(true);

const getEpisode = (id,num,full) =>{
    setLoading(false)
  
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
  // console.log(data)
  setNp(`Episode-${cartItems[0].lastEP2}`)
  setLoading(true)

  })  
}else{
 
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
    setSrc(data.headers.Referer)
  // console.log(data)
  setNp(`Episode-${cartItems[0].lastEP2}`)

  
  setLoading(true)
  console.log(cartItems[0].lastEP)
  console.log(full)
  })  

  }else{

    
  }
  
  }
 

  

}




  return (
    
    <div className='l'>
    
{
  loading ? 
  <div className='cart-page'>
 
 

    
    
    
    


  <div className=' prodtSingle__inner'>

    <div className='load-anime'>
    <div className="responsiveas">
{details ?
      <Iframe src={src}  
      width="100%"
      height='700px'
      id="myId"
      className="responsive-iframe"
    allowFullScreen
      scrolling="no"  />

    
    
    
    : <div ><ReactBootstrap.Spinner animation="border" /> </div>}

    </div>
  

    </div > 
<div className='productSingle__details '> 
 <p>Quality {details2?.sources?.map((type) => {
  return <span className='margin-left'>{type?.quality}</span>
})}</p>
<p className='productSingle__name'>{details.animeTitle} {np}</p>




  
    
   
  </div>
 </div> 

<div>
<p>Episodes</p>
</div>

<div className='container simmmilar'> 

{details.episodesList?.map((ep) => {
return <button className='btn btn-danger' onClick={() => getEpisode(ep.episodeId,ep.episodeNum)}>{ep.episodeNum}</button>
})}


</div>
</div>

:<div className="spinnerdiv"><ReactBootstrap.Spinner animation="border" /> </div>}
        </div>     
  )
}

export default SingleProduct