import React, { useState } from 'react';

import './Stadistics.css';

const Stadistics = ({ loss, draw, win }) => {

  const total = (+loss) + (+draw) + (+win);
  const lossPercentage = total ? ((loss / total) * 100).toFixed(2) : 0;
  const drawPercentage = total ? ((draw / total) * 100).toFixed(2) : 0;
  const winPercentage = total ? ((win / total) * 100).toFixed(2) : 0;

  return (
    <div className='GridContainer'>
      <div className='TextContainer'>
        <span>
          TOTAL GAMES: {total}
        </span>
      </div>
      <div className='Bar' style={{gridTemplateColumns: win + "fr " + draw + "fr " + loss + "fr " }}>
          <div className='Win'></div>
          <div className='Draw'></div>
          <div className='Loss'></div>
      </div>
      <div className='Bar_NoBorder' style={{gridTemplateColumns: win + "fr " + draw + "fr " + loss + "fr " }}>
          <span className='WinPercentage'>{winPercentage}%</span>
          <span className='DrawPercentage'>{drawPercentage}%</span>
          <span className='LossPercentage'>{lossPercentage}%</span>
      </div>
    </div>
  );
};

export default Stadistics;