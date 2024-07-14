import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import { getServerAddress } from './serverData.js'

const socket = io( getServerAddress() + ':4000' )

function SignUp() {

    const [pw, setPw] = useState("");
    const [un, setUn] = useState(""); 

    const send = (e) => {
        e.preventDefault();
        socket.emit('signUp',{un,pw})
        console.log('Emitted')
      };
    

    return(
        <div className='SignUp'>
            <h1>Sign-Up:</h1>
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;
