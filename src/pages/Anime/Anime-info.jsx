

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlay } from 'react-icons/fa';

const AnimeInfo = () => {
  let params = useParams();
  const [details , setDetails] = useState([]);

  const fetchDetails = async () => {
    await axios(`https://api.consumet.org/meta/anilist/info/${params.name}`)
    .then(data2 => { const data = data2.data
    

      setDetails(data)
      console.log(data)
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
  padding: 50px 50px;

    }
    .watch{    text-shadow: none;
    padding: min(1.5vw, .8rem) min(3vw, 4rem);
    transition: opacity 200ms ease 0s;
    border: none;
    border-color: none;
    border-radius: 5px;
  }
  .watch2{     
    background-color: #4D4D4DCC;
    margin-left: 10px;
    
  }
  .details-data span{
    margin: 0px 10px;
  }
  .li{
    padding: 1rem 0rem;
    border-bottom: 1px solid rgb(63, 63, 63);
  }
  `
  return (
    <Wrapper>
      <div className='flex relative items-end bg-cover bg-center main'  style={{  
            background: `linear-gradient(0deg, rgb(20, 20, 20) 1%, transparent 99%), url(${details.cover})`, height: "clamp(20rem, 34vw, 50rem)",
             backgroundSize: "cover",   
  }}>
    <div className="inner">
      <p>{details?.title?.english}</p>
      <p>({details?.title?.native})</p>
      <Link>   <button className='watch'> <FaPlay /> Play</button></Link>
          <Link to={`/anime/info/${details.id} `}>            <button className='watch watch2'> <FaPlay  /> Trailer</button></Link>
    </div>
  
  </div>
  <div className='container '>
      <p className='details-data'> {details.rating && <span className='text-green'>{details.rating}% Rating</span>}
      {details.season && <span >{details.season}</span>}
      {details.releaseDate && <span >{details.releaseDate}</span>}
      {details.totalEpisodes && <span >{details.totalEpisodes} Episodes</span>}
      {details.nextAiringEpisode && <span > Ep {details?.nextAiringEpisode?.episode}  airing in  {Math.floor(details?.nextAiringEpisode?.timeUntilAiring / (3600 * 24))} Days </span>}
      </p>
      <p className='description' dangerouslySetInnerHTML={{ __html: details.description }}></p>

      <h4>Episodes</h4>
      <div className="list">
        {details?.episodes?.map((data,index) => {
              return <Link to={`/anime/watch/${details.id}?ep=${data.id}`} key={data.id}> <p className='li' > <span>{data.number}.  {data.title}</span>
              <br /> <span>{data.description}</span>
              </p></Link>
        })}
      </div>
      <div>
        <p>About {details?.title?.english}</p>
    <span style={{color: "#a08686b9"}} >Genres:</span>  {details?.genres?.map(gen =><span key={gen} className='text-white'> {gen},</span>)}
      </div>
    </div>
    </Wrapper>
  )
}

export default AnimeInfo