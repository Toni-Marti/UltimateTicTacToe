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
      <div className='Bar' style={{gridTemplateColumns: loss + "fr " + draw + "fr " + win + "fr " }}>
          <div className='Loss'></div>
          <div className='Draw'></div>
          <div className='Win'></div>
      </div>
      <div className='Bar_NoBorder' style={{gridTemplateColumns: loss + "fr " + draw + "fr " + win + "fr " }}>
          <span className='LossPercentage'>{lossPercentage}%</span>
          <span className='DrawPercentage'>{drawPercentage}%</span>
          <span className='WinPercentage'>{winPercentage}%</span>
      </div>
    </div>
  );
};

export default Stadistics;