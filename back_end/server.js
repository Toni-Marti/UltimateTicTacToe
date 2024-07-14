const { EVENTTYPE } = require('./commonsSymbolicLink/socketUtils.js');
const bcrypt = require('bcrypt');
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
        console.log('New message in general chat from', username, ':', msg)
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

    socket.on('signUp', async (newuser) => {
        console.log('Connected')

        let users = []
        try {
            const response = await fetch('http://localhost:9999/users/');
            const data = await response.json();
            
            users = data;
            //console log to insure that use-effect is working properly
            console.log("If Printed, users were loaded.")
        } 
        catch (error) {
            console.error('Error fetching users:', error);
        }
    
        //take the previous
        const highestUserId = users.length > 0 ? Math.max(...users.map(user => parseInt(user.id))) : 0;
        const newUserId = highestUserId + 1;
        
        //hash the password
        const hashedPassword = await bcrypt.hash(String(newuser.pw), 10);
        
        //create the array that will be used to insert into json
        const newUserObj = { id: parseInt(newUserId, 10), userName: newuser.userName, password: hashedPassword };
    
        //call local json server using POST method to submit data 
        fetch('http://localhost:9999/users/', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUserObj)
        }).then(() => {
            //debugging message
            console.log('A new user has been added successfully!')
        });
        })

})

// The server listens on port 4000
server.listen(4000,()=>{
    console.log('Listening to port 4000)');
})