import "./TopBar.css"
import { PAGES } from "./App.js"

function TopBar({changePage, userName}) {
    return (
        <div id="TopBar">
            <span id="title" onClick={() => changePage(PAGES.LOBBY)}>ULTIMATE-ULTIMATE TIC-TAC-TOE</span>
            <div id="userPart">
                <span id="userName">User: <span style={{fontWeight:"bold"}}>{userName}</span></span>
                <span id="changeUser" onClick={() => changePage(PAGES.LOGIN)}>change user</span>
            </div>
        </div>
    );
}

export default TopBar;