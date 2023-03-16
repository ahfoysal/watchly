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
import { IoCloseCircle } from 'react-icons/io5';
import { FaPlay } from 'react-icons/fa';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Spinner } from 'react-bootstrap';




const ModalContainer = ({open, setOpen, item}) => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);

    const [details, setDetails] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [hasCw, setHasCw] = React.useState(false);
    const [hasSeason, setHasSeason] = React.useState(false);
    const [cw, setCw] = React.useState({});
  
 
  useEffect(() => { 

   
    async function fetchDetails () {
      setDetails({})
      setLoading(true)
      setHasSeason(false)
      setHasCw(false)
        

      const info = sessionStorage.getItem(item.id);
      
      if(info){
          const data = JSON.parse(info)
        if(data.episodes[0]?.season )(setHasSeason(true))
        setLoading(false)
        return data
      }else{
        const response = await  axios.get(`https://api-pewds.vercel.app/info/${item.id}`)  
        sessionStorage.setItem(item.id, JSON.stringify(response.data));
        if(response.data?.episodes[0]?.season )(setHasSeason(true))
        setLoading(false)
         return response.data
      }


  //  console.log(response.data?.episodes[0]?.season )
 
  
    }
    // console.log(item.id)
    const gettingData = async () => {
    const data = await fetchDetails()
    setDetails(data)
    const storedWatchlist = JSON.parse(localStorage.getItem(`${item.id}`));
  if (storedWatchlist) {
   
    // const myObject = storedWatchlist.find(cw => cw.id === item.id);

    if(!storedWatchlist){
      return console.log('no cw')
    }
    else{
      if(!storedWatchlist.position)return
      setHasCw(true)
      setCw(storedWatchlist)
      // console.log(storedWatchlist)
    }
    // const currentEp = myObject.episodes.find(item => item.id === `${ep}`);
  
  }
    // console.log(data)
   
  } 

    //  console.log(item.id)

   gettingData()

  },[item])

  
    const handleClose = () =>{ 
      window.history.replaceState(null, "Okay", `/`)
    setLoading(false)
    setOpen(false)
    setPage(1)
   
    };

    const SeasonMenuItem = ({item}) => {
      let uniqueObjects = {};

// loop through the objects array
item.episodes.forEach(function(obj) {
  // if the object ID is not in the uniqueObjects object, add it
  if (!uniqueObjects[obj.season]) {
    uniqueObjects[obj.season] = obj;
  }
});

// get an array of the unique objects
let uniqueObjectsArray = Object.values(uniqueObjects);
      return(
        <>
        {uniqueObjectsArray?.map((pro, index) => {
        return  <Dropdown.Item  onClick={() => setPage(index+1)} key={index}>{index+1}</Dropdown.Item>
        })}
        </>
      )
    }
  

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
        <Wrapper  details={details} item={item}>
    
          <header className="cgXpiH">
          <IoCloseCircle  onClick={handleClose} size={40} className='close-button' color='#181818'/> 
          <div>
            <h2 className='modal-title'>{item?.title?.english  || item?.title?.native || item?.title || details?.title?.english  || details?.title?.native || details?.title}</h2>
          {!loading && <>
            { hasCw ?  <>
              <ProgressBar animated now={cw?.position} max={cw?.total} variant={'danger'}/>;
              <div className="iwkpUn">
            
            <button className="bNIKgw" onClick={() => navigate(`/watch/${item?.id}?episode=${cw?.cwid}&ts=${cw?.position}`)}>    <FaPlay   size={18}  color='#181818'/>  <strong className='strong'> Resume {cw?.cw?.slice(0, 15) + (cw?.cw?.length > 15 ? "..." : "")}</strong></button>
            
            </div> 
             
        
             
            </>
             :
            <div className="iwkpUn">
            
            <button className="bNIKgw" onClick={() => navigate(`/watch/${item.id}?episode=${details?.episodes[0]?.id}`)}>    <FaPlay   size={18}  color='#181818'/>  <strong> Play</strong></button>

            </div> 
            }
          </> }
          </div>
          </header>
          <main className="fxRBEX">
          <div>
            <div className="EIpBt">
      {item?.rating  && <strong>{item?.rating || details?.rating}%Match</strong>} 
   {item?.releaseDate &&   <label>{item?.releaseDate || details?.releaseDate}</label>}
    { item?.totalEpisodes  && <label> {item?.totalEpisodes || details?.totalEpisodes}  episodes</label>}
{item?.duration  &&      <label>{item?.duration || details?.duration}  minutes </label>}
      
                 </div>
           
          </div>
          <div>
     
          { loading ?   <div className='loading-progress'>

            <Spinner variant='danger' size="sm" animation="grow" />
            <Spinner variant='danger'  size="sm" animation="grow" />
            <Spinner variant='danger' size="sm" animation="grow" />
          </div> : <>{details?.type !== "Movie"  && <>
          <header className="bJEMmB">
          <h3>Episodes</h3>
      {hasSeason ? 
      

      <Dropdown className='iklKND'>
      <Dropdown.Toggle variant="success" id="dropdown-basic" className='kXDwXI'>
       Season {page}
      </Dropdown.Toggle>

      <Dropdown.Menu >
      
     <SeasonMenuItem item={details} />
       
      </Dropdown.Menu>
    </Dropdown>

      : <> { details?.episodes?.length > 20 && 
        <Dropdown className='iklKND'>
      <Dropdown.Toggle variant="success" id="dropdown-basic" className='kXDwXI'>
       Page {page}
      </Dropdown.Toggle>

      <Dropdown.Menu >
        {details?.episodes?.slice(0, Math?.ceil(details?.episodes?.length/20))?.map((pro, index) => {
        return   <Dropdown.Item  onClick={() => setPage(index+1)} key={index}>{index+1}</Dropdown.Item>
        })}
       
      </Dropdown.Menu>
    </Dropdown>}
    </>}
     
          
          </header>
          <div className='episode-container'>
{hasSeason ? <>
  {  details?.episodes?.map((pro) => {
    if (pro.season === page)
        return    <Link key={pro.id} to={`/watch/${item.id}?episode=${pro.id}`}>
            <div className="iEayIb">
            <div className="eppqhJ">
            { pro?.image != null ?           <img alt="thumbnail" src={ pro?.image?.includes("thetvdb") ? `https://crunchy.animeflix.live/${pro.image}` : pro.image } />
 :   <img alt="thumbnail" src={ item.image } />}
            </div>
            <div className="hhCCFl">
{  pro.title != null ?       <>       <h3 className='episode-title'> {pro?.title}. (s{pro?.season})</h3>
                <p>{pro.description}</p> </> :
              <>  <h3 className='episode-title'>  Episode {pro.season} -</h3>
                <p> Episode {pro.number} of {item?.title?.english || details?.title?.english || item?.title || details?.title } </p> </>
                }
            </div>  
            </div>
          </Link>
      })} 
</> : <>      
{details?.episodes?.length > 0 && details?.episodes?.slice(perPage * (page - 1), perPage * page)?.map((pro) => {
        return  <Link  key={pro?.id} to={`/watch/${item.id}?episode=${pro.id}`}>
            <div className="iEayIb">
            <div className="eppqhJ">
            { pro?.image != null ?           <img alt="thumbnail" src={ pro?.image?.includes("thetvdb") ? `https://crunchy.animeflix.live/${pro.image}` : pro.image } />
 :   <img alt="thumbnail" src={ item.image } />}
            </div>
            <div className="hhCCFl">
{  pro.title != null ?       <>       <h3 className='episode-title'>{pro?.number}. {pro?.title}</h3>
                <p>{pro.description}</p> </> :
              <>  <h3 className='episode-title'> Episode {pro?.number} -</h3>
                <p> Episode {pro.number} of {item?.title?.english || details?.title?.english || item?.title || details?.title } </p> </>
                }
            </div>  
            </div>
          </Link>
      })} 
      </>}
      </div>
          </> }
          </>}
         

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
background: linear-gradient(0deg, rgb(24, 24, 24) 1%, transparent 99%) center center / contain, url( ${props => props.item?.cover || props.details?.cover ||  props.details?.image}) no-repeat;
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