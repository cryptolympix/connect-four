let MAX_DEPTH = 7; // The AI anticipates the plays up to 8 laps in advance.

function getBestMove(depth = MAX_DEPTH) {
  let bestScore = -Infinity;
  let bestMoves = []; // best moves found

  // If the board is empty, choose a random column
  if (isEmptyBoard()) {
    let col = round(random() * BOARD_NUM_COL);
    return { col };
  }

  for (let i = 0; i < BOARD_NUM_COL; i++) {
    // If the column if not full
    if (!board[i][BOARD_NUM_ROW - 1]) {
      pushPiece(i, players.AI);
      let score = alphabeta(board, depth, -Infinity, Infinity, false);
      removePiece(i);
      if (score > bestScore) {
        bestMoves = [];
        bestScore = score;
      }
      if (score == bestScore) {
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

function alphabeta(board, depth, alpha, beta, isMaximizingPlayer) {
  let result = checkWinner();
  if (result) {
    if (result === 'none') return 0;
    if (result === players.HUMAN) return -10;
    if (result === players.AI) return 10;
  }

  if (depth == 0) return 0;

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < BOARD_NUM_COL; i++) {
      // If the column if not full
      if (!board[i][BOARD_NUM_ROW - 1]) {
        pushPiece(i, players.AI);
        let score = alphabeta(board, depth - 1, alpha, beta, false);
        removePiece(i);
        bestScore = max(score, bestScore);
        alpha = max(alpha, score);
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < BOARD_NUM_COL; i++) {
      // If the column if not full
      if (!board[i][BOARD_NUM_ROW - 1]) {
        pushPiece(i, players.HUMAN);
        let score = alphabeta(board, depth - 1, alpha, beta, true);
        removePiece(i);
        bestScore = min(score, bestScore);
        beta = min(beta, score);
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  }
}
