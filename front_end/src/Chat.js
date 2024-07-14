import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { getUsername, getPassword } from './FrontendCommons.js';
import { getServerAddress } from './serverData.js';
import './Chat.css';
import { EVENTTYPE } from './commonsSymbolicLink/socketUtils.js';

const socket = io(getServerAddress() + ':4000');

function Chat({ roomId = 0 }) {
  let communicationId = 'generalChat';
  if (roomId !== 0) {
    communicationId = roomId; 
  }

  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    socket.on(communicationId, (userName, msg) => {
      setChat([...chat, { userName, msg }]);
    });
  });

  useEffect(() => {
    scrollToBottom(); 
  }, [chat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const send = (e) => {
    e.preventDefault();
    socket.emit(communicationId, getUsername(), getPassword(), EVENTTYPE.CHAT, msg);
    setMsg('');
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chatMsg">
          {chat.map((myData, index) => (
            <p className="chatEntry" key={index}>
              <span className="userName">{myData.userName}:</span>
              <span className="msg">{myData.msg}</span>
            </p>
          ))}
          <div ref={messagesEndRef} /> 
        </div>
        <form onSubmit={send} className="chat">
          <input
            type="text"
            required
            placeholder="Message here..."
            name="msg"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
