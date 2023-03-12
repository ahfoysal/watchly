import {  useEffect, useState } from "react";
import {Link} from  'react-router-dom'
import axios from "axios";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/react-splide/css';


function Popular() {
  const [pro , setPro] = useState([]);
  useEffect(() => { 
    getCat()
  }, []);



const getCat = (num, terms) =>{
  axios(`https://api.consumet.org/meta/anilist/popular?page=1&perPage=20`)
          .then(data2 => { const data = data2?.data?.results
 
            console.log(data);
               setPro(data) })}
  
    return (
<div  className="single-page">    
  <p className="top-lin mt-20">Popular Anime</p>
<div className="container-fluid bg-trasparent my-4 p-3"  style={{position: "relative"}}>
        <div className="row g-3">

<Splide  options={{
  perPage    : 6,
  gap        : 0,
  pagination : false,
  arrows : true,
  breakpoints: {
    1200: { perPage: 4, gap: 0 },
    640 : { gap: 0 , perPage: 2},
  },
}}>
        { pro?.map((product, index) => (
         <SplideSlide   key={index + 1}>
   
        <div className="col hp" >
      <div className="card h-100 shadow-sm">
  
            <div>  <Link to={'/anime/info/'+product?.id}> 
          <img src={product?.image
} className="card-img-top" alt="product.title" />
      
      
      
        <div className="card-body">
     
        <p className="product__name">{product?.title?.english  || product?.title?.native || product?.title}</p>

         
          </div>       
        </Link>      
        </div>
      </div>
    </div>

    </SplideSlide>
        )) }
      
       
 

        </Splide>


     
        
        </div>    </div>
          
   
   </div>
  )
  }
  

  
  
  export default Popular;