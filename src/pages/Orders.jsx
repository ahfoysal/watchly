import {useState, useEffect} from 'react'
import styled from 'styled-components'
import {Link, useParams} from 'react-router-dom';
import React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import axios from 'axios'

function Orders(props) {

  let params = useParams();
  const [details , setDetails] = useState({});
  const [loading , setLoading] = useState(false);
  const getData2 =  () => {
  
   
    axios(`${process.env.REACT_APP_SHOP_LINK}wp-json/wc/v3/orders/${params.name}?${process.env.REACT_APP_KEY}`)
    .then(data2 => { const data = data2
    
      setDetails(data.data);
     
      console.log(data.data);
    
    })
  }



const fetchDetails = () =>{
  const check = sessionStorage.getItem(`${params.name}`)
  if(check){
    setDetails(JSON.parse(check))
    setLoading(true)

  }else{  

    axios(`${process.env.REACT_APP_SHOP_LINK}wp-json/wc/v3/orders/${params.name}?${process.env.REACT_APP_KEY}`)
    .then(data2 => { const data = data2
      sessionStorage.setItem(`${params.name}`,JSON.stringify(data.data))
      setDetails(data.data);
      console.log(data.data);
      setLoading(true)
    })
  }

};

useEffect(() => {

//  const key =  'consumer_key=ck_f4414d18802ae452b45cd05a41cec38705a3ba5a&consumer_secret=cs_427628913e1aae762409b64e2a2e57e126fe7225';

//  axios(`${process.env.REACT_APP_SHOP_LINK}wp-json/wc/v3/products/${params.name}?${key}`)
//  .then(data2 => {
//   const rslt = data2;
//   console.log(rslt)

//   })
//  setImage(data2.data.images[0].src);
// .then(data3 => setImage(data3.data.images[0].src))
// .then(data4 => console.log(data4.data))
//  setLoading(true)

 
  

fetchDetails();
getData2()
 },[params.name]);

  return (
    
    
    <div className='cart-page'>

{
  loading ? 
  <div className='orders__inner' >  
  <div key={details.number} className='order_sum pay_sum' >
  <p className='top-line'>Order ID: 69420{details.number}</p>

  <p>Payment Method: {details.payment_method}</p>
  <p>Payment Method: {details.payment_method}</p>

      <div className='order__list noScrollbar'>
       
     {details.line_items?.map((pro) => {
                    return   <div className='order__item item_order'> 
                    <Link to={'/product/'+pro.product_id}>
                <div className='order__image'><img src={pro.image.src} alt=""   /></div>
                 <span className='order__name'>{pro.name}</span>
                <span className="order__quantity">x{pro.quantity}</span>
                </Link> </div>

                      }
                    )}</div>
                    
                    <div className="payment__item" style={{marginTop: "auto"}}>
                        <span className="payment__name">Total Amount</span>
                          <span className="payment__price">{details.total}</span>
                        </div>
                        <div className="payment__item" style={{marginTop: "auto"}}>
                     <p className="payment__name">status  </p>
                     <span className='payment__status'> {details.status} </span> 


                          </div>


    </div>
 </div>

:<div className="spinnerdiv"><ReactBootstrap.Spinner animation="border" /> </div>}
    
       </div>
       
  )
}



export default Orders