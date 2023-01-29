import Featured from "../components/Featured";
import Common from "../components/BestSelling";
import Movie from "../components/movie";
import Air from "../components/air";

import List from "../components/List";
import Trending from "../components/home/trending";




  function Home() {

    
    

  return (

    <div
    animate={{opacity: 1}}
    initial={{opacity: 0}}
    exit={{opacity: 0}}
    transition={{duration: 0.5}}
    
    > 

      <Featured />
    <Common />
    {/* <Air /> */}
    <List /> 
    <Movie /> 
    <Trending />
   
       
       

    </div>
  )
}

export default Home;
