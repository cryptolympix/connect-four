let MAX_DEPTH = 5;

function getBestMove() {
  let bestScore = -Infinity;
  let bestMoves = []; // best moves found

  // If the board is empty, choose a random column
  if (isEmptyBoard()) {
    let col = round(random() * boardCol);
    return { col };
  }

  for (let i = 0; i < boardCol; i++) {
    // If the column if not full
    if (board[i][boardRow - 1] === -Infinity) {
      pushPiece(i, players.AI);
      let score = minimax(board, 0, false);
      removePiece(i);
      if (score > bestScore) {
        bestMoves = [];
        bestScore = score;
      }
      if (score === bestScore) {
        bestMoves.push({ col: i });
      }
    }
  }

  if (bestMoves.length > 1) {
    let rand = floor(random() * bestMoves.length);
    return bestMoves[rand];
  } else {
    return bestMoves[0];
  }
}

function minimax(board, depth, isMaximizingPlayer) {
  if (depth > MAX_DEPTH) {
    return 0;
  }

  let result = checkWinner();
  if (result) {
    if (result === 'none') return 0;
    if (result === players.HUMAN) return -10;
    if (result === players.AI) return 100;
  }

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < boardCol; i++) {
      // If the column if not full
      if (board[i][boardRow - 1] === -Infinity) {
        pushPiece(i, players.AI);
        let score = minimax(board, depth + 1, false);
        removePiece(i);
        bestScore = max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boardCol; i++) {
      // If the column if not full
      if (board[i][boardRow - 1] === -Infinity) {
        pushPiece(i, players.HUMAN);
        let score = minimax(board, depth + 1, true);
        removePiece(i);
        bestScore = min(score, bestScore);
      }
    }
    return bestScore;
  }
}
