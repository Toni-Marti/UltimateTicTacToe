import { useState } from "react";
import { MARK, Tile, Board, Game } from "./gameLogic";
import "./gameComponents.css";

function TileR({tile, mark_function, address, className = ""}) {
    return (
        tile.value === MARK.X ?
        <div style={{background:"#FF00F0"}} className={"Tile " + className} onClick={() => mark_function(address)} /> :
        tile.value === MARK.O ?
        <div style={{background:"blue"}} className={"Tile " + className} onClick={() => mark_function(address)} /> :
        <div     className={"Tile " + className} onClick={() => mark_function(address)} />

    );
}

function BoardR({board, mark_function, address = "", className = ""}) {
    return (
        <div className={"Board " + className}>
            {board.tiles.map((tile, index) => {
                let tile_address = address + (index + 1);
                return (tile instanceof Board
                    ? <BoardR board={tile} mark_function={mark_function} address={tile_address} className={"GridItem" + (index+1)} key={tile_address} />
                    : <TileR tile={tile} mark_function={mark_function} address={tile_address} className={"GridItem" + (index+1)} key={tile_address} />)
            })}
            <div className="Line Line1"></div>
            <div className="Line Line2"></div>
            <div className="Line Line3"></div>
            <div className="Line Line4"></div>
        </div>
    );
}

function GameR({size = [500, 500]}) {
    // const [gameSt, setGameSt] = useState(new Game(new Board(Array.from({ length: 6 }, () => new Board()))));
    const [gameSt, setGameSt] = useState(new Game(new Board([new Board(), new Tile(), new Board(), new Tile(), new Board([new Tile(), new Tile(), new Tile(), new Tile(), new Board()]), new Tile(), new Board(), new Tile(), new Board()])));

    function markTile(address) {
            let newGameSt = Game.clone(gameSt); 
            newGameSt.markTile(address);
            setGameSt(newGameSt); 
    }

    return (
        <div className="Game">
            <p>{gameSt.player1} vs {gameSt.player2}</p>
            <div className="MainBoard" style={{width: size[0] + "px", height: size[1] + "px"}}>
                <BoardR board={gameSt.mainBoard} mark_function={markTile} />
            </div>
        </div>
    );
}

export { GameR };