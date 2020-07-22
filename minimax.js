let MAX_DEPTH = 8;

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
    if (!board[i][boardRow - 1]) {
      pushPiece(i, players.AI);
      let score = minimax(board, MAX_DEPTH, -Infinity, Infinity, false);
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

function minimax(board, depth, alpha, beta, isMaximizingPlayer) {
  if (depth == 0) {
    return 0;
  }

  let result = checkWinner();
  if (result) {
    if (result === 'none') return 0;
    if (result === players.HUMAN) return -10;
    if (result === players.AI) return 10;
  }

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < boardCol; i++) {
      // If the column if not full
      if (!board[i][boardRow - 1]) {
        pushPiece(i, players.AI);
        let score = minimax(board, depth - 1, alpha, beta, false);
        removePiece(i);
        bestScore = max(score, bestScore);
        alpha = max(alpha, score);
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boardCol; i++) {
      // If the column if not full
      if (!board[i][boardRow - 1]) {
        pushPiece(i, players.HUMAN);
        let score = minimax(board, depth - 1, alpha, beta, true);
        removePiece(i);
        bestScore = min(score, bestScore);
        beta = min(beta, score);
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  }
}
