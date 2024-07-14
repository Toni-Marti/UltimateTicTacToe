import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import {EVENTTYPE} from './commonsSymbolicLink/socketUtils.js'
import {getUsername, getPassword} from './FrontendCommons.js'
import { getServerAddress } from './serverData.js'
import gameComponent from './gameComponents.js'
import Chat from './Chat.js'

const socket = io( getServerAddress() + ':4000' )

function GamePage(roomId)
{
    /*const [roomId, setRoomId] = useState(-1);
    const [eventType, setEventType] = useState(EVENTTYPE.NONE);
    const [event, setEvent] = useState('');

    const findRoom = (e) => {
        e.preventDefault();
        socket.emit('findRoom', getUsername(), getPassword())
    };

    socket.on('findRoom', (username, roomNumber) => {
        if (username === getUsername()){
            setRoomId(roomNumber);
        }
    })

    const sendEvent = (e) => {
        e.preventDefault();
        socket.emit(roomId, getUsername(), getPassword(), eventType, event)
    };

    socket.on(roomId, (eventType, event) => {
        console.log("eventType: ", eventType, "event: ", event)
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
    );*/
}

export default GamePage;