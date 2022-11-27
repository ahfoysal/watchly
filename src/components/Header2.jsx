import React, { useContext } from 'react'
import SideNav, {  NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon2 from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingCartIcon2 from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/InventoryOutlined';
import ReceiptLongIcon2 from '@mui/icons-material/Inventory';
import NoAccountsIcon from '@mui/icons-material/AccountCircleOutlined';
import NoAccountsIcon2 from '@mui/icons-material/AccountCircle';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { Link } from 'react-router-dom';
import { TestContext } from '../App';
import { useUserAuth } from '../context/UserAuthContext';
import { useContextS } from '../pages/cart/Function';

const Header2 = () => {

    const {  headerActive} = useContext(TestContext);

    let {  cart } =  useContextS();




    const { activeTabCart, activeTabHome, activeTabOrder,  activeTabUser} = useContext(TestContext);
    let { user } =  useUserAuth();

  return (
    <SideNav className={`side-nav ${headerActive ? 'active' : ''}`}
    onSelect={(selected) => {
        // Add your code here
    }}
> 
    <SideNav.Toggle />
    <SideNav.Nav className="icons" >
        
        <NavItem eventKey="home">
            <NavIcon>  <Link to={'/'}> 
            {activeTabHome ? <HomeIcon2  fontSize="large" className='nav-icons' strokeWidth={1}  /> : <HomeIcon  fontSize="large" strokeWidth={1} className='nav-icons'  />}
            </Link >    </NavIcon>
            <NavText>
            <Link to={'/'}>     Home
               </Link>   
            </NavText>
        </NavItem>
        <NavItem eventKey="cart">
            <NavIcon>
            <div className="cartIcon">
                  <Link to={'/cart'}>{activeTabCart ? <ShoppingCartIcon2  fontSize="large" className='nav-icons'  /> : <ShoppingCartIcon  fontSize="large" className='nav-icons'  />} <h3 className='cart-text'>{cart.length}</h3></Link>
                    </div>
            </NavIcon>
               <NavText>
               <Link to={'/cart'}>     Cart
               </Link>       </NavText>
          
        </NavItem>
        <NavItem eventKey="order">
            <NavIcon>
            <div className="cartIcon">
                  <Link to={'/orders'}>{activeTabOrder ? <ReceiptLongIcon2  fontSize="large" className='nav-icons'  /> : <ReceiptLongIcon  fontSize="large" className='nav-icons'  />}</Link>
                    </div>
            </NavIcon>
               <NavText>
               <Link to={'/orders'}>     Orders
               </Link>       </NavText>
          
        </NavItem>
        <NavItem eventKey="order">
            <NavIcon>
            <div className="cartIcon">
                  <Link to={'/profile'}>{activeTabUser ? <NoAccountsIcon2  fontSize="large" className='nav-icons'  /> : <NoAccountsIcon  fontSize="large" className='nav-icons'  />}</Link>
                    </div>
            </NavIcon>
               <NavText>
               <Link to={'/profile'}>     {!user &&  <p>Login</p>}
               <p>{user?.displayName}</p>
               </Link>       </NavText>
          
        </NavItem>
    </SideNav.Nav>
</SideNav>

  )
}

export default Header2
