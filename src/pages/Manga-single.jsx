import { Details } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import YoutubeEmbed from "../components/ytembed";

const Manga = () => {
  const [details , setDetails] = useState([]);
  const [src , setSrc] = useState('');

  let params = useParams();
  useEffect(() => {
 
    fetchDetails()
    }, [])
  
const fetchDetails = async () =>{



  await axios(`https://api.10minuteschool.com/lms-auth-service/api/v4/pro/v3/content/course/1004/enrolled`)
 .then(data2 => { const data = data2.data.data
  console.log(data)
   setDetails(data)

  
 

 })  


}


  return (
    <div>
        <YoutubeEmbed embedId={src} />

        <div className="details">
            <p>CLass: {details?.category?.name} </p>
            <p>Sub: {details?.name} </p>


        </div>
        {details?.steps?.map((less) =>{
            return<> <p>{less.content_details.name}            </p>
            <p>            {less?.chapter_content?.map((lss) =>{
              return <>{lss?.content_details.name}</>
            })}</p>

            
            </>
        })}

    </div>
  )
}

export default Manga
