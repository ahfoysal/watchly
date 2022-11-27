import { createContext, useEffect, useState, useContext } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth"

import { auth } from "../firebase";
const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
    const [user, setUser] = useState("");
    function signUp(email, password ) {
        return createUserWithEmailAndPassword(auth, email, password)
         
    }

      
    
    
    function logIn(email, password) {
        console.log('email', email)

        return signInWithEmailAndPassword(auth, email, password); 
    }
    function logOut(email, password) {
       
        return signOut(auth);
    }
    function updateProfile(name) {
        
        return updateProfile(user,{
            displayName: name,

        });
    }
    function googleSignIn(){
        const googleAuthProvider= new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider)
    }
    useEffect(() => {
       const unsubscribe =  onAuthStateChanged(auth, (currentUser) => {
             setUser(currentUser);
        });
        return () => {
            unsubscribe();
        }
    }, []);
    return(  
    <userAuthContext.Provider value={{ user, signUp, logIn, logOut, googleSignIn }}>{children}</userAuthContext.Provider>)
    ;

}

export function useUserAuth() {
    return useContext(userAuthContext);
}


