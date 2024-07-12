// Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:4000');

const Chat = () => {
    const [msg, setMsg] = useState('');
    const [chat, setChat] = useState([]);

    useEffect(() => {
        socket.on('msg', myData => {
            setChat(prevChat => [...prevChat, myData.msg]);
        });

        return () => {
            socket.off('msg'); 
        };
    }, []);

    const send = (e) => {
        e.preventDefault();
        socket.emit('msg', { msg });
        setMsg(''); 
    };    

    return (
        <div className="chat-container">
            <div className="chat-box">
                <div className="chatMsg">
                    <div className="chatBcg">
                        {chat.map((message, index) => (
                        <div key={index} className="msg">
                            <span>
                                {message}
                            </span>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="smol-chat-box">
                <form onSubmit={send} className="inputMsg">
                    <input
                        className="input"
                        type="text"
                        required
                        placeholder="Type your message..."
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                    />
                    <button type="submit" className="send-button">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;