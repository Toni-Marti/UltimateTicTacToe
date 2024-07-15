import React, { useState } from 'react';
import io from 'socket.io-client'
import Chat from './Chat';
import { getUsername, getPassword } from './FrontendCommons';
import './Lobby.css';
import { getServerAddress } from './serverData.js';
import { Overlay, EmptyPopUp, MessagePopUp, TwoButtonPopUp } from './popUps.js';
import { useNavigate } from 'react-router-dom';


const socket = io( getServerAddress() + ':4000' )

// Room is an array that contains elements structured as:
// [player_name, game_rules]
const Lobby = () => { 
  const navigate = useNavigate();

  const [showJoinMessage, setShowJoinMessage] = useState(false);
  const [showRejectionMessage, setShowRejectionMessage] = useState(false);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [rooms, setRooms] = useState([]);

  const listRooms = () => {
    socket.emit('listRooms')
  };
  socket.on('listRooms', (r) => {
    setRooms(r);
  })

  const handlePlayerClick = (index) => {
    setSelectedRoomIndex(index);
    setShowJoinMessage(true);
  };

  const handleNoClick = () => {
    setShowJoinMessage(false);
    setSelectedRoomIndex(null);
  };

  const handleYesClick = () => {
    socket.emit('joinRoom', getUsername(), getPassword(), rooms[selectedRoomIndex][0]);
    socket.on('joinRoom', (username, accepted) => {
      if (accepted) {
        let roomId = rooms[selectedRoomIndex][0];
        // Go to GamePage
        navigate('/GamePage', { state: { roomId } });

        setShowJoinMessage(false);
      }
      else {
        setShowJoinMessage(false);
        setShowRejectionMessage(true);
      }
    })
  };

  const handleCreateGameClick = () => {
    socket.emit('createRoom', getUsername(), getPassword());
    socket.on('createRoom', (username, roomNumber) => {
      if (username === getUsername()) {
        let roomId = roomNumber;
        // Go to GamePage
        navigate('/GamePage', { state: { roomId } });
      }
    })
  };

  return (
    <div>

      {/* Lobby */}
      <div className="lobby-container">
        <div className="lobby-box">
          <div>
            <button className="player-block" onClick={handleCreateGameClick}>
              <h2>Create game</h2>
            </button>
            <h1>Available rooms:</h1>
            <button onClick={listRooms()}> Reload </button>
            {rooms.map((room, index) => (
              <button key={index} className="player-block" onClick={() => handlePlayerClick(index)}>
                <h2>{room[0]}</h2>
                <p>{room[1]}</p>
              </button>
            ))}
          </div>
        </div>
        {showJoinMessage && (
          <div>
            <Overlay/>
            <TwoButtonPopUp message={`Join room ${rooms[selectedRoomIndex][0]}`} negativeOnClick={() => handleNoClick()} positiveOnClick={() => handleYesClick()} className='message-box'/>
          </div>
        )}
        {showRejectionMessage && (
          <div>
            <Overlay/>
            <MessagePopUp message='The room is already full' onClick={() => setShowRejectionMessage(false)} className='message-box'/>
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
