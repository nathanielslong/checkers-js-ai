// in the div board, append divs so that 10 fit in each row
function buildBoard() {
  for (j = 0; j < 100; j++) {
    $('.board').append("<div class='cell' id=position-" + j + " data-index=" + j + "><i></i></div>")
    if (Math.floor(j / 10) % 2 == 0) {
      if (j % 2 == 0) {
        $('#position-' + j).addClass("even");
      } else {
        $('#position-' + j).addClass("odd");
      }
    } else {
      if (j % 2 != 0) {
        $('#position-' + j).addClass("even");
      } else {
        $('#position-' + j).addClass("odd");
      }
    }
  }
}

function populateBoard(board = "undefined") {
  if (typeof board !== 'object') {
    var domBoard = $('.cell');

    for (j = 0; j < 100; j++) {
      if ($(domBoard[j]).hasClass('odd')) {
        if (j >= 0 && j <= 38) {
          $(domBoard[j]).find("i").addClass("fa fa-circle");
        } else if (j > 60) {
          $(domBoard[j]).find("i").addClass("fa fa-circle-o");
        } else {
          $(domBoard[j]).find("i").addClass("fa fa-circle-o even");
        }
      } else {
        $(domBoard[j]).find("i").addClass("fa fa-circle-o even");
      }
    }
  } else {
    var domBoard = $('.cell');

    for (j = 0; j < 100; j++) {
      if ($(domBoard[j]).hasClass('odd')) {
        if (/W/.test(board[j])) {
          $(domBoard[j]).find("i").removeClass().addClass("fa fa-circle-o");
        } else if (/B/.test(board[j])) {
          $(domBoard[j]).find("i").removeClass().addClass("fa fa-circle");
        } else {
          $(domBoard[j]).find("i").removeClass().addClass("fa fa-circle-o even");
        }
      } else {
        $(domBoard[j]).find("i").removeClass().addClass("fa fa-circle-o even");
      }
    }
  }
}

function updateScores(state) {
  $('.cap-black').html(state.capBlackPieces);
  $('.cap-white').html(state.capWhitePieces);
}
