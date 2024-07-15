import React, { useState } from 'react';
import Chat from './Chat';
import { getUsername } from './FrontendCommons';
import './Lobby.css';

// Room is an array that contains elements structured as:
// [player_name, game_rules]
const Lobby = ({ rooms = [] }) => { 
  const [showJoinMessage, setShowJoinMessage] = useState(false);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);

  const handlePlayerClick = (index) => {
    setSelectedRoomIndex(index);
    setShowJoinMessage(true);
  };

  const handleNoClick = () => {
    setShowJoinMessage(false);
    setSelectedRoomIndex(null);
  };

  const handleYesClick = () => {
    // Add logic to join the game here
  };

  const handleStartGameClick = () => {
    // Add logic to start the game here
  };

  return (
    <div>

      {/* Lobby */}
      <div className="lobby-container">
        <div className="lobby-box">
          <h1>Available Players</h1>
          <div>
            {rooms.map((room, index) => (
              <button key={index} className="player-block" onClick={() => handlePlayerClick(index)}>
                <h2>{room[0]}</h2>
                <p>{room[1]}</p>
              </button>
            ))}
            <button className="player-block" onClick={handleStartGameClick}>
              <h2>Create Game</h2>
            </button>
          </div>
        </div>
        {showJoinMessage && (
          <div className="join-message">
            <div className="message-box">
              <p>Join game with {rooms[selectedRoomIndex][0]}?</p>
              <div>
                <button className="join-button no-button" onClick={handleNoClick}>No</button>
                <button className="join-button yes-button" onClick={handleYesClick}>Yes</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User */}
      <div className="user-container">
        <div className="user-box">
          <div className="user-info">
            User name: 
          </div>
          {getUsername()}
        </div>
      </div>

      <Chat />
    </div>
  );
};

export default Lobby;
