import React, { useState, useEffect } from 'react';
import { Overlay, MessagePopUp } from './popUps.js';
import { PAGES } from './App.js';

import "./FormPage.css"


function SignUp({socket, changePage, setUserName, setPassword}) {
    const [message, setMessage] = useState("");
    const [checkpw, setCheckPw] = useState("");
    const [pw, setPw] = useState("");
    const [un, setUn] = useState("");
    const [changePageAfterPopUp, setChangePageAfterPopUp] = useState(false);

    const send = (e) => {
        e.preventDefault();
        socket.emit('signUp',{un,pw,checkpw})
        socket.once('signupSuccess', data => {
            console.log("Sing in: ", un, pw);
            setUserName(un);
            setPassword(pw);
            setMessage("Successfully signed in!")
            setChangePageAfterPopUp(true);
            socket.off('signupFailed');
        });
        socket.once('signupFailed', data => {
            setPw("")
            setCheckPw("")
            setMessage(data.message)
            socket.off('signupSuccess');
        });
    };

    return(
        <div className='SignUp FormPage'>
            <h1>Sign Up:</h1>
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
                    name="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                />
                <input
                    type="password"
                    placeholder={"Re-enter Password"}
                    name="checkPassword"
                    value={checkpw}
                    onChange={(e) => setCheckPw(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
            <p style={{ textAlign: 'center' }}>Already have a account? <span className='link' onClick={() => changePage(PAGES.LOGIN)}>Log In</span></p>
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

export default SignUp;
