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

function WacthList() {


  let {  addToCart   , list, removeFromList } =  useContextS();


 


  useEffect(() => {
  

 
   
    
  }, []);






  
    return (
      <>
      {list?.length >= 1 && <>
<div  className="single-page">  

  <p className="top-line">Watch List</p>
  

<div className=" bg-trasparent "  style={{position: "relative"}}>
        <div className="row g-3">

<Splide  options={{
  perPage    : 5,
  gap        : 0,
  pagination : false,
  arrows : true,
  breakpoints: {
    1200: { perPage: 4, gap: 0 },
    640 : { gap: 0 , perPage: 2},
  },
}}>
        
  
        { list?.map((product, index) => (
        <SplideSlide key={index+1}>
        
        <div  key={product.animeId} >
      <div className="card h-100 shadow-sm">
  
            <div >  <Link to={'/anime/'+product.animeId}> <>
          <img src={product.animeImg
} className="card-img-top" alt="product.title"  />
      
      
      
        <div className="card-body">
        
        <p className="product__name">{product.animeTitle} </p>
    
          </div> </></Link>
        
          <p className="product__ratig" onClick={() => removeFromList(product.animeTitle)}>Remove From WatchList</p>

         
          
        
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
  

  
  
  export default WacthList;