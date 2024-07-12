import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'

const socket = io('http://localhost:4000')

function Login()
{
    //TO DO Add lobby functionality
    //TO DO Connect to JSON server (locally)


    // SERVER.JS (THIS CODE IS TEMPORAL AND ONLY TO TEST SERVER.JS)
    const [roomId, setRoomId] = useState(-1);

    const [username, setUsername] = useState('usernameExample')
    const [password, setPassword] = useState('passwordExample')
    const [eventType, setEventType] = useState('')
    const [event, setEvent] = useState('')

    const findRoom = (e) => {
        e.preventDefault();
        socket.emit('findRoom', username)
    };

    socket.on('findRoom', roomNumber => {
        setRoomId(roomNumber);
    })

    const sendEvent = (e) => {
        e.preventDefault();
        socket.emit('roomNumber', [username, password, eventType, event])
    };

    socket.on('roomNumber', event => {
        console.log("eventType: ", event.eventType, "event: ", event.event)
    })

    return(
        <div>
            {roomId === -1 && (<button onClick={findRoom}> Find room </button>)}
            {roomId !== -1 && (<div> Room number: {roomId} </div>)}

            <form onSubmit={sendEvent}>
                <input type="text" required placeholder="Event type..."
                    name="eventType" value={eventType} onChange={(e) => setEventType(e.target.value)}
                />
                <br />
                <input type="text" required placeholder="Event..."
                    name="event" value={event} onChange={(e) => setEvent(e.target.value)}
                />
                <br />
                <button type='submit'>Send</button>
            </form>
        </div>
    );
}

export default Login;