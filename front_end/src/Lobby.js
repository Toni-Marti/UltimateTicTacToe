import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import Chat from './Chat';
import { getServerAddress } from './serverData.js';
import { Overlay, EmptyPopUp, MessagePopUp, TwoButtonPopUp } from './popUps.js';
import { PAGES } from './App.js';
import { Game, Board } from './commonsSymbolicLink/gameLogic.js';
import { BoardSelection, GameR } from './gameComponents.js';
import User from './User.js';

import './Lobby.css';

// Room is an array that contains elements structured as:
// [player_name, game_rules]
function Lobby({socket, changePage, userName, password, setGameRoom}) {
  const [joinMessage, setJoinMessage] = useState(null);
  const [rooms, setRooms] = useState({});
  const [myRoom, setMyRoom] = useState(null);
  const [selectingBoard, setSelectingBoard] = useState(null);
  const [playerPopUp, setPlayerPopUp] = useState(null);
  const [closeMyRoom, setCloseMyRoom] = useState(null);
  const [couldnJoin, setCouldnJoin] = useState(null);

  useEffect(() => {
    socket.once('listRooms', (rooms) => processRooms(rooms));
    socket.emit('listRooms');
    socket.on("newRoom", (owner, Board) => {addRoom(owner, Board)});
    socket.on("deleteRoom", (owner) => {deleteRoom(owner)});

    // Cleanup function to remove event listeners and disconnect socket when component unmounts
    return () => {
      socket.off('listRooms');
      socket.off('newRoom');
      socket.off('deleteRoom');
    };
  }, []);

  function processRooms(rooms) {
    const otherRooms = {};
    for (let room of rooms) {
      let owner = room[0];
      let board = Board.fromJSON(room[1]);
      if (owner !== userName) {
        otherRooms[owner] = board;
      }
      else {
        setMyRoom(board);
      }
    }
    setRooms(otherRooms);
  }

  function addRoom(owner, board_json) {
    let board = Board.fromJSON(board_json);
    if (owner === userName) {
      setMyRoom(Board.fromJSON(board));
    }
    else {
      let newRooms = {...rooms};
      newRooms[owner] = board;
      setRooms(newRooms);
    }
  }

  function deleteRoom(owner) {
    if (owner === userName) {
      setMyRoom(null);
    }
    else {
      let newRooms = {...rooms};
      delete newRooms[owner];
      setRooms(newRooms);
    }
  }

  function boardSelected(board) {
    socket.emit('createRoom', userName, password, Board.toJSON(board));
    socket.once('joinRoom', (room) => {
      setGameRoom(room);
      changePage(PAGES.GAMEPAGE);
    })
    setSelectingBoard(null);
  }

  function joinPopUpYes(owner) {
    socket.emit('joinRoom', userName, password, owner);
    socket.once('joinRoom', (room) => {
      if (room === false) {
        setCouldnJoin(
          <div>
            <Overlay/>
            <MessagePopUp message="Couldn't join room" onClick={setCouldnJoin(null)}/>
          </div>
        )
      }
      else {
        socket.emit('deleteMyRoom', { userName, password });
        setGameRoom(room);
        changePage(PAGES.GAMEPAGE);
      }
    });
    setJoinMessage(null);
  }

  const joinMessagePopUp = (owner) =>
  <div>
    <Overlay/>
    <TwoButtonPopUp negativeOnClick={() => setJoinMessage(null)} positiveOnClick={() => joinPopUpYes(owner)} className='message-box'>Play against  {owner}?</TwoButtonPopUp>
  </div>;

  const closeMyRoomPopUp =
  <div>
    <Overlay/>
    <TwoButtonPopUp negativeOnClick={() => setCloseMyRoom(null)} positiveOnClick={() => {socket.emit("deleteMyRoom", userName, password); setCloseMyRoom(null)}} className='message-box'>Close your room?</TwoButtonPopUp>
  </div>;
  
  const selectingBoartPopUp = 
  <div>
    <Overlay onClick={()=>setSelectingBoard(null)}/>
    <EmptyPopUp>
      <BoardSelection setBoard={boardSelected}></BoardSelection>
    </EmptyPopUp>
  </div>;

  return (
    <div className="Lobby">

      <div className="LobbyGrid">

        <div className="Rooms">
          <div className="RoomsHeader">
            <h1 style={{textAlign:"center"}}>Available rooms</h1>
            <button onClick={() => changePage(PAGES.LOCALMODE)}>Local Mode</button>
            <button className="CreateGameButton" style={{fontSize:"x-large"}} onClick={() => setSelectingBoard(selectingBoartPopUp)}><p>Create game</p></button>
          </div>
          <div className="RoomList">
            {myRoom !== null && 
              <button key={userName} id="myRoom" className="Room" style={{display: 'flex', flexDirection:"column",  justifyContent: 'center', alignItems: 'center'}} onClick={() => setCloseMyRoom(closeMyRoomPopUp)}>
                <User userName={userName} setPopUp={setPlayerPopUp} size='xx-large' socket={socket}>{userName}</User>
                <br/>
                <div style={{width:"200px"}}>
                  <GameR isMyTyrn={false} game={new Game(myRoom)}/>
                </div>
              </button>}
            {Object.entries(rooms).map(([owner, board]) => (
              <button key={owner} className="Room" style={{display: 'flex', flexDirection:"column",  justifyContent: 'center', alignItems: 'center'}} onClick={() => setJoinMessage(() => joinMessagePopUp(owner))}>
                <User userName={userName} setPopUp={setPlayerPopUp} size='xx-large' socket={socket}>{owner}</User>
                <br/>
                <div style={{width:"200px"}}>
                  <GameR isMyTyrn={false} game={new Game(board)}/>
                </div>
              </button>
            ))}
          </div>
        </div>
        <Chat socket={socket} roomId={0} userName={userName} password={password}/>

      </div>

      {closeMyRoom}
      {couldnJoin}
      {playerPopUp}
      {joinMessage}
      {selectingBoard}
    </div>
  );
};

export default Lobby;
