import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat({className, socket, roomId = 0, userName, password}) {
  // Variables for saving the message and message list
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on(roomId, (userName, msg) => {
      setChat((prev) => [...prev, { userName, msg }]);
    })

    return () => {
      socket.off(roomId);
    }
  }, []);

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
    console.log(roomId, userName, msg);
    socket.emit("message", roomId, userName, msg);
    setMsg('');
  };

  // We display the form to enter the user name and
  // message, and display the chat with the message history
  return (
    <div className={"Chat " + className}>

      <div className='MessagesHeader'>
        <h2 style={{textAlign:"center"}}>Chat</h2>
      </div>

      <div className="Messages">
        {chat.map((myData, index) => (
          <p className={"MessageEntry "  + (myData.userName === userName ? 'MyMessage' : '')} key={index}>
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

