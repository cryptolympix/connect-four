// Canvas dimensions
let CW = 600;
let CH = 550;

// Dimensions for the mobiles
if (window.innerWidth < 767) {
  CW = (5 * window.innerWidth) / 6;
  CH = CW - CW / 12;
}

// Information above the board
let gameMessageView;
let gameMessage;
let gameMessageColor;

let board = [];
let BOARD_NUM_ROW = 6;
let BOARD_NUM_COL = 7;

let players = { HUMAN: 'human', AI: 'ai' };
let currentPlayer;
let end = false;

function setup() {
  gameMessageView = createP();
  createCanvas(CW, CH);
  reset();
}

function reset() {
  board = new Array(BOARD_NUM_COL).fill(null);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(BOARD_NUM_ROW).fill(null);
  }
  end = false;
  currentPlayer = players.HUMAN;
}

function draw() {
  background(255);
  drawBoard();
  drawPieces();
  drawGameInfo();
}

function drawGameInfo() {
  if (!end) {
    if (currentPlayer === players.AI) {
      gameMessageColor = 'lightgrey';
      gameMessage = 'AI is searching a move...';
    } else {
      gameMessageColor = '#4169E1';
      gameMessage = "It's your turn :)";
    }
  } else {
    let result = checkWinner();
    if (result) {
      if (result === 'none') {
        gameMessageColor = '#4169E1';
        gameMessage = 'No winner';
      }
      if (result === players.AI) {
        gameMessageColor = 'red';
        gameMessage = 'AI has been better than you...';
      }
      if (result === players.HUMAN) {
        gameMessageColor = 'green';
        gameMessage = 'Well played !';
      }
    }
  }

  gameMessageView.html(gameMessage);
  gameMessageView.size(CW, 20);
  gameMessageView.style('color', gameMessageColor);
  gameMessageView.style('text-align', 'center');
  gameMessageView.style('font-family', 'Nunito');
  gameMessageView.style('font-size', '20px');
  gameMessageView.style('font-style', 'italic');
}

function drawBoard() {
  let w = CW / BOARD_NUM_COL;
  let h = CH / BOARD_NUM_ROW;

  stroke(0);
  strokeWeight(1);
  fill('#4169E1');
  rect(0, 0, CW, CH);

  for (let i = 0; i < BOARD_NUM_COL; i++) {
    for (let j = 0; j < BOARD_NUM_ROW; j++) {
      let centerX = i * w + w / 2;
      let centerY = j * h + h / 2;
      let dw = w - w / 6;
      let dh = h - h / 6;
      fill(255);
      ellipse(centerX, centerY, dw, dh);
    }
  }
}

function drawPieces() {
  let w = CW / BOARD_NUM_COL;
  let h = CH / BOARD_NUM_ROW;

  // Draw the pieces
  for (let i = 0; i < BOARD_NUM_COL; i++) {
    for (let j = 0; j < BOARD_NUM_ROW; j++) {
      let centerX = i * w + w / 2;
      let centerY = CH - j * h - h / 2;
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
  let w = CW / BOARD_NUM_COL;

  // Ignore all the mouse event outside of the board
  if (mouseX < 0 || mouseX > CW || mouseY < 0 || mouseY > CH) return;

  if (!end && currentPlayer === players.HUMAN) {
    let col = floor(mouseX / w);
    // If the column is not full
    if (!board[col][BOARD_NUM_ROW - 1]) {
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
  while (board[col][j] && j < BOARD_NUM_ROW) {
    j++;
  }
  if (j < BOARD_NUM_ROW) {
    board[col][j] = player;
  }
}

function removePiece(col) {
  let j = BOARD_NUM_ROW - 1;
  // Find the j index to place the piece vertically
  while (!board[col][j] && j >= 0) {
    j--;
  }
  if (j > -1) {
    board[col][j] = null;
  }
}

function isFullBoard() {
  for (let i = 0; i < BOARD_NUM_COL; i++) {
    for (let j = 0; j < BOARD_NUM_ROW; j++) {
      if (!board[i][j]) return false;
    }
  }
  return true;
}

function isEmptyBoard() {
  for (let i = 0; i < BOARD_NUM_COL; i++) {
    for (let j = 0; j < BOARD_NUM_ROW; j++) {
      if (board[i][j]) return false;
    }
  }
  return true;
}

function equals(a, b, c, d) {
  return a !== null && a === b && b === c && c === d;
}

function checkWinner() {
  let winner = null;

  // Check horizontally
  for (let j = 0; j < BOARD_NUM_ROW; j++) {
    for (let i = 0; i < BOARD_NUM_COL - 3; i++) {
      if (equals(board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j])) {
        winner = board[i][j];
      }
    }
  }

  // Check vertically
  for (let i = 0; i < BOARD_NUM_COL; i++) {
    for (let j = 0; j < BOARD_NUM_ROW - 3; j++) {
      if (equals(board[i][j], board[i][j + 1], board[i][j + 2], board[i][j + 3])) {
        winner = board[i][j];
      }
    }
  }

  // Check diagonales (left bottom - right top)
  for (let j = 0; j < BOARD_NUM_ROW - 3; j++) {
    for (let i = 0; i < BOARD_NUM_COL - 3; i++) {
      if (
        equals(board[i][j], board[i + 1][j + 1], board[i + 2][j + 2], board[i + 3][j + 3])
      ) {
        winner = board[i][j];
      }
    }
  }

  // Check diagonales (left top - right bottom)
  for (let j = 3; j < BOARD_NUM_ROW; j++) {
    for (let i = 0; i < BOARD_NUM_COL - 3; i++) {
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
