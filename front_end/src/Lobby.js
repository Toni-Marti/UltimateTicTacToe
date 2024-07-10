import React, { useState } from 'react';
import './Lobby.css';

const Lobby = ({ nPlayers }) => {
  const [showJoinMessage, setShowJoinMessage] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handlePlayerClick = (index) => {
    setSelectedPlayer(index);
    setShowJoinMessage(true);
  };

  const handleNoClick = () => {
    setShowJoinMessage(false);
    setSelectedPlayer(null);
  };

  const handleYesClick = () => {
    // Add logic to join the game here
  };

  return (
    <div className="lobby-container">
      <div className="lobby-box">
        <h1>Available Players</h1>
        <div>
          {nPlayers.map((player, index) => (
            <button key={index} className="player-block" onClick={() => handlePlayerClick(index)}>
              <h2>{player[0]}</h2>
              <p>{player[1]}</p>
            </button>
          ))}
          <button className="player-block">
            <h2>Create Game</h2>
          </button>
        </div>
      </div>
      {showJoinMessage && (
        <div className="join-message">
          <div className="message-box">
            <p>Join game with {nPlayers[selectedPlayer][0]}?</p>
            <div>
              <button className="join-button no-button" onClick={handleNoClick}>No</button>
              <button className="join-button yes-button" onClick={handleYesClick}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lobby;
