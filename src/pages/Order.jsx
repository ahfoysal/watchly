import {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {useParams, Navigate} from 'react-router-dom';
import React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import axios from 'axios'
import { TestContext } from '../App';
function Orders(props) {
const test = useContext(TestContext)
  let params = useParams();
  const [details , setDetails] = useState({});
  const [loading , setLoading] = useState(false);

const fetchDetails = () =>{
  const check = sessionStorage.getItem(`${params.name}`)
  if(check){
    setDetails(JSON.parse(check))
    setLoading(true)

  }else{  

    axios(`https://shop.abusayeeed.xyz/wp/wp-json/wc/v3/orders/209?${process.env.REACT_APP_KEY}`)
    .then(data2 => { const data = data2
      sessionStorage.setItem(`${params.name}`,JSON.stringify(data.data))
      setDetails(data.data);
      console.log(data.data);
      setLoading(true)
    })
  }

};

useEffect(() => {


fetchDetails();
 
 },[params.name]);

  return (
    
    
    <DetailsWrapper>
{
  loading ? 

  
  <div className='container productpage'>
  
<Info> 
  <h1>context {test}</h1>
<h2>Order Number :{details.number}</h2>
<h2>Current Status: {details.status}</h2>
<h2>Name:{details.billing.first_name}</h2>
<h2>Phone: {details.billing.phone}</h2>
<h2>Total Amount:{details.total}</h2>


  
      <div>    
<div className="btn">
       <button className="buy-btn" href={'/'}>Back to home</button>
        </div>

  </div>
 




</Info></div>

:<div className="spinnerdiv"><ReactBootstrap.Spinner animation="border" /> </div>}
    
       </DetailsWrapper>
       
  )
}

const DetailsWrapper = styled.div`
margin-top: 10rem;
margin-bottom: 5rem;
display: flex;


.active{
background: linear-gradient(35deg, #494949, #313131);
color: white;
}
h2{
margin-bottom: 2rem;
margin-top: 1rem;
}
h2{
  font-size: 1rem;
  margin-bottom: 2rem;
  margin-top: 1rem;
  }
li{
font-size: 1.2rem;
line-height: 2.5rem;

}
ul{
margin-top: 2rem;
}

`;

const Info = styled.div`
margin-top: 4rem;

margin-left: 5rem;

`;

export default Orders