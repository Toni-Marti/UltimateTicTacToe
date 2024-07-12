const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server,{
    cors:{origin:'*',}
})

// We log the messages and users received in the
// console and broadcast them
io.on('connection', socket =>{
    let roomCounter = 0;
    let rooms = [];

    console.log('Connected')

    socket.on('findRoom', mydata => {
        console.log('Server received: ', mydata)
        roomCounter = roomCounter+1;
        rooms.push(roomCounter);
        io.emit('findRoom', roomCounter)
    })

    for (var i=0; i<rooms.length; i++){
        socket.on(room[i], mydata => {
            console.log('Server received data from: ', mydata)
            io.emit('msg', mydata)
        })
    }
})

// The server listens on port 4000
server.listen(4000,()=>{
    console.log('Listening to port 4000)');
})