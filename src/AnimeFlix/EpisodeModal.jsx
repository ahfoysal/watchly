import React from 'react'
import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';

import Fade from '@mui/material/Fade';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import Backdrop from '@mui/material/Backdrop';





const ModalContainer = ({open, setOpen, item, isMovie}) => {


  useEffect(() => { 
    
    async function fetchDetails () {
   const response = await  axios.get(`https://api.animeflix.live/v2/episodes?id=${item}&dub=false`)  
   setLoading(false)
    return response.data
  
    }
    console.log(item.id)
    const gettingData = async () => {
    const data = await fetchDetails()
    setDetails(data)
    console.log(data)
   
  } 
  async function fetchDetails2 () {
    const response = await  axios.get(`https://api-pewds.vercel.app/info/${item}`)  
    setLoading(false)
     return response.data
   
     }
     console.log(item.id)
     const gettingData2 = async () => {
     const data = await fetchDetails2()
     setDetails(data)
     console.log(data)
    
   } 
  
  if(!isMovie)(gettingData())
  if(isMovie)(gettingData2())
  },[item, isMovie])

    const [page, setPage] = React.useState(1);
    const [details, setDetails] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const handleClose = () =>{ 
    setLoading(false)
    setOpen(false)
    setPage(1)
    setDetails({})
    };
    const handleChange = (event) => {
      setPage(event.target.value);
    };
    const Wrapper = styled.section`
   
    width: clamp(16rem, 65vw, 55rem);
    line-height: 1.5;
    border-radius: 0.5rem;
    background: rgb(24, 24, 24);
    animation: 400ms ease 0s 1 normal none running ;
   
    
    .cgXpiH {
    height: clamp(25rem, 22vw, 30rem);
    display: flex;
    position: relative;
    align-items: flex-end;
    padding: 1.5vw 3vw;
    border-radius: 0.5rem 0.5rem 0px 0px;
    background: linear-gradient(0deg, rgb(24, 24, 24) 1%, transparent 99%) center center / contain, url(${item.cover || details.cover ||  details.image}) no-repeat;
    background-position: center center;
}

.modal-title{
  color: white;
 
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
}
.iwkpUn {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}
.bNIKgw {
    cursor: pointer;
    height: fit-content;
    display: inline-block;
    background: rgb(239, 239, 239);
    color: rgb(0, 0, 0);
    text-shadow: none;
    padding: min(.5vw, 6rem) min(1.5vw, 6rem);
    border-radius: 0.3rem;
    transition: opacity 200ms ease 0s;
    border: none;
 
}
.fxRBEX {
    padding: 0px 3vw 1.5vw;
}
.EIpBt {
    font-size: 80%;
    margin-bottom: 1.5vw;
    /* display: flex; */
    /* flex-direction: row; */
}
.EIpBt strong {
    color: rgb(70, 211, 105);
    margin: 0px 10px;
}
.EIpBt label {
    color: white;
    margin: 0px 20px;
    margin: 0px 10px;
}
.hFhjAa {
    display: flex;
    margin-bottom: 0.5vw;
}
.bJEMmB h3 {
    margin-top: 0.5vw;
    margin-bottom: 0px;
    line-height: 2;
    margin: auto auto auto 0px;
}
.ssss{
  float: right;
    display: flex;
    margin-left: auto;
}
.iklKND {
    width: fit-content;
    position: relative;
    margin-left: 1rem;
    margin-right: 1rem;

}
.kXDwXI {
    color: white;
    cursor: pointer;
    padding: 8px 18px;
    border: 1px solid rgb(77, 77, 77);
    border-radius: 0.3rem;
    background: rgb(36, 36, 36);


}
.bJEMmB{
  display: flex;
  
}
.eppqhJ img {
    width: 10.5rem;
    height: 6.1rem;
    object-fit: cover;
    border-radius: 0.5rem;
}
.hhCCFl p {
    color: rgb(210, 210, 210);
    height: 5.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    font-size: 13px !important;
}

.iEayIb {
    padding: 1rem 0px;
}
.eppqhJ {
    display: flex;
    /* background: rgb(20, 20, 20); */
    position: relative;
}
.eppqhJ h3 {
    white-space: nowrap;
}
.iEayIb {
    display: flex;
    padding: 1.5rem 2.5rem;
}
.episode-title{
  font-size: 13px !important;
}
@media (min-width: 700px){
  .iEayIb {
    display: flex;
    padding: 1.5rem 2.5rem;
}
.hhCCFl {
    margin-left: 2rem;
}

}
@media (max-width: 550px){
  width: 100%;
  .bNIKgw {

    padding: min(2vw, 6rem) min(2.5vw, 6rem);
   
}
  .cgXpiH {
    height: 250px;
   background-size: contain;
    padding: 20px;
   
}
.hhCCFl {
    margin-left: 1rem;
}
.hhCCFl .bJEMmB {
    color: rgb(210, 210, 210);
   display: none;
}
.iEayIb {
    padding: 0rem 0px;
}
.eppqhJ img {
    width: 7rem;
    height: 5rem;
    object-fit: cover;
    border-radius: 0.5rem;
}
}

    
    `

  return (
    
        <Modal
        
        open={open}
        onClose={handleClose}
        
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 3000,
          },
        }}
      >
       <Fade in={open}>
        <Box sx={style} className='dkMIQh'>
        <Wrapper  >
   
          
          <main className="fxRBEX">
          <div>
            <div className="EIpBt">
      {item.rating && <strong>{item?.rating}%Match</strong>} 
   {item.releaseDate &&   <label>{item.releaseDate}</label>}
    { item.totalEpisodes && <label> {item.totalEpisodes}  episodes</label>}
{item.duration &&      <label>{item.duration}  minutes </label>}
      
                 </div>
           
          </div>
          <div>
     
          { loading ?   <>
            <p>not loaded</p>
          </> : <>{details.type !== "Movie"  && <>
          <header className="bJEMmB">
          <h3>Episodes</h3>
       { details?.episodes?.length > 20 &&  
        <Dropdown className='iklKND'>
      <Dropdown.Toggle variant="success" id="dropdown-basic" className='kXDwXI'>
       Page {page}
      </Dropdown.Toggle>

      <Dropdown.Menu >
        {details?.episodes?.slice(0, Math.ceil(details?.episodes.length/20))?.map((pro, index) => {
        return   <Dropdown.Item  onClick={() => setPage(index+1)} key={index}>{index+1}</Dropdown.Item>
        })}
       
      </Dropdown.Menu>
    </Dropdown>}
     
          
          </header>
          <div className='episode-container'>
      {details?.episodes?.length > 0 && details?.episodes?.slice(20 * (page - 1), 20 * page)?.map((pro) => {
        return  <Link  key={pro?.id} to={`/watch/${item.id}?episode=${pro.number}`}>
            <div className="iEayIb">
            <div className="eppqhJ">
            { pro?.image != null ?           <img alt="thumbnail" src={ pro?.image?.includes("thetvdb") ? `https://crunchy.animeflix.live/${pro.image}` : pro.image } />
 :   <img alt="thumbnail" src={ item.image } />}
            </div>
            <div className="hhCCFl">
{  pro.title != null ?       <>       <h3 className='episode-title'>{pro?.number}. {pro?.title}</h3>
                <p>{pro.description}</p> </> :
              <>  <h3 className='episode-title'> Episode {pro?.number} -</h3>
                <p> Episode {pro.number} of {item?.title?.english} </p> </>
                }
            </div>  
            </div>
          </Link>
      })}</div>
          </> }</>}
         

          </div>

          </main>
        </Wrapper>





   
    
       
        </Box>
        </Fade>
      </Modal>
    
  )
}

export default ModalContainer
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  // right: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 400,

 

  backgroundColor: '#141414'
};
