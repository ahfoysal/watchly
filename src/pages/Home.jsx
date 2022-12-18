import Featured from "../components/Featured";
import Common from "../components/BestSelling";
import Movie from "../components/movie";
import Air from "../components/air";

import RecentlyUpdated from "../components/Recent-anime";
import List from "../components/List";

import Banner from "../components/banner";
import { useContext, useEffect } from "react";
import { TestContext } from "../App";


  function Home() {
    useEffect(() => {
 
    
    }, [])
    
    

  return (

    <div
    animate={{opacity: 1}}
    initial={{opacity: 0}}
    exit={{opacity: 0}}
    transition={{duration: 0.5}}
    
    > 
      {/* <Banner /> */}
      <Featured />
      {/* <RecentlyUpdated />  */}
   
    <Common />
    <Air />
    <List /> 
    <Movie /> 
   
       
       

    </div>
  )
}

export default Home;
