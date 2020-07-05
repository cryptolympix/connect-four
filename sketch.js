let CW = 700;
let CH = 600;

let board = [];
let boardRow = 6;
let boardCol = 7;

let players = { HUMAN: 'red', AI: 'orange' };
let currentPlayer;
let end = false;

function setup() {
  createCanvas(CW, CH);
  reset();
}

function reset() {
  board = new Array(boardCol).fill(-Infinity);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(boardRow).fill(-Infinity);
  }
  end = false;
  currentPlayer = random() > 0.5 ? players.HUMAN : players.AI;
  if (currentPlayer === players.AI) {
    AI();
  }
}

function draw() {
  background(255);
  drawBoard();
  drawPieces();

  let result = checkWinner();
  if (result) {
    noLoop();
    if (result === players.AI) {
      fill('red');
      textSize(30);
      textAlign(CENTER);
      text('AI wins !', CW / 2, CH / 2);
    }
    if (result === players.HUMAN) {
      fill('green');
      textSize(30);
      textAlign(CENTER);
      text('You win !', CW / 2, CH / 2);
    }
  }
}

function drawBoard() {
  let w = CW / boardCol;
  let h = CH / boardRow;

  fill('#4169E1');
  rect(0, 0, CW, CH);

  for (let i = 0; i < boardCol; i++) {
    for (let j = 0; j < boardRow; j++) {
      let centerX = i * w + w / 2;
      let centerY = j * h + h / 2;
      let dw = w - 20;
      let dh = h - 20;
      fill(255);
      circle(centerX, centerY, dw, dh);
    }
  }
}

function drawPieces() {
  let w = CW / boardCol;
  let h = CH / boardRow;

  // Draw the pieces
  for (let i = 0; i < boardCol; i++) {
    for (let j = 0; j < boardRow; j++) {
      let centerX = i * w + w / 2;
      let centerY = CH - j * h - h / 2;
      let dw = w - 20;
      let dh = h - 20;
      if (board[i][j] === players.HUMAN) {
        fill('red');
        ellipse(centerX, centerY, dw, dh);
      }
      if (board[i][j] === players.AI) {
        fill('orange');
        ellipse(centerX, centerY, dw, dh);
      }
    }
  }
}

function mousePressed() {
  let w = CW / boardCol;
  if (!end && currentPlayer === players.HUMAN) {
    let col = floor(mouseX / w);
    // If the column is not full
    if (board[col][boardRow - 1] === -Infinity) {
      pushPiece(col, players.HUMAN);
      currentPlayer = players.AI;
      let result = checkWinner();
      if (result) {
        end = true;
      } else {
        AI();
      }
    }
  }
}

function keyPressed() {
  if (end && keyCode === ENTER) {
    reset();
    redraw();
  }
}

function AI() {
  if (currentPlayer === players.AI) {
    let bestMove = getBestMove();
    pushPiece(bestMove.col, players.AI);
    currentPlayer = players.HUMAN;
    let result = checkWinner();
    if (result) {
      end = true;
    }
  }
}

function pushPiece(col, player) {
  let j = 0;
  // Find the j index to place the piece vertically
  while (board[col][j] !== -Infinity && j < boardRow) {
    j++;
  }
  if (j < boardRow) {
    board[col][j] = player;
  }
}

function removePiece(col) {
  let j = boardRow - 1;
  // Find the j index to place the piece vertically
  while (board[col][j] === -Infinity && j >= 0) {
    j--;
  }
  if (j > -1) {
    board[col][j] = -Infinity;
  }
}

function isFullBoard() {
  for (let i = 0; i < boardCol; i++) {
    for (let j = 0; j < boardRow - 3; j++) {
      if (board[i][j] === -Infinity) return false;
    }
  }
  return true;
}

function isEmptyBoard() {
  for (let i = 0; i < boardCol; i++) {
    for (let j = 0; j < boardRow - 3; j++) {
      if (board[i][j] !== -Infinity) return false;
    }
  }
  return true;
}

function equals(a, b, c, d) {
  return a !== -Infinity && a === b && b === c && c === d;
}

function checkWinner() {
  let winner = null;

  // Check horizontally
  for (let j = 0; j < boardRow; j++) {
    for (let i = 0; i < boardCol - 3; i++) {
      if (equals(board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j])) {
        winner = board[i][j];
      }
    }
  }

  // Check vertically
  for (let i = 0; i < boardCol; i++) {
    for (let j = 0; j < boardRow - 3; j++) {
      if (equals(board[i][j], board[i][j + 1], board[i][j + 2], board[i][j + 3])) {
        winner = board[i][j];
      }
    }
  }

  // Check diagonales (left bottom - right top)
  for (let j = 0; j < boardRow - 3; j++) {
    for (let i = 0; i < boardCol - 3; i++) {
      if (
        equals(board[i][j], board[i + 1][j + 1], board[i + 2][j + 2], board[i + 3][j + 3])
      ) {
        winner = board[i][j];
      }
    }
  }

  // Check diagonales (left top - right bottom)
  for (let j = 3; j < boardRow; j++) {
    for (let i = 0; i < boardCol - 3; i++) {
      if (
        equals(board[i][j], board[i + 1][j - 1], board[i + 2][j - 2], board[i + 3][j - 3])
      ) {
        winner = board[i][j];
      }
    }
  }

  if (!winner && isFullBoard()) {
    return 'none';
  } else {
    return winner;
  }
}
