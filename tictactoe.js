import readline from "readline";
// ================== READLINE SETUP
let input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
//0,1,2,3,4,5,6,7,8
let positions = [];
let marked = [];
let boardSize = 0;
let boardSizeSqrt;
let level;
let playerLetter = "X";
let computerLetter = "O";
let cut = false;
// START GAME
function selectLevel() {
  input.question(
    "1. Easy\n2. Hard\nEnter Your Level (Press 1 For easy..)=> ",
    (num) => {
      num = Number(num);
      if (isNaN(num) || num < 1 || num > 2) {
        console.log("Invalid Input!!!, Press either 1 or 2.");
        selectLevel();
      } else {
        level = num;
        askBoardSize();
      }
    }
  );
}
selectLevel();
//=================== ASK Board size
function askBoardSize() {
  input.question("Enter the board size (e.g., 3 for a 3×3 board)= ", (num) => {
    let n = Number(num);
    if (!isNaN(n) && n >= 2) {
      boardSize = n * n;
      boardSizeSqrt = n;

      for (let i = 0; i < boardSize; i++) {
        positions.push(" ");
      }
      for (let i = 0; i < boardSize; i++) {
        marked.push(false);
      }
      winningPointsProvider();
      tose();
      return;
    } else {
      console.log(`Choose only numbers not letters!!!`);
      askBoardSize();
    }
  });

  return;
}
//Winning point desider

let winningPoints = [];
function winningPointsProvider() {
  //row check
  let countFrRow = boardSizeSqrt;
  let indexFrRow = 0;
  while (countFrRow) {
    let row = [];
    let subCount = boardSizeSqrt;
    while (subCount) {
      row.push(indexFrRow);
      indexFrRow++;
      subCount--;
    }
    winningPoints.push(row);
    countFrRow--;
  }
  //col check
  let countFrCol = boardSizeSqrt;
  let rowIndex = 0;
  let indexFrCol = 0;
  while (countFrCol) {
    let col = [];
    let subCount = boardSizeSqrt;
    indexFrCol = rowIndex;
    while (subCount) {
      col.push(indexFrCol);
      indexFrCol += boardSizeSqrt;
      subCount--;
    }
    indexFrCol = 0;
    winningPoints.push(col);
    rowIndex++;
    countFrCol--;
  }

  //diagonal one check from left corner
  let countFrDiag1 = 1;

  let indexStartPointDiag1 = 0;
  let indexFrDiag1 = 0;
  while (countFrDiag1) {
    let diag1 = [];
    let subCount = boardSizeSqrt;
    indexFrDiag1 = indexStartPointDiag1;
    while (subCount) {
      diag1.push(indexFrDiag1);
      indexFrDiag1 += boardSizeSqrt + 1;
      subCount--;
    }

    winningPoints.push(diag1);

    countFrDiag1--;
  }
  //diagonal two check from right corner
  let countFrDiag2 = 1;

  let indexStartPointDiag2 = boardSizeSqrt - 1;
  let indexFrDiag2 = 0;
  while (countFrDiag2) {
    let diag2 = [];
    let subCount = boardSizeSqrt;
    indexFrDiag2 = indexStartPointDiag2;
    while (subCount) {
      diag2.push(indexFrDiag2);
      indexFrDiag2 += boardSizeSqrt - 1;
      subCount--;
    }

    winningPoints.push(diag2);

    countFrDiag2--;
  }
}

// ============= TOSS
function tose() {
  let chooser = 1;
  console.log("\nToss Winner →", chooser === 0 ? "PLAYER" : "COMPUTER");
  if (chooser === 0) {
    selectLetter();
  } else {
    if (level === 1) computer();
    else computer2(); /// here i missed to call computer2 bro
  }

  return;
}

// ================== ASK PLAYER
function askPlayer() {
  input.question(`Enter your position (1-${boardSize})= `, (num) => {
    let position = Number(num) - 1;

    if (isNaN(position) || position < 0 || position >= boardSize) {
      console.log("Invalid input! Try again.");
      return askPlayer();
    }

    if (marked[position] !== false) {
      console.log("Position already taken!");
      return askPlayer();
    }
    player(position, playerLetter);
  });
}
function selectLetter() {
  input.question("Choose your Letter = ", (letter) => {
    //Trim spaces and maintains letter in uppercase for consistancy
    letter = letter.trim().toUpperCase();

    if ((letter !== "X" && letter !== "O") || !isNaN(letter)) {
      console.log("Invalid input! Try again. Choose either X or O");
      selectLetter();
      return;
    } else {
      playerLetter = letter;
      letter === "X" ? (computerLetter = "O") : (computerLetter = "X");
      askPlayer();
      return;
    }
  });
}
// ================== PRINT BOARD
function printPositions() {
  let count = boardSizeSqrt;
  let index = 0;
  while (count) {
    let subCount = boardSizeSqrt;
    while (subCount) {
      process.stdout.write(positions[index]);
      if (subCount !== 1) {
        process.stdout.write(" | ");
      }

      index++;
      subCount--;
    }
    console.log();
    if (count !== 1) {
      for (let i = 0; i < boardSizeSqrt + (boardSizeSqrt - 1); i++) {
        process.stdout.write("- ");
      }
    }

    console.log();
    count--;
  }

  return;
}

// ================= PLAYER
function player(index, mark, n) {
  if (mark === "X" || mark === "O") {
    positions[index] = mark;
    marked[index] = true;
  }

  printPositions();

  //Condition for winning
  for (let i = 0; i < winningPoints.length; i++) {
    let count = 0;
    let tem = winningPoints[i];
    for (let j = 0; j < tem.length; j++) {
      if (positions[tem[j]] === playerLetter) {
        count++;
      }
    }
    if (count == boardSizeSqrt) {
      console.log("The WINNER is ====> Player 💫💫💫");
      input.close();
      return;
    } else {
      count = 0;
    }
  }
  function drawTrue() {
    for (let i = 0; i < marked.length; i++) {
      if (marked[i] === false) {
        return true;
      }
    }
    return false;
  }
  // DRAW CHECK
  if (!drawTrue()) {
    console.log("Match Draw!");
    input.close();
    return;
  }

  nextTurn(0); //
}

// ================= Machine
function computer() {
  console.log("\nMachine's Turn...");

  let emptyPlace = [];
  for (let i = 0; i < positions.length; i++) {
    if (marked[i] === false) emptyPlace.push(i);
  }

  if (emptyPlace.length === 0) {
    console.log("Match Draw!");
    input.close();
    return;
  }

  let randomPick = emptyPlace[Math.floor(Math.random() * emptyPlace.length)];
  positions[randomPick] = computerLetter;
  marked[randomPick] = true;

  printPositions();

  // WIN CHECK (using boardSizeSqrt)
  for (let i = 0; i < winningPoints.length; i++) {
    let count = 0;
    let tem = winningPoints[i];

    for (let j = 0; j < tem.length; j++) {
      if (positions[tem[j]] === computerLetter) {
        console.log(tem);
        count++;
      }
    }
    if (count === boardSizeSqrt) {
      console.log("The WINNER is ====> Machine 💫💫💫");
      input.close();
      return;
    } else {
      count = 0;
    }
  }
  function drawTrue() {
    for (let i = 0; i < marked.length; i++) {
      if (marked[i] === false) {
        return true;
      }
    }
    return false;
  }
  // DRAW CHECK
  if (!drawTrue()) {
    console.log("Match Draw!");
    input.close();
    return;
  }

  nextTurn(1); // next: player
}

//========= computer2
function computer2() {
  console.log("Machine 2 Turn");
  winMove();
  //===== Win Logic =======
  function winMove() {
    for (let i = 0; i < winningPoints.length; i++) {
      let temp = winningPoints[i];
      let strike = 0;
      for (let j = 0; j < boardSizeSqrt; j++) {
        if (positions[temp[j]] === computerLetter) {
          strike++;
        }
        if (strike == boardSizeSqrt - 1) {
          for (let k = 0; k < boardSizeSqrt; k++) {
            if (marked[temp[k]] === false) {
              positions[temp[k]] = computerLetter;
              marked[temp[k]] = true;

              printPositions();
              console.log("Computer2 won!!!");
              input.close();
              cut = true;
              return;
            }
          }
        }
      }
    }
    blockMove();
    return false;
  }

  if (cut) return;

  //===== Block Logic =======
  function blockMove() {
    for (let i = 0; i < winningPoints.length; i++) {
      let temp = winningPoints[i];
      let strike = 0;
      for (let j = 0; j < boardSizeSqrt; j++) {
        if (positions[temp[j]] === playerLetter) {
          strike++;
        }
        if (strike == boardSizeSqrt - 1) {
          for (let k = 0; k < boardSizeSqrt; k++) {
            if (marked[temp[k]] === false) {
              positions[temp[k]] = computerLetter;
              marked[temp[k]] = true;

              printPositions();

              return;
            }
          }
        }
      }
    }

    cornerCheck();
  }
  //===== Corner Check Logic =======
  function cornerCheck() {
    if (marked[0] === false) {
      positions[0] = computerLetter;
      marked[0] = true;
      printPositions(); // here i missed to print the board bro, so i can not position player in 3rd place
      return;
    } else if (marked[boardSizeSqrt - 1] === false) {
      positions[boardSizeSqrt - 1] = computerLetter;
      marked[boardSizeSqrt - 1] = true;
      printPositions();
      return;
    } else if (marked[boardSize - boardSizeSqrt] === false) {
      positions[boardSize - boardSizeSqrt] = computerLetter;
      marked[boardSize - boardSizeSqrt] = true;
      printPositions();
      return;
    } else if (marked[boardSize - 1] === false) {
      positions[boardSize - 1] = computerLetter;
      marked[boardSize - 1] = true;
      printPositions();
      return;
    }
    centerCheck();
  }

  //===== Center Check Logic =======
  function centerCheck() {
    if (boardSizeSqrt % 2 !== 0) {
      let center = Math.floor(boardSize * 0.5);
      if (positions[center] === " ") {
        positions[center] = computerLetter;
        marked[center] = true;
        return;
      }
    }

    let centers = [
      (boardSizeSqrt * 0.5 - 1) * boardSizeSqrt + (boardSizeSqrt * 0.5 - 1),
      (boardSizeSqrt * 0.5 - 1) * boardSizeSqrt + boardSizeSqrt * 0.5,
      boardSizeSqrt * 0.5 * boardSizeSqrt + (boardSizeSqrt * 0.5 - 1),
      boardSizeSqrt * 0.5 * boardSizeSqrt + boardSizeSqrt * 0.5,
    ];

    for (let i = 0; i < centers.length; i++) {
      if (positions[Math.floor(centers[i])] === " ") {
        positions[Math.floor(centers[i])] = computerLetter;
        marked[Math.floor(centers[i])] = true;
        printPositions();
        console.log("center", Math.floor(centers[i]));
        return;
      }
    }

    sideCheck();
    return;
  }
  //===== Side Check Logic =======
  function sideCheck() {
    //rowTop
    let rowTop = winningPoints[0];
    for (let i = 0; i < rowTop.length - 1; i++) {
      if (positions[rowTop[i]] === " ") {
        positions[rowTop[i]] = computerLetter;
        marked[rowTop[i]] = true;
        nextTurn(1);
        return;
      }
    }
    let leftCol = winningPoints[4];
    for (let i = 0; i < rowTop.length - 1; i++) {
      if (positions[leftCol[i]] === " ") {
        positions[leftCol[i]] = computerLetter;
        marked[leftCol[i]] = true;
        nextTurn(1);
        return;
      }
    }
    let rightCol = winningPoints[7];
    for (let i = 0; i < rowTop.length - 1; i++) {
      if (positions[rightCol[i]] === " ") {
        positions[rightCol[i]] = computerLetter;
        marked[rightCol[i]] = true;
        nextTurn(1);
        return;
      }
    }
    let rowBot = winningPoints[9];
    for (let i = 0; i < rowTop.length - 1; i++) {
      if (positions[rowBot[i]] === " ") {
        positions[rowBot[i]] = computerLetter;
        marked[rowBot[i]] = true;
        nextTurn(1);
        return;
      }
    }
    computer();
  }
  // DRAW CHECK
  function drawTrue() {
    for (let i = 0; i < marked.length; i++) {
      if (marked[i] === false) {
        return true;
      }
    }
    return false;
  }
  if (!drawTrue()) {
    console.log("Match Draw!");
    input.close();
    return;
  }
  nextTurn(1);
}

// ================= switching players
function nextTurn(who) {
  if (who === 0) {
    if (level == 1) {
      computer();
      return;
    } else if (level === 2) {
      computer2();
      return;
    }
  } else if (who === 1) {
    askPlayer();
    return;
  }
}
