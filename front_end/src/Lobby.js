import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import Chat from './Chat';
import { getUsername, getPassword } from './FrontendCommons';
import './Lobby.css';
import { getServerAddress } from './serverData.js';
import { Overlay, EmptyPopUp, MessagePopUp, TwoButtonPopUp } from './popUps.js';


// Room is an array that contains elements structured as:
// [player_name, game_rules]
function Lobby({socket}) {

  const [showJoinMessage, setShowJoinMessage] = useState(false);
  const [showRejectionMessage, setShowRejectionMessage] = useState(false);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const handleListRooms = (r) => {
      setRooms(r);
    };
    
    const handleJoinRoom = (username, accepted) => {
      if (accepted) {
        let roomId = rooms[selectedRoomIndex][0];
        setShowJoinMessage(false);
      } else {
        setShowJoinMessage(false);
        setShowRejectionMessage(true);
      }
    };

    const handleCreateRoom = (username, roomNumber) => {
      if (username === getUsername()) {
        let roomId = roomNumber;
      }
    };

    socket.on('listRooms', handleListRooms);
    socket.on('joinRoom', handleJoinRoom);
    socket.on('createRoom', handleCreateRoom)

    // Cleanup function to remove event listeners and disconnect socket when component unmounts
    return () => {
      socket.off('listRooms', handleListRooms);
      socket.off('joinRoom', handleJoinRoom);
      socket.off('createRoom', handleCreateRoom);
    };
  }, []);

  const listRooms = () => {
    socket.emit('listRooms');
  };

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
  };

  const handleCreateGameClick = () => {
    socket.emit('createRoom', getUsername(), getPassword());
  };

  return (
    <div className="Lobby">

      <div className="LobbyGrid">

        <div className="Rooms">
          <div className="RoomsHeader">
            <h1 style={{textAlign:"center"}}>Available rooms</h1>
            <button onClick={listRooms()}> Reload rooms </button>
          </div>
          <div className="RoomList">
            <button className="CreateGameButton" style={{fontSize:"x-large"}} onClick={handleCreateGameClick}><p>Create game</p></button>
            {rooms.map((room, index) => (
            <button key={index} className="Room" onClick={() => handlePlayerClick(index)}>
              <h2>{room[0]}</h2>
              <p>{room[1]}</p>
            </button>
            ))}
          </div>
        </div>

        <Chat socket={socket}/>

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
  );
};

export default Lobby;
