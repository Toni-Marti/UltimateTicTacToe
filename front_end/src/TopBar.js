import { useState } from "react";
import { PAGES } from "./App.js"
import User from "./User.js"
import { TwoButtonPopUp } from "./popUps.js";

import "./TopBar.css"

function TopBar({changePage, userName, socket, handleLogout}) {
    const [playerPopUp, setPlayerPopUp] = useState(null);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const confirmLogout = () => {
        setShowLogoutPopup(false);
        handleLogout();
    };

    const cancelLogout = () => {
        setShowLogoutPopup(false);
    };

    return (
        <div id="TopBar">
            <span id="title" onClick={() => changePage(PAGES.LOBBY)}>ULTIMATE-ULTIMATE TIC-TAC-TOE</span>
            <div id="userPart">
                <span id="userName">User: <User setPopUp={setPlayerPopUp} socket={socket}>{userName}</User></span>
                <span id="changeUser" onClick={() => changePage(PAGES.LOGIN)}>change user</span>
                <span id="logout" onClick={() => setShowLogoutPopup(true)}>logout</span>
            </div>
            {playerPopUp}
            {showLogoutPopup && (
                <TwoButtonPopUp
                    children="Are you sure you want to logout?"
                    negativeOnClick={cancelLogout}
                    positiveOnClick={confirmLogout}
                    negativeButtonText="No"
                    positiveButtonText="Yes"
                />
            )}
        </div>
    );
}

export default TopBar;