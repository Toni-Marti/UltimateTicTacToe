const MARK = Object.freeze({
    NONE: 0,
    X: 1,
    O: 2,
    XO: 3,
    OX: 4,
});



class Tile {
    constructor(value = MARK.NONE) {
        this.value = value;
    }

    static clone(tile_instance) {
        return new Tile(tile_instance.value);
    }

    markTile(mark, _tile_address = "") {
        this.value = mark;
    }

    hasRoom() {
        return this.value === MARK.NONE;
    }
}



class Board extends Tile {
    static #winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal 
                                   [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
                                   [0, 4, 8], [2, 4, 6]]            // diagonal

    constructor(tiles = []) {
        super();

        this.tiles = [];

        for (let i = 0; i < 9; i++) {
            if (tiles.length > i && tiles[i] !== null) {
                    this.tiles.push(tiles[i]);
            }
            else {
                this.tiles.push(new Tile());
            }
        }

        this.#updateValue();
    }

    static clone(board_instance) {
        let newBoard = new Board();
        newBoard.tiles = board_instance.tiles.map(tile => {
            if (tile instanceof Board) {
                return Board.clone(tile);
            }
            else {
                return Tile.clone(tile);
            }
        });

        newBoard.value = board_instance.value;

        return newBoard;
    }

    markTile(mark, tile_address) {
        this.tiles[(+tile_address[0])-1].markTile(mark, tile_address.slice(1));
        this.#updateValue();
    }

    fistMark() {
        if ([MARK.X, MARK.XO].includes(this.value)) {
            return MARK.X;
        }

        if ([MARK.O, MARK.OX].includes(this.value)) {
            return MARK.O;
        }

        return null;
    }

    hasRoom() {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].hasRoom()) {
                return true;
            }
        }
        return false;
    }

    #updateValue() {
        if ([MARK.XO, MARK.OX].includes(this.value)) {
            return;
        }

        let present_marks = new Set();
        for (let i = 0; i < Board.#winningCombinations.length; i++) {
            let current_combination = Board.#winningCombinations[i];
            
            let line_mark = this.tiles[current_combination[0]].value;
            for (let j = 1; j < current_combination.length; j++) {
                if(line_mark === MARK.NONE || present_marks.has(line_mark)) {
                    break;
                }
                
                let curr_mark = this.tiles[current_combination[j]].value;

                if ([MARK.OX, MARK.XO].includes(line_mark)) {
                    line_mark = curr_mark;
                }
                else if(line_mark !== curr_mark) {
                    line_mark = MARK.NONE;
                    break;
                }
            }

            if ([MARK.XO, MARK.OX].includes(line_mark)) {
                present_marks.add(MARK.X);
                present_marks.add(MARK.O);
            }
            else if (line_mark === MARK.X) {
                present_marks.add(MARK.X);
            }
            else if(line_mark === MARK.O) {
                present_marks.add(MARK.O);
            }

            if (present_marks.size === 2) {
                break;
            }
        }

        if (this.value === MARK.NONE) {
            if (present_marks.size === 2) {
                this.value = MARK.XO;
            }
            else if (present_marks.size === 1) {
                this.value = present_marks.values().next().value;
            }
        }
        else if (this.value === MARK.X) {
            if (present_marks.has(MARK.O)) {
                this.value = MARK.XO;
            }
        }
        else if (this.value === MARK.O) {
            if (present_marks.has(MARK.X)) {
                this.value = MARK.OX;
            }
        }
    }
}



class Rules {
    constructor() {
        this.keepPlacingInBoardAfterItIsMarked = true;
        this.boardCanHaveMultipleMarks = true;
    }

    static clone(rules_instance) {
        let newRules = new Rules();
        newRules.keepPlacingInBoardAfterItIsMarked = rules_instance.keepPlacingInBoardAfterItIsMarked;
        newRules.boardCanHaveMultipleMarks = rules_instance.boardCanHaveMultipleMarks;

        return newRules;
    }
}



class Game {
    constructor(board = new Board(), player1 = "Player1", player2 = "Player2", rules = new Rules()) {
        this.mainBoard = Board.clone(board);
        this.currentPlayer = MARK.X;
        this.nextMoveBoardAddress = "";

        this.player1 = player1;
        this.player2 = player2;

        this.rules = Rules.clone(rules);
    }

    static clone(game_instance) {
        let newGame = new Game(game_instance.mainBoard, game_instance.player1, game_instance.player2, game_instance.rules);
        newGame.currentPlayer = game_instance.currentPlayer;
        newGame.nextMoveBoardAddress = game_instance.nextMoveBoardAddress;

        return newGame;
    }
    
    /**
     * 
     * @param {String} tile_address a succesion of numbers btween 1 and 9 indicating in 
     * which tile the player wants to mark. The the biggest figure digit
     * indicates which board the player wants to mark, the next one would indicate
     * the tile inside the board and so on. Has to be a valid tile.
     * 
     * @note A board tile is specified like this:
     *  1 2 3
     *  4 5 6
     *  7 8 9
    */
    markTile(tile_address) {
        
        if (!this.#canClickOn(tile_address)) {
            return;
        }
        console.log("clicking on " + tile_address); 

        this.mainBoard.markTile(this.currentPlayer, tile_address);
        this.currentPlayer = this.currentPlayer === MARK.X ? MARK.O : MARK.X;   
        this.#updateNextMoveBoardAddress(tile_address);
    }

    getWinner() {
        this.mainBoard.fistMark();
    }
    
    #getTile(address) {
        if (address === "") {
            return this.mainBoard;
        }

        let currentBoard = this.mainBoard;
        for (let i = 0; i < address.length; i++) {
            currentBoard = currentBoard.tiles[(+address[i])-1];
        }

        return currentBoard;
    }

    #canClickOn(tile_address) {
        let validBoard;
        if (this.nextMoveBoardAddress === "") {
            validBoard = true;
        }
        else {
            validBoard = this.nextMoveBoardAddress === tile_address.slice(0, this.nextMoveBoardAddress.length);
        }

        if (!validBoard) {
            return false;
        }

        return this.#getTile(tile_address).value === MARK.NONE;
    }

    #updateNextMoveBoardAddress(address_of_tile_clicked) {
        let next_address = address_of_tile_clicked.slice(0, -2);
        
        if (address_of_tile_clicked.length > 1) {
            next_address += address_of_tile_clicked.slice(-1);
        }

        if (!this.rules.keepPlacingInBoardAfterItIsMarked) {
            while(next_address !== "" && this.#getTile(next_address).value !== MARK.NONE) {
                next_address = next_address.slice(0, -1);
            }
        }

        while(next_address !== "" && !this.#getTile(next_address).hasRoom()) {
            next_address = next_address.slice(0, -1);
        }

        console.log("next address: " + next_address);
        this.nextMoveBoardAddress = next_address;
    }
}



export { MARK, Tile, Board, Game };