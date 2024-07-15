import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { getUsername, getPassword } from './FrontendCommons.js';
import { getServerAddress } from './serverData.js';
import './Chat.css';
import { EVENTTYPE } from './commonsSymbolicLink/socketUtils.js';

const socket = io(getServerAddress() + ':4000');

function Chat({className, roomId = 0 }) {
  // communicationId will be 'generalChat' or the number of the room
  // if we are in a private room
  let communicationId = 'generalChat';
  if (roomId !== 0) {
    communicationId = roomId;
  }

  // Variables for saving the message and message list
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);

  // Each time the website is updated, we add
  // the new message with its user name to the chat
  useEffect(() => {
    socket.on(communicationId, (userName, eventType, msg) => {
      if (eventType === EVENTTYPE.CHAT){
        setChat([...chat, { userName, msg }]);
      }
    });
  });

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // We show through the console the message
  // with its user name and send them to the server
  const send = (e) => {
    e.preventDefault();
    socket.emit(communicationId, getUsername(), getPassword(), EVENTTYPE.CHAT, msg);
    setMsg('');
  };

  // We display the form to enter the user name and
  // message, and display the chat with the message history
  return (
    <div className={"Chat " + className}>

      <div className='MessagesHeader'>
        <h2 style={{textAlign:"center"}}>Chat: </h2>
      </div>

      <div className="Messages">
        {chat.map((myData, index) => (
          <p className={"MessageEntry "  + (myData.userName === getUsername() ? 'MyMessage' : '')} key={index}>
            <span className={"UserName"}>{myData.userName}</span>
            <span className="msg">: {myData.msg}</span>
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={send} className="NewMessage">
        <input
          className='MessageInput'
          type="text"
          required
          placeholder="Message here..."
          name="msg"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button type="submit" className='SendButton'>Send</button>
      </form>

    </div>
  );
}

export default Chat;

