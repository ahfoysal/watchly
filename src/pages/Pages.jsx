import React, { useEffect } from 'react'
import Home from "./Home";
import Category from "./Category";
import Searched from "./Searched";
import AnimeSingle from "./anime-single";
import Profile from "./profile";
import{ Route, Routes, useLocation } from 'react-router-dom';

import Manga from './Manga';
import MangaSingle from './Manga-single';
import OrdersPage from '../components/OrdersPage/testDb';
import Login from './login/login';
import Signup from './login/signup';
import { useContextS } from './cart/Function';


function Pages() {
  const location = useLocation();
       let { getCart, getList} =  useContextS();

  useEffect(() => {
    getCart();
    getList()

    }, [])

  return (
  
    
        <Routes location={location} key={location.pathname}>
       <Route path="/" element={<Home />}/>
       {/* <Route path="/category/:name" element={<Category  />} /> */}
       <Route path="/searched/:search" element={<Searched />} />
       <Route path="/anime/:name" element={<AnimeSingle />} />
       <Route path="/manga/" element={<Manga /> } />
       <Route path="/10min" element={<MangaSingle /> } />

       {/* <Route path="/order/:name" element={<Orders />} /> */}
       {/* <Route path="/cart" element={<Cart  />} /> */}
       {/* <Route path="/checkout" element={<Checkoutest />} /> */}
       {/* <Route path="/checkout-2" element={<Checkout />} /> */}
       <Route path="/login/" element={<Login   />} />
       <Route path="/signup/" element={<Signup />} />
       {/* <Route path="/orders/" element={  <OrdersPage /> }/> */}
       <Route path="/profile/" element={  <Profile /> }/>

       </Routes>  
      

  );
};

export default Pages