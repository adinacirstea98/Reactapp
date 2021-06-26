import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container'>
      <video src='/videos/3.mp4' autoPlay loop muted />
      <h1>MEET YOUR NEXT FAVORITE BOOK!</h1>
      <p>What are you waiting for?</p>
      {/* <div className='hero-btns'> */}
      <div>
        <Button
          > GET STARTED
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
