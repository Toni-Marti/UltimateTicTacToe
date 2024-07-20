const { Board, Game, MARK } = require('./commonsSymbolicLink/gameLogic.js');
const bcrypt = require('bcrypt');
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

    socket.on(0, (user, mesage) => {
        io.emit(0, user, mesage);
    })

    socket.on('createRoom', (username, password, board) => {
        console.log('Creating room for', username);
        avialebleRooms[username] = [Board.fromJSON(board), socket];
        io.emit('newRoom', username, board);

        socket.on('disconnect', () => {
            console.log('User disconnected:', username);
            delete avialebleRooms[username];
            io.emit('deleteRoom', username);
        })
    })

    socket.on('listRooms', () => {
        socket.emit('listRooms', Object.entries(avialebleRooms).map(([key, value]) => [key, value[0]]));
    })

    socket.on('joinRoom', (username, password, host_name) => {
        room = avialebleRooms[host_name];
        board = room[0];
        host_socket = room[1];
        if (room !== undefined) {
            avialebleRooms[host_name][1].emit('playerJoined');
            rooms[next_room] = [socket, avialebleRooms[host_name][1], false, false, new Game(board, host_name, username), false];
            socket.emit('joinRoom', next_room);
            host_socket.emit('joinRoom', next_room);
            next_room++;
            delete avialebleRooms[host_name];
            io.emit('deleteRoom', host_name);
        }
        else {
            socket.emit('joinRoom', false)
        }
    })

    socket.on("deleteMyRoom", (username, password) => {
        delete avialebleRooms[username];
        io.emit('deleteRoom', username);
    })

    async function getAddress(socket) {
        return new Promise((resolve, reject) => {
            socket.once('move', (move) => {
                resolve(move);
            })
        })
    }

    socket.on('ready', async (room_id) => {
        io.on(room_id, (message) => {
            io.emit(room_id, message);
        })

        let room = rooms[room_id];
        if(room === undefined) {
            return;
        }

        
        if (room[0] === socket) {
            room[2] = true;
        }
        else if (room[1] === socket) {
            room[3] = true;
        }
        let ready1 = room[2];
        let ready2 = room[3];
        
        if (ready1 && ready2 && !room[5]) {
            let socket1 = room[0];
            let socket2 = room[1];
            let game = room[4];
            room[5] = true;

            if(Math.random() < 0.5) {
                let temp_name = game.player1;
                game.player1 = game.player2;
                game.player2 = temp_name;

                let temp_socket = socket1;
                socket1 = socket2;
                socket2 = temp_socket;
            }

            while(game.mainBoard.value === MARK.NONE && game.mainBoard.hasRoom()) {
                console.log("playing")
                
                socket1.emit('updateGame', Game.toJSON(game), true);
                socket2.emit('updateGame', Game.toJSON(game), false);
                address = await getAddress(socket1);
                game.markTile(address);

                let temp_socket = socket1;
                socket1 = socket2;
                socket2 = temp_socket;
            }
        }
    })

    socket.on('userStats', async (username) => {
        let users = await fetchUsers();
        if (users.some(u => u.username === username)) {
            const thisuser = users.find(u => u.username === username);
            socket.emit('userStats', thisuser.gameStats);
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