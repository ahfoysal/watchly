

import React from 'react'



import{ Route, Routes, useLocation } from 'react-router-dom';
import AniHome from '../AnimeFlix/Home';
import AniWatch from '../AnimeFlix/AniWatch';
import FlixWAtch from '../AnimeFlix/Movie-Watch';
import AniSearch from '../AnimeFlix/Anisearch';



function Pages() {
  const location = useLocation();




  return (
  
        <Routes location={location} key={location.pathname}>

           <Route path="/" element={<AniHome />}/>
 
           <Route path="/watch/:name" element={<AniWatch />} />
           <Route path="/watch/:type/:name" element={<FlixWAtch />} />
      
       <Route path="/searched/:search" element={<AniSearch />} />

    

       {/* <Route path="/login/" element={<Login   />} /> */}
       {/* <Route path="/signup/" element={<Signup />} /> */}
       {/* <Route path="/profile/" element={  <Profile /> }/> */}

       </Routes>  
      

  );
};

export default Pages