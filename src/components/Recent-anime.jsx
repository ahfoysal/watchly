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
  let {  addToCart , cart, clearTheCart } =  useContextS();


 


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
<div >  

{cart?.length >= 1 && <> <p className="top-line">Continue Watcing</p>
    <div className="container-fluid bg-trasparent my-4 p-3"  style={{position: "relative"}}>
        <div className="row row-cols-3 row-cols-xs-5 row-cols-sm-5 row-cols-lg-6 g-3">
        { cart?.slice(0,6)?.map(product => (
        <>
        
        <div className="col hp" key={product.animeId} onClick={() => addToCart(product)}>
      <div className="card h-100 shadow-sm">
  
            <div>  <Link to={'/anime/'+product.animeId}> <>
          <img src={product.animeImg
} className="card-img-top" alt="product.title" />
      
      
      
        <div className="card-body">
          <span className="product__category">EP {product?.lastEP2}</span>
        <p className="product__name">{product.animeTitle} </p>
      

         
          </div>
        
          </></Link>
          <div className="add-to-cart">
          
          
          </div>
          
        
        </div>
      </div>
    </div>

        </>
        )) }
        </div>    </div>

  <button className="btn btn-danger" onClick={() => clearTheCart()}>Clear</button></>}






  <Pagination className="paginatin" count={100}
      onChange={(_, value) => {
        pages(value);    
      }}
      />

 

<Splide  options={{
        arrows: false,      pagination: false,        gap: '30px',   perPage: 8,
        breakpoints: {
          700: {        perPage: 5,    gap: '10px'      },
          
          1000: {        perPage: 5,    gap: '10px'      }

        }
      }}>
        <SplideSlide className={'catergory-bar active   '} ><p onClick={() =>  getCat(1,'recent-release')}>Recently Updated</p></SplideSlide>
        <SplideSlide className={'catergory-bar   '} ><p onClick={() =>  getCat(1,'popular')}>Popular</p></SplideSlide>
        <SplideSlide className={'catergory-bar   '} ><p onClick={() =>  getCat(1,'top-airing')}>Top Airing</p></SplideSlide>
        <SplideSlide className={'catergory-bar     '} ><p onClick={() =>  getCat(1,'anime-movies')}>Anime Movies</p></SplideSlide>


        
        {/* {ctg.map((ctgn) => {
  return <SplideSlide className={' catergory-bar'} key={ctgn}>   <p  className={` cat-btn categories__category ${active === ctgn ? 'cat-active' : ' '}`}  onClick={() => gteProducts(ctgn)} > {ctgn}</p> </SplideSlide>
})}  */}
        </Splide>


        <div className="container-fluid bg-trasparent my-4 p-3"  style={{position: "relative"}}>
        <div className="row row-cols-2 row-cols-xs-4 row-cols-sm-4 row-cols-lg-5 g-3">
        { pro?.map(product => (
        <>
        
        <div className="col hp" key={product.animeId} onClick={() => addToCart(product)}>
      <div className="card h-100 shadow-sm">
  
            <div>  <Link to={'/anime/'+product.animeId}> <>
          <img src={product.animeImg
} className="card-img-top" alt="product.title" />
      
      
      
        <div className="card-body">
     
        <p className="product__name">{product.animeTitle }</p>

         
          </div>
        
          </></Link>
          <div className="add-to-cart">
          
          
          </div>
          
        
        </div>
      </div>
    </div>

        </>
        )) }
        </div>    </div>
          
   
   </div>
  )
  }
  

  
  
  export default RecentlyUpdated;