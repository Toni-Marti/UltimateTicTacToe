
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import {Credentials, EVENTTYPE, SocketEvent} from './commonsSymbolicLink/socketUtils.js'
import {getUsername, setUsername, getPassword, setPassword} from './FrontendCommons.js'
import { getServerAddress } from './serverData.js'

const socket = io( getServerAddress() + ':4000' )

function Login()
{
    
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [pw, setPw] = useState("");
    const [userName, setUserName] = useState(""); 

    const send = (e) => {
        e.preventDefault();
        socket.emit('login',{userName,pw})
      };
    
    return(
        <div className='Login'>
            <h1>Sign-Up:</h1>
            <form onSubmit={send} className="chat">
                <input
                    type="text"
                    placeholder={"Username"}
                    name="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <input
                    type="password"
                    placeholder={"Password"}
                    name="msg"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;