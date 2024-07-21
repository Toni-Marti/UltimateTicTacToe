import React, { useState, useEffect } from "react";
import { Overlay, TwoButtonPopUp } from "./popUps.js";
import { PAGES } from './App.js';

function Logout ({socket, changePage, setUserName, setPassword}) {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    function handleLogout(){
        socket.emit('logout');
    }

    const confirmLogout = () => {
        setShowLogoutPopup(false);
        handleLogout();
    };

    const cancelLogout = () => {
        setShowLogoutPopup(false);
    };

    socket.on('logout', data => {
        console.log(data.message)
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        setUserName('guest');
        setPassword('');
    });
    return (
        <div id="Logout">
            
            <span id="logout" onClick={() => setShowLogoutPopup(true)}>logout</span>
            
            {showLogoutPopup && <>
    <Overlay />
    <TwoButtonPopUp
        children="Are you sure you want to logout?"
        negativeOnClick={cancelLogout}
        positiveOnClick={confirmLogout}
        negativeButtonText="No"
        positiveButtonText="Yes"
    />
</>}
        </div>
    );
};

export default Logout;
    