import { Game } from './commonsSymbolicLink/gameLogic.js';
const { execPath, emit } = require('process');
const { EVENTTYPE } = require('./commonsSymbolicLink/socketUtils.js');
const bcrypt = require('bcrypt');
const { error } = require('console');
const { hostname } = require('os');
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server,{
    cors:{origin:'*',}
})

// Key: [board, host_socket]
let avialebleRooms = {}

// Key: [player1_socket, player2_socket, player1_ready, player2_ready, game]
let rooms = {}
let next_room = 1;

async function hashPassword(pw) {
    const hashedPassword = await bcrypt.hash(String(pw), 10);
    return hashedPassword;
}

// We log the messages and users received in the
// console and broadcast them
io.on('connection', socket =>{
    console.log('New conection on the server')

    // socket.on('generalChat', (username, password, eventType, event) => {
    //     console.log('New message in general chat from', username, ':', event)
    //     io.emit('generalChat', username, eventType, event)
    // })

    // socket.on('createRoom', (username, password) => {
    //     let roomNumber = 1;
    //     while (rooms.some(room => room[0] === roomNumber)) {
    //         roomNumber = roomNumber+1;
    //     }
    //     rooms.push([roomNumber, username]);
    //     io.emit('createRoom', username, roomNumber)
    //     console.log('The user', username, 'created the room:', roomNumber)

    //     subscribeToRoom(roomNumber);
    // })

    // socket.on('joinRoom', (username, password, roomNumber) => {
    //     if (rooms.some(room => room[0] === roomNumber)){
    //         io.emit('joinRoom', username, true);
    //         // It deletes the room with the id roomNumber
    //         rooms = rooms.filter(room => room[0] !== roomNumber);
    //     }
    //     else {
    //         io.emit('joinRoom', username, false)
    //     }
    // })
    // function subscribeToRoom(roomNumber) {
    //     socket.on(roomNumber, (username, password, eventType, event) => {
    //         if (eventType === EVENTTYPE.CHAT) {
    //             console.log('New message in private chat in room', roomNumber, 'from', username, ':', event)
    //             io.emit(roomNumber, username, eventType, event)
    //         }
    //         else if (eventType === EVENTTYPE.ACTION) {
    //             io.emit(roomNumber, username, eventType, event);
    //         }
    //     });
    // }

    socket.on('listRooms', () => {
        socket.emit('listRooms', avialebleRooms.map(([key, value]) => [key, value[0]]));
    })

    socket.on('createRoom', (username, password, board) => {
        avialebleRooms[username] = board;
        io.emit('newRoom', username, board);
        socket.on('disconnect', () => {
            delete avialebleRooms[username];
            io.emit('deleteRoom', username);
        })
    })

    socket.on('joinRoom', (username, password, host_name) => {
        room = avialebleRooms[host_name];
        if (room !== undefined) {
            socket.emit('canJoin', true, next_room);
            avialebleRooms[host_name][1].emit('playerJoined');
            rooms[next_room] = [socket, avialebleRooms[host_name][1], false, false, new Game()];
            next_room++;
            delete avialebleRooms[host_name];
            io.emit('deleteRoom', host_name);
        }
        else {
            socket.emit('canJoin', false);
        }
    })



    async function fetchUsers() {
        let users = [];
        try {
            const response = await fetch('http://localhost:9999/users/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Response status:", response.status);
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
    
            users = Array.isArray(data) ? data : [];
        } catch (error) {
            console.log('Error fetching users:', error);
        }
        return users;
    }
    

    //verify user
    async function verifyCredentials(un, pw) {
        let verified = false
        let users = await fetchUsers();
        hashedPassword = await hashPassword(pw)
        foundUser = users.some(u => u.username === un)

        if (foundUser) {
            const thisuser = users.find(u => u.username === un);
            const passwordMatch = await bcrypt.compare(pw, thisuser.password); // Compare the passwords
            if (passwordMatch) {
                verified = true
            }
        }
        
        return verified;        
    }

    //account creation: verify valid user info input
    async function validCredentials(un, pw, checkpw) {
        let message = "";
        let validpass = false;
        let validuser = false;
        let users = await fetchUsers();
        let foundUser = users.some(user => user.username === un);
    
        // Check username
        if (un.length >= 3 && un.length <= 20 && /^[a-zA-Z0-9_.]+$/.test(un) && !foundUser) {
            validuser = true;
        } else {
            message = message + "Username is invalid. "
            if (foundUser) {
                message = message + "Username is already taken. ";
            } else {
                message = message + "Username must be 3-20 characters long and can only contain alphanumeric characters, underscores, and periods. ";
            }
        }
        
        let samePass = pw === checkpw;
        let underEightChar = pw.length >= 8
        let pwCharVerified = (
            /[A-Z]/.test(pw) && 
            /[a-z]/.test(pw) && 
            /\d/.test(pw) && 
            /[^A-Za-z0-9]/.test(pw) &&
            !(/\s/.test(pw))
        )

        // Check password
        if (
            samePass &&
            underEightChar &&
            pwCharVerified
        ) {
            validpass = true;
        } 
        else {
            message = message + "Password is invalid. "
            if (!samePass) {
                message = message + "Passwords do not match. "
            }
            if (!(pwCharVerified & underEightChar))
            {
                message = message + "It must be at least 8 characters, contain an uppercase letter, a lowercase letter, a number, and a special character. ";
            }
        }
    
        if (validuser && validpass) {
            message = "";
        }
        
        console.log(message)
        return { validuser, validpass, message };
    }

    //signup
    socket.on('signUp', async (newuser) => {
        console.log('Connected')

        let { validuser, validpass, message } =  await validCredentials(newuser.un, newuser.pw, newuser.checkpw)

        console.log({validuser})
        console.log({validpass})
        console.log({message})

        if (validuser & validpass) {
            const users = await fetchUsers();
            //take the previous
            const highestUserId = users.length > 0 ? Math.max(...users.map(user => parseInt(user.id))) : 0;
            const newUserId = highestUserId + 1;
            
            //hash the password
            const hashedPassword = await hashPassword(newuser.pw)
            
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
                socket.emit('signupSuccess', { message });
            });
        }
        else {
            socket.emit('signupFailed', { message });
        }
        
    })

    // Handle user login
    socket.on('login', async (user) => {
        console.log('Server received user:', user);

        let message = ""
        const verified = await verifyCredentials(user.un, user.pw)
        
        if (verified) {
            message = "Logged In! "
            console.log(message)
            let users = await fetchUsers();

            console.log(users)

            console.log(user.un)

            let foundUser = users.find(u => u.username === user.un);
            
            console.log(foundUser)

            socket.emit('loginSuccess', {
                id: foundUser.id,
                username: foundUser.username,
                gameStats: foundUser.gameStats,
                message: message,
            });
        } 
        else {
            message = 'Username or Password is incorrect.'
            console.log(message)
            socket.emit('loginFailed',{ message });
        }
    })
})


// The server listens on port 4000
server.listen(4000,()=>{
    console.log('Listening to port 4000)');
})