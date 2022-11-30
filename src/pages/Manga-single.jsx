import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const Manga = () => {
  const [details , setDetails] = useState([]);

  let params = useParams();
  useEffect(() => {
 
    fetchDetails()
    }, [])
  
const fetchDetails = async () =>{



  await axios(`https://api.consumet.org/manga/mangahere/read?chapterId=chainsaw_man/c001`)
 .then(data2 => { const data = data2.data
  console.log(data)
   setDetails(data)

  
 

 })  


}


  return (
    <div>
       {/* {details.map((data) =>{
        return<> <p className='text-danger'>{data.img}</p>
        <img src={data.img} alt="" />
        </>
       })} */}
       
       <div className="read-img-bar"> 
        
     
         
         <img src="https://zjcdn.mangahere.org/store/manga/31060/001.0/compressed/s001.jpg" className="reader-main-img" alt="" />
         </div>
    </div>
  )
}

export default Manga
