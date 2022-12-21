import { Splide, SplideSlide } from '@splidejs/react-splide'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Trending = () => {
    const [pro , setPro] = useState([]);

    useEffect(() => {
        getAnime()
      }, []);
      const getAnime = () => {
        axios(`https://api.consumet.org/meta/anilist/trending`)
        .then(data2 => { const data = data2.data

          // console.log(num);
             setPro(data)})
              
      }
    const Wrapper = styled.div``
    
  return (
    <Wrapper>
      <Splide  options={{
  perPage    : 6,
  gap        : 0,
  pagination : true,
  arrows : false,
  breakpoints: {
    1200: { perPage: 5, gap: 0 },
    640 : { gap: 0 , perPage: 2},
  },
}}>
        
         <SplideSlide   > <p>hello</p></SplideSlide> 
         <SplideSlide   > <p>hello</p></SplideSlide> 
         
         </Splide>
    </Wrapper>
  )
}

export default Trending
