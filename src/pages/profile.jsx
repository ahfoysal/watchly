import React, { useContext, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { TestContext } from '../App';
import { useUserAuth } from '../context/UserAuthContext';

const Profile = () => {
  const {    setActiveTabCart, setActiveTabOrder,setActiveTabHome, setActiveTabUser} = useContext(TestContext);

  let { user } =  useUserAuth();
  const navigate = useNavigate();
  let {  logOut } =  useUserAuth();
  const handleLogOut = async () => {

    try {
      await logOut();
    }catch(err) {
        console.log(err.message)
    }
  }


  useEffect(() => {

console.log(user)
    setActiveTabCart(false)
    setActiveTabOrder(false)
    setActiveTabHome(false)
    setActiveTabUser(true) 
   if(!user){ navigate(`/login`)}      

  })
  
  return (
    <div className='cart-page profile'>
      <div className="profile__header">
      <img src="https://i.pravatar.cc/150?u=dfgsad@da.c" alt="" className="profile__avatar" />
      <span className="profile__header_span">
        <h3>Hi, {user?.displayName}</h3>
        <p className="profile-stats">This is your profile page. Here, you can view and customize your profile details. Double check your details before check out.</p>
      </span>
      <div className="buttons" style={{marginLeft: "auto"}}>
      <button className='buttonRed'  onClick={handleLogOut}     style={{padding: "1rem 1.5rem"}}> Sign Out </button>
      </div>
      

      </div>
      <div className="profile__inner">
        <p>   <span>Name</span> <span>   {user?.displayName}   </span>  </p>
        <p>   <span>Email Address</span> <span>   {user?.email}   </span>  </p>
        {/* <p>   <span>Name</span> <span>   {user.displayName}   </span>  </p>
        <p>   <span>Name</span> <span>   {user.displayName}   </span>  </p>
        <p>   <span>Name</span> <span>   {user.displayName}   </span>  </p>
        <p>   <span>Name</span> <span>   {user.displayName}   </span>  </p> */}
      </div>
    </div>
  )
}

export default Profile
