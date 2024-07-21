import React, { useState, useEffect } from "react";
import { MessagePopUp, Overlay, TwoButtonPopUp } from "./popUps.js";
import { PAGES } from './App.js';

function Logout ({socket, changePage, setUserName, setPassword}) {
    const [message, setMessage] = useState("");
    const [showLogoutConfirmPopup, setShowLogoutConfirmPopup] = useState(false);
    const [showLoggedOutPopup, setShowLoggedOutPopup] = useState(false);
    const [forciblyLoggedoutPopup, setForciblyLoggedoutPopup] = useState(false);
    const confirmLogout = () => {
        setShowLogoutConfirmPopup(false);
        initiateLogout();
    };
    const cancelLogout = () => {
        setShowLogoutConfirmPopup(false);
    };
    const clearLogoutConfirmation = () => {
        setShowLoggedOutPopup(false);
        changePage(PAGES.LOGIN)
    };
    const clearLogoutWarning = () => {
        setForciblyLoggedoutPopup(false);
        changePage(PAGES.LOGIN)
    };

    const clearLoginInfo = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        setUserName('guest');
        setPassword('');
    }

    function initiateLogout(){
        socket.emit('logout');
    }
    
    socket.on('forcelogout', data => {
        clearLoginInfo();
        setShowLogoutConfirmPopup(true);
    });

    socket.on('logout', data => {
        setShowLoggedOutPopup(true);
        clearLoginInfo();
    });



    return (
        <div id="Logout">
            <span id="logout" onClick={() => setShowLogoutConfirmPopup(true)}>logout</span>
            {showLogoutConfirmPopup && <>
                <Overlay />
                <TwoButtonPopUp
                    children="Are you sure you want to logout?"
                    negativeOnClick={cancelLogout}
                    positiveOnClick={confirmLogout}
                    negativeButtonText="No"
                    positiveButtonText="Yes"
                />
            </>}
            {showLoggedOutPopup && <>
                <Overlay />
                <MessagePopUp
                    children="You have successfully logged out. "
                    buttonText={"OK"}
                    onClick={clearLogoutConfirmation}
                />
            </>}
            {forciblyLoggedoutPopup && <>
                <Overlay />
                <MessagePopUp
                    children="We apologize, but an error has occured, and you have been forceably logged out. "
                    buttonText={"OK"}
                    onClick={clearLogoutWarning}
                />
            </>}

        </div>
    );
};

export default Logout;
    