import React, { useState } from 'react';
import './Slider.css';

const SliderContainer = ({ anime,currentIndex,index }) => {

    let title= anime?.title?.english  || anime?.title?.native ||  anime?.title?.userPreferred || anime?.title?.romaji || anime?.title

 
  return (
    // <div className="slider-container">
    <>
      {/* <div className="slider-items-container"> */}
       
          <div
            key={anime.id}
            className={`slider-item ${currentIndex === index ? 'active' : ''}`}
          >
            <img src={anime.image} alt={title} />
            <div className="slider-item-title">{title}</div>
          </div>
      
      {/* </div> */}
      
    {/* </div> */}</>
  );
};

export default SliderContainer;