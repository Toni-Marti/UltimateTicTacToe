
import React, { useState, useEffect } from 'react';
import { Overlay, MessagePopUp } from './popUps.js';
import { PAGES } from './App.js';

import "./FormPage.css"


function Login({socket, changePage, setUserName, setPassword}) {
    const [pw, setPw] = useState("");
    const [un, setUn] = useState("");
    const [message, setMessage] = useState("");
    const [changePageAfterPopUp, setChangePageAfterPopUp] = useState(false);

    const send = (e) => {
        e.preventDefault()
        socket.emit('login', {un, pw})
    };
    
    
    useEffect(() => {
        socket.on('loginSuccess', data => {
            setUserName(un)
            setPassword(pw)
            setMessage("Successfully loged in!")
            setChangePageAfterPopUp(true);
        });
        socket.on('loginFailed', data => {
            setMessage(data.message)
        });
        //clean up socket listener when component unmounts
        return () => {
            socket.off('loginSuccess');
            socket.off('loginFailed');
        };
    },  [un, pw]);

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
            {message != "" && <>
                <Overlay />
                <MessagePopUp children={message} onClick={() => {
                    setMessage("")
                    if(changePageAfterPopUp){
                        changePage(PAGES.LOBBY);
                        setChangePageAfterPopUp(false);
                    }
                    }} />
            </>}
        </div>
    );
}

export default Login;