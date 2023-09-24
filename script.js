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
  let kind;
  let player = {};

  player.setKind = function (k) {
    kind = k;
  };
  player.getKind = function () {
    return kind;
  };
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

let DisplayController = (function () {
  let buttons = document.querySelectorAll("main .board button");
  let displayMark = document.querySelector("main .mark");
  let buttonSet = document.querySelectorAll(".set");
  let player1Info = document.querySelector(".player.one");
  let player2Info = document.querySelector(".player.two");
  let difficulty = document.querySelector(".difficulty");
  let overlay = document.querySelector(".overlay");
  let message = document.querySelector(".message");
  let texts = document.querySelectorAll(".player input");

  let counter = 0;
  let player1 = Player();
  let player2 = Player();
  let currentPlayer = player1;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      buttons[counter].classList.add(i + "" + j);
      counter++;
    }
  }
  let controller = {};
  controller.difficulty = "easy";
  controller.updateBoard = function () {
    for (let i = 0; i < buttons.length; i++) {
      index = buttons[i].classList[0].split("");
      buttons[i].textContent = GameBoard.getBoard()[index[0]][index[1]];
    }
  };
  function toggleState() {
    this.classList.add("active");
    let siblings = this.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i] != this && siblings[i].nodeName == "BUTTON")
        siblings[i].classList.remove("active");
      if (siblings[i].nodeName == "INPUT") {
        siblings[i].value = "";
      }
    }
    controller.difficulty = controller.getDifficulty();
    controller.updatePlayersInfo();
  }
  buttonSet.forEach((btn) => btn.addEventListener("click", toggleState));

  controller.clearBoard = function () {
    GameBoard.clearBoard();
    buttons.forEach((button) => (button.textContent = ""));
    currentPlayer = player1;
    this.updateBoard();
  };
  controller.setPlayerInfo = function (player, playerInfo) {
    //kind
    for (node of playerInfo.childNodes) {
      if (node.nodeName != "BUTTON") continue;
      if (node.classList.contains("active")) {
        if (node.classList.contains("human")) player.setKind("human");
        else player.setKind("bot");
      }
    }
    // name
    for (node of playerInfo.childNodes) {
      if (node.nodeName == "INPUT") {
        if (player.getKind() == "bot") {
          if (player == player1) {
            node.value = "Glados";
          } else {
            node.value = "Wheatley";
          }
          node.setAttribute("readonly", "readonly");
        } else {
          node.removeAttribute("readonly");
        }
        player.setName(node.value);
      }
    }
    // mark
    if (player == player1) {
      player.setMark("X");
    } else {
      player.setMark("O");
    }
  };
  controller.updatePlayersInfo = function () {
    this.setPlayerInfo(player1, player1Info);
    this.setPlayerInfo(player2, player2Info);
    this.clearBoard();
  };

  controller.getDifficulty = function () {
    for (node of difficulty.childNodes) {
      if (node.nodeName != "BUTTON") continue;
      if (node.classList.contains("active")) {
        if (node.classList.contains("easy")) return "easy";
        else if (node.classList.contains("hard")) return "hard";
      }
    }
  };
  let play = function () {
    if (this.textContent != "") return;
    this.textContent = currentPlayer.getMark();
    index = this.classList[0].split("");
    GameBoard.setMark(currentPlayer.getMark(), index[0], index[1]);
    if (GameBoard.checkWinner(currentPlayer.getMark())) {
      displayWinner(currentPlayer);
      controller.clearBoard();
      return;
    }
    currentPlayer = changePlayer(currentPlayer);
    displayMark.textContent = currentPlayer.getMark();
    buttons.forEach((button) => button.setAttribute("disabled", ""));
    setTimeout(() => {
      buttons.forEach((button) => button.removeAttribute("disabled"));
    }, 200);
  };
  let changePlayer = function (player) {
    if (player == player1) return player2;
    else return player1;
  };
  buttons.forEach((button) => button.addEventListener("click", play));
  let displayWinner = function (player) {
    overlay.classList.add("active");
    message.classList.add("active");
    message.getElementsByClassName(
      "text"
    )[0].textContent = `${player.getName()} won!`;
  };

  let playAgain = function () {
    message.childNodes[0].textContent = "";
    overlay.classList.remove("active");
    message.classList.remove("active");
  };

  message
    .getElementsByClassName("play")[0]
    .addEventListener("click", playAgain);

  texts.forEach((text) =>
    text.addEventListener("change", () => controller.updatePlayersInfo())
  );

  return controller;
})();

DisplayController.updatePlayersInfo();
