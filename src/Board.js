// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) { // 1
      var row = this.get(rowIndex);
      var intialValue = 0;
      for (var j = 0; j < row.length; j++) {
        if (row[j] !== 0) {
          intialValue ++;
        }
        if (intialValue > 1) {
          return true;
        }
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() { //board
      var size = this.get('n');
      for ( var i = 0; i < size; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var intialValue = 0;
      var size = this.get('n');
      for (var i = 0; i < size; i++) {
        var row = this.get(i);
        if (row[colIndex] !== 0) {
          intialValue ++;
        }
        if (intialValue > 1) {
          return true;
        }
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var size = this.get('n');
      for (var col = 0; col < size; col++) {
        if (this.hasColConflictAt(col)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) { // -1

      var initialValue = 0; // value we add in the end
      var size = this.get('n'); // gets us SIZE
      var columnIndex;
      var rowIndex;
      // used to identify our (column, rowIndex) ie: (X,Y)
      if (majorDiagonalColumnIndexAtFirstRow >= 0) {
        columnIndex = majorDiagonalColumnIndexAtFirstRow;
        rowIndex = 0
      } else {
        columnIndex = 0;
        rowIndex = Math.abs(majorDiagonalColumnIndexAtFirstRow);
      }

      while (columnIndex < size && rowIndex < size) {
        var row = this.get(rowIndex);
        if(row[columnIndex] === 1) {
          initialValue++;
        }
        if (initialValue > 1) {
          return true;
        }
        columnIndex++;
        rowIndex++;
      }
      return false;

      //APPROACH RECURSIVELY
      // var checkNextIter = function(board, columnInput, rowInput) {

      //   while (columnInput < size || rowInput < size) {
      //   // //  var row = board[rowInput]
      //   //   // if(row[ColumnInput] === 1) {
      //   //   //   initialvalue++;
      //   //   // }
      //   //   // if (initialvalue > 1) {
      //   //   //   return true;
      //   //   // }
      //       checkNextIter(board, columnInput++; rowInput++);
      //     }
      //     return false;
      //   };
      // return checkNextIter(board, columnIndex, rowIndex);
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var size = this.get('n');
      for (var i = (-size+1); i < size; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var initialValue = 0; // value we add in the end
      var size = this.get('n'); // gets us SIZE
      var columnIndex;
      var rowIndex;
      // used to identify our (column, rowIndex) ie: (X,Y)
      if (minorDiagonalColumnIndexAtFirstRow <= size-1) {
        columnIndex = minorDiagonalColumnIndexAtFirstRow;
        rowIndex = 0
      } else {
        columnIndex = size - 1;
        rowIndex = minorDiagonalColumnIndexAtFirstRow - (size - 1);
      }

      while (columnIndex > -1 && rowIndex < size) {
        var row = this.get(rowIndex);
        if(row[columnIndex] === 1) {
          initialValue++;
        }
        if (initialValue > 1) {
          return true;
        }
        columnIndex--;
        rowIndex++;
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var size = this.get('n');
      for (var i = 0; i < 2*size - 1; i++) { // 0 - 6
        if (this.hasMinorDiagonalConflictAt(i)) { // checks if has conflict
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
