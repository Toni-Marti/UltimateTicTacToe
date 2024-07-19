
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import {Credentials, EVENTTYPE, SocketEvent} from './commonsSymbolicLink/socketUtils.js'
import {getUsername, setUsername, getPassword, setPassword} from './FrontendCommons.js'
import { getServerAddress } from './serverData.js'


function Login({socket})
{
    
    const [users, setUsers] = useState([]);
    const [pw, setPw] = useState("");
    const [un, setUn] = useState("");
    const [message, setMessage] = useState("");

    const send = (e) => {
        e.preventDefault()
        socket.emit('login', {un, pw})
    };
    
    
    useEffect(() => {
        socket.on('loginSuccess', data => {
            console.log("Hello")
            setMessage(data.message)
            setUsername(un)
            setPassword(pw)
            console.log(data.message)
        });
        socket.on('loginFailed', data => {
            setMessage(data.message)
        });
        //clean up socket listener when component unmounts
        return () => {
            socket.off('loginSuccess');
            socket.off('loginFailed');
        };
    },  []);

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