/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other


window.findNRooksSolution = function(n) {
  var baseBoard = new Board({n: n});
  var solution = [];

  var helper = function(row) {
    if (row === n) {
      solution = baseBoard.rows();
      return solution;
    }

    for (var col = 0; col < n; col++) {
      baseBoard.togglePiece(row, col);
      if (baseBoard.hasColConflictAt(col) === false) {
        helper(row + 1);
      } else { // else returns one solution
        baseBoard.togglePiece(row, col);
      }
    }

  };
  helper(0);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var baseBoard = new Board({n: n});

  var helper = function(row) {
    if (row === n) {
      solutionCount++; // 1
      return;
    }

    for (var col = 0; col < n; col++) { // [0, 1]
      baseBoard.togglePiece(row, col);

      if (baseBoard.hasColConflictAt(col) === false) { // false
        helper(row + 1);
      }
      // debugger;
      baseBoard.togglePiece(row, col); // [0, 0]
    }
  };
  helper(0);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  n = 4;
  var baseBoard = new Board({n: n});
  var solution = baseBoard.rows();

  var helper = function(row) {
    if (row === n) {
      return solution;
    }
    for (var col = 0; col < n; col++) {
      debugger;
      baseBoard.togglePiece(row, col);
      if (baseBoard.hasAnyQueensConflicts() === false) {
        var nextToggle = helper(row + 1);
        if (nextToggle) {
          return nextToggle;
        }
      }
      baseBoard.togglePiece(row, col);
    }
  };
  helper(0);

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var baseBoard = new Board({n: n});

  var helper = function(row) {
    if (row === n) {
      solutionCount++;
      return;
    }

    for (var col = 0; col < n; col++) {
      baseBoard.togglePiece(row, col);
      if (!baseBoard.hasAnyQueensConflicts()) { //hasAnyRooksConflicts  hasColConflictAt
        helper(row + 1);
      }
      baseBoard.togglePiece(row, col);
    }
  };
  helper(0);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
