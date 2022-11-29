import { createContext, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";


const contextProviderS = createContext();

export function ContextProviderS({ children }) {
  
    const [test2 , setTest2] = useState(false);
    const [cart , setCart] = useState([]);

    const unsubscribe = (id) => {
      const newCart = [id, ...cart];
      // const merged = [].concat.apply([], newCart);
      // let uniqueChars = [...new Set(merged)];
      const unique = [...new Map(newCart.map((m) => [m.animeId  , m])).values()];
      setCart(unique);
      

        // console.log(id.animeId)
 
        localStorage.setItem("cartItems", JSON.stringify(newCart))
        getCart();
   


    };
    function addToCart(id) {

        
        return unsubscribe(id)
         
    }






    const getCart = () => {
      const newCart = localStorage?.getItem("cartItems" ) 
      const test = JSON.parse(newCart)
      const unique = [...new Map(test?.map((m) => [m.animeId , m])).values()];

    setCart(unique)
  
    
    }
  
    const getDb = () => localStorage.getItem('cartItems');
    const updateDb = cart => {
      localStorage.setItem('cartItems', JSON.stringify(cart));
    }
    const removeFromDb = id => {
      console.log(id)
      
const indexOfObject = cart.filter(object => {
  return object.animeId  !== id;
});
console.log(indexOfObject)
setCart(indexOfObject)
localStorage.setItem("cartItems", JSON.stringify(indexOfObject))

    }
    const getStoredCart = () => {
      const exists = getDb();
      return exists ? JSON.parse(exists) : {};
    }
    const clearTheCart = () => {
      // localStorage.setItem('shopping_cart', []);
      // localStorage.setItem('cartItems', []);
      setCart([]) 
      localStorage.removeItem('shopping_cart');
      localStorage.removeItem('cartItems');

    }









    
    useEffect(() => {
    //    const unsubscribe =  () => {
    //          console.log('unsubscribe');
    //     };
    //     return () => {
    //         unsubscribe();
    //     }
    }, []);
    return(  
    <contextProviderS.Provider value={{ addToCart, cart, test2 , updateDb, getDb, clearTheCart,removeFromDb, getCart, setCart, setTest2 }}>{children}</contextProviderS.Provider>)
    ;

}

export function useContextS() {
    return useContext(contextProviderS);
}


