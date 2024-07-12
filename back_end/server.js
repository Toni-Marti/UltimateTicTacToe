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

    socket.on('findRoom', mydata => {
        console.log('Server received: ', mydata)
        roomNumber = roomNumber+1;
        rooms.push(roomNumber);
        io.emit('findRoom', roomNumber)
    })

    for (var i=0; i<rooms.length; i++){
        socket.on(rooms[i], mydata => {
            console.log('Server received data from: ', mydata)
            io.emit(rooms[i], mydata)
        })
    }
})

// The server listens on port 4000
server.listen(4000,()=>{
    console.log('Listening to port 4000)');
})