import {useState, useEffect} from 'react';
import {FaSearch} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom'
import {FormControl, Form, Button} from 'react-bootstrap';
import SearchIcon from '@mui/icons-material/Search';


function Search() {

const [input, setInput] = useState("");
const navigate = useNavigate();
const submitHandler = (e) => {
    e.preventDefault();
    navigate('/searched/'+input)
};
const [visible, setVisible] = useState(true);
  const [width, setWidth] = useState(window.innerHeight);

  const handleVisibility = () => {
    setVisible(prev => !prev);
  };

  const handleWidth = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    // console.log(visible);
    window.addEventListener("resize", handleWidth);
    width <= 600 ? setVisible(false) : setVisible(true);
    return () => {
      window.removeEventListener("resize", handleWidth);
    };
  }, [width]);


  return (
//     <Form className="d-flex " onSubmit={submitHandler}>
//     <FormControl
//       placeholder="Search"
//       className="me-2"
//       aria-label="Search"
//       onChange={(e) => setInput(e.target.value)} type="text" 
// value={input}
//     />
//     <Button variant="outline-success" onClick={submitHandler}><FaSearch/></Button>
    <div className=" search-bar header__search ">
        
        <div>
         <Form className="d-flex " onSubmit={submitHandler}>

        <aside className='open'>
          <input placeholder="Search..." type="text" className='border-none'  onChange={(e) => setInput(e.target.value)} 
value={input}/>
        </aside></Form></div>
        <div className="magnifierContainer">
        </div>
        <SearchIcon onClick={handleVisibility} fontSize="large" className='nav-icons' />


         </div>
    
 
    )
}




export default Search