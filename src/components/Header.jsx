import React, { useContext } from 'react'
import {Container, Navbar} from 'react-bootstrap'
import {Link, useNavigate, useLocation} from 'react-router-dom';
import Search from "./Search";
import './header.css'
import { TestContext } from '../App';
import Left from '@mui/icons-material/KeyboardArrowLeft';
import Right from '@mui/icons-material/KeyboardArrowRight';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingCartIcon2 from '@mui/icons-material/ShoppingCart';
import { useContextS } from '../pages/cart/Function';

const Header = () => {
  let params = useLocation();
  const param = params.pathname
  const history = useNavigate()
  const {    setHeaderActive, headerActive, activeTabCart} = useContext(TestContext);



 

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
