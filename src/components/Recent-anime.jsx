import { useContext, useEffect, useState } from "react";
import styled from 'styled-components';
import {Link} from  'react-router-dom'
import './shop.css'
import { TestContext } from "../App";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/react-splide/css';
import { Pagination } from "@mui/material";
import { MdAddShoppingCart } from "react-icons/md";
import { useContextS } from "../pages/cart/Function";
// import { darken } from 'polished';
// import api from '../pages/api';

function RecentlyUpdated() {


 
  const [ctg , setCtg] = useState([]);
  const [pro , setPro] = useState([]);
  let {  addToCart , cart,  removeFromDb,clearTheCart } =  useContextS();


 


  useEffect(() => {
  
    // gteProducts2()
    getCat(1, 'recent-release')
    console.log(cart)
   
    
  }, []);
  const [term, setTerm] =useState('')



const getCat = (num, terms) =>{
  setTerm(terms)
  axios(`https://pewds-anime1-api.herokuapp.com/${terms}?page=${num}`)
          .then(data2 => { const data = data2.data
 
            // console.log(num);
               setPro(data) })}

  
  const pages = (num) => {
  
 getCat(num, term)
   

  }
  
    return (
      <>
      {cart?.length >= 1 && <>
<div  className="single-page">  
<p className="product__rating" onClick={() => clearTheCart( )}> Remove All</p>
  <p className="top-line">Continue Watching </p>
  

<div className=" bg-trasparent "  style={{position: "relative"}}>
        <div className="row g-3">

<Splide  options={{
  perPage    : 6,
  gap        : 0,
  pagination : false,
  arrows : true,
  breakpoints: {
    1200: { perPage: 5, gap: 0 },
    640 : { gap: 0 , perPage: 3},
  },
}}>
        
  
        { cart?.slice(0,6)?.map(product => (
        <SplideSlide >
        
        <div className="   " key={product.animeId} >
      <div className="card h-100 shadow-sm">
  
            <div >  <Link to={'/anime/'+product.animeId}> <>
          <img src={product.animeImg
} className="card-img-top" alt="product.title"  onClick={() => addToCart(product)}/>
      
      
      
        <div className="card-body">
          <span className="product__category">EP {product?.lastEP2}</span>
        <p className="product__name">{product.animeTitle} </p>
    
          </div> </></Link>
        
          {/* <p className="product__rating" onClick={() => removeFromDb(product.animeId)}>Remove</p> */}

         
          
        
        </div>
      </div>
    </div>

    </SplideSlide>
        )) }
     

  
      
       
 

        </Splide>


     
        
        </div>    </div>
          
   
   </div></>}</>
  )
  }
  

  
  
  export default RecentlyUpdated;