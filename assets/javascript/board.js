// start a variable to hold the current board
var initialBoard = ['E','B','E','B','E','B','E','B','E','B','B','E','B','E','B','E','B','E','B','E','E','B','E','B','E','B','E','B','E','B','B','E','B','E','B','E','B','E','B','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','W','E','W','E','W','E','W','E','W','W','E','W','E','W','E','W','E','W','E','E','W','E','W','E','W','E','W','E','W','W','E','W','E','W','E','W','E','W','E'];

// State is initialized with the old state of the game, in order to have a reference to advance the game.
var State = function(old) {
  // Sets whose turn it is (human or ai)
  this.turn = "";

  // Black Moves Count: number of moves for the AI player
  this.blackMovesCount = 0;

  this.capBlackPieces = 0;
  this.capWhitePieces = 0;

  // result: the result of the game given the current state
  this.result = "still running";

  this.board = [];

  // This conditional is the object constructor. if old exists, the state is constructed given the parameters of the old state.
  if (typeof old !== "undefined") {
    // the next 5 lines copy the previous board state to the current board
    var len = old.board.length;
    this.board = new Array(len);
    for (var i = 0; i < len; i++) {
      this.board[i] = old.board[i];
    }

    this.blackMovesCount = old.blackMovesCount;
    this.result = old.result;
    this.turn = old.turn;
  }

  this.position = function(index) {
    return this.board[index];
  }

  // check if is king, return boolean
  this.isKing = function(index) {
    /K/.test(this.position(index));
  }

  // get opposing color
  this.oppColor = function(index) {
    return this.position(index) == "W" ? "B" : "W";
  }

  // set movement functions for each direction, check if empty space. Boolean functions
  this.canMoveLowerLeft = function(index) {
    this.position(index + 9) == "E";
  }

  this.canMoveLowerRight = function(index) {
    this.position(index + 11) == "E";
  }

  this.canMoveUpperLeft = function(index) {
    this.position(index - 11) == "E";
  }

  this.canMoveUpperRight = function(index) {
    this.position(index - 9) == "E";
  }

  //make jump checker functions, Boolean
  this.canJumpLowerLeft = function(index) {
    this.position[index + 9] == this.oppColor(index) && this.position[index + 18] == "E";
  }

  this.canJumpLowerRight = function(index) {
    this.position[index + 11] == this.oppColor(index) && this.position[index + 22] == "E";
  }

  this.canJumpUpperLeft = function(index) {
    this.position[index - 11] == this.oppColor(index) && this.position[index - 22] == "E";
  }

  this.canJumpUpperRight = function(index) {
    this.position[index - 9] == this.oppColor(index) && this.position[index - 18] == "E";
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
      } else if (index % 9 == 0) {
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
      } else if (index % 9 == 0) {
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
    }
  }

  // Checks for movable spots
  this.canMoveTo = function(index) {
  }

  // Now we define functions of state
  this.advanceTurn = function() {
    this.turn = this.turn == "white" ? "black" : "white";
  }

  // IsTerminal checks if the current state is a terminal state by checking each possible win condition and draw condition. Returns true if terminal, false if not.
  this.isTerminal = function() {
    // First, check win conditions

    //Check if black has run out of pieces
    if (capBlackPieces == 20) {
      this.result = "White won";
      return true;

      //Check if white has run out of pieces
    } else if (capWhitePieces == 20) {
      this.result = "Black won";
      return true;

      //Check if white has run out of moves
    } else if (/*white has no valid moves*/false) {
      this.result = "Black won";
      return true;

      //Check if black has run out of moves
    } else if (/*black has no valid moves*/false) {
      this.result = "White won";
      return true;

      //Then check draw conditions
    } else if (/*players only have one king each*/false) {
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

  this.currentState.turn = "white";

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
      if (this.currentState.turn == "White") {
        human.switchViewTo("human");
      } else {
        human.switchViewTo("robot");

        this.ai.notify("Black");
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
  // Make score function for checkers
}
