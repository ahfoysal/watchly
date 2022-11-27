import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../firebase'
import { collection, addDoc,  getDocs} from "firebase/firestore";
import { useUserAuth } from '../../context/UserAuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as ReactBootstrap from 'react-bootstrap'
import { TestContext } from '../../App';


const TestDb = () => {
  const {    setActiveTabCart, setActiveTabOrder,setActiveTabHome, setActiveTabUser} = useContext(TestContext);
  let { user } =  useUserAuth();

  const [order, setOrder] = useState([]);
  const [details , setDetails] = useState([]);

  const [loading , setLoading] = useState(false);


  


   


// }
const getData2 =  () => {

  axios(`${process.env.REACT_APP_SHOP_LINK}wp-json/wc/v3/orders/?${process.env.REACT_APP_KEY}&per_page=100`)
  .then(data2 => { const data = data2.data
   
    console.log(Number(user?.photoURL))
    setLoading(true) 

   const data3 = (data.map((cart) => cart ).filter((val)=> {
    return val.customer_id === Number(user.photoURL)
    }))

    console.log(data3)
      setOrder(data3) 
  })

}
  useEffect( () => {

    if(user?.email){
      setLoading(false)
    }

    // getData()    
    getData2()     
    setActiveTabCart(false)
    setActiveTabOrder(true)
    setActiveTabHome(false)
    setActiveTabUser(false)

       
      
}, [])

  return (
    <div className='cart-page'>
      {user && order.length < 1 && <p className="top-line">No Orders Found</p> }
            <p className='top-line'>Your Orders </p>
         {  loading ?   <div className='orders__inner' >      
        {user && order.length >= 1 &&  order.map((name) => {
                     return  <div key={name.number} className='payment__summary pay_sum' > <Link to={`/order/${name.number}`}>
                      <h5>Order ID: 69420{name.number}</h5>
                      <p>Payment Method: {name.payment_method}</p>
                    <div className='order__list noScrollbar'>
                     
                    {name.line_items?.map((pro) => {
                              return   <div className='order__item item_order'> 
                      <div className='order__image'><img src={pro.image.src} alt=""   /></div>
                      <span className='order__name'>{pro.name}</span>
                      <span className="order__quantity">x{pro.quantity}</span>
                      </div>
                      }
                    )}</div>

                        <div className="payment__item" style={{marginTop: "auto"}}>
                        <span className="payment__name">Total Amount</span>
                          <span className="payment__price">{name.total}</span>
                        </div>
                        <div className="payment__item" style={{marginTop: "auto"}}>
                     <p className="payment__name">status  </p>
                     <span className='payment__status'> {name.status} </span>

                          </div>



                  </Link>   </div>
                     })}




                     
                     {!user && <p>Please Login To Check Orders</p> }
                  
            </div>  : <div className="spinnerdiv"><ReactBootstrap.Spinner animation="border" /> </div> }
          {user?.email &&  <button className='btn btn-primary' onClick={() => getData2()}>refresh</button>
}            </div>
  )
}

export default TestDb
