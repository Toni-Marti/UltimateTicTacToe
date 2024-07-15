import React, { useState } from 'react';
import './ShowMoreList.css';

const ShowMoreList = ({ items, initialNumber }) => {
  const [visibleCount, setVisibleCount] = useState(initialNumber);

  const showMoreItems = () => {
    setVisibleCount(prevCount => prevCount + initialNumber);
  };

  return (
    <div className="container">
      <div className="box">
        <div>
          {items.slice(0, visibleCount).map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
        {visibleCount < items.length && (
          <button onClick={showMoreItems}>Show More</button>
        )}
      </div>
    </div>
  );
};

export default ShowMoreList;