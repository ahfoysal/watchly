import React, { useEffect } from 'react'
import Home from "./Home";
import Searched from "./Searched";
import AnimeSingle from "./anime-single";
import AnimeWatch from "./Anime/anime-watch";
import MovieWatch from "./movie-watch";
import Profile from "./profile";
import{ Route, Routes, useLocation } from 'react-router-dom';

import Login from './login/login';
import Signup from './login/signup';
import { useContextS } from './cart/Function';
import AnimeInfo from './Anime/Anime-info';
import AniHome from '../AnimeFlix/Home';
import AniWatch from '../AnimeFlix/AniWatch';
import PlyrContainer from '../PLYR/Plyr';
import FlixWAtch from '../AnimeFlix/Movie-Watch';


function Pages() {
  const location = useLocation();
       let { getCart, getList} =  useContextS();

  useEffect(() => {
    getCart();
    getList()

    }, [])

  return (
  
    
        <Routes location={location} key={location.pathname}>
       {/* <Route path="/" element={<Home />}/> */}
           <Route path="/" element={<AniHome />}/>
           <Route path="/test" element={<PlyrContainer />}/>
           <Route path="/watch/:name" element={<AniWatch />} />
           <Route path="/watch/:type/:name" element={<FlixWAtch />} />
       <Route path="/searched/:search" element={<Searched />} />
       {/* <Route path="/anime/:name" element={<AnimeSingle />} /> */}
       {/* <Route path="/anime/info/:name" element={<AnimeInfo />} /> */}
       {/* <Route path="/anime/watch/:name" element={<AnimeWatch />} /> */}
       {/* <Route path="/anime/watch/:name/:id" element={<AnimeWatch />} /> */}
       <Route path="/:type/:term" element={<MovieWatch />} />

       {/* <Route path="/login/" element={<Login   />} /> */}
       {/* <Route path="/signup/" element={<Signup />} /> */}
       {/* <Route path="/orders/" element={  <OrdersPage /> }/> */}
       {/* <Route path="/profile/" element={  <Profile /> }/> */}

       </Routes>  
      

  );
};

export default Pages