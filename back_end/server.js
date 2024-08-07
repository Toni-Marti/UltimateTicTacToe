const { Board, Game, MARK } = require('./commonsSymbolicLink/gameLogic.js');
const bcrypt = require('bcrypt');
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server,{
    cors:{origin:'*',}
})

// Key: [board, host_socket]
let availableRooms = {}

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

    socket.on("message", (room, user, mesage) => {
        io.emit(room, user, mesage);
    })

    //user action, must verify
    socket.on('createRoom', (username, password, board) => {
        let userVerified = verifyCredentials(username, password)
        if (!userVerified){
            forceLogout();
        }
        else {
            console.log('Creating room ', next_room,' for ', username);
            availableRooms[username] = [Board.fromJSON(board), socket];
            io.emit('newRoom', username, board);

            socket.on('disconnect', () => {
                delete availableRooms[username];
                io.emit('deleteRoom', username);
            })
        }
    })

    //user action, must verify
    socket.on('listRooms', () => {
        socket.emit('listRooms', Object.entries(availableRooms).map(([key, value]) => [key, Board.toJSON(value[0])]));
    })

    socket.on('joinRoom', (username, password, host_name) => {
        let userVerified = verifyCredentials(username, password);
        if (!userVerified) {
            forceLogout();
        } else {
            let room = availableRooms[host_name];
            if (room !== undefined) {
                let board = room[0];
                let host_socket = room[1];

                rooms[next_room] = [socket, host_socket, false, false, new Game(board, host_name, username), false];
                socket.emit('joinRoom', next_room);
                host_socket.emit('joinRoom', next_room);

                socket.on('disconnect', () => handleDisconnection(socket, next_room));
                host_socket.on('disconnect', () => handleDisconnection(host_socket, next_room));

                next_room++;
                delete availableRooms[host_name];
                io.emit('deleteRoom', host_name);
            } else {
                socket.emit('joinRoom', false);
            }
        }
    });

    async function deleteMyRoom(username) {
        existed = availableRooms[username] !== undefined;
        delete availableRooms[username];
        if (existed){
            io.emit('deleteRoom', username);
        }
    }

    //user action, must verify
    socket.on('deleteMyRoom', (userName, password) => {
        let userVerified = verifyCredentials(userName, password)
        if (!userVerified){
            forceLogout();
        }
        else{
            deleteMyRoom(userName)
        }
    })

    async function getAddress(socket) {
        return new Promise((resolve, reject) => {
            socket.once('move', (move) => {
                resolve(move);
            })
        })
    }

    //client action, must verify credentials
    socket.on('ready', async (room_id) => {
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

            // Delete the room after 1 hour
            setTimeout(() => {
                delete rooms[room_id];
            }, 3600000);
    
            if(Math.random() < 0.5) {
                let temp_name = game.player1;
                game.player1 = game.player2;
                game.player2 = temp_name;

                let temp_socket = socket1;
                socket1 = socket2;
                socket2 = temp_socket;
            }
    
            while(game.mainBoard.value === MARK.NONE && game.mainBoard.hasRoom()) {
                socket1.emit('updateGame', Game.toJSON(game), true);
                socket2.emit('updateGame', Game.toJSON(game), false);
                
                let marked = false;
                while(!marked) {
                    try{
                        address = await getAddress(socket1);
                        game.markTile(address);
                        marked = true;
                    }
                    catch (error) {}
                }
    
                let temp_socket = socket1;
                socket1 = socket2;
                socket2 = temp_socket;
            }
        }

    })

    socket.on('userStats', async (userName) => {
        let users = await fetchUsers();
        let thisuser = users.find(u => u.username === userName);
        if (thisuser) {
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
    
    //verify logged in user exists
    async function verifyCredentials(un, pw) {
        let verified = false
        if (un === 'guest'){
            verified = true
        }
        else {
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
        }        
        return verified;        
    }
    async function forceLogout(){
        socket.emit('forceLogout',{ message });
        logout();
    }


    //logout logic
    socket.on('logout', async (data) => {
        logout(data.userName);
    })

    function logout(username){
        deleteMyRoom(username)
        message = 'Logged out.'
        socket.emit('logout',{ message });
    }
    function handleDisconnection(socket, room_id) {
        let room = rooms[room_id];
        if (room) {
            if (room[0] === socket || room[1] === socket) {
                delete rooms[room_id];
                io.emit('roomClosed', room_id);
            }
        }
    }



    //handle user login
    socket.on('login', async (user) => {
        let message = ""
        const verified = await verifyCredentials(user.un, user.pw)
        
        if (verified) {
            message = "Logged In! "
            let users = await fetchUsers();

            let foundUser = users.find(u => u.username === user.un);

            socket.emit('loginSuccess', {
                id: foundUser.id,
                username: foundUser.username,
                gameStats: foundUser.gameStats,
                message: message,
            });
        } 
        else {
            message = 'Username or Password is incorrect.'
            socket.emit('loginFailed',{ message });
        }
    })




    //account creation logic: verify valid user info input
    async function validCredentials(un, pw, checkpw) {
        let message = "";
        let validpass = false;
        let validuser = false;
        let users = await fetchUsers();
        let foundUser = users.some(user => user.username === un);
        
        let lengthReqs = un.length >= 3 && un.length <= 20
        let usernameCharOK = /^[a-zA-Z0-9_.]+$/.test(un)
        let usernameNotGuest = un !== "guest"

        // Check username
        if (lengthReqs && usernameCharOK && usernameNotGuest && !foundUser) {
            validuser = true;
        } else {
            message = "Username is invalid. ";
            if (!lengthReqs) {
                message += "Username must be 3-20 characters long. ";
            }
            if (!usernameCharOK) {
                message += "Username can only contain alphanumeric characters, underscores, and periods. ";
            }
            if (!usernameNotGuest) {
                message += "Username cannot be \"guest\". ";
            }
            if (foundUser) {
                message += "Username is already taken. ";
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
        
        return { validuser, validpass, message };
    }

    //signup
    socket.on('signUp', async (newuser) => {
        let { validuser, validpass, message } =  await validCredentials(newuser.un, newuser.pw, newuser.checkpw)

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

})




// The server listens on port 4000
server.listen(4000,()=>{
    console.log('Listening to port 4000)');
})