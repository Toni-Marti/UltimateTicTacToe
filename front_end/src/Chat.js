import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import {getUsername, getPassword} from './FrontendCommons.js'
import { getServerAddress } from './serverData.js'

const socket = io( getServerAddress() + ':4000' )

function Chat(roomId = 0) {
  // communicationId will be 'generalChat' or the number of the room
  // if we are in a private room
  let communicationId = 'generalChat';
  if (roomId !== 0){
    let communicationId = roomId;
  }

  // Variables for saving the message and message list
  const [msg, setMsg] = useState('')
  const [chat, setChat] = useState([])

  // Each time the website is updated, we add
  // the new message with its user name to the chat
  useEffect(() => {
    socket.on(communicationId, (userName, msg) => {
      setChat([...chat, {userName, msg}])
    })
  })

  // We show through the console the message
  // with its user name and send them to the server
  const send = (e) => {
    e.preventDefault();
    socket.emit(communicationId, getUsername(), getPassword(), msg)
    setMsg('')
  };

  // We display the form to enter the user name and
  // message, and display the chat with the message history
  return (
    <div>
      <div class="App">
        <h1>General chat</h1>
        <form onSubmit={send} className="chat">
          <input type="text" required placeholder="Message here..." 
            name="msg" value={msg} onChange={(e) => setMsg(e.target.value)} 
          />
          <br />
          <button type='submit'>Send</button>
        </form>
      </div>

      <div class="chatMsg">
        {chat.map((myData, index)=>{
          return(
            <p class='chatEntry' key={index}><span class='userName'>{myData.userName}:</span> <span class="msg">{myData.msg}</span></p>
          )
        })}
      </div>
    </div>
  );
}

export default Chat;
