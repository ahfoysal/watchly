import React, { useState, useEffect } from "react";
import "./header.css";
import {FaSearch} from 'react-icons/fa';


function SSearch() {
  const [visible, setVisible] = useState(true);
  const [width, setWidth] = useState(window.innerHeight);

  const handleVisibility = () => {
    setVisible(prev => !prev);
  };

  const handleWidth = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    console.log(visible);
    window.addEventListener("resize", handleWidth);
    width <= 600 ? setVisible(false) : setVisible(true);
    return () => {
      window.removeEventListener("resize", handleWidth);
    };
  }, [width]);

  return (
    <div className="container search-bar">
        
        <div>
        <aside className={visible ? "open" : "close"}>
          <input placeholder="Search..." type="text" />
        </aside></div>
        <div className="magnifierContainer">
        <FaSearch onClick={handleVisibility}/>
        </div>

         </div>
  );
}

export default SSearch

