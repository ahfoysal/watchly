
import React, { useState, useEffect } from "react";
import Pages from "./pages/Pages";
import {BrowserRouter} from 'react-router-dom'
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

import DisableDevtool from 'disable-devtool';
import ReactGA from "react-ga4";
// import { UserAuthContextProvider } from './context/UserAuthContext';

const TrackingId=  'UA-231741407-1'

ReactGA.initialize(TrackingId)
// DisableDevtool(); 
function App() {


  const [cwList, setCwList] = useState([]);
  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem("cwList"));
    if (storedWatchlist) {
   
      setCwList(storedWatchlist);

    }
  }, []);

  const handleAddToWatchlist = (movie) => {
    // console.log(movie)
    if(!movie)return
    const updatedWatchlist = [movie, ...cwList];
    const unique = [...new Map(updatedWatchlist.map((m) => [m.id  , m])).values()];
  

    setCwList(unique);
  
    localStorage.setItem("cwList", JSON.stringify(unique));
  };

  return (

    
      
      <BrowserRouter>  
 
      {/* <UserAuthContextProvider> */}


       
    <Header />
    {/* <Header2  /> */}
     <Pages cwList={cwList} handleAddToWatchlist={handleAddToWatchlist} />
     
    

     {/* </UserAuthContextProvider> */}
   
      </BrowserRouter>
 

  );
}






export default App;
