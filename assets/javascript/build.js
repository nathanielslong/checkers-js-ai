// in the div board, append divs so that 10 fit in each row
function buildBoard() {
  for (i = 0; i < 100; i++) {
    $('.board').append("<div class='cell' id=position-" + i + " data-index=" + i + "></div>")
    if (Math.floor(i / 10) % 2 == 0) {
      if (i % 2 == 0) {
        $('#position-' + i).addClass("even");
      } else {
        $('#position-' + i).addClass("odd");
      }
    } else {
      if (i % 2 != 0) {
        $('#position-' + i).addClass("even");
      } else {
        $('#position-' + i).addClass("odd");
      }
    }
  }
}

function populateBoard() {
  var board = $('.cell');

  for (i = 0; i < 100; i++) {
    if ($(board[i]).hasClass('odd')) {
      if (i >= 0 && i <= 38) {
        $(board[i]).html("B");
      } else if (i > 38 && i < 60) {
        $(board[i]).html("E");
      } else {
        $(board[i]).html("W");
      }
    } else {
      $(board[i]).html("E");
    }
  }
}
