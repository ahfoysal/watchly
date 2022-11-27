import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import axios from 'axios'
import { MdAddShoppingCart } from 'react-icons/md';
import {useParams} from 'react-router-dom';
import { TestContext } from '../App';



function Cuisine() {
  const {context, allProducts, addToCart, test2} = useContext(TestContext);

  let paramss = useParams();
  const [category , setCategory] = useState([]);


useEffect(() => { 
  fetchDetails()
  
  
},[])



const fetchDetails = () =>{
 
  if(test2 === true){

    const param = paramss.name

    const cartItems = allProducts.map((cart)=> {
      return cart.categories.map(cat => (cart)).filter((val)=> {
        return val.categories[0].id === parseInt(param)
            });
     
      });
    // console.log(cartItems);
    const merged = [].concat.apply([], cartItems);
    let uniqueChars = [...new Set(merged)];
  // console.log(uniqueChars);
    setCategory(uniqueChars)
    // console.log(category)
    
  // console.log(paramss.name)
  
  const cartItems2 = allProducts.map((cart2)=> {
    return cart2.categories.map(cat => (cart2))
   
        });
       
        console.log(cartItems2);
  
  }else{  

    axios(`${process.env.REACT_APP_SHOP_LINK}wp-json/wc/v3/products?${process.env.REACT_APP_KEY}&category=${paramss.name}`)
    .then(data2 => { const data = data2
      sessionStorage.setItem(`${paramss.name}`,JSON.stringify(data.data))
      setCategory(data.data);
    })
    
  }



}





  return (
    <ProductList  >
      
        { category.map(product => (
          <li className="product-con" key={product.id}>
            <Link to={'/product/'+product.id}>
   <img
              src={product.images[0].src}
              alt={product.name}
            />
            <strong>{product.name }</strong>
            <p>{product.price}</p></Link>

            <button type="button" onClick={() => addToCart(product) } >
              <div>
                <MdAddShoppingCart size={16} color="#FFF" /> 

              </div>

              <span>ADD TO CART</span>
            </button>
          </li>
        )) }
      </ProductList>
  )
}


const ProductList = styled.ul`
display: grid;
grid-template-columns: repeat(3, 1fr);
grid-gap: 20px;
list-style: none;
@media screen and (max-width: 800px) {
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 10px;

}

li {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 4px;
  padding: 20px;

  img {
    align-self: center;
    max-width: 250px;
  }

  > strong {
    font-size: 16px;
    line-height: 20px;
    color: #333;
    margin-top: 5px;
  }

  > p {
    font-size: 21px;
    font-weight: bold;
    margin: 5px 0 20px;
  }

  button {
    background: #7159c1;
    color: #fff;
    border: 0;
    border-radius: 4px;
    overflow: hidden;
    margin-top: auto;

    display: flex;
    align-items: center;
    transition: background 0.2s;

    &:hover {
      background: black;
    }

    div{
      display: flex;
      align-items: center;
      padding: 12px;
      background: rgba(0, 0, 0, 0.1);

      svg {
        margin-right: 5px;
      }
    }

    span {
      flex: 1;
      text-align: center;
      font-weight: bold;
    }
  }
}

`;


export default Cuisine