import React, { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import { Alert } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { TestContext } from '../../App';
import GoogleButton from 'react-google-button'
import { useForm } from 'react-hook-form';
import { motion } from "framer-motion";




const Login = () => {
  const {    setActiveTabCart, setActiveTabOrder,setActiveTabHome, setActiveTabUser} = useContext(TestContext);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { logIn, googleSignIn, user } = useUserAuth();
  const [error, setError] = useState("");


  const onSubmit = data => {
  console.log(data)
  handleSubmit2(data)
  };
    







  





  const navigate = useNavigate();
  // const history = useHistory()
  const history = useNavigate()

const location= useLocation()
 
 let { from } = location.state || { from: { pathname: "/" } };

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
  const handleSubmit2 = async (data) => {

      setError("");
     console.log(`login`)
     try{
    await logIn(data.email, data.password);
    console.log(user)
      // navigate('/') 
      history.replace(from);
      
     }catch (err) {setError(err.message)}
 

     
    };


    useEffect(() => {
      // console.log(watch("example"))

      setActiveTabCart(false)
      setActiveTabOrder(false)
      setActiveTabHome(false)
      setActiveTabUser(true) 
     if(user){ navigate(`/profile`)}
  
    })
  return (
    <div className='login'>
    <form className='form' onSubmit={handleSubmit(onSubmit)}>
      <h4>Log In</h4>
   
    {error && <p className='error'>{error}</p>}

  
    <div className="input-bx">
            <input  type="text" required="required" {...register("email", { required: true }) }/>
            <span>Email</span>
          
        </div>     <br />
        <div className="input-bx">
            <input type="password" required="required"    {...register("password", { required: true })}/>
            <span>Password</span>
        </div>   <br />
<div className="buttons form__element">
      <Button type="submit">  LOGIN</Button></div>
      <span className='form-span'>Need help logging in?</span>
<hr /> 
      <div className="buttons form__element">
<GoogleButton onClick={ handleGoogleSignIn }  style={{width: "100%"}}/>

<Link to={'/signup'}>   <Button   className='secondary'>
        Sign Up
      </Button></Link>

</div>
  
    </form>

   
  
    </div>
  )
}

export default Login