
import React, { useState, useEffect } from "react";
import Pages from "./pages/Pages";
import {BrowserRouter} from 'react-router-dom'
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { UserAuthContextProvider } from './context/UserAuthContext';



 
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
     <ToastContainer />
    

     {/* </UserAuthContextProvider> */}
   
      </BrowserRouter>
 

  );
}






export default App;
