import {  useEffect, useState } from "react";

import {Link} from  'react-router-dom'
import './shop.css'
import axios from "axios";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/react-splide/css';
import { useContextS } from "../pages/cart/Function";
// import { darken } from 'polished';
// import api from '../pages/api';

function RecentlyUpdated() {
  const [pro , setPro] = useState([]);
  let {  addToCart} =  useContextS();
  useEffect(() => {
  
    getCat()
    
  }, []);
  const [term, setTerm] =useState('')



const getCat = (num, terms) =>{
  setTerm(terms)
  axios(`https://pewds-anime1-api.herokuapp.com/top-airing?page=1`)
          .then(data2 => { const data = data2.data
 
            // console.log(num);
               setPro(data) })}
  
    return (
<div  className="single-page">  
  <p className="top-line">New Anime</p>
<div className="container-fluid bg-trasparent my-4 p-3"  style={{position: "relative"}}>
        <div className="row g-3">

<Splide  options={{
  perPage    : 6,
  gap        : 0,
  pagination : false,
  arrows : true,
  breakpoints: {
    1200: { perPage: 4, gap: 0 },
    640 : { gap: 0 , perPage: 2},
  },
}}>
        { pro?.map((product, index) => (
         <SplideSlide  key={index + 1}>
   
        <div className="col hp"  onClick={() => addToCart(product)}>
      <div className="card h-100 shadow-sm">
  
            <div>  <Link to={'/anime/'+product.animeId}> 
          <img src={product.animeImg
} className="card-img-top" alt="product.title" />
      
      
      
        <div className="card-body">
     
        <p className="product__name">{product.animeTitle }</p>

         
          </div>       
        </Link>      
        </div>
      </div>
    </div>

    </SplideSlide>
        )) }
      
       
 

        </Splide>


     
        
        </div>    </div>
          
   
   </div>
  )
  }
  

  
  
  export default RecentlyUpdated;