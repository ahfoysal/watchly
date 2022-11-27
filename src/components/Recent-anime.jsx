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
    axios(`https://api.consumet.org/anime/gogoanime/watch/spy-x-family-episode-1?server=gogocdn`)
  .then(data2 => { const data = data2.data  
console.log(data)

  
  })  
    
  }, []);

const getCat = (num) =>{
  axios(`https://pewds-anime1-api.herokuapp.com/recent-release?page=${num}`)
          .then(data2 => { const data = data2.data
            // sessionStorage.setItem('AllItems',JSON.stringify(data.data))
            // setPro(data.data)
            console.log(num);
            // const ctgName =  data.data.map(product => {
            //   return product.categories.map(categories => ( categories.name))})
            //   const merged = [].concat.apply([], ctgName);
            //   let uniqueChars = [...new Set(merged)];
            //   const ctgId =  data.data.map(product => {
            //    return product.categories.map(categories => ( categories.id))})
            //    const merged2 = [].concat.apply([], ctgId);
            //    let uniqueChars2 = [...new Set(merged2)];
            
               setPro(data)
          
  
    })
        
  
  
}

//   const gteProducts2 = () =>{
  
//             axios(`${process.env.REACT_APP_SHOP_LINK}wp-json/wc/v3/products?${process.env.REACT_APP_KEY}&per_page=100`)
//           .then(data2 => { const data = data2
//             sessionStorage.setItem('AllItems',JSON.stringify(data.data))
//             setPro(data.data)
//             // console.log(data);
  
//           })
        
//   }

// const gteProducts = (id) =>{
// setActive(id)
// console.log(id)

//   setPage(1)
//   if(test2 === true){

//     const param = id

//     const cartItems = allProducts.map((cart)=> {
//       return cart.categories.map(cat => (cart)).filter((val)=> {
//         return val.categories[0].name === id
//             });
     
//       });
//     // console.log(cartItems);
//     const merged = [].concat.apply([], cartItems);
//     let uniqueChars = [...new Set(merged)];
//   // console.log(uniqueChars);
//     setPro(uniqueChars)
//     // console.log(category)
    
//   // console.log(paramss.name)
  
//   const cartItems2 = allProducts.map((cart2)=> {
//     return cart2.categories.map(cat => (cart2))
   
//         });
       
//         // console.log(cartItems2);
  
//   }else{  

//     axios(`${process.env.REACT_APP_SITE_LINK}wp-json/wc/v3/products?${process.env.REACT_APP_KEY}&category=${id}`)
//     .then(data2 => { const data = data2
//       setPro(data.data);
//     })
    
//   }



// }
  
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
          
          {product?.stock_status === "instock" && <button className="buy-btn pp-btn" onClick={() => addToCart(product)}> <MdAddShoppingCart size={16} color="#FFF" />
        <span>  Add To Cart</span></button>}
        {product?.stock_quantity < 1 && product?.stock_quantity != null && <p>Stock Out</p>}
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