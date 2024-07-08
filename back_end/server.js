const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server,{
    cors:{origin:'*',}
})

// We log the messages and users received in the
// console and broadcast them
io.on('connection', socket =>{
    console.log('Connected')

    socket.on('userName', mydata => {
        console.log('Server received: ', mydata)
        io.emit('userName', mydata)
    })

    socket.on('msg', mydata => {
        console.log('Server received: ', mydata)
        io.emit('msg', mydata)
    })
})

// The server listens on port 4000
server.listen(4000,()=>{
    console.log('Listening to port 4000)');
})