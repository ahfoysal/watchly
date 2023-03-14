import Pages from "./pages/Pages";
import {BrowserRouter} from 'react-router-dom'
import Header from "./components/Header";
import { createContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { UserAuthContextProvider } from './context/UserAuthContext';



 
function App() {


  return (

      
      <BrowserRouter>  
 
      {/* <UserAuthContextProvider> */}


       
    <Header />
    {/* <Header2  /> */}
     <Pages  />
     <ToastContainer />
    

     {/* </UserAuthContextProvider> */}
   
      </BrowserRouter>
 

  );
}






export default App;
