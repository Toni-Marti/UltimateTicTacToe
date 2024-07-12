import { useState } from "react";
import { MARK, Tile, Board, Rules, Game } from "./gameLogic";
import "./gameComponents.css";

const white = "#FFFFFF";
const light_red = "#f28585";
const saturated_red = "#f23030";
const light_blue = "#50acf2";
const saturated_blue = "#006fff";
const light_purple = "#e899f7";
const saturated_purple = "#d500ff";

const player1_light_color = light_red;
const player1_saturated_color = saturated_red;
const player2_light_color = light_blue;
const player2_saturated_color = saturated_blue;
const bouth_players_light_color = light_purple;
const bouth_players_saturated_color = saturated_purple;

function shouldBeCovered(address, game) {
    let tile = game.getTile(address);
    if (!(tile instanceof Board) &&
        address.length - 1 >= game.nextMoveBoardAddress.length) {
        return false;
    } 
    return game.canClickOn(address.slice(0, -1)) && !game.canClickOn(address) && tile.hasRoom();
}

function tileColor(address, game) {
    let value = game.getValue(address);

    if (value === MARK.NONE) {
        return white;
    }
    else if ([MARK.XO, MARK.OX].includes(value)) {
        if (game.isPartOfValidLine(address)) {
            return bouth_players_saturated_color;
        }
        else {
            return bouth_players_light_color;
        }
    }
    else if (value === MARK.X) {
        if (game.isPartOfValidLine(address)) {
            return player1_saturated_color;
        }
        else {
            return player1_light_color;
        }
    }
    else if (value === MARK.O) {
        if (game.isPartOfValidLine(address)) {
            return player2_saturated_color;
        }
        else {
            return player2_light_color;
        }
    }
}

function TileR({game, mark_function, address, className = ""}) {
    let covered_class = shouldBeCovered(address, game) ? " Covered" : "";
    let finalClassName = "Tile " + className + covered_class;
    let color = tileColor(address, game);

    return (
        <div style={{background:color}} className={finalClassName} onClick={() => mark_function(address)} />
    );
}

function BoardR({game, mark_function, address = "", className = ""}) {
    let board = game.getTile(address);
    let covered_class = shouldBeCovered(address, game) ? " Covered" : "";
    let finalClassName = "Board " + className + covered_class;
    let color = tileColor(address, game);

    return (
        <div className={finalClassName} style={{background:color}}>
            {board.tiles.map((tile, index) => {
                let tile_address = address + (index + 1);
                return (tile instanceof Board
                    ? <BoardR game={game} mark_function={mark_function} address={tile_address} className={"GridItem" + (index+1)} key={tile_address} />
                    : <TileR game={game} mark_function={mark_function} address={tile_address} className={"GridItem" + (index+1)} key={tile_address} />)
            })}
            <div className="Line Line1"></div>
            <div className="Line Line2"></div>
            <div className="Line Line3"></div>
            <div className="Line Line4"></div>
        </div>
    );
}

function GameR({size = [500, 500]}) {
    const [gameSt, setGameSt] = useState(new Game(new Board([new Board(), new Tile(), new Board(), new Tile(), new Board([new Tile(), new Tile(), new Tile(), new Tile(), new Board()]), new Tile(), new Board(), new Tile(), new Board()]), new Rules(false, true)));
    const [isDebugMode, setIsDebugMode] = useState(false);
    const [colorRadio, setColorRadio] = useState("switching");

    // Only for debuging
    function colorChanged(val) {
        let newGameSt = Game.clone(gameSt); 
        
        if (val === "red") {
            newGameSt.currentPlayer = MARK.X;
        }
        else if (val === "blue") {
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
        if (!newGameSt.markTile(address)) {
            return;
        };
        
        if (isDebugMode) {
            newGameSt.nextMoveBoardAddress = "";
            if (colorRadio === "red") {
                newGameSt.currentPlayer = MARK.X;
            }
            else if (colorRadio === "blue") {
                newGameSt.currentPlayer = MARK.O;
            }
        }

        setGameSt(newGameSt); 
    }

    return (
        <div className="Game">
            <p>{gameSt.player1} vs {gameSt.player2}</p>
            <span style={{fontWeight:"bold"}}>Debug mode</span>
            <input type="checkbox" id="debug_mode" checked={isDebugMode} onChange={() => debugModified(!isDebugMode)}/>
            {isDebugMode ? 
                <div>
                    <span>Color:</span>
                    <br/>
                    <input type="radio" name="color" checked={colorRadio==="switching"} onChange={() => colorChanged("switching")}/> <span>Swiching</span><br/>
                    <input type="radio" name="color" checked={colorRadio==="red"} onChange={() => colorChanged("red")}/> <span>Red</span><br/>
                    <input type="radio" name="color" checked={colorRadio==="blue"} onChange={() => colorChanged("blue")}/> <span>Blue</span><br/>
                </div>
                :
                null
            }
            <div style={{width: size[0] + "px", height: size[1] + "px"}}>
                <BoardR game={gameSt} board={gameSt.mainBoard} mark_function={markTile} />
            </div>
        </div>
    );
}

export { GameR };