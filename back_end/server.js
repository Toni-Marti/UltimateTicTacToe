const { EVENTTYPE } = require('./commonsSymbolicLink/socketUtils.js');

const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server,{
    cors:{origin:'*',}
})

// We log the messages and users received in the
// console and broadcast them
io.on('connection', socket =>{
    let roomNumber = 0;
    let rooms = [];

    console.log('Connected')

    socket.on('generalChat', (username, password, msg) => {
        console.log('New message in general chat from', username, ': ', msg)
        io.emit('generalChat', username, msg)
    })

    socket.on('findRoom', (username, password) => {
        roomNumber = roomNumber+1;
        rooms.push(roomNumber);
        io.emit('findRoom', username, roomNumber)
        console.log('The user', username, 'was added to the room:', roomNumber)

        subscribeToRoom(roomNumber);
    })

    function subscribeToRoom(roomNumber) {
        socket.on(roomNumber, (username, password, eventType, event) => {
            console.log('Server received an event with the content: ', event);
            io.emit(roomNumber, eventType, event);
        });
    }
})

// The server listens on port 4000
server.listen(4000,()=>{
    console.log('Listening to port 4000)');
})