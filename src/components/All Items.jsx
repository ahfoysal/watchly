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
  const { allProducts} = useContext(TestContext);

  let {  addToCart , test2 } =  useContextS();








  
  const [ctg , setCtg] = useState([]);
  const [pro , setPro] = useState([]);
  const [active , setActive] = useState('all');
  const [page , setPage] = useState(1);

 


  useEffect(() => {
  
    // gteProducts2()
    getCat()
    
  }, []);












const getCat = () =>{
  axios(`https://pewds-anime1-api.herokuapp.com/recent-release`)
          .then(data2 => { const data = data2.data
            // sessionStorage.setItem('AllItems',JSON.stringify(data.data))
            // setPro(data.data)
            console.log(data);
            // const ctgName =  data.data.map(product => {
            //   return product.categories.map(categories => ( categories.name))})
            //   const merged = [].concat.apply([], ctgName);
            //   let uniqueChars = [...new Set(merged)];
            //   const ctgId =  data.data.map(product => {
            //    return product.categories.map(categories => ( categories.id))})
            //    const merged2 = [].concat.apply([], ctgId);
            //    let uniqueChars2 = [...new Set(merged2)];
            
               setCtg(data)
          
  
    })
        
  
    setPage(1)
  
}

  const gteProducts2 = () =>{
  
            axios(`${process.env.REACT_APP_SHOP_LINK}wp-json/wc/v3/products?${process.env.REACT_APP_KEY}&per_page=100`)
          .then(data2 => { const data = data2
            sessionStorage.setItem('AllItems',JSON.stringify(data.data))
            setPro(data.data)
            // console.log(data);
  
          })
        
  }

const gteProducts = (id) =>{
setActive(id)
console.log(id)

  setPage(1)
  if(test2 === true){

    const param = id

    const cartItems = allProducts.map((cart)=> {
      return cart.categories.map(cat => (cart)).filter((val)=> {
        return val.categories[0].name === id
            });
     
      });
    // console.log(cartItems);
    const merged = [].concat.apply([], cartItems);
    let uniqueChars = [...new Set(merged)];
  // console.log(uniqueChars);
    setPro(uniqueChars)
    // console.log(category)
    
  // console.log(paramss.name)
  
  const cartItems2 = allProducts.map((cart2)=> {
    return cart2.categories.map(cat => (cart2))
   
        });
       
        // console.log(cartItems2);
  
  }else{  

    axios(`${process.env.REACT_APP_SITE_LINK}wp-json/wc/v3/products?${process.env.REACT_APP_KEY}&category=${id}`)
    .then(data2 => { const data = data2
      setPro(data.data);
    })
    
  }



}
  
  
  
    return (
<div className="gridd">
 


  
   </div>
  )
  }
  

  
  
  export default RecentlyUpdated;