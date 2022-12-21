import React, { useContext } from 'react'
import {Container, Navbar} from 'react-bootstrap'
import {Link, useNavigate, useLocation} from 'react-router-dom';
import Search from "./Search";
import './header.css'
import { TestContext } from '../App';

const Header = () => {
  let params = useLocation();
  const param = params.pathname
  const history = useNavigate()



 

  return (

      <>
    <Navbar className=" header-top   "  >
      <Container fluid>
    {/* <div className={`head-start ${headerActive ? '' : 'active'}`}> 
    
  {headerActive ? <Left  fontSize="large" className='nav-icons'onClick={ () => handleHeader()}  /> :  <Right  onClick={ () => handleHeader()} fontSize="large" className='nav-icons'  />}
    </div> */}
               <div className="head-conatiner ">
            <div>
             {param !== '/' && <button className='border-none header__back' onClick={() => history(-1)}> Back</button>}
            </div>
                  <div ><Search  />
                  </div>

                
                  <Navbar.Brand ><Link to={'/'}>
               <h3 className="logo">PewdsAnime</h3>  </Link>  </Navbar.Brand>
     
                 </div>

       
      </Container>
    </Navbar>
</>
  )
}

export default Header
