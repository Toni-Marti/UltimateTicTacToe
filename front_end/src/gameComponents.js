import { useState } from "react";
import { MARK, Tile, Board, Rules, Game } from "./gameLogic";
import { Overlay, EmptyPopUp, MessagePopUp, TwoButtonPopUp } from "./popUps";
import "./gameComponents.css";

const white = "#FFFFFF";
const light_red = "#f28585";
const saturated_red = "#f23030";
const light_blue = "#50acf2";
const saturated_blue = "#006fff";
const light_purple = "#e899f7";
const saturated_purple = "#d500ff";

const background_color = white;
const player1_light_color = light_blue;
const player1_saturated_color = saturated_blue;
const player2_light_color = light_red;
const player2_saturated_color = saturated_red;
const bouth_players_light_color = light_purple;
const bouth_players_saturated_color = saturated_purple;

function shouldBeCovered(address, game) {
    if (game.mainBoard.value !== MARK.NONE) {
        return false;
    }

    let tile = game.getTile(address);
    if (!(tile instanceof Board) &&
        address.length - 1 >= game.nextMoveBoardAddress.length) {
        return false;
    } 
    return game.canClickOn(address.slice(0, -1)) && !game.canClickOn(address)   ;
}

function tileColor(address, game, force_dark = false) {
    let value = game.getValue(address);

    if (value === MARK.NONE) {
        return background_color;
    }
    else if ([MARK.XO, MARK.OX].includes(value)) {
        if (game.isPartOfValidLine(address) || force_dark) {
            return bouth_players_saturated_color;
        }
        else {
            return bouth_players_light_color;
        }
    }
    else if (value === MARK.X) {
        if (game.isPartOfValidLine(address) || force_dark) {
            return player1_saturated_color;
        }
        else {
            return player1_light_color;
        }
    }
    else if (value === MARK.O) {
        if (game.isPartOfValidLine(address) || force_dark) {
            return player2_saturated_color;
        }
        else {
            return player2_light_color;
        }
    }
}

function TileR({game, hover_player, mark_function, address, className = ""}) {
    let color = tileColor(address, game);
    let covered_class = shouldBeCovered(address, game) ? " Covered" : "";
    let hover_class  = ""

    if (color === background_color && covered_class === "") {
        hover_class = " HoverPlayer" + hover_player
        color = null;
    }

    let finalClassName = "Tile " + className + covered_class + hover_class;

    return (
        <div style={{background:color}} className={finalClassName} onClick={() => mark_function(address)} />
    );
}

function BoardR({game, mark_function, hover_player, address = "", className = ""}) {
    let board = game.getTile(address);
    let covered_class = shouldBeCovered(address, game) ? " Covered" : "";
    let finalClassName = "Board " + className + covered_class;
    let color = tileColor(address, game);

    return (
        <div className={finalClassName} style={{background:color}}>
            {board.tiles.map((tile, index) => {
                let tile_address = address + (index + 1);
                return (tile instanceof Board
                    ? <BoardR game={game} mark_function={mark_function} hover_player={hover_player} address={tile_address} className={"GridItem" + (index+1)} key={tile_address} />
                    : <TileR game={game} mark_function={mark_function} hover_player={hover_player} address={tile_address} className={"GridItem" + (index+1)} key={tile_address} />)
            })}
            <div className="Line Line1"></div>
            <div className="Line Line2"></div>
            <div className="Line Line3"></div>
            <div className="Line Line4"></div>
        </div>
    );
}

function GameR({size = ["500px", "500px"], isMyTyrn = true, is_online = false}) {
    const [gameSt, setGameSt] = useState(new Game());
    // const [gameSt, setGameSt] = useState(new Game(new Board([new Board(), new Tile(), new Board(), new Tile(), new Board([new Tile(), new Tile(), new Tile(), new Tile(), new Board()]), new Tile(), new Board(), new Tile(), new Board()]), new Rules()));
    const [isDebugMode, setIsDebugMode] = useState(false);
    const [colorRadio, setColorRadio] = useState("switching");
    const [hasShownWinner, setHasShownWinner] = useState(false);

    // Only for debuging
    function colorChanged(val) {
        let newGameSt = Game.clone(gameSt); 
        
        if (val === "blue") {
            newGameSt.currentPlayer = MARK.X;
        }
        else if (val === "red") {
            newGameSt.currentPlayer = MARK.O;
        }
        setColorRadio(val);
        setGameSt(newGameSt);
    }

    // Only for debuging
    function debugModified(val) {
        let newGameSt = Game.clone(gameSt);
        
        if (val) {
            newGameSt.nextMoveBoardAddress = "";
            colorChanged(colorRadio);
        }
        setIsDebugMode(val);
        setGameSt(newGameSt);
    }

    function markTile(address) {
        let newGameSt = Game.clone(gameSt); 

        if (!isMyTyrn || !newGameSt.markTile(address)) {
            return;
        };
        
        if (isDebugMode) {
            newGameSt.nextMoveBoardAddress = "";
            if (colorRadio === "blue") {
                newGameSt.currentPlayer = MARK.X;
            }
            else if (colorRadio === "red") {
                newGameSt.currentPlayer = MARK.O;
            }
        } 

        setGameSt(newGameSt); 
    }

    let showWinner = false;
    if (gameSt.mainBoard.value !== MARK.NONE) {
        isMyTyrn = false;
        if (!hasShownWinner) {
            showWinner = true;
        }
    }

    let hover_player = null;
    if (isMyTyrn) {
        hover_player = gameSt.currentPlayer;
    }

    return (
        <div className="Game">
            {/* <span style={{fontWeight:"bold"}}>Debug mode</span>
            <input type="checkbox" id="debug_mode" checked={isDebugMode} onChange={() => debugModified(!isDebugMode)}/>
            {isDebugMode ? 
                <div>
                    <span>Color:</span>
                    <br/>
                    <input type="radio" name="color" checked={colorRadio==="switching"} onChange={() => colorChanged("switching")}/> <span>Swiching</span><br/>
                    <input type="radio" name="color" checked={colorRadio==="blue"} onChange={() => colorChanged("blue")}/> <span>Blue</span><br/>
                    <input type="radio" name="color" checked={colorRadio==="red"} onChange={() => colorChanged("red")}/> <span>Red</span><br/>
                </div>
                :
                null
            } */}
            <div style={{width: size[0], height: size[1]}}>
                <BoardR game={gameSt} hover_player={hover_player} board={gameSt.mainBoard} mark_function={markTile} />
            </div>
            {showWinner 
            ? <div>
                <Overlay/>
                <MessagePopUp buttonText="OK" onClick={() => setHasShownWinner(true)}>
                        <span style={{fontSize:"x-large"}}>
                            <span style={{color:tileColor("", gameSt, true), fontWeight:"bold"}}>{gameSt.winerName()}</span> won the game!
                        </span>
                </MessagePopUp> 
            </div>
            : null}
        </div>
    );
}

export { GameR };