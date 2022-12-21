import React, { useContext } from 'react'
import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {Link} from  'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap'
import { TestContext } from '../App';
import { useContextS } from './cart/Function';
import axios from 'axios';
import { Pagination } from '@mui/material';



function Searched() {
  let {  addToCart , cart } =  useContextS();

    const [details, setDetails] = useState([]);
    const [loading , setLoading] = useState(true);
    const [pro , setPro] = useState([]);


    let params = useParams();
    

    const pages = (num) => {
  
      getSearched(num)
        console.log(params.search)
     
       }
    const getSearched = (num) => {

   
      axios(`https://gogoanime.consumet.org/search?keyw=${params.search}&page=${num}`)
      .then(data2 => {  const data = data2.data  
    console.log(data)
    setPro(data)
  
    setLoading(true)
      
      })  
      axios(`https://api.consumet.org/movies/flixhq/${params.search}`)
      .then(data2 => {  const data = data2.data.results.slice(1,10)  
    console.log(data)
    setDetails(data)
    
      
      })  
   


  };
  useEffect(() => {
    getSearched(1)

  
},[params.search]);
  return (
    <div className="gridd">
      
      <div className="container-fluid bg-trasparent my-4 p-3"  style={{position: "relative"}}>
            <p>Anime</p>
          {pro?.length <= 0 && <p> No anime found</p>}
          <div className="row row-cols-2 row-cols-xs-4 row-cols-sm-4 row-cols-lg-5 g-3">
         
          { pro?.map((product, index )=> (
          <div key={index+1}>
          
          <div className="col hp" key={product.animeId} onClick={() => addToCart(product)}>
        <div className="card h-100 shadow-sm">
    
              <div>  <Link to={'/anime/'+product.animeId}> <>
            <img src={product.animeImg
  } className="card-img-top" alt="product.title" />
        
        
        
          <div className="card-body">
       
          <p className="product__name">{product.animeTitle }</p>
  
           
            </div>
          
            </></Link>
            
          </div>
        </div>
      </div>
  
          </div>
          )) }
          </div>    </div>
            
      
  
          {pro?.length > 0 &&   <Pagination className="paginatin" count={2}
      onChange={(_, value) => {
        pages(value);    
      }}
      />} 
<div className="container-fluid bg-trasparent my-4 p-3"  style={{position: "relative"}}>
      <p>Movie & Series</p>
      <div className="row row-cols-2 row-cols-xs-4 row-cols-sm-4 row-cols-lg-5 g-3">
          { details?.map((product, index )=> (
          <div key={index+1}>
          
          <div className="col hp" key={product?.id}>
        <div className="card h-100 shadow-sm">
    
              <div>  <Link to={`/${product.id}`}> <>
            <img src={product.image
  } className="card-img-top" alt="product.title" />
        
        
        
          <div className="card-body">
       
          <p className="product__name">{product.title }</p>
          <p className="product__name">{product.type }</p>
  
           
            </div>
          
            </></Link>
            
          </div>
        </div>
      </div>
  
          </div>
          )) }</div>


      </div>



     </div>

  )
}


export default Searched