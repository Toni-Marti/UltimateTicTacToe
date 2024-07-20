import "./TopBar.css"
import { PAGES } from "./App.js"
import User from "./User.js"

function TopBar({changePage, userName, socket}) {
    return (
        <div id="TopBar">
            <span id="title" onClick={() => changePage(PAGES.LOBBY)}>ULTIMATE-ULTIMATE TIC-TAC-TOE</span>
            <div id="userPart">
                <span id="userName">User: <User socket={socket}>{userName}</User></span>
                <span id="changeUser" onClick={() => changePage(PAGES.LOGIN)}>change user</span>
            </div>
        </div>
    );
}

export default TopBar;