// start a variable to hold the current board
var initialBoard = ['E','B','E','B','E','B','E','B','E','B','B','E','B','E','B','E','B','E','B','E','E','B','E','B','E','B','E','B','E','B','B','E','B','E','B','E','B','E','B','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','W','E','W','E','W','E','W','E','W','W','E','W','E','W','E','W','E','W','E','E','W','E','W','E','W','E','W','E','W','W','E','W','E','W','E','W','E','W','E'];

var humanScore = 0;
var robotScore = 0;
var drawScore = 0;

// State is initialized with the old state of the game, in order to have a reference to advance the game.
var State = function(old) {
  // Sets whose turn it is (human or ai)
  this.turn = "";

  this.finished = false;
  // Black Moves Count: number of moves for the AI player
  this.blackMovesCount = 0;

  this.capBlackPieces = 0;
  this.capWhitePieces = 0;

  // result: the result of the game given the current state
  this.result = "still running";

  this.board = initialBoard;

  // This conditional is the object constructor. if old exists, the state is constructed given the parameters of the old state.
  if (typeof old !== "undefined") {
    // the next lines copy the previous board state to the current board
    var len = old.board.length;
    this.board = new Array(len);
    for (var i = 0; i < len; i++) {
      this.board[i] = old.board[i];
    }

    this.blackMovesCount = old.blackMovesCount;
    this.capBlackPieces = old.capBlackPieces;
    this.capWhitePieces = old.capWhitePieces;
    this.result = old.result;
    this.turn = old.turn;
  }

  this.position = function(index) {
    return this.board[index];
  }

  // expands out arrays for multiple jumps
  this.expandOutArray = function(array) {
    var containsArray = false;
    var arrayIndices = [];

    for (i = 0; i < array.length; i++) {
      if (typeof array[i] == 'object') {
        containsArray = true;
        arrayIndices.push(i);
      }
    }

    if (containsArray) {
      for (i = 0; i < arrayIndices.length; i++) {
        var newArray = array.concat(array[arrayIndices[i]])
        newArray.splice(arrayIndices[i],1);
      }
      return this.expandOutArray(newArray);
    } else {
      array = array.filter(function(x) {return x != undefined});
      return array;
    }
  }

  // check if is king, return boolean
  this.isKing = function(index) {
    return /K/.test(this.position(index));
  }

  // get opposing color
  this.oppColor = function(index) {
    return /W/.test(this.position(index)) ? "B" : "W";
  }

  // set movement functions for each direction, check if empty space. Boolean functions
  this.canMoveLowerLeft = function(index) {
    return this.position(index + 9) == "E";
  }

  this.canMoveLowerRight = function(index) {
    return this.position(index + 11) == "E";
  }

  this.canMoveUpperLeft = function(index) {
    return this.position(index - 11) == "E";
  }

  this.canMoveUpperRight = function(index) {
    return this.position(index - 9) == "E";
  }

  //make jump checker functions, Boolean
  // make so it's not opp color, because that means black can't capture white kings
  this.canJumpLowerLeft = function(index) {
    if (index + 9 < 100 && index + 18 < 100) {
      return this.position(index + 9).includes(this.oppColor(index)) && this.position(index + 18) == "E" && Math.floor(index / 10) + 1 == Math.floor((index + 9) / 10) && Math.floor((index + 9) / 10) + 1 == Math.floor((index + 18) / 10);
    } else {
      return false;
    }
  }

  this.canJumpLowerRight = function(index) {
    if (index + 11 < 100 && index + 22 < 100) {
      return this.position(index + 11).includes(this.oppColor(index)) && this.position(index + 22) == "E" && Math.floor(index / 10) + 1 == Math.floor((index + 11) / 10) && Math.floor((index + 11) / 10) + 1 == Math.floor((index + 22) / 10);
    } else {
      return false;
    }
  }

  this.canJumpUpperLeft = function(index) {
    if (index - 11 > 0 && index - 22 > 0) {
      return this.position(index - 11).includes(this.oppColor(index)) && this.position(index - 22) == "E" && Math.floor(index / 10) - 1 == Math.floor((index - 11) / 10) && Math.floor((index - 11) / 10) - 1 == Math.floor((index - 22) / 10);
    } else {
      return false;
    }
  }

  this.canJumpUpperRight = function(index) {
    if (index - 9 > 0 && index - 18 > 0) {
      return this.position(index - 9).includes(this.oppColor(index)) && this.position(index - 18) == "E" && Math.floor(index / 10) - 1 == Math.floor((index - 9) / 10) && Math.floor((index - 9) / 10) - 1 == Math.floor((index - 18) / 10);
    } else {
      return false;
    }
  }

  // checks if a given piece has any jumps (currently only single jumps)
  this.canJumpAny = function(index) {
    var jumpSpaces = [];
    // if white, white conditions
    if (/W/.test(this.position(index))) {
      // if left wall
      if (index % 10 == 0) {
        if (this.canJumpUpperRight(index)) {
          jumpSpaces.push(index - 18);
        }
        if (this.isKing(index)) {
          if (this.canJumpLowerRight(index)) {
            jumpSpaces.push(index + 22);
          }
        }
        //if right wall
      } else if ((index - 9)% 10 == 0) {
        if (this.canJumpUpperLeft(index)) {
          jumpSpaces.push(index - 22);
        }
        if (this.isKing(index)) {
          if (this.canJumpLowerLeft(index)) {
            jumpSpaces.push(index + 18);
          }
        }
        // everywhere else
      } else {
        if (!this.isKing(index) || (this.isKing(index) && index > 90)){
          if (this.canJumpUpperRight(index)) {
            jumpSpaces.push(index - 18);
          }
          if (this.canJumpUpperLeft(index)) {
            jumpSpaces.push(index - 22);
          }
        }
        if (this.isKing(index) && index > 10 && index < 90 ) {
          if (this.canJumpUpperRight(index)) {
            jumpSpaces.push(index - 18);
          }
          if (this.canJumpUpperLeft(index)) {
            jumpSpaces.push(index - 22);
          }
          if (this.canJumpLowerRight(index)) {
            jumpSpaces.push(index + 22);
          }
          if (this.canJumpLowerLeft(index)) {
            jumpSpaces.push(index + 18);
          }
        }
        if (this.isKing(index) && index < 10) {
          if (this.canJumpLowerRight(index)) {
            jumpSpaces.push(index + 22);
          }
          if (this.canJumpLowerLeft(index)) {
            jumpSpaces.push(index + 18);
          }
        }
      }
    } else { // black actions
      // if left wall
      if (index % 10 == 0) {
        if (this.canJumpLowerRight(index)) {
          jumpSpaces.push(index + 22);
        }
        if (this.isKing(index)) {
          if (this.canJumpUpperRight(index)) {
            jumpSpaces.push(index - 18);
          }
        }
        //if right wall
      } else if ((index - 9) % 10 == 0) {
        if (this.canJumpLowerLeft(index)) {
          jumpSpaces.push(index + 18);
        }
        if (this.isKing(index)) {
          if (this.canJumpUpperLeft(index)) {
            jumpSpaces.push(index - 22);
          }
        }
        // everywhere else
      } else {
        if (!this.isKing(index) || (this.isKing(index) && index < 10)){
          if (this.canJumpLowerRight(index)) {
            jumpSpaces.push(index + 22);
          }
          if (this.canJumpLowerLeft(index)) {
            jumpSpaces.push(index + 18);
          }
        }
        if (this.isKing(index) && index > 10 && index < 90 ) {
          if (this.canJumpUpperRight(index)) {
            jumpSpaces.push(index - 18);
          }
          if (this.canJumpUpperLeft(index)) {
            jumpSpaces.push(index - 22);
          }
          if (this.canJumpLowerRight(index)) {
            jumpSpaces.push(index + 22);
          }
          if (this.canJumpLowerLeft(index)) {
            jumpSpaces.push(index + 18);
          }
        }
        if (this.isKing(index) && index > 89) {
          if (this.canJumpUpperRight(index)) {
            jumpSpaces.push(index - 18);
          }
          if (this.canJumpUpperLeft(index)) {
            jumpSpaces.push(index - 22);
          }
        }
      }
    }
    return jumpSpaces;
  }

  // checks if a given piece has any valid moves
  this.canMoveAny = function(index) {
    if (this.position(index) !== "E") {
      var moveSpaces = [];
      // if white, white conditions
      if (/W/.test(this.position(index))) {
        // if left wall
        if (index % 10 == 0) {
          if (this.canMoveUpperRight(index)) {
            moveSpaces.push(index - 9);
          }
          if (this.isKing(index)) {
            if (this.canMoveLowerRight(index)) {
              moveSpaces.push(index + 11);
            }
          }
          //if right wall
        } else if ((index - 9) % 10 == 0) {
          if (this.canMoveUpperLeft(index)) {
            moveSpaces.push(index - 11);
          }
          if (this.isKing(index)) {
            if (this.canMoveLowerLeft(index)) {
              moveSpaces.push(index + 9);
            }
          }
          // everywhere else
        } else {
          if (!this.isKing(index) || (this.isKing(index) && index > 89)){
            if (this.canMoveUpperRight(index)) {
              moveSpaces.push(index - 9);
            }
            if (this.canMoveUpperLeft(index)) {
              moveSpaces.push(index - 11);
            }
          }
          if (this.isKing(index) && index > 10 && index < 90 ) {
            if (this.canMoveUpperRight(index)) {
              moveSpaces.push(index - 9);
            }
            if (this.canMoveUpperLeft(index)) {
              moveSpaces.push(index - 11);
            }
            if (this.canMoveLowerRight(index)) {
              moveSpaces.push(index + 11);
            }
            if (this.canMoveLowerLeft(index)) {
              moveSpaces.push(index + 9);
            }
          }
          if (this.isKing(index) && index < 10) {
            if (this.canMoveLowerRight(index)) {
              moveSpaces.push(index + 11);
            }
            if (this.canMoveLowerLeft(index)) {
              moveSpaces.push(index + 9);
            }
          }
        }
      } else { // black actions
        // if left wall
        if (index % 10 == 0) {
          if (this.canMoveLowerRight(index)) {
            moveSpaces.push(index + 11);
          }
          if (this.isKing(index)) {
            if (this.canMoveUpperRight(index)) {
              moveSpaces.push(index - 9);
            }
          }
          //if right wall
        } else if ((index - 9) % 10 == 0) {
          if (this.canMoveLowerLeft(index)) {
            moveSpaces.push(index + 9);
          }
          if (this.isKing(index)) {
            if (this.canMoveUpperLeft(index)) {
              moveSpaces.push(index - 11);
            }
          }
          // everywhere else
        } else {
          if (!this.isKing(index) || (this.isKing(index) && index < 10)){
            if (this.canMoveLowerRight(index)) {
              moveSpaces.push(index + 11);
            }
            if (this.canMoveLowerLeft(index)) {
              moveSpaces.push(index + 9);
            }
          }
          if (this.isKing(index) && index > 10 && index < 90 ) {
            if (this.canMoveUpperRight(index)) {
              moveSpaces.push(index - 9);
            }
            if (this.canMoveUpperLeft(index)) {
              moveSpaces.push(index - 11);
            }
            if (this.canMoveLowerRight(index)) {
              moveSpaces.push(index + 11);
            }
            if (this.canMoveLowerLeft(index)) {
              moveSpaces.push(index + 9);
            }
          }
          if (this.isKing(index) && index > 89) {
            if (this.canMoveLowerRight(index)) {
              moveSpaces.push(index + 11);
            }
            if (this.canMoveLowerLeft(index)) {
              moveSpaces.push(index + 9);
            }
          }
        }
      }
      return moveSpaces;

    }
  }

  // checks the number of jumps for a given piece.number is a variable to keep track through recursion how many jumps. if multiplepaths, return array of numbers
  this.numberOfJumps = function(index, number, board = this.board) {
    var currentBoard = board.slice(0);
    var state = new State()
    state.board = currentBoard

    if (state.canJumpAny(index).length > 1) {
      var numJumpArray = [];
      var jumps = state.canJumpAny(index);

      for (i = 0; i < jumps.length; i++) {
        var pos1 = index;
        var pos2 = jumps[i];
        var pos3 = (index + jumps[i]) / 2;
        var newBoard = currentBoard.slice(0);


        newBoard[pos2] = currentBoard[pos1];
        newBoard[pos1] = "E";
        newBoard[pos3] = "E";
        numJumpArray.push(state.numberOfJumps(jumps[i], number + 1, newBoard));
      }
      return numJumpArray;

    } else if (state.canJumpAny(index).length == 1) {
      var pos1 = index;
      var pos2 = state.canJumpAny(index)[0];
      var pos3 = (state.canJumpAny(index)[0] + index) / 2;

      currentBoard[pos2] = currentBoard[pos1];
      currentBoard[pos1] = "E";
      currentBoard[pos3] = "E";

      return [index, state.numberOfJumps(pos2, number + 1, currentBoard)];
    } else {
      return [index, currentBoard[state.canJumpAny(index)[0]]];
    }
  }

  // check for valid moves for all pieces of a given color. if jumps are available, they are they only valid moves
  this.allValidMoves = function(color) {
    var validMoves = [];
    var validJumps = [];

    matcher = new RegExp(color);

    // refactor to check jumps first, to save computational time
    for (i = 0; i < 100; i++) {
      if (matcher.test(this.position(i))) {
        var moves = this.canMoveAny(i);
        var jumps = this.canJumpAny(i);

        if (moves.length > 0) {
          for (j = 0; j < moves.length; j++) {
            if (moves[j].length > 1) {
              // get them all as individual pairs
              for (k = 0; k < moves[j].length; k++) {
                validMoves.push([i],moves[j][k]);
              }
            } else {
              validMoves.push([i,moves[j]]);
            }
          }
        }

        // this will be copied as above
        if (jumps.length > 0) {
          for (j = 0; j < jumps.length; j++) {
            if (jumps[j].length > 1) {
              // get them all as individual pairs
              for (k = 0; k < jumps[j].length; k++) {
                validJumps.push([i],jumps[j][k]);
              }
            } else {
              validJumps.push([i,jumps[j]]);
            }
          }
        }
      }
    }
    // if there are any jumps, they are the only valid moves and check multiples. else, return other moves.
    if (validJumps.length > 0) {
      return validJumps;
    } else {
      return validMoves;
    }
  }

  // check for valid moves for a given index. if jumps are available, they are they only valid moves
  this.indexValidMoves = function(i) {
    var validMoves = [];
    var validJumps = [];

    var moves = this.canMoveAny(i);
    var jumps = this.canJumpAny(i);
    if (moves.length > 0) {
      for (j = 0; j < moves.length; j++) {
        if (moves[j].length > 1) {
          // get them all as individual pairs
          for (k = 0; k < moves[j].length; k++) {
            validMoves.push([i],moves[j][k]);
          }
        } else {
          validMoves.push([i,moves[j]]);
        }
      }
    }

    // this will be copied as above
    if (jumps.length > 0) {
      for (j = 0; j < jumps.length; j++) {
        if (jumps[j].length > 1) {
          // get them all as individual pairs
          for (k = 0; k < jumps[j].length; k++) {
            valiJumps.push([i],jumps[j][k]);
          }
        } else {
          validJumps.push([i,jumps[j]]);
        }
      }
    }
    // if there are any jumps, they are the only valid moves and check for multiple jumps. else, return other moves.
    if (validJumps.length > 0) {
      var validJumpArray = [];
      for (j = 0; j < validJumps.length; j++) {

        var newBoard = this.board.slice(0);

        newBoard[validJumps[j][1]] = newBoard[validJumps[j][0]];
        newBoard[(validJumps[j][1] + validJumps[j][0]) / 2] = "E";
        newBoard[validJumps[j][0]] = "E";

        var multiJump = this.numberOfJumps(validJumps[j][1], 0, newBoard);

        multiJump = this.expandOutArray(multiJump);

        if (multiJump.length > 1) {
          validJumpArray.push([validJumps[j][0], multiJump[multiJump.length - 1]]);
        } else {
          validJumpArray.push(validJumps[j]);
        }
      }
      return validJumpArray;
    } else {
      return validMoves;
    }
  }

  this.checkForKings = function() {
    var whiteKings = [];
    var blackKings = [];

    for (i = 0; i < 100; i++) {
      if (this.isKing(i) && /W/.test(this.position(i))) {
        whiteKings.push(i);
      } else if (this.isKing(i) && /B/.test(this.position(i))) {
        blackKings.push(i);
      }
    }
    return [whiteKings, blackKings];
  }
  // Now we define functions of state
  this.advanceTurn = function() {
    this.turn = this.turn == "W" ? "B" : "W";
  }

  // IsTerminal checks if the current state is a terminal state by checking each possible win condition and draw condition. Returns true if terminal, false if not.
  this.isTerminal = function() {
    // First, check win conditions

    //Check if black has run out of pieces
    if (this.capBlackPieces == 20) {
      this.result = "White won";
      return true;

      //Check if white has run out of pieces
    } else if (this.capWhitePieces == 20) {
      this.result = "Black won";
      return true;

      //Check if white has run out of moves
    } else if (this.allValidMoves("W").length == 0) {
      this.result = "Black won";
      return true;

      //Check if black has run out of moves
    } else if (this.allValidMoves("B").length == 0) {
      this.result = "White won";
      return true;

      //Then check draw conditions
    } else if (this.checkForKings()[0].length == 1 && this.checkForKings()[1].length == 1 && this.capBlackPieces == 19 && this.capWhitePieces == 19) {
      this.result = "draw";
      return true;
    } else {
      return false;
    }
  }
}

// This function defines the game itself. this contains the information of what sort of AI player, current game state, and whether the game is still running. It also controls moving the game to different states and a way to start the game.
var Game = function(autoPlayer) {
  this.ai = autoPlayer;

  // Initializes to an empty board configuration
  this.currentState = new State();

  // Inital board state
  this.currentState.board = initialBoard;

  this.currentState.turn = "W";

  this.status = "beginning";

  // This next function advances the game ahead one state
  this.advanceTo = function(_state) {
    this.currentState = _state;
    if (_state.isTerminal()) {
      this.status = "ended";

      if (_state.result == "White won") {
        human.switchViewTo("won");
        humanScore++;
      } else if (_state.result == "Black won") {
        human.switchViewTo("lost");
        robotScore++;
      } else {
        human.switchViewTo("draw");
        drawScore++;
      }

      $('.human-score').html(humanScore);
      $('.robot-score').html(robotScore);
      $('.draw-score').html(drawScore);
      $('.messages').html("Play again?").fadeIn();

    } else { // Game is still running, so we switch players
      if (this.currentState.turn == "W") {
        human.switchViewTo("human");
      } else {
        human.switchViewTo("robot");

        this.ai.notify("B");
      }
    }
  }
  // This function starts the game
  this.start = function() {
    if (this.status == "beginning") {
      this.advanceTo(this.currentState);
      this.status = "running";
    }
  }
}

Game.score = function(_state) {
  // if condition is win, return absurd amounts of value
  if (_state.result == "White won") {
    return 10000;
  } else if (_state.result == "Black won") {
    return -1000;
  } else {
    // use heuristics for what is valuable for state determination
    var score = 0;
    for (i = 0; i < 100; i++) {
      if (_state.board[i] == "B") {
        score = score - (1 * scoreOfBoard[i]);
      } else if (_state.board[i] == "BK") {
        score = score - (2 * scoreOfBoard[i]);
      } else if (_state.board[i] == "B") {
        score = score + (1 * scoreOfBoard[i]);
      } else if (_state.board[i] == "WK") {
        score = score + (2 * scoreOfBoard[i]);
      }

      // place on the board is ranked based on pieces being near varying points.
    }
    // count captured pieces as value
    score = score + _state.capBlackPieces - _state.capWhitePieces;
    return score;
  }
}

var scoreOfBoard = [0,4,0,4,0,4,0,4,0,4,
  4,0,3,0,3,0,3,0,3,0,
  0,3,0,2,0,2,0,2,0,4,
  4,0,2,0,1,0,3,0,3,0,
  0,2,0,1,0,1,0,1,0,2,
  2,0,1,0,1,0,1,0,2,0,
  0,3,0,3,0,1,0,2,0,4,
  4,0,3,0,2,0,2,0,3,0,
  0,3,0,3,0,3,0,3,0,4,
  4,0,4,0,4,0,4,0,4,0]
