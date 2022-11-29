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
            console.log(id.animeId)
     
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
      let cartItems = {};
      if (!exists) {
        cartItems[id] = 1;
      }
      else {
        cartItems = JSON.parse(exists);
        if (cartItems[id]) {
          const newCount = cartItems[id] + 1;
          cartItems[id] = newCount;
        }
        else {
          cartItems[id] = 1;
        }
      }
      updateDb(cartItems);
      // console.log(shopping_cart);
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

      // const exists = getDb();
      // if (!exists) {
      // }
      // else {
      //   const cartItems = JSON.parse(exists);
      //   delete cartItems[id];
      //   updateDb(cartItems);
      // }
      // getCart()
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


