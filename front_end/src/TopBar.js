import { useState } from "react";
import { PAGES } from "./App.js"
import User from "./User.js"
import { TwoButtonPopUp } from "./popUps.js";
import Logout from "./Logout.js";

import "./TopBar.css"

function TopBar({changePage, userName, socket, setUserName, setPassword}) {
    const [playerPopUp, setPlayerPopUp] = useState(null);
    
    

    return (
        <div id="TopBar">
            <span id="title" onClick={() => changePage(PAGES.LOBBY)}>ULTIMATE-ULTIMATE TIC-TAC-TOE</span>
            <div id="userPart">
            <span id="userName">User: <User userName={userName} setPopUp={setPlayerPopUp} socket={socket} /></span>
            <span id="changeUser" onClick={() => changePage(PAGES.LOGIN)}>change user</span>
                <Logout 
                    socket={socket} 
                    changePage={changePage} 
                    userName={userName}
                    setUserName={setUserName} 
                    setPassword={setPassword} 
                />
            </div>
            {playerPopUp}
        </div>
    );
}

export default TopBar;