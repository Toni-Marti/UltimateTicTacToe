import React, { useState, useEffect } from 'react';

function SignUp({socket}) {
    
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
        <div className='SignUp'>
            <h1>Sign-Up:</h1>
            <p>{message}</p>
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
        </div>
    );
}

export default SignUp;
