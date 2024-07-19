import "./TopBar.css"
import { PAGES } from "./App.js"

function TopBar({changePage}) {
    return (
        <div id="TopBar">
            <span id="title" onClick={() => changePage(PAGES.LOBBY)}>ULTIMATE-ULTIMATE TIC-TAC-TOE</span>
            <div id="userPart">
                <span id="userName">user</span>
                <br/>
                <span id="changeUser" onClick={() => changePage(PAGES.LOGIN)}>Change User</span>
            </div>
        </div>
    );
}

export default TopBar;