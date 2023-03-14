import React, { useContext } from 'react'
import {Container, Navbar} from 'react-bootstrap'
import {Link, useNavigate, useLocation} from 'react-router-dom';
import Search from "./Search";
import './header.css'


const Header = () => {
  let params = useLocation();
  const param = params.pathname
  const history = useNavigate()



 

  return (

      <>
    <Navbar className={`header-top  ${param.includes("watch") && 'display-none'} `}  >
      <Container fluid>

               <div className="head-conatiner ">
            <div>
             {param !== '/' && <button className='border-none header__back' onClick={() => history(-1)}> Back</button>}
            </div>
                  <div ><Search  />
                  </div>

                
                  <Navbar.Brand ><Link to={'/'}>
               <h3 className="logo">PewdsFlix</h3>  </Link>  </Navbar.Brand>
     
                 </div>

       
      </Container>
    </Navbar>
</>
  )
}

export default Header
