// in the div board, append divs so that 10 fit in each row
function buildBoard() {
  for (i = 0; i < 100; i++) {
    $('.board').append("<div id=position-" + i + " data-index=" + i + "></div>")
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

$(document).ready(function() {
  buildBoard();
})
