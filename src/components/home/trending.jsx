import { Splide, SplideSlide } from '@splidejs/react-splide'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FaPlay } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';


const Trending = () => {
    const [pro , setPro] = useState([]);

    useEffect(() => {
        getAnime()
      }, []);
      const getAnime = () => {
        axios(`https://api.consumet.org/meta/anilist/trending`)
        .then(data2 => { const data = data2.data.results
          console.log(data);
             setPro(data)})
              
      }
    const Wrapper = styled.div`
    height: 100vh;
    p{
      /* line-height: 1.8; */
    }
    span{
      margin: 5px;
    }
    .inner{
      margin: auto;
  width: 50%;
  /* height: 50%; */
  /* bottom: 50%; */
  left: 0;
  top: 20%;
  margin: 0;
  position: absolute;
  
  
  padding: 0px 10px;
    }
    .text-green{
      color: green;
    }
    .description{
      white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    color: #e5e5e5;
    line-height: 1.5;
    height: 150px;
    }
    .watch{    text-shadow: none;
    padding: min(1.5vw, .5rem) min(3vw, 4rem);
    transition: opacity 200ms ease 0s;
    border: none;
    border-color: none;
    border-radius: 5px;
  }
  .watch2{     
    background-color: #4D4D4DCC;
    margin-left: 10px;
    
  }
    
    `
    
  return (
    <Wrapper>
      <Splide  options={{
  perPage    : 1,
  gap        : 0,
  pagination : true,
  arrows : false,
  breakpoints: {
    1200: { perPage: 1, gap: 0 },
    640 : { gap: 0 , perPage: 1},
  },
}}>
        
        
        { pro.map((data, index) => {
          return   <SplideSlide  key={data.id} > <div  className=' w-full h-[45vh] flex leading-[1.3] items-center' style={{  
            background: `linear-gradient(90deg, rgb(20, 20, 20) 30%, transparent 70%),
             linear-gradient(0deg, rgb(20, 20, 20) 1%, transparent 99%), url(${data.cover}) no-repeat`, height: "100vh",
             backgroundSize: "cover",   
  }} >
           <div className="inner">
           <p className='text-danger'>#{index + 1} in trending</p>
            <p>{data.title.english}</p>
            <p>({data.title.native})</p>
            <p > {data.rating && <span className='text-green'>{data.rating}% Rating</span>}  <span>{data.releaseDate} </span>
             {data.totalEpisodes &&  <span>{data.totalEpisodes}  Episodes</span>} </p>
             <p className='description' dangerouslySetInnerHTML={{ __html: data.description }}></p>
             <button className='watch'> <FaPlay /> Watch</button>
             <button className='watch watch2'> <FaInfoCircle  /> More Info</button>
           </div>
            </div></SplideSlide>
         })}
         
         </Splide>
    </Wrapper>
  )
}

export default Trending
