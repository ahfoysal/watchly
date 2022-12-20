

import React, { useEffect } from 'react'
import Plyr from "plyr-react";
// import "plyr-react/dist/plyr.css";
import "plyr-react/plyr.css"
import { useParams } from 'react-router-dom';

const Animewatch = () => {
    let params = useParams();
    useEffect(() => { 
       console.log(params)
       
      },[])
    const plyrProps = { 
        type: 'video',
        sources: [
          {
            src: 'QkVJKmNBApk',
            provider: 'youtube',
          },
        ],
      };
      
  return (
    <div>
      <Plyr {...plyrProps} />
    </div>
  )
}

export default Animewatch
