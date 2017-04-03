// This function represents the basic AI class in the game. The AI's primary functions are to know its intelligence level and what game it's playing.

var AI = function(level) {
  var levelOfIntelligence = level;

  // Stores the game being played
  var game = {};

  // recursive function that returns the minimax Value of a given game state
  function minimaxValue(state, count = 0) {
    if (count == 5) {
      return Game.score(state);
    } else {
      var stateScore;

      if (state.turn == "W") {
        // for white turn, we maximize score, so we initialize with a score lower than the function could reach
        stateScore = -100000;
      } else {
        // for black turn, we minimize score, so we initialize with a score higher than the function could reach
        stateScore = 1000000;
      }

      var availableMoves = state.allValidMoves(state.turn);
      var availableNextStates = [];

      // calculates available next states
      for (i = 0; i < availableMoves.length; i++) {
        var action = new AIAction(availableMoves[i][0], availableMoves[i][1]);

        var nextState = action.applyTo(state);

        availableNextStates.push(nextState);
      }

      // gets minimax value for all the available next states
      availableNextStates.forEach( function(nextState) {
        var nextScore = minimaxValue(nextState, count + 1);

        if (state.turn == "W") {
          // maximize W
          if (nextScore > stateScore) {
            stateScore = nextScore;
          }
        } else {
          // minimize B
          if (nextScore < stateScore) {
            stateScore = nextScore;
          }
        }
      })
      return stateScore;
    }
  }

  // move functions based on a given level of intelligence. turn is the player to play, either white or black
  // ai chooses a random move
  function takeARandomMove(turn) {
    var available = game.currentState.allValidMoves(turn);
    var randomPosition = available[Math.floor(Math.random() * available.length)];
    var action = new AIAction(randomPosition[0],randomPosition[1]);

    var next = action.applyTo(game.currentState);

    human.playMove(next);

    $('.current-turn').html("White");

    game.advanceTo(next);
  }

  // ai chooses the optimal move 40% of the time, suboptimal (2nd choice) 60%
  function takeANoviceMove(turn) {
    var available = game.currentState.allValidMoves(turn);
    var availableAction = [];

    // calculate score for each possible action
    var i = 0;
    while (i < available.length) {
      var action = new AIAction(available[i][0], available[i][1]);

      // get next state
      var next = action.applyTo(game.currentState);

      action.minimaxVal = minimaxValue(next, 2);

      availableAction.push(action);
      i++;
    }

    if (turn == "W") {
      // white maximizes
      availableAction.sort(AIAction.DESCENDING);
    } else {
      // black minimizes
      availableAction.sort(AIAction.ASCENDING);
    }

    var next = availableAction[0].applyTo(game.currentState);

    $('.current-turn').html("White");

    human.playMove(next);

    game.advanceTo(next);
  }

  // ai chooses the optimal move
  function takeAOptimalMove(turn) {
    var available = game.currentState.allValidMoves(turn);
    var availableActions = [];

    // calculate score for each possible action
    var i = 0;
    while (i < available.length) {
      var action = new AIAction(available[i][0], available[i][1]);

      // get next state
      var next = action.applyTo(game.currentState);

      action.minimaxVal = minimaxValue(next);

      availableActions.push(action);
      i++;
    }

    if (turn == "W") {
      // white maximizes
      availableActions.sort(AIAction.DESCENDING);
    } else {
      // black minimizes
      availableActions.sort(AIAction.ASCENDING);
    }

    var chosenAction = availableActions[0];
    var next = chosenAction.applyTo(game.currentState);

    $('.current-turn').html("White");

    human.playMove(next);

    game.advanceTo(next);

  }

  // function that specifies the game to be played
  this.plays = function(_game) {
    game = _game;
  }

  // Method to specify the level of intelligence
  this.notify = function(turn) {
    switch(levelOfIntelligence) {
      case "random":
        takeARandomMove(turn);
      break;

      case "novice":
        takeANoviceMove(turn);
      break;

      case "optimal":
        takeAOptimalMove(turn);
      break;
    }
  }
}

// The next function represents the actions of the AI, taken into its own class for modularity. It has two main roles: remembering where on the board a play is, and the minimax value calculated.

var AIAction = function(pos1, pos2) {
  // specify defaults
  this.initialPosition = pos1;
  this.movePosition = pos2;

  //returns true if difference in position is enough for a jump
  this.isJump = function(initialPosition, movePosition) {
    return Math.abs(initialPosition - movePosition) > 11;
  }

  this.minimaxValue = 0;

  // Applies an action to the board to advance to the next state
  this.applyTo = function(state) {
    var next = new State(state);

    next.board[this.initialPosition] = 'E';
    next.board[this.movePosition] = state.board[this.initialPosition]

    //if move position is either end, mark king
    if (state.turn == "B" && this.movePosition >= 90 && !/K/.test(state.board[this.initialPosition])) {
      next.board[this.movePosition] = "BK"
    } else if (state.turn == "W" && this.movePosition < 10 && !/K/.test(state.board[this.initialPosition])) {
      next.board[this.movePosition] = "WK"
    }

    if (this.isJump(this.initialPosition, this.movePosition)) {
      var multiJump = state.numberOfJumps(this.initialPosition, 0);
      multiJump = state.expandOutArray(multiJump);
      if (multiJump.length > 2) {

        for (i = 0; i < multiJump.length - 1; i++) {
          next.board[(multiJump[i + 1] + multiJump[i]) / 2] = "E";
          if (state.turn == "B") {
            next.capWhitePieces++;
          } else {
            next.capBlackPieces++;
          }
        }

      } else {
        next.board[(this.movePosition + this.initialPosition) / 2] = "E";
        if (state.turn == "B") {
          next.capWhitePieces++;
        } else {
          next.capBlackPieces++;
        }
      }
    }

    if (state.turn == "B") {
      next.blackMovesCount++;
    }

    next.advanceTurn();

    return next;
  }
}

// Sorting methods for minimaxValues are below. Basically, in order to determine the best outcome, we need to be able to sort given probabilities by best and worst. we return -1, 1, and 0 in order for JavaSCript's array.sort function to sort them properly.

AIAction.ASCENDING = function(firstAction, secondAction) {
  if (firstAction.minimaxVal < secondAction.minimaxVal) {
    return -1;
  } else if (firstAction.minimaxVal > secondAction.minimaxVal) {
    return 1;
  } else {
    return 0;
  }
}

AIAction.DESCENDING = function(firstAction, secondAction) {
  if (firstAction.minimaxVal > secondAction.minimaxVal) {
    return -1;
  } else if (firstAction.minimaxVal < secondAction.minimaxVal) {
    return 1;
  } else {
    return 0;
  }
}
