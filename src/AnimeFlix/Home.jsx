import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components'
import AnimeGrid from './AnimeGrid';
import './Animeflix.css'
import ModalContainer from './ModalContainer';
import { json } from 'react-router-dom';
// import MovieModalContainer from './MovieModal';

const AniHome = () => {


    const [trending , setTrending] = useState([]);
    // const [featured , setFeatured] = useState([]);
    const [popular , setPopular] = useState([]);
    const [airing , setAiring] = useState([]);
    const [trendingMovie , setTrendingMovie] = useState([]);
    const [tvShows , setTvShows] = useState([]);
    const [rMovie , setRMovie] = useState([]);
    const [rTvShows , setRTvShows] = useState([]);
 
    async function fetchDetails (term) {
   const response = await   axios({
    method: 'get',
    url: `https://cors.delusionz.xyz/https://api.animeflix.live/anime/${term}`,
    headers: {'Origin': `https://api.animeflix.live`,
    'x-cors-api-key': `${process.env.REACT_APP_KEY}`
}
})
    return response.data
  
    }
    async function movieDetails (term) {
      const response = await  axios.get(`https://api-pewds.vercel.app/${term}`)  
       return response.data
     
       }
   

  useEffect(() => { 
  
 
    const gettingData = async () => {
    const Trending = await fetchDetails('gettrending')
    setTrending(Trending.trending)
    const Popular = await fetchDetails('getpopular')
    setPopular(Popular)
    console.log(JSON.stringify(popular))
    const Airing = await fetchDetails('getairing')
    setAiring(Airing)
    const TrendingMovie = await movieDetails('trending-movies')
    setTrendingMovie(TrendingMovie)
    const TvShows = await movieDetails('trending-tvshows')
    setTvShows(TvShows)
    const RMovies = await movieDetails('recent-movies')
    setRMovie(RMovies)
    const RTvShows = await movieDetails('recent-tvshows')
    setRTvShows(RTvShows)
    
    // console.log(trending,Popular ,  airing)



  
    
  } 
    gettingData()
  },[])
  
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [isMovie, setIsMovie] = React.useState(null);
    const handleOpen = () => setOpen(true);
    const handleOpen2 = () => setOpen2(true);

    const [item, setItem] = React.useState({});
  
  
    return (
    <Wrapper>
    <ModalContainer item={item} handleOpen={handleOpen} isMovie={isMovie}  setOpen={setOpen} open={open}  />

    
     <AnimeGrid batch={trending} term={'Trending Anime'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} isAnime={true}/>
  
     <AnimeGrid batch={trendingMovie} term={'Trending Movie'} handleOpen={handleOpen} setIsMovie={setIsMovie} handleOpen2={handleOpen2} isAnime={false} setItem={setItem}/>

     {/* <AnimeGrid batch={popular} term={'Popular Anime'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} isAnime={true} /> */}
    
     <AnimeGrid batch={tvShows} term={'Trending Tv Shows'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} handleOpen2={handleOpen2}  isAnime={false}/>

     <AnimeGrid batch={rMovie} term={'Recent Movies'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} handleOpen2={handleOpen2} isAnime={false}/>
   
     <AnimeGrid batch={rTvShows} term='Recent TV Shows' handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} handleOpen2={handleOpen2} isAnime={false}/>

     <AnimeGrid batch={airing} term='Currently Airing' handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} isAnime={true}/>
    
    </Wrapper>
  )
  
}

export default AniHome
const Wrapper = styled.section`
   
    `