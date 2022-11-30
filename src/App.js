import Pages from "./pages/Pages";
import {BrowserRouter} from 'react-router-dom'
import Header from "./components/Header";
import { createContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserAuthContextProvider } from './context/UserAuthContext';
import {  ContextProviderS } from "./pages/cart/Function";

export const TestContext = createContext();
 
function App() {


  return (
    <div className="App">
      
      <BrowserRouter>  
      <UserAuthContextProvider>
        <ContextProviderS>

        <TestContext.Provider value={{ 
         
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
