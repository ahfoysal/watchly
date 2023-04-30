
import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';


import axios from 'axios';
import AnimeGrid from './AnimeGrid';
import ModalContainer from './ModalContainer';




function AniSearch() {

    const [details, setDetails] = useState([]);
    const [loading , setLoading] = useState(true);
    const [pro , setPro] = useState([]);


    let params = useParams();
    
    const getSearched = () => {

   
      axios(`https://api.pewds.vercel.app/anime/search/${params.search}`)
      .then(data2 => {  const data = data2.data  
    console.log(data)
    setPro(data.results)
  
    setLoading(true)
      
      })  
      axios(`https://api.pewds.vercel.app/movie/search/${params.search}`)
      .then(data2 => {  const data = data2.data
    console.log(data)
    setDetails(data.results)
    
      
      })  
   


  };
  useEffect(() => {
    getSearched()

  
},[params.search]);
const [open, setOpen] = React.useState(false);
const [open2, setOpen2] = React.useState(false);
const [isMovie, setIsMovie] = React.useState(null);
  const handleOpen = () => setOpen(true);


  const [item, setItem] = React.useState({});
  return (
    <div >
        <ModalContainer item={item} handleOpen={handleOpen} isMovie={isMovie}  setOpen={setOpen} open={open}  />
      <AnimeGrid batch={pro} term={'Anime'} handleOpen={handleOpen} setIsMovie={setIsMovie}  isAnime={true} setItem={setItem}/>
      <AnimeGrid batch={details} term={'Movies & Tv Shows'} handleOpen={handleOpen} setIsMovie={setIsMovie}  isAnime={false} setItem={setItem}/>


            


     </div>

  )
}


export default AniSearch