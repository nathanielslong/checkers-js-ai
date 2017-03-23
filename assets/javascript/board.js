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

  // Now we define functions of state
  this.advanceTurn = function() {
    this.turn = this.turn == "white" ? "black" : "white";
  }

  // EmptyCells returns the indexes of the empty positions
  this.emptyCells = function() {
    var indexes = [];
    for (i = 0; i < 100; i++) {
      if (this.board[i] == 0) {
        indexes.push(i)
      }
    }
    return indexes;
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

// Piece object. Keep track of individual pieces

var Piece = function(color, element, position) {
  // Sets DOM element of the piece
  this.element = element;

  // Sets initial position of the piece
  this.position = position;

  // keeps track of whether piece has been promoted
  this.king = false;

  this.makeKing = function() {
    this.king = true;
  }

  this.color = color;

  // function checks if piece can jump any pieces
  this.canJumpAny = function() {
  }
}

// This function defines the game itself. this contains the information of what sort of AI player, current game state, and whether the game is still running. It also controls moving the game to different states and a way to start the game.
var Game = function(autoPlayer) {
  this.ai = autoPlayer;

  // Initializes to an empty board configuration
  this.currentState = new State();

  // Inital board state
  this.currentState.board = ['E','B','E','B','E','B','E','B','E','B','B','E','B','E','B','E','B','E','B','E','E','B','E','B','E','B','E','B','E','B','B','E','B','E','B','E','B','E','B','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','W','E','W','E','W','E','W','E','W','W','E','W','E','W','E','W','E','W','E','E','W','E','W','E','W','E','W','E','W','W','E','W','E','W','E','W','E','W','E']

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
}

// Make score function for checkers
$(document).ready(function() {
  var initialBoard = ['E','B','E','B','E','B','E','B','E','B',
    'B','E','B','E','B','E','B','E','B','E',
    'E','B','E','B','E','B','E','B','E','B',
    'B','E','B','E','B','E','B','E','B','E',
    'E','E','E','E','E','E','E','E','E','E',
    'E','E','E','E','E','E','E','E','E','E',
    'E','W','E','W','E','W','E','W','E','W',
    'W','E','W','E','W','E','W','E','W','E',
    'E','W','E','W','E','W','E','W','E','W',
    'W','E','W','E','W','E','W','E','W','E'];

    var loadBoard = $('.board div');

    updateBoard(loadBoard, initialBoard);
})

function updateBoard(oldBoard, newBoard) {
  for (i = 0; i < 100; i++) {
    $(oldBoard[i]).html(newBoard[i]);
  }
}
