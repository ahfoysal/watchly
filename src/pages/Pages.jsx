import React, { useEffect } from 'react'
import Home from "./Home";
import Category from "./Category";
import Searched from "./Searched";
import Product from "./Product";
import Profile from "./profile";
import{ Route, Routes, useLocation } from 'react-router-dom';
import Cart from './cart/Cart';
import Orders from './Orders';
import Checkout from './checkout/Checkout';
import Checkoutest from './checkout/Checkoutest';
import Shop from '../components/Shop';
import OrdersPage from '../components/OrdersPage/testDb';
import Login from './login/login';
import Signup from './login/signup';
import { useContextS } from './cart/Function';


function Pages() {
  const location = useLocation();
       let { getCart} =  useContextS();

  useEffect(() => {
    getCart();

    }, [])

  return (
    // <AnimatePresence exitBeforeEnter>
    
        <Routes location={location} key={location.pathname}>
       <Route path="/" element={<Home />}/>
       <Route path="/category/:name" element={<Category  />} />
       <Route path="/searched/:search" element={<Searched />} />
       <Route path="/product/:name" element={<Product />} />
       <Route path="/shop/" element={<Shop /> } />
       <Route path="/order/:name" element={<Orders />} />
       <Route path="/cart" element={<Cart  />} />
       <Route path="/checkout" element={<Checkoutest />} />
       <Route path="/checkout-2" element={<Checkout />} />
       <Route path="/login/" element={<Login   />} />
       <Route path="/signup/" element={<Signup />} />
       <Route path="/orders/" element={  <OrdersPage /> }/>
       <Route path="/profile/" element={  <Profile /> }/>

       </Routes>  
      
        // </AnimatePresence>
  );
};

export default Pages