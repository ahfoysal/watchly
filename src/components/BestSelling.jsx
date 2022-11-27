import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/react-splide/css';
import {Link} from  'react-router-dom'
import { TestContext } from "../App";


function Common() {

  const {context, allProducts, addToCart} = useContext(TestContext);
  
  const [Common, setCommon] = useState([]);
  useEffect(() => {
    getCommon();
    // console.log(process.env)
  }, []);

  const getCommon = async () => {
    const check = sessionStorage.getItem('common')
    if(check){
      setCommon(JSON.parse(check))
    }else{

      const api = await fetch(`${process.env.REACT_APP_SHOP_LINK}wp-json/wc/v3/products?${process.env.REACT_APP_KEY}&category=37`);
      const data = await api.json();
      sessionStorage.setItem('common',JSON.stringify(data))
      setCommon(data);
      console.log(data);
    }
  };
    return (
      <div className="container">
      <h3 className="head">Best Selling </h3>

      <Wrapper>

    <Splide options={{
      
      arrows: false,
      pagination: false,
      drag: 'free',
      gap: '1rem',
      perPage: 3,
      breakpoints: {
        640: {
          perPage: 1,
        },
        1000: {        perPage: 2,    gap: '10px'      }

      }
    }}>
      {Common.map((product) => {
  return(
    <SplideSlide className="cards" key={product.id}>
    <Link to={'/product/'+product.id}>
<div className="product-image">
<img src={product.images[0].src} alt={product.name}/>
</div>
<div className="product-info">
<h2>{product.name}</h2>
<p dangerouslySetInnerHTML={{ __html: product.short_description }}></p>
<div className="price">৳{product.price}</div>
</div> </Link>
<div className="btn ppbtn">
<button className="buy-btn" onClick={() => addToCart(product)}>Add to Cart</button>
</div>
</SplideSlide>
  );

})};
        </Splide>
        </Wrapper>


  </div>
  )
  }
  const Wrapper = styled.div`
margin: 4rem 0rem;
`;
  
  export default Common;