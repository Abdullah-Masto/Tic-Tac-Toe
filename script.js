const GameBoard = (function () {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  let game = {};
  game.setMark = function (mark, x, y) {
    board[y][x] = mark;
  };
  let _checkRow = function (mark) {
    for (let i = 0; i < board.length; i++) {
      let check = false;
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] != mark) {
          check = false;
          break;
        } else {
          check = true;
        }
      }
      if (check) return check;
    }
    return false;
  };
  let _checkColumn = function (mark) {
    for (let i = 0; i < board.length; i++) {
      let check = false;
      for (let j = 0; j < board.length; j++) {
        if (board[j][i] != mark) {
          check = false;
          break;
        } else {
          check = true;
        }
      }
      if (check) return check;
    }
    return false;
  };
  let _checkDiameter = function (mark) {
    let main = 0,
      secondary = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i][i] == mark) main++;
      if (board[i][2 - i] == mark) secondary++;
    }
    if (main == 3 || secondary == 3) return true;
    else return false;
  };
  game.checkWinner = function (mark) {
    if (_checkRow(mark) || _checkColumn(mark) || _checkDiameter(mark))
      return true;
    else return false;
  };
  game.clearBoard = function () {
    board = board.map((item) => item.map(() => ""));
  };
  game.getBoard = function () {
    return board;
  };

  return game;
})();

let Player = function () {
  let mark;
  let turn;
  let player = {};
  player.setMark = function (symbol) {
    mark = symbol;
  };
  player.getMark = function () {
    return mark;
  };
  player.setTurn = function (op) {
    turn = op;
  };
  player.getTurn = function () {
    return turn;
  };
  player.toggleTurn = function () {
    this.setTurn(!this.getTurn());
  };
  player.playTurn = function (x, y) {
    if (!this.getTurn()) return false;
    GameBoard.setMark(this.getMark(), x, y);
    this.toggleTurn();
  };
  player.setName = function (name) {
    this.name = name;
  };
  player.getName = function () {
    return this.name;
  };

  return player;
};
