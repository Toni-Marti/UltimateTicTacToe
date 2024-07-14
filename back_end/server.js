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
    let rooms = [1, 2,3,4,5,6];

    console.log('Connected')

    socket.on('findRoom', (username, password) => {
        console.log('This user was added to a room: ', username)
        roomNumber = roomNumber+1;
        rooms.push(roomNumber);
        io.emit('findRoom', roomNumber)

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