const GameBoardMaker = function () {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  let game = {};
  game.setBoard = function (array) {
    board = [[...array[0]], [...array[1]], [...array[2]]];
  };
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
  game.isFull = function () {
    for (a of board) {
      for (b of a) {
        if (b == "") return false;
      }
    }
    return true;
  };

  return game;
};

let GameBoard = GameBoardMaker();

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
  let reset = message.getElementsByClassName("reset")[0];

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

  let resetInfo = function () {
    if (
      player1Info.getElementsByClassName("bot")[0].classList.contains("active")
    ) {
      player1Info.getElementsByClassName("bot")[0].classList.remove("active");
      player1Info.getElementsByClassName("human")[0].classList.add("active");
    }
    if (
      player2Info
        .getElementsByClassName("human")[0]
        .classList.contains("active")
    ) {
      player2Info.getElementsByClassName("human")[0].classList.remove("active");
      player2Info.getElementsByClassName("bot")[0].classList.add("active");
    }
    if (
      difficulty.getElementsByClassName("hard")[0].classList.contains("active")
    ) {
      difficulty.getElementsByClassName("hard")[0].classList.remove("active");
      difficulty.getElementsByClassName("easy")[0].classList.add("active");
    }

    player1Info.getElementsByTagName("input")[0].value = "";

    controller.difficulty = controller.getDifficulty();
    message.childNodes[0].textContent = "";
    overlay.classList.remove("active");
    message.classList.remove("active");
    controller.updatePlayersInfo();
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
    displayMark.textContent = currentPlayer.getMark();
    botPlay();
  };

  controller.getDifficulty = function () {
    for (node of difficulty.childNodes) {
      if (node.nodeName != "BUTTON") continue;
      if (node.classList.contains("active")) {
        if (node.classList.contains("easy")) return "easy";
        else return "hard";
      }
    }
  };
  let play = function () {
    if (this.textContent != "") return;
    this.textContent = currentPlayer.getMark();
    index = this.classList[0].split("");
    GameBoard.setMark(currentPlayer.getMark(), index[1], index[0]);
    if (GameBoard.checkWinner(currentPlayer.getMark())) {
      displayWinner(currentPlayer);
      controller.clearBoard();
      return;
    }
    if (isDraw()) {
      displayDraw();
      controller.clearBoard();
      return;
    }
    currentPlayer = changePlayer(currentPlayer);
    displayMark.textContent = currentPlayer.getMark();
    setTimeout(() => {
      botPlay();
    }, 200);
  };

  let isDraw = function () {
    for (btn of buttons) {
      if (btn.textContent == "") return false;
    }
    return true;
  };

  reset.addEventListener("click", resetInfo);

  let displayDraw = function () {
    overlay.classList.add("active");
    message.classList.add("active");
    message.getElementsByClassName("text")[0].textContent = `it's a Draw!`;
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
    controller.updatePlayersInfo();
  };

  message
    .getElementsByClassName("play")[0]
    .addEventListener("click", playAgain);

  texts.forEach((text) =>
    text.addEventListener("change", () => controller.updatePlayersInfo())
  );

  let playAuto = function (mark, index) {
    GameBoard.setMark(mark, index[1], index[0]);
    if (GameBoard.checkWinner(mark)) {
      displayWinner(currentPlayer);
      controller.clearBoard();
      return;
    }
    if (isDraw()) {
      displayDraw();
      controller.clearBoard();
      return;
    }

    currentPlayer = changePlayer(currentPlayer);
    displayMark.textContent = currentPlayer.getMark();
    setTimeout(() => {
      botPlay();
    }, 200);
  };

  let easyBot = function () {
    let num = parseInt(Math.random() * 9);
    btn = buttons[num];
    if (btn.textContent != "") {
      return easyBot();
    }
    btn.textContent = currentPlayer.getMark();
    index = btn.classList[0].split("");
    let mark = currentPlayer.getMark();
    playAuto(mark, index);
  };

  let actions = function (array) {
    let answers = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (array[i][j] == "") {
          answers.push([i.toString(), j.toString()]);
        }
      }
    }
    return answers;
  };

  let result = function (board, mark, index) {
    let tempGameBoard = GameBoardMaker();
    tempGameBoard.setBoard(board.getBoard());
    tempGameBoard.setMark(mark, parseInt(index[1]), parseInt(index[0]));
    return tempGameBoard;
  };

  let minMax = function (board, maxPlayer) {
    let index = ["0", "0"];
    if (board.checkWinner("X")) return [1, index];

    if (board.checkWinner("O")) return [-1, index];
    if (board.isFull()) return [0, index];

    let array = board.getBoard();
    let currentBoard = [[...array[0]], [...array[1]], [...array[2]]];
    let value;

    if (maxPlayer) {
      value = -Infinity;
      let actionsArray = actions(currentBoard);
      for (action of actionsArray) {
        let tempBoard = result(board, "X", action);
        let mima = minMax(tempBoard, false);
        if (mima[0] > value) {
          value = mima[0];
          index = action;
        }
      }
    }

    if (!maxPlayer) {
      value = Infinity;
      let actionsArray = actions(currentBoard);
      for (action of actionsArray) {
        let tempBoard = result(board, "O", action);
        let mima = minMax(tempBoard, true);
        if (mima[0] < value) {
          value = mima[0];
          index = action;
        }
      }
    }

    board.setBoard(currentBoard);
    return [value, index];
  };

  let hardBot = function () {
    let tempGameBoard = GameBoardMaker();
    tempGameBoard.setBoard(GameBoard.getBoard());
    let isMax;
    if (currentPlayer == player1) isMax = true;
    else isMax = false;
    let index = minMax(tempGameBoard, isMax)[1];
    let mark = currentPlayer.getMark();
    let btn;
    let btns = Array.from(buttons);
    btn = btns.find((btn) => btn.classList[0] == index[0] + "" + index[1]);
    btn.textContent = mark;
    playAuto(mark, index);
  };

  let botPlay = function () {
    if (currentPlayer.getKind() == "bot") {
      if (controller.getDifficulty() == "easy") {
        easyBot();
      } else {
        hardBot();
      }
    }
  };

  return controller;
})();

DisplayController.updatePlayersInfo();
