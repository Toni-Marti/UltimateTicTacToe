import { useState } from 'react';
import { GameR, BoardSelection } from './gameComponents';
import { Game } from './commonsSymbolicLink/gameLogic';
import { Overlay, EmptyPopUp } from './popUps'

function LocalMode ({changePage}) {
    const [selectedBoard, setSelectedBoard] = useState(null);
    
    function returnPage() {
        if (selectedBoard === null) {
            return <BoardSelection setBoard={setSelectedBoard} maxBoarSize={"650px"} size={["auto", "80vh"]}/>
        }
        else {
            return <GameR game={new Game(selectedBoard)}/>
        }
    }
    
    return (
        <>
            <h1>　Local Mode</h1>
            {returnPage()}
        </>
    );
}

export default LocalMode;