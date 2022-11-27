import {useState, useEffect, useContext} from 'react'

import {useParams, useNavigate, Link} from 'react-router-dom';
import React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import axios from 'axios'
import { TestContext } from '../App';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaStar } from 'react-icons/fa';
import { useContextS } from './cart/Function';
import { orderBy } from 'firebase/firestore';

function SingleProduct() {
  const navigate = useNavigate();

  const { allProducts, setActiveTabCart, setActiveTabOrder,setActiveTabHome, setActiveTabUser, setHeaderActive} = useContext(TestContext);
   let {  addToCart , test2, setTest2} =  useContextS();

  const [details , setDetails] = useState([]);
  const [details2 , setDetails2] = useState([]);

  const [loading , setLoading] = useState(false);
  const [loading2 , setLoading2] = useState(true);


  let params = useParams();

useEffect(() => { 

      setActiveTabCart(false)
      setActiveTabOrder(false)
      setActiveTabHome(false)
      setActiveTabUser(false)
      setHeaderActive(false)

  fetchDetails()
  


 
 
},[])



const fetchDetails = () =>{
 
  if(test2 === true){
    const param = params.name
    const cartItems = allProducts.map((cart) => cart ).filter((val)=> {
      return val.id === parseInt(param)
      });
      if(cartItems[0] === undefined){
        window.location.reload()
      }
    setDetails(cartItems[0])
    setDetails2(cartItems[0])

    console.log(details)
  console.log(cartItems[0])
          setLoading(true) 
  }else{  


    axios(`${process.env.REACT_APP_SHOP_LINK}wp-json/wc/v3/products/${params.name}?${process.env.REACT_APP_KEY}`)
    .then(data2 => { const data = data2
      sessionStorage.setItem(`${params.name}`,JSON.stringify(data.data))
      setDetails(data.data);
      setDetails2(data.data);

      console.log(data.data);
      setLoading(true)
      console.log(data.data.parent_id)
      if(data.data.parent_id > 1){
        console.log('hi')
        navigate(`/product/${data.data?.parent_id}`)
      }
      setTest2(true)
    })  
  }


  

}
const size = (id) =>{
  setLoading2(false)
  axios(`${process.env.REACT_APP_SHOP_LINK}wp-json/wc/v3/products/${id}?${process.env.REACT_APP_KEY}`)
  .then(data2 => { const data = data2
    sessionStorage.setItem(`${params.name}`,JSON.stringify(data.data))
    setDetails2(data.data);
    console.log(data.data);
    setLoading2(true)
    console.log(details)

  })  


}


const page = Math.random() * 10


  return (
    
    <div className='home-page'>
    
{
  loading ? 
  <div className='productSingle'>
 
  <div className=' productSingle__inner'>

    <div className='productSingle__image'>
  
      <img src={details?.images[0].src} alt={details?.name} />
      {details?.sale_price && <div> <p className="tag">Sale</p></div>}
    </div > 
<div className='productSingle__details '> 
<p className='productSingle__name'>{details2?.name}</p>
{details2?.stock_quantity && <small> Stock : {details2?.stock_quantity} </small>}

{/*    attributes*/}
{/* {details?.variations?.length >= 1 && <p >{details?.variations.map((att) => {
    return <div><span onClick={() => size(att)}>{att}
    </span>
    </div>
  })}</p> } */}
{details?.attributes.length >= 1 && <div>
  {details?.attributes.map((att) => {
    return <div><p>{att.name} : {att?.option}
      {att.options?.map((opt, index) => {
                              return  <span className='pro-span' onClick={() => size(details.variations[0+index] )}>{opt} </span>
                      }
                    )}
    
    
    </p>
    </div>
  })}

  
  </div> }
<span dangerouslySetInnerHTML={{ __html: details?.short_description }} className='productSingle__features ' ></span>

  
      <div className='productSingle__footer'>    

<p className='productSingle__price price'>৳{details2?.price} {details?.sale_price && <span className=" del">৳{details?.regular_price}</span>}</p>
{/* <span dangerouslySetInnerHTML={{ __html: details.description }} ></span> */}
      <div className="buttons ">
    {loading2 ? <>{<>  {details2?.stock_status === "instock" && <button className="buy-btn pp-btn" onClick={() => addToCart(details2)}> <MdAddShoppingCart size={16} color="#FFF" />
        <span>  Add To Cart</span></button>}</> }</> : <>  <div className="spinnerdiv"><ReactBootstrap.Spinner animation="border" /> </div></>}
        {details2?.stock_quantity < 1 && details2?.stock_quantity != null && <p>Stock Out</p>}
      </div>
    </div>
  </div>
 </div> 

<div className='container simmmilar'> <p className='top-line'>You might also like  </p> 
<div className="container-fluid bg-trasparent my-4 p-3"  style={{position: "relative"}}>
        <div className="row row-cols-1 row-cols-xs-2 row-cols-sm-2 row-cols-lg-4 g-3">
        { allProducts.slice((page-1) * 4, (page-1) * 4 + 4).map(product => (
        <>
        
        <div className="col hp" key={product.id}>
      <div className="card h-100 shadow-sm">
  
            <div>  <Link to={'/product/'+product.id}> <>
          <img src={product.images[0].src} className="card-img-top" alt="product.title" />
      

       
       {product.sale_price && <div> <p className="tag">Sale</p></div>}
       
    
      
        <div className="card-body">
        {product.categories.map(pro =>
           <p className="product__category">  {pro.name} </p>)}
        <h5 className="card-title">
            <p className="product__name">{product.name }</p>
          </h5>
          <div className="clearfix mb-3">
          <p className="product__price">৳{product.price} {product.sale_price && <span className=" del">৳{product.regular_price}</span>}</p>

          <p className="product__rating"><FaStar  className="star"/>0</p>
          </div>
         
          </div>
        
          </></Link>
          <div className="add-to-cart">
          <button  onClick={() => addToCart(product) } className='addtocart-btn buy-btn pp-btn' >
           
                <MdAddShoppingCart size={16} color="#FFF" /> 

             

              <span>Add To Cart</span>
            </button></div>
          
          <div className="clearfix mb-1">

            <span className="float-start"><i className="fas fa-question-circle"></i></span>

            <span className="float-end">
              <i className="far fa-heart" ></i>

            </span>
          </div>
        </div>
      </div>
    </div>

        </>
        )) }
        </div>    </div>


</div>
</div>

:<div className="spinnerdiv"><ReactBootstrap.Spinner animation="border" /> </div>}
        </div>     
  )
}

export default SingleProduct