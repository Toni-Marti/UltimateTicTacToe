import React, { useState, useEffect } from 'react';
import "./FormPage.css"
import { PAGES } from './App.js';


function SignUp({socket, changePage}) {
    
    const [message, setMessage] = useState("");
    const [checkpw, setCheckPw] = useState("");
    const [pw, setPw] = useState("");
    const [un, setUn] = useState(""); 

    const send = (e) => {
        e.preventDefault();
        socket.emit('signUp',{un,pw,checkpw})
        console.log('Emitted')
    };
    
    useEffect(() => {
        socket.on('signupSuccess', data => {
            setMessage(data.message)
            console.log(data.message)
        });
        socket.on('signupFailed', data => {
            setMessage(data.message)
        });
        return () => {
            socket.off('signupSuccess');
            socket.off('signupFailed');
        }
    }, []);
    

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
            <p style={{ textAlign: 'center' }}>Already have a user? <span className='link' onClick={() => changePage(PAGES.LOGIN)}>Log In</span></p>
        </div>
    );
}

export default SignUp;
