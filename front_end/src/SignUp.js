import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';

const socket = io('http://localhost:4000')

function SignUp() {

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [pw, setPw] = useState("");
    const [userName, setUserName] = useState(""); 

    const send = (e) => {
        e.preventDefault();
        socket.emit('signUp',{userName,pw})
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;
