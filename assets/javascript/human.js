// this function represents the actions of the human player in the game.

// First, we define a human object
var human = {};

// Then we set the initial controls visible, so that when we load the page, the human is set and sees the controls for the game.
human.initialControlsVisible = true;

// When the AI is going, we want to have some sort of effect, so we set a robot flickering attribute
human.robotFlickerHandle = 0;

// We also want something to mark down what view the human player should be seeing at any given point, so we'll mark that here.
human.currentView = "";

// Function starts the robot flickering with a set interval
human.startRobotFlickering = function() {
  human.robotFlickeringHandle = setInverval(function() {
    $('#robot').toggleClass('robot');
  }, 500);
}

// Stops the flickering effect
human.stopRobotFlickering = function() {
  clearInterval(human.robotFlickeringHandle);
}

// Function switches the view depending on the current player turn
human.switchViewTo = function(turn) {
  //Since we may have async calls, let's define a helper method. This will find the id representing the current view and fade it in
  function _switch(_turn) {
    human.currentView = "#" + _turn;
    $(human.currentView).fadeIn("fast");

    if (_turn == "ai") {
      human.StartRobotFlickering();
    }
  }

  // If the game is just starting, we fade out the initial content; otherwise, we fade out the current player status
  if (human.initialControlsVisible) {
    human.initialControlsVisible = false;
    $('.initial').fadeOut({
      duration: "slow",
      done: function() {
        _switch(turn);
      }
    })
  } else {
    $(human.currentView).fadeOut({
      duration: "fast",
      done: function() {
        _switch(turn);
      }
    })
  }
}

// Play move function redraws the board after each move
human.playMove = function(state) {
  $('.board').html("");
  $('.board').off('click', '.odd');
  buildBoard();
  populateBoard(state.board);

  updateScores(state);
  clickEvents();
}
