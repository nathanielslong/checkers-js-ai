$(document).ready(function() {
  initialBoard = [0,1,0,1,0,1,0,1,0,1,
    1,0,1,0,1,0,1,0,1,0,
    0,1,0,1,0,1,0,1,0,1,
    1,0,1,0,1,0,1,0,1,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,2,0,2,0,2,0,2,0,2,
    2,0,2,0,2,0,2,0,2,0,
    0,2,0,2,0,2,0,2,0,2,
    2,0,2,0,2,0,2,0,2,0];

  currentBoard = $('.board div');
})

function updateBoard(oldBoard, newBoard) {
  for (i = 0; i < 100; i++) {
    $(oldBoard[i]).html(newBoard[i]);
  }
}
