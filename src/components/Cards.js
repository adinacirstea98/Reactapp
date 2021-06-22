import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Check out these EPIC Destinations!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/g4.svg'
              text='Set Sail in the Atlantic Ocean visiting Uncharted Waters'
              label='Mystery'
              path='/signup'
            />
            <CardItem
              src='images/g5.svg'
              text='Experience Football on Top of the Himilayan Mountains'
              label='Adventure'
              path='/signup'
            />
            <CardItem
              src='images/g3.svg'
              text='Ride through the Sahara Desert on a guided camel tour'
              label='Adrenaline'
              path='/signup'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
