import { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/react-splide/css';
import './banner.css';

function Banner() {

  return (
  
    <div >
      <Splide  options={{
        arrows: false,      pagination: true,        gap: '3rem',   perPage: 1,
        breakpoints: {
          700: {        perPage: 1,    gap: '10px'      },  

        }
      }}>

      <SplideSlide className="banner">
    <img src="https://amazon-ish.vercel.app/static/media/1.a6827cf5.jpg" alt="hi"/>
    </SplideSlide>

    <SplideSlide className="banner">
    <img src="https://amazon-ish.vercel.app/static/media/3.5989ebbf.jpg" alt="hi"/>
    </SplideSlide>

    <SplideSlide className="banner">
    <img src="https://amazon-ish.vercel.app/static/media/1.a6827cf5.jpg" alt="hi"/>
    </SplideSlide>
     
     
          </Splide>


    </div>

);
}


export default Banner;