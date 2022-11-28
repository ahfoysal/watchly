import { createContext, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";


const contextProviderS = createContext();

export function ContextProviderS({ children }) {
  
    const [test2 , setTest2] = useState(false);
    const [cart , setCart] = useState([]);

    
    function addToCart(id) {

        const unsubscribe = () => {
          const newCart = [id, ...cart];
          // const merged = [].concat.apply([], newCart);
          // let uniqueChars = [...new Set(merged)];
          const unique = [...new Map(newCart.map((m) => [m.animeId  , m])).values()];
          setCart(unique);
          
            addToDb(id.animeId)
     
            localStorage.setItem("cartItems", JSON.stringify(newCart))
            getCart();
            // console.log(id)


        };
        return unsubscribe(id)
         
    }






    const getCart = () => {
      const newCart = localStorage?.getItem("cartItems" ) 
      const test = JSON.parse(newCart)
      const unique = [...new Map(test?.map((m) => [m.animeId , m])).values()];

    setCart(unique)
    const nnnn = JSON.parse(newCart)
    const savedCart = getStoredCart();
    const savedId = Object.keys(savedCart);
    // console.log(savedId)
    // const cartPd = savedId.map( id => {
    //   const product = nnnn?.find( pd => pd.animeId === id)
    //   product.abc = savedCart[id];

    //   return product
    // } );
    
    
    // setCart(cartPd)
    
    
    }
    const addToDb = id => {
      const exists = getDb();
      let shopping_cart = {};
      if (!exists) {
        shopping_cart[id] = 1;
      }
      else {
        shopping_cart = JSON.parse(exists);
        if (shopping_cart[id]) {
          const newCount = shopping_cart[id] + 1;
          shopping_cart[id] = newCount;
        }
        else {
          shopping_cart[id] = 1;
        }
      }
      updateDb(shopping_cart);
      // console.log(shopping_cart);
    }
    const getDb = () => localStorage.getItem('shopping_cart');
    const updateDb = cart => {
      localStorage.setItem('shopping_cart', JSON.stringify(cart));
    }
    const removeFromDb = id => {
      console.log(id)
      const exists = getDb();
      if (!exists) {
      }
      else {
        const shopping_cart = JSON.parse(exists);
        delete shopping_cart[id];
        updateDb(shopping_cart);
      }
      getCart()
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
      console.log(localStorage.getItem('shopping_cart'));
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


