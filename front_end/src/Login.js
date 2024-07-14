import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import {Credentials, EVENTTYPE, SocketEvent} from './commonsSymbolicLink/socketUtils.js'

const socket = io('http://localhost:4000')

function Login()
{
    

    return(
        <div>
            ...
        </div>
    );
}

export default Login;