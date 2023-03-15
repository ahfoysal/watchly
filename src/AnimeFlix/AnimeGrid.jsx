import React from 'react'
import styled from 'styled-components'
import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/react-splide/css';
import { Link } from 'react-router-dom';



const AnimeGrid = ({batch, handleOpen, setItem, isAnime, setIsMovie, term}) => {
    


    const GridContiner = ({anime}) => {

        let img = anime?.image 
        let title= anime?.title?.english  || anime?.title?.native ||  anime?.title?.userPreferred || anime?.title?.romaji || anime?.title
        let id = anime?.id
        const  pressHandler = () => {
        
          if(isAnime)(setIsMovie(false))
          if(!isAnime)(setIsMovie(true))
          window.history.replaceState(null, "Okay", `?title=${anime.id}`)
  setItem(anime)
  handleOpen()
}
        return (
            <SplideSlide   key={id}>
   
   {/* <Link to={'/watch/'+id}> */}
          <div className="card  "  onClick={pressHandler}>
      
                
              <img src={img} className="card-img" alt="product.title" />
              <p className="anime-name">{title}</p>
          
          
                
              
            </div>
               {/* </Link>  */}
          
            
    
        </SplideSlide>
        )
    } 


  return (
    <Wrapper>

{batch?.length > 0 && <> <h3 className="sc-fctJkW jbCcDw">{term}</h3>

<Splide  className='cqRZkL' options={{
  perPage    : batch?.length === 1 && 1.5 || batch?.length === 2 && 4.5
   || batch?.length === 3 && 5.5   ||  7 ,
  gap        : 5,
  pagination : false,
  arrows : true,
  breakpoints: {
    1200: { perPage: 7, gap: 5 },
    640 : { gap: 2 , perPage: 5},
    550 : { gap: 2 , perPage: 3,   pagination : false},

  },
}}>
        {batch?.map((anime) => (
        <GridContiner key={anime.id} anime={anime}/>
        )) }
      
       
 

        </Splide></>
}

     
        
        
          

    </Wrapper>
  )
}

export default AnimeGrid
const Wrapper = styled.section`
             .jbCcDw {
    margin-left: 1.5vw;
    padding: 10px 0px;
    position: relative;
    z-index: 2;
}
    `