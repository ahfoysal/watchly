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
import { set } from 'react-hook-form';


function SingleProduct() {
  const navigate = useNavigate();

  const { allProducts, setActiveTabCart, setActiveTabOrder,setActiveTabHome, setActiveTabUser, setHeaderActive} = useContext(TestContext);
   let {  addToCart , test2, setTest2} =  useContextS();

  const [details , setDetails] = useState([]);
  const [src , setSrc] = useState('');

  const [loading , setLoading] = useState(false);
  const [loading2 , setLoading2] = useState(true);


  let params = useParams();

useEffect(() => { 

  //     setActiveTabCart(false)
  //     setActiveTabOrder(false)
  //     setActiveTabHome(false)
  //     setActiveTabUser(false)
  //     setHeaderActive(false)

  fetchDetails()
  

console.log(params.name)
 
 
},[])



const fetchDetails = () =>{
 
  // if(test2 === true){
  //   const param = params.name
  //   const cartItems = allProducts.map((cart) => cart ).filter((val)=> {
  //     return val.id === parseInt(param)
  //     });
  //     if(cartItems[0] === undefined){
  //       window.location.reload()
  //     }
  //   setDetails(cartItems[0])
  //   setDetails2(cartItems[0])

  //   console.log(details)
  // console.log(cartItems[0])
  //         setLoading(true) 
  // }else{  


    axios(`${process.env.REACT_APP_SITE_LINK}anime-details/${params.name}`)
    .then(data2 => { const data = data2
      sessionStorage.setItem(`${params.name}`,JSON.stringify(data.data))
      setDetails(data.data);

      console.log(data.data);
      setLoading(true)
    })  
  // }


  

}
const getEpisode = (num,id) =>{
  setLoading(false)
  console.log(num,id);
  axios(`https://api.consumet.org/anime/gogoanime/watch/${id}?server=gogocdn`)
  .then(data2 => { const data = data2.data  
    setSrc(data.headers.Referer)
console.log(data.headers.Referer)
setLoading(true)
  
  })  


}


const page = Math.random() * 10


  return (
    
    <div className='container'>
    
{
  loading ? 
  <div className='productSingle'>
 
  <div className=' productSingle__inner'>

    <div className='load anime'>
    <div className="play-video">
{details ?
    <Iframe src={src}     width="100%"
        height="800px" autoplay="true"/> : <div ><ReactBootstrap.Spinner animation="border" /> </div>}

    </div>
  

    </div > 
<div className='productSingle__details '> 
<p className='productSingle__name'>{details?.animeTitle}</p>



  
    
   
  </div>
 </div> 

<div>
<p>Episodes</p>
</div>

<div className='container simmmilar'> 

{details?.episodesList?.map((ep) => {
return <button className='btn btn-danger' onClick={() => getEpisode(ep?.episodeNum,ep?.episodeId)}>{ep?.episodeNum}</button>
})}


</div>
</div>

:<div className="spinnerdiv"><ReactBootstrap.Spinner animation="border" /> </div>}
        </div>     
  )
}

export default SingleProduct