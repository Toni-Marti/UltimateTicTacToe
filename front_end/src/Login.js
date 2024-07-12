import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'

const socket = io('http://localhost:4000')

function Login()
{
    //TO DO Add lobby functionality
    //TO DO Connect to JSON server (locally)

    // TESTEO DE SERVER.JS
    const [roomId, setRoomId] = useState(-1);

    const send = (e) => {
        e.preventDefault();
        console.log("hola")
        socket.emit('findRoom',)
    };

    socket.on('findRoom', roomNumber => {
        setRoomId(roomNumber);
    })

    return(
        <div>
            <button onClick={send}>
                Send
            </button>
            <div> Room number: {roomId} </div>
        </div>
    );
}

export default Login;