import React, {  useContext, useEffect, useState } from 'react'
import { Container, ProductTable, Total } from './Cart-styles';
import { MdRemoveCircleOutline, MdAddCircleOutline, MdDelete } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import '../cart/Cart.css'
import { TestContext } from '../../App';
import Remove from '@mui/icons-material/RemoveShoppingCart';
import { useContextS } from './Function';





const Cart = () => {
  ////props
  const {   setActiveTabCart, setActiveTabOrder,setActiveTabHome, setActiveTabUser, setHeaderActive} = useContext(TestContext);
     
  let {  cart, updateDb, getDb, clearTheCart, removeFromDb, getCart } =  useContextS();


  const navigate = useNavigate();
/////state
  const [isCartEmpty, setIsCartEmpty] = useState(true);
 

/////checkout button 
useEffect(() => {
 if(cart.length < 1 ){setIsCartEmpty(false)} 

  setActiveTabCart(true)
  setActiveTabOrder(false)
  setActiveTabHome(false)
  setActiveTabUser(false)
  setHeaderActive(false)
}, [])

const ProceedtoPayment = () => {
  navigate("/checkout")      
}
const total = (cart.reduce((total, prd) => total + prd.price * prd.abc , 0).toFixed(2))
const total2 = cart.reduce((total, prd) => total + prd.abc , 0)


// const subTotal = cart.reduce(( prd) =>   parseInt(prd.price) * prd.abc )

// const subTotal = cart.reduce(( prd) =>   parseInt(prd.price) * prd.abc )
const incrs = (id) => {
  const exists = getDb();
    let shopping_cart = {};
    if (!exists) {
      shopping_cart[id] = 1;
    } 
    else {
      shopping_cart = JSON.parse(exists);
      if (shopping_cart[id]) {
        const newCount = shopping_cart[id] + 1;
        shopping_cart[id] = newCount;
      }
      else {
        shopping_cart[id] = 1;
      }
      updateDb(shopping_cart);
    console.log(shopping_cart);
    }
    getCart()
}

const dcrs = (id) => {
  const exists = getDb();
    let shopping_cart = {};
    if (!exists) {
      shopping_cart[id] = 1;
    } 
    else {
      shopping_cart = JSON.parse(exists);
      if (shopping_cart[id] > 1) {
        const newCount = shopping_cart[id] - 1 ;
        shopping_cart[id] = newCount;
      }
      
      else {
        testCart(id)
            }
      updateDb(shopping_cart);
    console.log(shopping_cart);
    }
    getCart()
}
const testCart = (id) => {
    console.log(id)
    removeFromDb()
}


  return (<>
    {cart.length >= 1   && <div className='cart-page'>
      <div><p className='top-line'>Your Cart</p></div>
      <div className="cart__inner">
     
        <div className="cart__items">
        {cart.map((cart, index) => (    
  <div className="cartItem">
  <div className="cartItem__image">
            <img  src={cart.images[0].src}
              alt={cart.name} />

  </div>
  <div className="cartItem__details">

 <Link to={'/product/'+cart.id}>   <p className="cartItem__name">{cart.name}</p></Link>
    <div className="cartItem__footer">
    <div className='cartItem_title'>
      <p className="cartItem__price">
      ৳{(cart.price * cart.abc).toFixed(1)}
       
      </p>
      {cart.sale_price && <p className=" del">৳{(cart.regular_price * cart.abc).toFixed(1)}</p>}</div>
      <div className="cartItem__buttons">
      <button type="button" >
                  <MdRemoveCircleOutline size={20} color="#1a1a2c" onClick={() => dcrs(cart.id)} />
                </button>
                <input className='cart-input' readOnly value={`${cart.abc}`} />
                <button type="button"  onClick={() => incrs(cart.id)} >
                  <MdAddCircleOutline size={20} color="#1a1a2c"/>
                </button>
      </div>
      <div className="cartItem__remove"><button className="buttonRed"   onClick={() => removeFromDb(cart.id)}>
      <Remove  className='btnremove' fontSize="small" />


      </button>
      </div>
    </div>
  </div>
  

  </div>


            ) ) }
        
      
    </div>
    <div className="cart__checkout">
    <p className='top-line'>Checkout</p>
    <p className="cart__total">
    Sub-Total: ৳{total}
    </p>
    <p>
    Number of items: {total2}
    </p>
    <span style={{opacity: ".7"}}>
    This price is exclusive of Delivery charge. Delivery charge will be added during checkout.
    </span>
    <div className="buttons">

       <button onClick={() => ProceedtoPayment() }>
       Proceed to Payment</button>
       <button className="red" onClick={clearTheCart }>
      Clear  Cart</button>
 

    </div>
  
    </div>
    
    
    
    
    
    </div>


</div> }  {cart < 1 && <div className='cart-page'><p> No Products In cart</p>
<div className="buttons"><Link to={'/'}><button >Continue Shopping</button></Link></div>
</div> }</>
  )
}

export default Cart
