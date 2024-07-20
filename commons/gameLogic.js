const MARK = Object.freeze({
    NONE: 0,
    X: 1,
    O: 2,
    XO: 3,
    OX: 4,
});

const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal 
                             [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
                             [0, 4, 8], [2, 4, 6]]            // diagonal


class Tile {
    constructor(value = MARK.NONE) {
        this.value = value;
    }

    static clone(tile_instance) {
        return new Tile(tile_instance.value);
    }

    static toJSON(tile_instance) {
        return {
            value: tile_instance.value,
            type: "Tile",
        };
    }

    static fromJSON(data) {
        return new Tile(data.value);
    }

    markTile(mark, _tile_address = "") {
        this.value = mark;
    }

    firstMark() {
        return this.value;
    }

    hasRoom() {
        return this.value === MARK.NONE;
    }
}



class Board extends Tile {
    constructor(tiles = [], more_than_one_mark = true) {
        super();

        this.more_than_one_mark = more_than_one_mark;
        this.first_lines_indexes = [];

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

        newBoard.more_than_one_mark = board_instance.more_than_one_mark;
        newBoard.first_lines_indexes = board_instance.first_lines_indexes;

        newBoard.value = board_instance.value;

        return newBoard;
    }

    static toJSON(board_instance) {
        return {
            tiles: board_instance.tiles.map(tile => {
                if (tile instanceof Board) {
                    return Board.toJSON(tile);
                }
                else {
                    return Tile.toJSON(tile);
                }
            }),
            more_than_one_mark: board_instance.more_than_one_mark,
            first_lines_indexes: board_instance.first_lines_indexes,
            value: board_instance.value,
            type: "Board",
        };
    }

    static fromJSON(data) {
        let newBoard = new Board();
        newBoard.tiles = data.tiles.map(tile => {
            if (tile.type === "Board") {
                return Board.fromJSON(tile);
            }
            else {
                return Tile.fromJSON(tile);
            }
        });

        newBoard.more_than_one_mark = data.more_than_one_mark;
        newBoard.first_lines_indexes = data.first_lines_indexes;

        newBoard.value = data.value;

        return newBoard;
    }

    markTile(mark, tile_address) {
        this.tiles[(+tile_address[0])-1].markTile(mark, tile_address.slice(1));
        this.#updateValue();
    }

    // TOOO:  needs updating
    firstMark() {
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

    setMoreThanOneMarkRecursive(more_than_one_mark) {
        this.more_than_one_mark = more_than_one_mark;

        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i] instanceof Board) {
                this.tiles[i].setMoreThanOneMarkRecursive(more_than_one_mark);
            }
        }
    }

    #updateValue() {
        // This two conditionas are for optimization, if a versioin of the game
        // allows for the markes to change, then they must be removed
        if ([MARK.XO, MARK.OX].includes(this.value)) {
            return;
        }
        if (!this.more_than_one_mark && this.value !== MARK.NONE) {
            return;
        }

        let present_marks = new Set();
        let line_indexes = [];
        for (let i = 0; i < winningCombinations.length; i++) {
            let current_combination = winningCombinations[i];
            
            let line_mark = this.tiles[current_combination[0]].value;
            
            for (let j = 1; j < current_combination.length; j++) {
                if(line_mark === MARK.NONE || present_marks.has(line_mark)) {
                    break;
                }
                
                let curr_mark = this.tiles[current_combination[j]].value;

                if ([MARK.OX, MARK.XO].includes(line_mark)) {
                    line_mark = curr_mark;
                }
                else if ([MARK.OX, MARK.XO].includes(curr_mark)) {
                    continue;
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

            if (line_mark !== MARK.NONE) {
                line_indexes = [...line_indexes, i];
            }

            if (present_marks.size === 2) {
                break;
            }
        }

        this.first_lines_indexes = this.first_lines_indexes.length === 0 
                                   ? line_indexes
                                   : this.first_lines_indexes;

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


// TODO: could be added a rule that sums the number of lines of each player and 
// only the one with the most lines wins, a second rule can come in hand with that one
// if they have more than one line each, and it is a draw, then should it be XO/OX or NONE?
class Rules {
    constructor(newLinesAlsoTeleport = true, keepPlacingInBoardAfterItIsMarked = true, boardCanHaveMultipleMarks = true) {
        this.newLinesAlsoTeleport = newLinesAlsoTeleport;
        this.keepPlacingInBoardAfterItIsMarked = keepPlacingInBoardAfterItIsMarked;
        this.boardCanHaveMultipleMarks = boardCanHaveMultipleMarks;
    }

    static clone(rules_instance) {
        let newRules = new Rules();
        newRules.keepPlacingInBoardAfterItIsMarked = rules_instance.keepPlacingInBoardAfterItIsMarked;
        newRules.boardCanHaveMultipleMarks = rules_instance.boardCanHaveMultipleMarks;

        return newRules;
    }

    static toJSON(rules_instance) {
        return {
            newLinesAlsoTeleport: rules_instance.newLinesAlsoTeleport,
            keepPlacingInBoardAfterItIsMarked: rules_instance.keepPlacingInBoardAfterItIsMarked,
            boardCanHaveMultipleMarks: rules_instance.boardCanHaveMultipleMarks,
        };
    }

    static fromJSON(data) {
        return new Rules(data.newLinesAlsoTeleport, data.keepPlacingInBoardAfterItIsMarked, data.boardCanHaveMultipleMarks);
    }
}



class Game {
    constructor(board = new Board(), player1 = "Player1", player2 = "Player2", rules = new Rules()) {
        this.mainBoard = Board.clone(board);
        this.mainBoard.setMoreThanOneMarkRecursive(rules.boardCanHaveMultipleMarks);
        this.currentPlayer = MARK.X;
        this.nextMoveBoardAddress = "";

        this.player1 = player1;
        this.player2 = player2;

        this.rules = Rules.clone(rules);
    }

    static clone(game_instance) {
        let newGame = new Game(game_instance.mainBoard, game_instance.rules, game_instance.player1, game_instance.player2);
        newGame.currentPlayer = game_instance.currentPlayer;
        newGame.nextMoveBoardAddress = game_instance.nextMoveBoardAddress;

        return newGame;
    }

    static toJSON(game_instance) {
        return {
            mainBoard: Board.toJSON(game_instance.mainBoard),
            rules: Rules.toJSON(game_instance.rules),
            currentPlayer: game_instance.currentPlayer,
            nextMoveBoardAddress: game_instance.nextMoveBoardAddress,
            player1: game_instance.player1,
            player2: game_instance.player2,
        };
    }

    static fromJSON(data) {
        let newGame = new Game(Board.fromJSON(data.mainBoard), Rules.fromJSON(data.rules), data.player1, data.player2);
        newGame.currentPlayer = data.currentPlayer;
        newGame.nextMoveBoardAddress = data.nextMoveBoardAddress;

        return newGame;
    }
    
    /**
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
        if (!this.canClickOn(tile_address)) {
            return false;
        }

        this.mainBoard.markTile(this.currentPlayer, tile_address);
        this.currentPlayer = this.currentPlayer === MARK.X ? MARK.O : MARK.X;   
        this.#updateNextMoveBoardAddress(tile_address);
        return true;
    }

    getWinner() {
        this.mainBoard.firstMark();
    }
    
    getTile(address) {
        if (address === "") {
            return this.mainBoard;
        }

        let currentBoard = this.mainBoard;
        for (let i = 0; i < address.length; i++) {
            currentBoard = currentBoard.tiles[(+address[i])-1];
        }

        return currentBoard;
    }

    getValue(address) {
        let val;
        if (this.rules.boardCanHaveMultipleMarks) {
            val = this.getTile(address).value;
        } else {
            val = this.getTile(address).firstMark();
        }

        if (val === null) {
            return MARK.NONE;
        }
        else {
            return val;
        }
    }

    isPartOfValidLine(address) {
        if (address === "") {
            return false;
        }
        
        let parent_address = address.slice(0, -1);
        let index_in_board = (+address.slice(-1))-1;

        for(let i = 0; i < winningCombinations.length; i++) {
            let checking_comb = winningCombinations[i];
            
            if(!checking_comb.includes(index_in_board)) {
                continue;
            }
            else {
            }

            let line_value = this.getValue(parent_address+(checking_comb[0]+1));
            for (let j = 1; j < checking_comb.length; j++) {
                let curr_value = this.getValue(parent_address+(checking_comb[j]+1));
                if ([MARK.XO, MARK.OX].includes(line_value)) {
                    line_value = curr_value;
                }
                else if([MARK.XO, MARK.OX].includes(curr_value)) {
                    continue;
                }
                else if(line_value !== curr_value) {
                    line_value = MARK.NONE;
                    break;
                }
            }

            if (line_value !== MARK.NONE) {
                if(this.rules.boardCanHaveMultipleMarks) {
                    return true;
                }
                else if (this.getTile(parent_address).first_lines_indexes.includes(i)) {
                    return true;
                }
            }
        }

        return false;
    }

    winerName() {
        if (this.mainBoard.value === MARK.X) {
            return this.player1;
        }
        else if (this.mainBoard.value === MARK.O) {
            return this.player2;
        }
        else if ([MARK.XO, MARK.OX].includes(this.mainBoard.value)) {
            return this.player1 + " and " + this.player2;
        }
        return null;
    }

    canClickOn(address) {
        let tile = this.getTile(address);
        let not_contained_in_next_move = this.nextMoveBoardAddress.slice(0, address.length) !== address.slice(0, this.nextMoveBoardAddress.length);
        let mark_rule_part = !this.rules.keepPlacingInBoardAfterItIsMarked && this.getValue(address) !== MARK.NONE;
        let is_full = !tile.hasRoom();

        if (not_contained_in_next_move || mark_rule_part || is_full) {
            return false; 
        }

        return true;
    }

    #updateNextMoveBoardAddress(address_of_tile_clicked) {
        if (this.rules.newLinesAlsoTeleport) {
            while(address_of_tile_clicked !== "" && this.isPartOfValidLine(address_of_tile_clicked)) {
                address_of_tile_clicked = address_of_tile_clicked.slice(0, -1);
            }
        }

        let next_address = address_of_tile_clicked.slice(0, -2);
        next_address += address_of_tile_clicked.slice(-1);

        if (!this.rules.keepPlacingInBoardAfterItIsMarked) {
            while(next_address !== "" && this.getValue(next_address) !== MARK.NONE) {
                next_address = next_address.slice(0, -1);
            }
        }

        while(next_address !== "" && !this.getTile(next_address).hasRoom()) {
            next_address = next_address.slice(0, -1);
        }

        this.nextMoveBoardAddress = next_address;
    }
}

module.exports.MARK = MARK;
module.exports.Tile = Tile;
module.exports.Board = Board;
module.exports.Rules = Rules;
module.exports.Game = Game;