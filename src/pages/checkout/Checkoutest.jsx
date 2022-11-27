import {  useNavigate } from 'react-router-dom';
import React, {   useContext, useEffect, useState } from 'react'
import './Checkout.css'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button1 from 'react-bootstrap/Button';
import { useUserAuth } from '../../context/UserAuthContext';
import { TestContext } from '../../App';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useContextS } from '../cart/Function';

const Checkoutest = () => {
  const { cart, setCart} = useContextS();
  const navigate = useNavigate();
  let { user } =  useUserAuth();
  const [isContainerActive, setIsContainerActive] = useState(false);
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [customerID, setCustomerID] = useState(0);
  const [method, setMethod] = useState("cod");
  const [trxid, setTrxid] = useState('');
  const [radio, setRadio] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  


  const total = (cart.reduce((total, prd) => total + prd.price * prd.abc , 0).toFixed(2))


  /////////   Step Handler BAck & Continue
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
   handleNext()
  };
////////////////////
  

/////// Create Order
  const createOrder = (e) => {
    e.preventDefault();

    /////cart item find
    const cartItems = cart.map((cart) => `{'product_id': ${cart.id},'quantity': ${cart.abc}}` );
  const StringCart= JSON.stringify(cartItems);  
  const newItms = StringCart.replace (/"/g,'');
  const newCart = newItms.replace (/'/g,'"');
  setIsContainerActive(true);
  const cID = `"customer_id":"${customerID}"  ,`

    var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
     

   const body1 = `{"payment_method": "${method}","customer_note":"hello",${user ? cID : ''}"transaction_id":"${trxid}","billing":{"first_name":"${name}","address_1":"${address}","phone":"${phone}"},"line_items":`
  const body2= `${newCart}}`
      const body3 = body1.concat(' ', body2);
  
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: body1.concat(' ', body2),
        redirect: 'follow'
      };
      fetch(`https://shop.abusayeeed.xyz/wp/wp-json/wc/v3/orders?${process.env.REACT_APP_KEY}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          const rslt = result;
          console.log(rslt)
          // console.log(rslt.id)
          if(user){addingOrderToDB(rslt, rslt.id)}
          navigate(`/order/${rslt.number}`)      
          setCart([]) 
          localStorage.removeItem('shopping_cart');
          })
        .catch(error => {
          const rslt = error;
          console.log('error', rslt)
          setSomethingWentWrong(true)
        });
        
      console.log(body3)
  }

  
 
   
  const steps = [
    {
      label: 'Delivery Information',
      description: 
      <div> 
    
           

    <Form onSubmit={handleSubmit}>
      <Form.Group as={Row} className="mb-3" controlId="Name" >
        <Form.Label column sm="2">
          Name
        </Form.Label>
        <Col sm="10">
          <Form.Control   required placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}  />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="address">
        <Form.Label column sm="2">
          Address
        </Form.Label>
        <Col sm="10">
          <Form.Control required placeholder="Address"  value={address} onChange={(e) => setAddress(e.target.value)} />
        </Col>
      </Form.Group>


      <Form.Group as={Row} className="mb-3" controlId="phone">
        <Form.Label column sm="2">
         Phone
        </Form.Label>
        <Col sm="10">
          <Form.Control required placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}  />
        </Col>
      </Form.Group>

      <Button1 variant="warning" type="submit">Continue</Button1>

    </Form>
       </div>
   
    },
    {
      label: 'Choose a payment method',
      description: 
      <div>
    <div className="form-check ">
  <input className="form-check-input" onClick={()=>setRadio(false) & setMethod("cod")} type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked />
  <label className="form-check-label" htmlFor="flexRadioDefault1" >
    Cash On Delivery
  </label>
</div>
<div className="form-check ">
  <input className="form-check-input" onClick={()=>setRadio(true) & setMethod("Bkash")} type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
  <label className="form-check-label"  htmlFor="flexRadioDefault2">
   Bkash
  </label>
</div>
    
{!radio  && <div>
<Form onSubmit={createOrder}>
  

      <Button1 variant="warning" type="submit">Checkout</Button1></Form>
 </div>  }

{radio  &&  <div><p>Bkash Number: 01861389963</p>
<Form onSubmit={createOrder}>
    <Form.Group as={Row} className="mb-3" controlId="trxid">
        <Form.Label >
         Transaction Number
        </Form.Label>
        <Col sm="10">
          <Form.Control required placeholder="trxid" value={trxid} onChange={(e) => setTrxid(e.target.value)}  />
        </Col>
        
      </Form.Group>
      <Button1 variant="warning" type="submit">Checkout</Button1></Form>
 </div>  }

           </div>,
    },
  ];
  useEffect(() => {
   if (user){ 
    setName(user?.displayName)
    setCustomerID(user?.photoURL)}
    
    console.log(customerID)
    }, [])


///// adding info to data test 
    const [orderCollection, setOrderCollection] = useState([])
    const ordersCollection = collection(db, "order");
      const addingOrderToDB = async (order, orderId) => {
       const res = await addDoc(ordersCollection, order)
           updateOrder(res.id, orderId)
          console.log(res.id)
       }
      
      const updateOrder = async (id)  =>   {
        const orderDoc = doc(db, "order", id)
        const newFeilds = {email: user.email}
        await updateDoc(orderDoc, newFeilds)
      }
/////////////////

  return (
    
    <div className='cart-page checkout' >
            <div><p className='top-line'>Complete your Order</p></div>
       {cart.length >= 1 && <div className='payment__inner'><Box className='payment__method'   sx={{ maxWidth: 400 }}>
        {isContainerActive ? <h3 className="head">Thank You For Your Order.</h3> : ""}
{somethingWentWrong ? <h3 className="head">somthing went wrong</h3> : ""}
      <Stepper activeStep={activeStep} orientation="vertical" >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <div>{step.description}</div>
              <Box sx={{ mb: 2 }}>
                <div>            
<Button disabled={index === 0}  onClick={handleBack} sx={{ mt: 1, mr: 1 }}>Back</Button>

                </div>
   
             </Box>
            </StepContent>
          </Step>
        ))}
      
      </Stepper>
     
    </Box>
      
  <div className="payment__summary">    
  <p className='top-line2'>Order Summary</p>
  <div className='payment__summaryList'>
  {cart.map((css) => {
    return <div className="payment__item">
          <span className='payment__name'>{css.name} </span>
          <span className='payment__quantity'>X{css.abc}</span>  
          <span className='payment__price'>৳{(css.price * css.abc).toFixed(2)}</span> </div>
    
  })}
  <hr />
  <div className="payment__item">
          <span className='payment__name'>Delivery Charge: </span>
          <span className='payment__price'>৳0</span> </div>
          <div className="payment__item" >
          <span className='payment__name'> Total : </span>
          <span className='payment__price'>৳{total}</span> </div>

          <div className="payment__item" style={{marginTop: "30px"}}>
          <span className='payment__name'>Grand Total : </span>
          <span className='payment__price'>৳{total}</span> </div>

   </div>

</div>
</div> }
{cart < 1 && <p>Please Add atleast a Products In Cart</p>}
    </div>
  )
}

export default Checkoutest
