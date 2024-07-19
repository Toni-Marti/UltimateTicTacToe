
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import {Credentials, EVENTTYPE, SocketEvent} from './commonsSymbolicLink/socketUtils.js'
import {getUsername, setUsername, getPassword, setPassword} from './FrontendCommons.js'
import { getServerAddress } from './serverData.js'
import "./FormPage.css"
import { PAGES } from './App.js';


function Login({socket, changePage})
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
            setUsername('guest')
            setPassword('')
            setMessage(data.message)
        });
        //clean up socket listener when component unmounts
        return () => {
            socket.off('loginSuccess');
            socket.off('loginFailed');
        };
    },  []);

    return(
        <div className='Login FormPage'>
            <h1>Log In:</h1>
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
            <p style={{ textAlign: 'center' }}>Don't have a user? <span className='link' onClick={() => changePage(PAGES.SIGNUP)}>Sing Up</span></p>
        </div>
    );
}

export default Login;