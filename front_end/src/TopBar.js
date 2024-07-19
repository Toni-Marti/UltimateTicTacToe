import "./TopBar.css"
import { PAGES } from "./App.js"

function TopBar({changePage}) {
    return (
        <div id="TopBar">
            <span id="title">ULTIMATE-ULTIMATE TIC-TAC-TOE</span>
            <div id="userPart">
                <span id="userName">user</span>
                <br/>
                <span onClick={() => changePage(PAGES.LOGIN)}>Change User</span>
            </div>
        </div>
    );
}

export default TopBar;