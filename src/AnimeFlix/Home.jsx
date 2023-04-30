import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components'
import AnimeGrid from './AnimeGrid';
import './Animeflix.css'
import ModalContainer from './ModalContainer';
import {  useLocation } from 'react-router-dom';
// import MovieModalContainer from './MovieModal';
import ReactGA from "react-ga4";

const AniHome = ({cwList}) => {
  const useQuery = () => {
    return new URLSearchParams (useLocation().search)
  }
    let query = useQuery()
 
    const title = query.get('title')

    const [trending , setTrending] = useState([]);
    // const [featured , setFeatured] = useState([]);
    const [popular , setPopular] = useState([]);
    const [recent , setRecent] = useState([]);
    const [trendingMovie , setTrendingMovie] = useState([]);
    const [tvShows , setTvShows] = useState([]);
    const [rMovie , setRMovie] = useState([]);
    const [rTvShows , setRTvShows] = useState([]);
 
    async function fetchDetails (term) {
   const response = await   axios.get(`https://api.pewds.vercel.app/${term}`)
   .catch(function (error) {
    if (error.response) {
    
      console.log(error.response.data, 'error');
      console.log(error.response.status);
      console.log(error.response.headers);
    }})
    return response.data
  
    }
   
   
       const fetchAnime =async (id) => {


        const info = sessionStorage.getItem(id);

      
      if(info){
          const data = JSON.parse(info)
          console.log(data)
          setItem(data)
          handleOpen()
       
        return data
      }else{
        const response = await  axios.get(`https://api-pewds.vercel.app/info/${id}`)  
        sessionStorage.setItem(id, JSON.stringify(response.data));
        console.log(response.data)
      setItem(response.data)
      handleOpen()
         return response.data
      }

       }

   const gettingDataStore = async (term) => {
      const data = sessionStorage.getItem(term);
  if (data) {
    // If the data is already in session storage, return it
    return JSON.parse(data);
  }else{
    const data = await fetchDetails(term)
    sessionStorage.setItem(term, JSON.stringify(data));
   return data
  }
    }

  useEffect(() => { 
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Home View" });
    if(title){
      ReactGA.event({
        category: title,
        action: title,
        label: title, // optional
        value: 99, // optional, must be a number
        nonInteraction: true, // optional, true/false
        transport: "xhr", // optional, beacon/xhr/image
      });
      console.log('title:' ,title)
      fetchAnime(title)
    }


    const gettingData = async () => {
    const Trending = await gettingDataStore('anime/trending')
    setTrending(Trending?.results)
    const Popular = await gettingDataStore('anime/popular') 
    setPopular(Popular?.results)
    const Airing = await fetchDetails('anime/recent')
    setRecent(Airing?.results)
    const TrendingMovie = await gettingDataStore('movie/trending')
    setTrendingMovie(TrendingMovie)
    const TvShows = await gettingDataStore('tv/trending')
    setTvShows(TvShows)
    const RMovies = await gettingDataStore('movie/recent')
    setRMovie(RMovies)
    const RTvShows = await gettingDataStore('tv/recent')
    setRTvShows(RTvShows)
    

    
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

    <AnimeGrid batch={cwList} term={'Continue Watch'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} isAnime={true}/>
    <AnimeGrid batch={popular} term={'Popular Anime'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} isAnime={true} />

  
     <AnimeGrid batch={trendingMovie} term={'Trending Movie'} handleOpen={handleOpen} setIsMovie={setIsMovie}  isAnime={false} setItem={setItem}/>

     <AnimeGrid batch={trending} term={'Trending Anime'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} isAnime={true}/>

     <AnimeGrid batch={tvShows} term={'Trending Tv Shows'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie}   isAnime={false}/>

     <AnimeGrid batch={rMovie} term={'Recent Movies'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie}  isAnime={false}/>
     <AnimeGrid batch={recent} term={'Recent Anime'} handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} isAnime={true} />

     <AnimeGrid batch={rTvShows} term='Recent TV Shows' handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie}  isAnime={false}/>

     {/* <AnimeGrid batch={airing} term='Currently Airing' handleOpen={handleOpen} setItem={setItem} setIsMovie={setIsMovie} isAnime={true}/> */}
    
    </Wrapper>
  )
  
}

export default AniHome
const Wrapper = styled.section`
   
    `