import { createContext, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";


const contextProviderS = createContext();

export function ContextProviderS({ children }) {
  
    const [test2 , setTest2] = useState(false);
    const [cart , setCart] = useState([]);
    const [list , setList] = useState([]);

    
    function addToList(id, name) {

      const unsubscribe2 = (id) => {

        const indexOfObject = list.filter(object => {
          return object.animeTitle === id.animeTitle;
        });
       
        console.log(name.name)
            id.animeId = name.name
        if(indexOfObject.length >= 1){
          alert('Already Added To List')
          return

        }
        
        const newCart2 = [id, ...list];
        // const merged = [].concat.apply([], newCart);
        // let uniqueChars = [...new Set(merged)];
        const unique2 = [...new Map(newCart2.map((m) => [m.animeTitle  , m])).values()];
        setList(unique2);
        
          console.log(unique2)
   
          localStorage.setItem("list", JSON.stringify(newCart2))
         getList(unique2)
    


      };
      return unsubscribe2(id)
       
  }




    function addToCart(id) {

        const unsubscribe = () => {
          const newCart = [id, ...cart];
          // const merged = [].concat.apply([], newCart);
          // let uniqueChars = [...new Set(merged)];
          const unique = [...new Map(newCart.map((m) => [m.animeId  , m])).values()];
          setCart(unique);
          
     
            localStorage.setItem("cartItems", JSON.stringify(newCart))
              getCart();
            // console.log(id)


        };
        return unsubscribe(id)
         
    }




    const getList = () => {
      const newCart = localStorage?.getItem("list" ) 
      const test = JSON.parse(newCart)
      const unique = [...new Map(test?.map((m) => [m.animeTitle , m])).values()];

    setList(unique)
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
  
    const getDb = () => localStorage.getItem('cartItems');
    const updateDb = cart => {
      localStorage.setItem('cartItems', JSON.stringify(cart));
    }

    const removeFromList = id => {
      console.log(id)
      
const indexOfObject = list.filter(object => {
  return object.animeTitle  !== id;
});





console.log(indexOfObject)
setList(indexOfObject)
localStorage.setItem("list", JSON.stringify(indexOfObject))

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
    <contextProviderS.Provider value={{ addToCart, cart, test2 , updateDb, getDb, clearTheCart,removeFromDb, getCart, setCart, setTest2, list, addToList, getList, removeFromList}}>{children}</contextProviderS.Provider>)
    ;

}

export function useContextS() {
    return useContext(contextProviderS);
}


