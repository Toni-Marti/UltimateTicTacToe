import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import Chat from './Chat';
import { getUsername, getPassword } from './FrontendCommons';
import './Lobby.css';
import { getServerAddress } from './serverData.js';
import { Overlay, EmptyPopUp, MessagePopUp, TwoButtonPopUp } from './popUps.js';
import { useNavigate } from 'react-router-dom';


// Room is an array that contains elements structured as:
// [player_name, game_rules]
const Lobby = () => { 
  const navigate = useNavigate();

  const [showJoinMessage, setShowJoinMessage] = useState(false);
  const [showRejectionMessage, setShowRejectionMessage] = useState(false);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [rooms, setRooms] = useState([]);

  // Initialize socket connection
  const socket = io(getServerAddress() + ':4000', { autoConnect: false });

  useEffect(() => {
    // Connect socket when component mounts
    socket.connect();

    // Setup event listeners
    const handleListRooms = (r) => {
      setRooms(r);
    };
    socket.on('listRooms', handleListRooms);

    const handleJoinRoom = (username, accepted) => {
      if (accepted) {
        let roomId = rooms[selectedRoomIndex][0];
        navigate('/GamePage', { state: { roomId } });
        setShowJoinMessage(false);
      } else {
        setShowJoinMessage(false);
        setShowRejectionMessage(true);
      }
    };
    socket.on('joinRoom', handleJoinRoom);

    // Cleanup function to remove event listeners and disconnect socket when component unmounts
    return () => {
      socket.off('listRooms', handleListRooms);
      socket.off('joinRoom', handleJoinRoom);
      socket.disconnect();
    };
  }, [navigate, selectedRoomIndex, rooms]);

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
    <div className="Lobby">

      <div className="LobbyGrid">

        <div className="Rooms">
          <div className="RoomsHeader">
            <h1 style={{textAlign:"center"}}>Available rooms: </h1>
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

        <Chat />

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
