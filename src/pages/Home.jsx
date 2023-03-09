// import Featured from "../components/Featured";
// import Common from "../components/BestSelling";
// import Movie from "../components/movie";
// import Air from "../components/air";

import List from "../components/List";
// import Trending from "../components/home/Trending";
import Popular from "../components/home/Popular";




  function Home() {

    
    

  return (

    <div
    animate={{opacity: 1}}
    initial={{opacity: 0}}
    exit={{opacity: 0}}
    transition={{duration: 0.5}}
    
    > 
    {/* <Trending /> */}
    <Popular />

      {/* <Featured />
    <Common />
    <Air />
    <List /> 
    <Movie />  */}
   
       
       

    </div>
  )
}

export default Home;
