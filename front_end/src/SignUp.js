import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';

function SignUp() {

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [pw, setPw] = useState("");
    const [userName, setUserName] = useState(""); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        //take the previous
        const highestUserId = users.length > 0 ? Math.max(...users.map(user => parseInt(user.id))) : 0;
        const newUserId = highestUserId + 1;
        
        //hash the password
        const hashedPassword = await bcrypt.hash(pw, 10);

        //create the array that will be used to insert into json
        const newUserObj = { id: parseInt(newUserId, 10), userName, pw: hashedPassword };

        //call local json server using POST method to submit data 
        fetch('http://localhost:9999/users/', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUserObj)
        }).then(() => {
            //for some reason, the first time you submit a post, the message doesnt work, but it does on the second deletion
            setMessage('A new user has been added successfully!');
            //debugging message
            console.log(message)
        });
    }

    return(
        <div className='SignUp'>
            <h1>Sign-Up:</h1>
            <form onSubmit={handleSubmit} className="chat">
                <input
                    type="text"
                    placeholder={"Username"}
                    name="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <input
                    type="password"
                    placeholder={"Password"}
                    name="msg"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;
