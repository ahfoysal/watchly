
import React, { useEffect, useState } from 'react'
import "plyr-react/plyr.css"
import {  useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Video from '../video'
import 'videojs-errors';
import 'video.js/dist/video-js.css';
import { RxDoubleArrowLeft } from 'react-icons/rx';
import { RxDoubleArrowRight } from 'react-icons/rx';
import { IoMdSettings } from 'react-icons/io';
import { Dropdown } from 'react-bootstrap';
import styled from 'styled-components';



const Animewatch = () => {

  const useQuery = () => {
    return new URLSearchParams (useLocation().search)
  }
  let query = useQuery()
    const ep = query.get('ep')
    let params = useParams();
    const [details , setDetails] = useState([]);
    const[ total,  setTotal] = useState()
    const[ ql,  setQl] = useState('')
    const[ np,  setNp] = useState('')
    const [details2 , setDetails2] = useState(true);
    const [error, setError] = useState("");
    const [src2 , setSrc2] = useState('');
    const [loading3 , setLoading3] = useState(false);
    const [input, setInput] = useState("");

   








    const getInfo = async () =>{

        await axios(`https://api.consumet.org/meta/anilist/info/${params.name}`)
       .then(data2 => { const data = data2.data
        console.log(data)
         setDetails(data)
         setTotal(data?.episodesList?.length)
   
        
        
       })  
     // }
   
   
     
   
   }

const getEp = () => {
  setError('')

    axios(`https://api.consumet.org/meta/anilist/watch/${ep}?server=gogocdn`)
    .then(data2 => { const data = data2.data  
      setDetails2(data)
 
     console.log(data)
     setSrc2(data.sources[1].url)
     setQl(data.sources[1].quality)
     setLoading3(true)
    }).catch(error => {
      const rslt = error;
      setError('Something Went wrong please try again after 2min. It`ll be fix automaticlly , Thank You.')
      console.log('error', rslt)
    });

}


const getEp2 = (id, number) => {
  setNp(number)
  // params2.pathname = id
  setError('')
  setLoading3(false) 
       console.log( id)
       window.history.replaceState(null, "Okay", `/anime/watch/${params.name}?ep=${id}`)
  axios(`https://api.consumet.org/meta/anilist/watch/${id}?server=gogocdn`)
  .then(data2 => { const data = data2.data  
    setLoading3(true)
   console.log(data.sources[1].url)
   setSrc2(data.sources[1].url)
  

  }).catch(error => {
    const rslt = error;
    console.log('error', rslt)
  });

}
const qual = (url, type) =>{
  setQl(type)
  setLoading3(false)
    setSrc2(url)
    
  
    setTimeout(() => setLoading3(true) , 500)
    
}


    useEffect(() => { 
       console.log(params)
       getInfo()
       getEp()
       console.log(ep)
       
      },[])
    
      const test =  details?.episodes?.map(sub =>  {
        return {src: src2, 
          type: "application/x-mpegURL",
          label: "480P",
        }
    
        })
        
const play2 = {
    fill: true,
    userActions: { hotkeys: true },
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2],
    autoplay: true,
    controls: true,
    preload: "metadata",
    sources: test,
  
 }


  

//  
const Wrapper = styled.div`
  .li{
    padding: 1rem 0rem;
    border-bottom: 1px solid rgb(63, 63, 63);
  }
 
  `

   
  return (
    <Wrapper>
       <div className='container'>
        
       {error && <p className='error'>{error}</p>}
        <div className="video-inner">
        {loading3 ? 
    <>
    <Video  {...play2} />

  </> : <>
  {/* <Video {...play2} />   */}
          
  </>}
  <div className='d-flex justify-content-center'>
    <button className='btn text-white mt-3 mr-6'><RxDoubleArrowLeft /> Previous </button > 
    <button className='btn text-white mt-3 ' >Next<RxDoubleArrowRight /> </button>
   
    <Dropdown className='mt-3'>
      <Dropdown.Toggle variant="" className='text-white mt-3' id="dropdown-basic">
      <p className='btn text-white  '> Select  Resolution {ql }</p>    
      </Dropdown.Toggle>

      <Dropdown.Menu>
      {details2?.sources?.map((qls, index) =>{
      return  <Dropdown.Item  key={index + 1} onClick={() => qual(qls.url, qls.quality)}>
        <p className='btn  ' key={qls.quality} > {qls.quality}</p>
        </Dropdown.Item>
    })} 
       
      
      </Dropdown.Menu>
    </Dropdown>
  </div>
  </div>






    
  <div className=' episodes '>
    
   {/* <input placeholder="Search..." type="text" className='border-none form mt-3'  onChange={(e) => setInput(e.target.value)} 
value={input}/>
<input type="text" onChange={(e) => setInput(e.target.value)} /> */}
</div>
    <div className=' episodes '> 
  
<div className="ep-button" id='paragraph'>
<div className="list">
        {details?.episodes?.length < 50 && details?.episodes?.map((data,index) => {
              return <p className='li' > <span>{data.number}.  {data.title}</span>
              <br /> <span>{data.description}</span>
              </p>
        })}
      </div>

{details?.episodes?.length > 50 && details.episodes?.map((ep,index) => {
return  <button key={index + 1}  id={`one${index}`} className={`btn btn-ep ${np === ep.number ? 'activeep' : ' '} ${Number(input) === ep.number ? 'sep' : ' '}`}  onClick={() => getEp2(ep.id, ep.number)}>{ep.number}</button>
})}

</div>
</div>
    
    </div></Wrapper>
  
  )
  
}

export default Animewatch
