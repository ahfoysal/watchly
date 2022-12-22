

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const AnimeInfo = () => {
  let params = useParams();
  const [details , setDetails] = useState([]);

  const fetchDetails = async () => {
    await axios(`https://api.consumet.org/meta/anilist/info/${params.name}`)
    .then(data2 => { const data = data2.data
    
console.log(data)
      setDetails(data)
      // setTotal(data?.episodesList?.length)

     
    
        // const data3 = cartItems[0].lastEP
        // const data4 = cartItems[0].lastEP2

        // if(cartItems[0].lastEP){
        //   setLoading2(true)
        //   getEpisode(data3,data4,data,0)
        // }
 
    })  

  }
  useEffect(() => { 
    fetchDetails()
   
  },[])
  const Wrapper = styled.div`
  .main{
    position: relative;
  }
  .inner{  margin: auto;
  width: 50%;
  /* height: 50%; */
  /* bottom: 50%; */
  left: 0;
  bottom: 0;
  margin: 0;
  position: absolute;
  padding: 0px 10px;
    }`
  return (
    <Wrapper>
      <div className='flex relative items-end bg-cover bg-center main'  style={{  
            background: `linear-gradient(0deg, rgb(20, 20, 20) 1%, transparent 99%), url(${details.cover})`, height: "clamp(20rem, 34vw, 50rem)",
             backgroundSize: "cover",   
  }}>
    <div className="inner">
      <p>{details?.title?.english}</p>
      <p>({details?.title?.native})</p>
    </div>
  </div>
    </Wrapper>
  )
}

export default AnimeInfo