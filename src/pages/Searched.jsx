import React, { useContext } from 'react'
import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {Link} from  'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap'
import { TestContext } from '../App';
import { useContextS } from './cart/Function';



function Searched() {
  const { allProducts} = useContext(TestContext);
  const { addToCart} = useContextS();



    const [searchedRecipes, setSearchedRecipes] = useState([]);
    const [loading , setLoading] = useState(true);

    let params = useParams();

    const getSearched = async (name) => {
    const data = await fetch(`${process.env.REACT_APP_SHOP_LINK}wp-json/wc/v3/products?search=${name}&${process.env.REACT_APP_KEY}&per_page=20`);
    const recipes = await data.json();
    // console.log(recipes)
    setLoading(false)

    setSearchedRecipes(recipes)
  };
  useEffect(() => {
getSearched(params.search);

const cartItems = allProducts.map((cart) => cart.name )
console.log(cartItems.includes("shoe"));
  
},[params.search]);
  return (
    <div> { loading  ?  <div className="spinnerdiv">      <ReactBootstrap.Spinner animation="border" /> </div> :
    <div className='container'>
           <p>found items: {searchedRecipes.length}</p>

    <Grid>  
        {searchedRecipes.map((item) => {
            return(
              
                <Card key={item.id}><Link to={'/product/'+item.id}>
                        <img src={item.images[0].src} alt={item.name} />
                        <h4>{item.name}</h4></Link>
                        <div className="btn">
       <button className="buy-btn" onClick={() => addToCart(item)}>Add To Cart</button>
        </div>
                </Card>   
               
            )
        }
        )}
  
    </Grid> </div>} </div>
  )
}
const Grid = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
grid-gap: 10px;
`
const Card = styled.div`


img{
  border-radius: 2rem;
  width: 100%;
}
h4{
  padding: 1rem;
  text-align: center;
}
`

export default Searched