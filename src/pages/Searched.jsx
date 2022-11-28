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

    const [searchedRecipes, setSearchedRecipes] = useState([]);
    const [loading , setLoading] = useState(true);
    const [pro , setPro] = useState([]);


    let params = useParams();
    

    const pages = (num) => {
  
      getSearched(num)
        
     
       }
    const getSearched = (num) => {

   
      axios(`https://pewds-anime1-api.herokuapp.com/search?keyw=${params.search}&page=${num}`)
      .then(data2 => { const data = data2.data  
    console.log(data)
    setPro(data)
  
    setLoading(true)
      
      })  
   


  };
  useEffect(() => {
    getSearched(1)

  
},[params.search]);
  return (
    <div className="gridd">
    <h3 className="top-line">Search Result :  {params.search}</h3>
    <Pagination className="paginatin" count={100}
      onChange={(_, value) => {
        pages(value);    
      }}
      />
  
 
  
  
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


export default Searched