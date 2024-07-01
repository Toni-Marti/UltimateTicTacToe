const MARK = Object.freeze({
    NONE: 0,
    X: 1,
    O: 2
});



class Tile {
    constructor(value = MARK.NONE) {
        this.value = value;
    }
}



class Board {
    constructor(tiles = [], value = MARK.NONE) {
        this.tiles = [];
        this.value = value;

        for (let i = 0; i < 9; i++) {
            if (tiles.length > i && tiles[i] !== null) {
                    this.tiles.push(tiles[i]);
            }
            else {
                this.tiles.push(new Tile());
            }
        }
    }
}



class Game {
    constructor(board = new Board(), player1 = "Player1", player2 = "Player2") {
        this.mainBoard = board;
        this.currentPlayer = MARK.X;
        this.focusedBoard = this.board;
        this.boardStack = []

        this.player1 = player1;
        this.player2 = player2;
    }
}



export { MARK, Tile, Board, Game };