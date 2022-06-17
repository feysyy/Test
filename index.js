// Board
const chessboard = document.getElementById('board');

const row = 8;
const col = 8;
const cellSize = 50;
const border = 10;

const black = 'b';
const white = 'w';

// Chess piece names
const pawn = 'pawn';
const rook = 'rook';
const knight = 'knight';
const bishop = 'bishop';
const queen = 'queen';
const king = 'king';

// Assign chess pieces
const king_black = '&#9818;';
const king_white = '&#9812;';
const queen_black = '&#9819;';
const queen_white = '&#9813;';
const bishop_black = '&#9821;';
const bishop_white = '&#9815;';
const knight_black = '&#9822;';
const knight_white = '&#9816;';
const rook_black = '&#9820;';
const rook_white = '&#9814;';
const pawn_black = '&#9823;';
const pawn_white = '&#9817;';

let playerTurn = document.getElementById('turn');
let isMoving = null;

// Create board
function makeBoard(row, col) {
    let boardArr = [];
    for (let i = 0; i < row; i++) {
    let rowBoardArr = [];
        for (let j = 0; j < col; j++) {
            let value = true;
            if (i % 2 === 0) value = !value;
            if (j % 2 === 0) value = !value;
            rowBoardArr.push({ piece: null, background: value });
        }
    boardArr.push(rowBoardArr);
    }
    console.log(boardArr);
    return boardArr;
}

// Render board
function renderBoard() {
    let boardHTML = this.board.reduce(function(acc, item, index) {
        let row = ''
        item.forEach(function (box, idx) {
        let chessPiece, color, id, player = '';
        let classValue = box.background ? 'darkcyan' : 'lightcyan'; // Display alternate background

        if (box.piece) {
            chessPiece = box.piece.name;
            color = box.piece.color;
            id = 'data-piece=' + box.piece.id;
            player = 'data-player=' + color;
        }

        row += 
            '<div data-x=' + idx + ' class="' + classValue + '">' +          
                buildPiece(chessPiece, color, id , player) + 
            '</div>'; // create div with the chess piece
        })
        return acc += '<div data-y=' + index + ' class="row">' + row + '</div>';
    }, '');  
    chessboard.innerHTML = boardHTML;
}

function buildPiece(name, color, id , player) {
    value = '';
    if (!name) return value;
    
    if (name === pawn) value = color === black ? pawn_black : pawn_white;
    if (name === rook) value = color === black ? rook_black : rook_white;
    if (name === knight) value = color === black ? knight_black : knight_white;
    if (name === bishop) value = color === black ? bishop_black : bishop_white;
    if (name === queen) value = color === black ? queen_black : queen_white;
    if (name === king) value = color === black ? king_black : king_white;
    
    return '<div ' + id + ' ' + player + ' class="game-piece">' + value + '</div>';
}

function GamePiece(x, y, name, color, count) {
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    this.id = name + count + color;
    this.move(); // this will place the piece in the board
    game.pieces[this.id] = this; // keep all pieces together for easy access
}

// Place piece on the board 
GamePiece.prototype.move = function() {
    game.board[this.y][this.x].piece = this;
    game.render();
}

// Validate piece move 
GamePiece.prototype.update = function(x, y) {
    if (isMoveAllowed(this, x, y)) {
        this.x = x;
        this.y = y;
        this.move(); // Place piece on the board 
        game.render(); // Render piece on the board  
        game.updateTurn(); // Change player 
    } else {
        this.goBack(); // back to the original piece position if the move is invalid
    }
}

GamePiece.prototype.goBack = function() {
    this.move();
}

function isMoveAllowed(obj, x, y) {
    let isAllowed = false;
    
    if (obj.name === pawn) isAllowed = checkPawnRules(obj, x, y);
    if (obj.name === rook) isAllowed = checkRookRules(obj, x, y);
    if (obj.name === knight) isAllowed = checkKnightRules(obj, x, y);
    if (obj.name === bishop) isAllowed = checkBishopRules(obj, x, y);
    if (obj.name === queen) isAllowed = checkQueenRules(obj, x, y);
    if (obj.name === king) isAllowed = checkKingRules(obj, x, y);
    
    // Return true if the piece move is valid
    return isAllowed;
}

function checkPawnRules (obj, x, y) {
    let initialY = obj.color === black ? 1 : 6;
    let collisionValue = checkCollision(x, y);
    let result = true;
    console.log('sdsd', obj)
    if(y === 0 || y === 7) {
        obj.name = queen;
    }
    // always move straight
    if (obj.x !== x) result = false;

    // can't capture straight
    if (obj.x === x && collisionValue &&
        collisionValue.color !== obj.color) result = false;

    if (obj.color === white) {
        // can't go back, move one space
        if (obj.y < y || y !== obj.y - 1) {
        result = false;
        }
        // first move can jump 2 spaces
        if (initialY === obj.y && y === obj.y - 2 && obj.x === x) {
        result = true;
        }
    }

    if (obj.color === black) {
        // can't go back, move one space
        if (obj.y > y || y !== obj.y + 1) {
        result = false;
        }
        // first move can jump 2 spaces
        if (initialY === obj.y && y === obj.y + 2 && obj.x === x) {
        result = true;
        }
    }
    
    if (collisionValue && collisionValue.color !== obj.color) {
        if (x === obj.x - 1 || x === obj.x + 1) {
        console.log('capture');
        result = true;
        }
    }

    return result;
}

// todo
function checkRookRules (obj, x, y) {
    let dest = { x: x, y: y };
    let collisionValue = checkCollision(x, y);
    let ownColor = obj.color;
    
    // avoid moving in the same spot
    if (x === obj.x && y === obj.y) return false;

    // rook cant\'t move diagonal
    if (x !== obj.x && y !== obj.y) return false;
        
    // checks which way is moving 
    let letter = obj.x === x ? 'y' : 'x';
    
    // can not jump pieces
    let min = Math.min(obj[letter], dest[letter]) + 1;
    let max = Math.max(obj[letter], dest[letter]) - 1;
    
    for (let i = min; i <= max; i++) {
        if (letter === 'y') {
        if (checkCollision(x, i)) return false;
        } else {
        if (checkCollision(i, y)) return false;
        }
    }
    // if(collisionValue && collisionValue.name === king) {
    //     console.log('check')
    // }
    if (collisionValue && collisionValue.color !== ownColor || !collisionValue) return true;
    
    return false;
}

function checkKnightRules(initial, x, y) {
    let collisionValue = checkCollision(x, y);
    let ownColor = initial.color;
    
    if (collisionValue && collisionValue.color !== ownColor || !collisionValue) {
        if ( (y === initial.y + 2 && x === initial.x + 1) ||
            (y === initial.y + 2 && x === initial.x - 1) ||
            (y === initial.y - 2 && x === initial.x + 1) ||
            (y === initial.y - 2 && x === initial.x - 1) ) return true;
        
        if ( (x === initial.x + 2 && y === initial.y + 1) ||
            (x === initial.x + 2 && y === initial.y - 1) ||
            (x === initial.x - 2 && y === initial.y + 1) ||
            (x === initial.x - 2 && y === initial.y - 1) ) return true;  
    }
    return false;
}

function checkBishopRules(initial, x, y) {
    let collisionValue = checkCollision(x, y);
    
    let xDiff = Math.abs(initial.x - x);
    let yDiff = Math.abs(initial.y - y);
    
    
    // only moves diagonal
    if ( (xDiff === yDiff) && !collisionValue ||
    (collisionValue && collisionValue.color !== initial.color) ) {
        
        // cant move in same space
        if(xDiff === 0 && yDiff === 0) return false
        // TODO: bishop can not jump pieces    
        let spacesLength = xDiff - 1;
        // check if the movement is positive or negative
        let xOperator = getCoordOperator(initial.x, x);
        let yOperator = getCoordOperator(initial.y, y);
        
        // checks path for collision   
        for (let i = 1; i <= spacesLength; i++ ) {
        let xResult = operation[xOperator](initial.x, i);
        let yResult = operation[yOperator](initial.y, i);
        
        if (checkCollision(xResult, yResult)) return false;
        }
        
        return true; 
    }
    
    return false;
}

function getCoordOperator(start, end) {
    if (start < end) return 'sum';
    return 'sub'
}

let operation = {
    sum: function(a, b) { return a + b },
    sub: function(a, b) { return a - b }
}

function checkQueenRules(obj, x, y) {
    if (checkRookRules(obj, x, y) || checkBishopRules(obj, x, y)) return true;
    
    return false;
}

function checkKingRules(obj, x, y) {
    let xDiff = Math.abs(obj.x - x);
    let yDiff = Math.abs(obj.y - y);
    let collisionValue = checkCollision(x, y);
    let ownColor = obj.color;

    // can't capture the same color / check collision 
    if (collisionValue && collisionValue.color === ownColor) return false;  
    
    // can not jump to the same place
    if (obj.x === x && obj.y === y) return false;
    
    // no more than 1 space
    if (xDiff <= 1 && yDiff <= 1) return true;
    
    return false;
}

function drag(event) {
    if (event.target.classList.contains('game-piece')) { // check if the box has a piece
        let selectedPiece = event.target;

        //make sure that the piece is centered when dragged 
        let width = selectedPiece.offsetWidth / 2;
        let height = selectedPiece.offsetHeight / 2;

        // get player: dataset.player from attribute 'data-player=' (check this in renderBoard() function)
        let player = selectedPiece.dataset.player;
        
        // get player turn 
        let turn = game.turn ? black : white; 

        // check if player is dragging his own pieces
        if (player === turn) isMoving = true;
        
        selectedPiece.addEventListener('mousemove', function(e) {
        if (isMoving) {

            let x = e.clientX - width;
            let y = e.clientY - height;
            
            // Get the dimension of the board
            let board = chessboard.getBoundingClientRect();
            let coordX = x - board.x;
            let coordY = y - board.y;
            
            // Make sure that the piece can only be dragged inside the board   
            if (coordX < 0 || coordX > 375 || coordY < 0 || coordY > 375 ) return
                    
            let position = 'left:' + x + 'px;top:' + y + 'px; z-index: 1;';
            selectedPiece.setAttribute('style', position); // set position of the piece being dragged
            selectedPiece.classList.add('active'); // Add style to the piece being dragged
        }
        });
    }
}

function drop(event) {
    if (isMoving) { // check if player is being dragged
        let selectedPiece = event.target 
        let x = event.x;
        let y = event.y;

        selectedPiece.classList.remove('active'); // remove style to the dragged piece 

        let coords = getCoordinates(x, y);
        updateBoard(selectedPiece, coords);
    }

    isMoving = false;
}

function getCoordinates(x, y) {
    let board = chessboard.getBoundingClientRect();
    
    let coordX = x - board.x - border; 
    let coordY = y - board.y - border;
    
    const boardSize = row * cellSize;
    let resultX = Math.floor(coordX / boardSize * row);
    let resultY = Math.floor(coordY / boardSize * row);
    
    return { x: resultX, y: resultY };
}

function updateBoard(box, coord) {
    let x = coord.x;
    let y = coord.y;
    let id = box.dataset.piece;  
    let piece = game.pieces[id];
        
    // erase piece from initial coordinates
    game.board[piece.y][piece.x].piece = null;
    // update piece
    piece.update(x, y);
} 

function checkCollision(x, y) {
    return (game.board[y][x].piece) 
}


// Toggle player turn
function updateTurn() {
    this.turn = !this.turn;
    
    let classValue = this.turn ? 'player-black' : 'player-white'; // Add class to the playerTurn element depending who's player turn 
    let player = this.turn ? '&#9818; Black' : '&#9812; White'; // Piece and player to be displayed on the playerTurn element depending who's player turn 
    let feedBack = '<div class="' + classValue + '">' + player + '\'s Turn</div>';
    
    playerTurn.innerHTML = feedBack; // insert div inside the playerTurn element
}

// Game Module

const game = {
    board: makeBoard(row, col),
    render: renderBoard,
    pieces: {},
    turn: true,
    updateTurn: updateTurn,
    init: function() {
        chessboard.addEventListener('mousedown', drag);
        chessboard.addEventListener('mouseup', drop);

        // create black pawns
        for (let i = 0; i < 8; i++) {
        new GamePiece(i, 1, pawn, black, i);
        }

        // create white pawns
        for (let i = 0; i < 8; i++) {
        new GamePiece(i, 6, pawn, white, i);
        }
        
        // create white rook (x = vertical, y = horizaontal, piece, color, count)
        new GamePiece(0, 7, rook, white, 1);
        new GamePiece(7, 7, rook, white, 2);

        new GamePiece(1, 7, knight, white, 1);
        new GamePiece(6, 7, knight, white, 2);

        new GamePiece(2, 7, bishop, white, 1);
        new GamePiece(5, 7, bishop, white, 2);

        new GamePiece(3, 7, queen, white, 1);
        new GamePiece(4, 7, king, white, 1);

        new GamePiece(0, 0, rook, black, 1);
        new GamePiece(7, 0, rook, black, 2);

        new GamePiece(1, 0, knight, black, 1);
        new GamePiece(6, 0, knight, black, 2);

        new GamePiece(2, 0, bishop, black, 1);
        new GamePiece(5, 0, bishop, black, 2);

        new GamePiece(3, 0, queen, black, 1);
        new GamePiece(4, 0, king, black, 1);

        this.updateTurn();
        this.render();
    } 
}

game.init();


