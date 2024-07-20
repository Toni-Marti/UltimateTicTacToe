import { useState } from "react";
import { PAGES } from "./App.js"
import User from "./User.js"

import "./TopBar.css"

function TopBar({changePage, userName, socket}) {
    const [playerPopUp, setPlayerPopUp] = useState(null);

    return (
        <div id="TopBar">
            <span id="title" onClick={() => changePage(PAGES.LOBBY)}>ULTIMATE-ULTIMATE TIC-TAC-TOE</span>
            <div id="userPart">
                <span id="userName">User: <User setPopUp={setPlayerPopUp} socket={socket}>{userName}</User></span>
                <span id="changeUser" onClick={() => changePage(PAGES.LOGIN)}>change user</span>
            </div>
            {playerPopUp}
        </div>
    );
}

export default TopBar;