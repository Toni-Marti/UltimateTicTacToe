const { execPath } = require('process');
const { EVENTTYPE } = require('./commonsSymbolicLink/socketUtils.js');
const bcrypt = require('bcrypt');
const { error } = require('console');
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

    socket.on('generalChat', (username, password, eventType, event) => {
        console.log('New message in general chat from', username, ':', event)
        io.emit('generalChat', username, event)
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
        
        //initialize game statistics
        const gameStats = {wins: 0, losses: 0, ties: 0}

        //create the array that will be used to insert into json
        const newUserObj = { id: parseInt(newUserId, 10), username: newuser.un, password: hashedPassword, gameStats: gameStats };
        

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

        // Handle user login
        socket.on('verifyId', async (user) => {
            console.log('Server received:', user);

            let users = [];
            try {
                const response = await fetch('http://localhost:9999/users/');
                const data = await response.json();
                
                users = data;
                //console log to ensure that users were loaded
                console.log("If Printed, users were loaded.");
            } 
            catch (error) {
                console.error('Error fetching users:', error);
            }

            const foundUser = users.find(u => u.username === user.un);
            
            let message = ""

            if (foundUser) {
                const isPasswordMatch = await bcrypt.compare(String(user.pw), foundUser.password);
                if (isPasswordMatch) {
                    message = "Logged In!"
                    console.log(message)
                    io.emit('loginSuccess', {
                        id: foundUser.id,
                        username: foundUser.username,
                        gameStats: foundUser.gameStats,
                        message: message
                    });
                } else {
                    message = 'Incorrect password'
                    console.log(message)
                    io.emit('loginFailed', message );
                }
            } 
            else {
                message = 'User not found'
                console.log(message)
                io.emit('loginFailed', message);
            }

    })
})

// The server listens on port 4000
server.listen(4000,()=>{
    console.log('Listening to port 4000)');
})