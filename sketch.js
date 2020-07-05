let CW = 600;
let CH = 650;
let BOARD_W = 600;
let BOARD_H = 550;

// Dimensions for the mobiles
if (window.innerWidth < 600) {
  CW = (5 * window.innerWidth) / 6;
  CH = CW + CW / 6;
  BOARD_W = CW;
  BOARD_H = CW - CW / 12;
}

let TEXT_SIZE = 20;

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
  currentPlayer = players.HUMAN;
}

function draw() {
  background(255);
  drawBoard(0, CH - BOARD_H);
  if (end) drawResult();
  else drawMessage();
}

function drawMessage() {
  noStroke();
  textFont('Nunito');
  textSize(TEXT_SIZE);
  textAlign(CENTER);
  textStyle(ITALIC);
  if (currentPlayer === players.AI) {
    fill('lightgrey');
    text('AI is thinking...', CW / 2, (CH - BOARD_H) / 2 + TEXT_SIZE / 2);
  } else {
    fill('#4169E1');
    text("It's your turn :)", CW / 2, (CH - BOARD_H) / 2 + TEXT_SIZE / 2);
  }
}

function drawResult() {
  noStroke();
  textFont('Nunito');
  textSize(TEXT_SIZE);
  textAlign(CENTER);
  textStyle(ITALIC);
  let result = checkWinner();
  if (result) {
    if (result === 'none') {
      fill('#4169E1');
      text('No winner', CW / 2, (CH - BOARD_H) / 2 + TEXT_SIZE / 2);
    }
    if (result === players.AI) {
      fill('red');
      text('AI has been better than you...', CW / 2, (CH - BOARD_H) / 2 + TEXT_SIZE / 2);
    }
    if (result === players.HUMAN) {
      fill('green');
      text('Well played !', CW / 2, (CH - BOARD_H) / 2 + TEXT_SIZE / 2);
    }
  }
}

function drawBoard(x, y) {
  let w = BOARD_W / boardCol;
  let h = BOARD_H / boardRow;

  stroke(0);
  strokeWeight(1);
  fill('#4169E1');
  rect(x, y, BOARD_W, BOARD_H);

  for (let i = 0; i < boardCol; i++) {
    for (let j = 0; j < boardRow; j++) {
      let centerX = x + i * w + w / 2;
      let centerY = y + j * h + h / 2;
      let dw = w - w / 6;
      let dh = h - h / 6;
      fill(255);
      ellipse(centerX, centerY, dw, dh);
    }
  }

  drawPieces(x, y);
}

function drawPieces(x, y) {
  let w = BOARD_W / boardCol;
  let h = BOARD_H / boardRow;

  // Draw the pieces
  for (let i = 0; i < boardCol; i++) {
    for (let j = 0; j < boardRow; j++) {
      let centerX = x + i * w + w / 2;
      let centerY = y + BOARD_H - j * h - h / 2;
      let dw = w - w / 6;
      let dh = h - h / 6;
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

function mouseReleased() {
  let w = CW / boardCol;

  // Ignore all the mouse event outside of the board
  if (mouseX < 0 || mouseX > CW || mouseY < CH - BOARD_H || mouseY > CH) return;

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
        setTimeout(function () {
          AI();
        }, 500);
      }
    }
  }
}

function keyPressed() {
  if (end && keyCode === ENTER) {
    reset();
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
    for (let j = 0; j < boardRow; j++) {
      if (board[i][j] === -Infinity) return false;
    }
  }
  return true;
}

function isEmptyBoard() {
  for (let i = 0; i < boardCol; i++) {
    for (let j = 0; j < boardRow; j++) {
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
