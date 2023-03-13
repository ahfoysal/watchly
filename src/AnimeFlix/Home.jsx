import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components'
import AnimeGrid from './AnimeGrid';
import './Animeflix.css'
import ModalContainer from './ModalContainer';
import { json, useLocation } from 'react-router-dom';
// import MovieModalContainer from './MovieModal';

const AniHome = () => {
  const useQuery = () => {
    return new URLSearchParams (useLocation().search)
  }
    let query = useQuery()
    const anime = query.get('anime')
    const title = query.get('title')

    const [trending , setTrending] = useState([]);
    // const [featured , setFeatured] = useState([]);
    const [popular , setPopular] = useState([]);
    const [airing , setAiring] = useState([]);
    const [trendingMovie , setTrendingMovie] = useState([]);
    const [tvShows , setTvShows] = useState([]);
    const [rMovie , setRMovie] = useState([]);
    const [rTvShows , setRTvShows] = useState([]);
 
    async function fetchDetails (term) {
   const response = await   axios.get(`https://api-pewds.vercel.app/${term}`)
   .catch(function (error) {
    if (error.response) {
    
      console.log(error.response.data, 'error');
      console.log(error.response.status);
      console.log(error.response.headers);
    }})
    return response.data
  
    }
    async function movieDetails (term) {
      const response = await  axios.get(`https://api-pewds.vercel.app/${term}`)  
       return response.data
     
       }
   
       const fetchAnime =async (id) => {
        await axios(`https://api-pewds.vercel.app/info/${id}`)
    .then(data2 => { const data = data2.data
     
      console.log(data)
      setItem(data)
      handleOpen()
    }
    )}

  useEffect(() => { 
    if(anime){
      console.log('anime:' ,anime)
      fetchAnime(anime)

      // handleOpen()
    }
    if(title){
      console.log('title:' ,title)
      fetchAnime(title)
    }

    const gettingData = async () => {
    const Trending = await fetchDetails('trending')
    setTrending(Trending)
    const Popular = await fetchDetails('popular') 
    setPopular(Popular)
    // const Airing = await fetchDetails('getairing')
    // setAiring(Airing)
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
  // const [open2, setOpen2] = React.useState(false);
  const [isMovie, setIsMovie] = React.useState(null);
    const handleOpen = () => setOpen(true);
   

    const [item, setItem] = React.useState({});
  
  
    return (
    <Wrapper>
    <ModalContainer item={item} handleOpen={handleOpen} isMovie={isMovie}  setOpen={setOpen} open={open}  />

    
     <AnimeGrid batch={trending} term={'Trending Anime'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} isAnime={true}/>
  
     <AnimeGrid batch={trendingMovie} term={'Trending Movie'} handleOpen={handleOpen} setIsMovie={setIsMovie}  isAnime={false} setItem={setItem}/>

     <AnimeGrid batch={popular} term={'Popular Anime'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} isAnime={true} />
    
     <AnimeGrid batch={tvShows} term={'Trending Tv Shows'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie}   isAnime={false}/>

     <AnimeGrid batch={rMovie} term={'Recent Movies'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie}  isAnime={false}/>
   
     <AnimeGrid batch={rTvShows} term='Recent TV Shows' handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie}  isAnime={false}/>

     {/* <AnimeGrid batch={airing} term='Currently Airing' handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} isAnime={true}/> */}
    
    </Wrapper>
  )
  
}

export default AniHome
const Wrapper = styled.section`
   
    `