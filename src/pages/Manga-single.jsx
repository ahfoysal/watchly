import { Details } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import YoutubeEmbed from "../components/ytembed";
import Video from './video'
import 'video.js/dist/video-js.css';

const Manga = () => {
  const [details , setDetails] = useState([]);
  const [src , setSrc] = useState('');

  let params = useParams();
    useEffect(() => {
  
      fetchDetails()
      }, [])
  
const fetchDetails = async () =>{



  await axios(`https://api.10minuteschool.com/lms-auth-service/api/v4/pro/v3/content/course/1009  /enrolled`)
 .then(data2 => { const data = data2.data.data
  console.log(data)
   setDetails(data)

  
 

 })  


}
const videoJsOptions = {
  autoplay: true,
  controls: true,
  sources: [{
    src: 'http://index2.circleftp.net/FILE/English%20Movies/2021/Lacy%27s%20Christmas%20Do-Over%20%282021%29%201080p%20WEBRip%20x264/Lacy%27s%20Christmas%20Do-Over%20%282021%29%201080p%20WEBRip%20x264.mp4',
    type: 'video/mp4'
  }]
}



  return (
    <div className='container'>
    <div className="load-anime">

        <Video {...videoJsOptions} />
    </div> </div>
  )
}

export default Manga
