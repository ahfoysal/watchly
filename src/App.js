import Pages from "./pages/Pages";
import {BrowserRouter} from 'react-router-dom'
import Header from "./components/Header";
import { useState , useEffect, createContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { UserAuthContextProvider } from './context/UserAuthContext';
import Header2 from "./components/Header2";
import {  ContextProviderS } from "./pages/cart/Function";

export const TestContext = createContext();
 
function App() {
  //////////// Cart & All Items
  // const [cart , setCart] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

//////////////////

  //////// Nav & Icon State
          const [headerActive , setHeaderActive] = useState(false);
          const [activeTabHome , setActiveTabHome] = useState(false);
          const [activeTabCart , setActiveTabCart] = useState(false);
          const [activeTabOrder , setActiveTabOrder] = useState(false);
          const [activeTabUser , setActiveTabUser] = useState(false);
  ////////////
  
    ///////test2 = All Products Local Storage  
   const [test2 , setTest2] = useState(false);
    ////////////////////
   useEffect(() => {

    gteProducts();
    }, [])
   
  

const gteProducts = () =>{
  const check = sessionStorage.getItem('AllItems')
      if(check){
        setAllProducts(JSON.parse(check))
        setTest2(true)

      }else{  
          axios(`${process.env.REACT_APP_SHOP_LINK}wp-json/wc/v3/products?${process.env.REACT_APP_KEY}&per_page=100`)
        .then(data2 => { const data = data2
          sessionStorage.setItem('AllItems',JSON.stringify(data.data))
          setAllProducts(data.data)
          console.log(data);
          setTest2(true)

        })
      }
}
///////cart Related Function////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="App">
      
      <BrowserRouter>  
      <UserAuthContextProvider>
        <ContextProviderS>

        <TestContext.Provider value={{ allProducts,  
                activeTabCart ,setActiveTabCart,
                setActiveTabHome, setActiveTabOrder,
                setActiveTabUser,  activeTabUser,
                activeTabHome, activeTabOrder,
                headerActive, setHeaderActive
              }}>
    <Header />
    {/* <Header2  /> */}
     <Pages  />
     <ToastContainer />
     </TestContext.Provider  >
     </ContextProviderS>
     </UserAuthContextProvider>
      </BrowserRouter>
 
    </div>
  );
}






export default App;
