import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import {Credentials, EVENTTYPE, SocketEvent} from './commonsSymbolicLink/socketUtils.js'
import {getUsername, setUsername, getPassword, setPassword} from './Credentials.js'

const socket = io('http://localhost:4000')

function TestPage()
{
    // SERVER.JS (THIS CODE IS TEMPORAL AND ONLY TO TEST SERVER.JS)

    setUsername('paco')

    const [roomId, setRoomId] = useState(-1);
    let credentials = new Credentials();
    let socketEvent = new SocketEvent();
    const [eventType, setEventType] = useState(EVENTTYPE.NONE);
    const [event, setEvent] = useState('');

    const findRoom = (e) => {
        e.preventDefault();
        socket.emit('findRoom', credentials)
    };

    socket.on('findRoom', roomNumber => {
        setRoomId(roomNumber);
    })

    const sendEvent = (e) => {
        e.preventDefault();
        socketEvent.eventType = eventType;
        socketEvent.event = event;
        socket.emit(roomId, socketEvent)
    };

    socket.on(roomId, socketEvent => {
        console.log("eventType: ", socketEvent.eventType, "event: ", socketEvent.event)
    })

    return(
        <div>
            The username is: {getUsername()}
            <br/>

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

export default TestPage;