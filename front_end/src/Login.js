
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
    const [un, setUn] = useState(""); 

    const send = (e) => {
        e.preventDefault();
        socket.emit('verifyId', {un,pw})
      };
    
    socket.on('loginSuccess', data => {
        setUsername(data.userName)
        setPassword(pw)
        setMessage(data.message)
        console.log(data.message)
    });
    socket.on('loginFailed', message => {
        setMessage(message)
    });
    
    useEffect(() => {
        //clean up socket listener when component unmounts
        return () => {
            socket.off('loginSuccess');
        };
    });

    return(
        <div className='Login'>
            <h1>Login:</h1>
            <h1>{message}</h1>
            <form onSubmit={send} className="chat">
                <input
                    type="text"
                    placeholder={"Username"}
                    name="userName"
                    value={un}
                    onChange={(e) => setUn(e.target.value)}
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