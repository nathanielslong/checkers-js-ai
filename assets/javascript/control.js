$(document).ready(function() {
  buildBoard();
  populateBoard();
  clickEvents();
})

function containedMove(index, array) {
  for (i = 0; i < array.length; i++) {
    if (index == array[i][0]) {
      return true;
    }
  } return false;
}

// sets event listeners for clicks, turns off at the end
function clickEvents() {
  $('.board').on('click', '.odd', function() {
    var $this = $(this);

    var validMoves = globals.game.currentState.allValidMoves(globals.game.currentState.turn);

    var index = parseInt($this.data('index'));

    if (globals.game.status == "running" && globals.game.currentState.turn == "W" && /W/.test(globals.game.currentState.board[index]) && containedMove(index, validMoves)) {
      var possibleMoves = globals.game.currentState.indexValidMoves(index)

      var endingLocations = possibleMoves.map(function(x) {return x[1]})
      endingLocations = endingLocations.filter(function(x) {return x != undefined});

      var board = $('.cell');
      $('.possibles').removeClass('possibles');

      endingLocations.forEach(function(location) {
        $(board[location]).addClass('possibles');
      })

      $('.possibles').each(function() {
        var $thistoo = $(this);
        $thistoo.on('click', function() {
          $('.possibles').removeClass('possibles');

          var endPosition = parseInt($thistoo.data('index'));
          var next = new State(globals.game.currentState);

          next.board[index] = "E";
          next.board[endPosition] = globals.game.currentState.board[index];

          if (endPosition < 10 && !/K/.test(globals.game.currentState.board[index])) {
            next.board[endPosition] = "WK"
          }

          if (Math.abs(endPosition - index) > 11) {
            var multiJump = globals.game.currentState.numberOfJumps(index, 0);
            multiJump = globals.game.currentState.expandOutArray(multiJump);
            if (multiJump.length > 2) {

              for (i = 0; i < multiJump.length - 1; i++) {
                next.board[(multiJump[i + 1] + multiJump[i]) / 2] = "E";
                next.capBlackPieces++;
              }

            } else {
              next.board[(endPosition + index) / 2] = "E";
              next.capBlackPieces++;
            }
          }

          human.playMove(next);

          $('.current-turn').html("Black");

          next.advanceTurn();

          globals.game.advanceTo(next);


          $thistoo.off('click');
        })
      })
    }
  })
}

// This deals with the user control on the site
// set storage for variables in the site
var globals = {};

// choose difficulty level
$('.level').each(function() {
  var $this = $(this);
  $this.click(function() {
    $('.selected').toggleClass('not-selected');
    $('.selected').toggleClass('selected');
    $this.toggleClass('not-selected');
    $this.toggleClass('selected');

    ai.level = $this.attr('id');

    $('.start').fadeIn();
  })
})

// Start game
$('.start').click(function() {
  var selectedDifficulty = $('.selected').attr('id');
  if (typeof selectedDifficulty !== "undefined") {
    var aiPlayer = new AI(selectedDifficulty);
    globals.game = new Game(aiPlayer);

    aiPlayer.plays(globals.game);

    globals.game.start();

    $('.current-turn').html("White");

    $('.title').fadeOut();
  }
})

// Allow restarting of the game
$('.messages').click(function() {
  if (globals.game.status == "ended") {
    $('.board').html("");

    var difficulties = $('.level');

    for (i = 0; i < difficulties.length; i++) {
      $(difficulties[i]).removeClass('selected');
      $(difficulties[i]).addClass('not-selected');
    }

    $('.title').fadeIn();
    $('.initial').fadeIn();
    $('.ingame').fadeOut();
    $('.messages').fadeOut();
    $('.start').hide();
    human.initialControlsVisible = true;

    buildBoard();
    populateBoard();
    clickEvents();
  }
})
