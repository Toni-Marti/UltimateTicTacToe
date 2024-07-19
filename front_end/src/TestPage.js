import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import {EVENTTYPE} from './commonsSymbolicLink/socketUtils.js'
import { getServerAddress } from './serverData.js'

function TestPage({socket})
{
    // SERVER.JS (THIS CODE IS TEMPORAL AND ONLY TO TEST SERVER.JS)

    // setUsername('paco')

    // const [roomId, setRoomId] = useState(-1);
    // const [prevRoomId, setPrevRoomId] = useState(roomId);
    // const [eventType, setEventType] = useState(EVENTTYPE.NONE);
    // const [event, setEvent] = useState('');


    // useEffect(() => {
    //     socket.on('createRoom', (username, roomNumber) => {
    //         if (username === getUsername()){
    //             setRoomId(roomNumber);
    //         }
    //     })

    //     socket.on(roomId, (eventType, event) => {
    //         console.log("eventType: ", eventType, "event: ", event)
    //     })

    //     return () => {
    //         socket.off('createRoom');
    //         socket.off(prevRoomId);
    //         setPrevRoomId(roomId);
    //     }
    // }, [roomId]);


    // const createRoom = (e) => {
    //     e.preventDefault();
    //     socket.emit('createRoom', getUsername(), getPassword())
    // };

    // const sendEvent = (e) => {
    //     e.preventDefault();
    //     socket.emit(roomId, getUsername(), getPassword(), eventType, event)
    // };

    // return(
    //     <div>
    //         The username is: {getUsername()}
    //         <br/>

    //         {roomId === -1 && (<button onClick={createRoom}> Find room </button>)}
    //         {roomId !== -1 && (<div> Room number: {roomId} </div>)}

    //         <form onSubmit={sendEvent}>
    //             <input type="text" required placeholder="Event type..."
    //                 name="eventType" value={eventType} onChange={(e) => setEventType(e.target.value)}
    //             />
    //             <br />
    //             <input type="text" required placeholder="Event..."
    //                 name="event" value={event} onChange={(e) => setEvent(e.target.value)}
    //             />
    //             <br />
    //             <button type='submit'>Send</button>
    //         </form>
    //     </div>
    // );
}

export default TestPage;