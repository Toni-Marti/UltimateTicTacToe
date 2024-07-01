import { useState } from "react";
import { MARK, Board } from "./gameLogic";
import "./gameComponents.css";

const lineSize = 0.04
const tileSize = (1 - 2 * lineSize) / 3;

document.documentElement.style.setProperty('--lineSize', (lineSize * 100).toString + "%");

// TODO refactor props
// TODO refactor state

function TileR(props) {
    const [value, setValue] = useState(props.tile.value);
    const markTile = () => {
        props.tile.value = props.game.currentPlayer;
        setValue(props.tile.value);
        props.game.currentPlayer = props.game.currentPlayer === MARK.X ? MARK.O : MARK.X;
    }


    return (
        <div className="Tile" style={{ width: props.size + 'px', height: props.size + 'px' }} onClick={markTile}>
            {value === MARK.X ? 'X' : value === MARK.O ? 'O' : ''}
        </div>
    );
}

function BoardR(props) {
    return (
        <div className="Board" style={{ width: props.size + 'px', height: props.size + 'px', gap: props.size * lineSize + 'px ' + props.size * lineSize + 'px' }}>
            {props.board.tiles.map((tile, index) => {
                return (tile instanceof Board
                    ? <BoardR board={tile} key={index} game={props.game} size={props.size * tileSize} />
                    : <TileR tile={tile} key={index} game={props.game} size={props.size * tileSize} />)
            })}
        </div>
    );
}

function GameR(props) {
    return (
        <div className="Game">
            <p>{props.game.player1} vs {props.game.player2}</p>
            <BoardR board={props.game.mainBoard} game={props.game} size={props.boardSize} />
        </div>
    );
}

export { GameR };