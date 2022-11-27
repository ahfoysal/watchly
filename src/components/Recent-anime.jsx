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

  let {  addToCart  } =  useContextS();

 
  const [ctg , setCtg] = useState([]);
  const [pro , setPro] = useState([]);


 


  useEffect(() => {
  
    // gteProducts2()
    getCat(1)
   
    
  }, []);

const getCat = (num) =>{
  axios(`https://pewds-anime1-api.herokuapp.com/recent-release?page=${num}`)
          .then(data2 => { const data = data2.data
 
            console.log(num);
               setPro(data) })}

  
  const pages = (num) => {
  
 getCat(num)
   

  }
  
    return (
<div className="gridd">
  <h3 className="top-line">Recently Updated</h3>
  <Pagination className="paginatin" count={100}
      onChange={(_, value) => {
        pages(value);    
      }}
      />

 
{/* 
<Splide  options={{
        arrows: false,      pagination: false,        gap: '10px',   perPage: 10,
        breakpoints: {
          700: {        perPage: 5,    gap: '10px'      },
          
          1000: {        perPage: 5,    gap: '10px'      }

        }
      }}>
        <SplideSlide className={'catergory-bar  test '}><p className={` cat-btn categories__category ${active === 'all' ? 'cat-active' : ' '}`} onClick={() => (setPro(allProducts), setActive('all'))}>All Products</p></SplideSlide>
        
        {ctg.map((ctgn) => {
  return <SplideSlide className={' catergory-bar'} key={ctgn}>   <p  className={` cat-btn categories__category ${active === ctgn ? 'cat-active' : ' '}`}  onClick={() => gteProducts(ctgn)} > {ctgn}</p> </SplideSlide>
})} 
        </Splide> */}


        <div className="container-fluid bg-trasparent my-4 p-3"  style={{position: "relative"}}>
        <div className="row row-cols-2 row-cols-xs-4 row-cols-sm-4 row-cols-lg-5 g-3">
        { pro?.map(product => (
        <>
        
        <div className="col hp" key={product.animeId}>
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
          
          {/* <div className="clearfix mb-1">

            <span className="float-start"><i className="fas fa-question-circle"></i></span>

            <span className="float-end">
              <i className="far fa-heart" ></i>

            </span>
          </div> */}
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