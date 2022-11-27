

import React, { useContext, useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useUserAuth } from '../../context/UserAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {  updateProfile, getAuth, updatePhoneNumber } from "firebase/auth"
import { TestContext } from '../../App';
import GoogleButton from 'react-google-button';


const Signup = () => {
  const {    setActiveTabCart, setActiveTabOrder,setActiveTabHome, setActiveTabUser} = useContext(TestContext);


  const auth = getAuth();
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ]  = useState("");
    const [ name, setName ]  = useState("");
    const { signUp ,googleSignIn, user} = useUserAuth();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
       
       try{
      await signUp(email, password);
      createCustomer()
        navigate('/')

        test()
        
       }catch (err) {setError(err.message)} 
      };
    function test() {
      updateProfile(auth.currentUser, {
        displayName: name,

 
        
      })

     
    }


    function test2(id) {
      updateProfile(auth.currentUser, {
   
        photoURL: id,
  
        
      })
console.log(id)
     
    }




    const handleGoogleSignIn = async (e) => {
      e.preventDefault();

      try {
          await googleSignIn()
          setError('Success Login')
          navigate(`/`)
      
      }catch(err) {
            setError(err.message)
      }
  }





  const createCustomer = () => {
   

    /////cart item find


    var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
     

   const body2 = `{
    "email": "${email}",
    "first_name": "${name}"
    
  }`
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: body2,
        redirect: 'follow'
      };
      fetch(`https://shop.abusayeeed.xyz/wp/wp-json/wc/v3/customers?${process.env.REACT_APP_KEY}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          const rslt = result;
          console.log(rslt.id)
          test2(rslt.id)
        
          })
        .catch(error => {
          const rslt = error;
          console.log('error', rslt)
       
        });
        
      console.log(body2)
  }

  


    useEffect(() => {


      setActiveTabCart(false)
      setActiveTabOrder(false)
      setActiveTabHome(false)
      setActiveTabUser(true) 
     if(user){ navigate(`/profile`)}
  
    })
  return (
    <div className='signup'>
    <form className='form' onSubmit={handleSubmit}> 
    <h4>Create your Account</h4>
    {error && <p className='error'>{error}</p>}
      <div className="input-bx">
            <input  type="text" required="required" onChange={(e) => setName(e.target.value)}/>
            <span>Name</span>
        </div>     <br />
      <div className="input-bx">
            <input  type="email" required="required" onChange={(e) => setEmail(e.target.value)}/>
            <span>Email</span>
        </div>     <br />

      <div className="input-bx">
            <input  type="password" required="required" onChange={(e) => setPassword(e.target.value)}/>
            <span>Password</span>
        </div>     <br />


        <div className="buttons form__element">
      <Button type="submit">  Sign Up</Button></div>
      <span className='form-span'>Already have an account?</span>
<hr /> 
      <div className="buttons form__element">
      <Link to={'/login'}>   <Button   className='secondary'>
      LogIn
      </Button></Link>
<GoogleButton onClick={ handleGoogleSignIn }  style={{width: "100%"}}/>



</div>
  
     
    </form>
    
    </div>
  )
}

export default Signup