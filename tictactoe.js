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

let playerLetter = "X";
let computerLetter = "O";
// START GAME
askBoardSize();
//=================== ASK Board size
function askBoardSize() {
  input.question("Enter the board size (e.g., 3 for a 3×3 board)= ", (num) => {
    if (!isNaN(num)) {
      for (let i = 0; i < num * num; i++) {
        positions.push(" ");
      }
      for (let i = 0; i < num * num; i++) {
        marked.push(false);
      }
      console.log(positions);
      boardSize = num * num;
      winningPointsProvider();
      console.log(winningPoints);
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
  let countFrRow = Math.sqrt(boardSize);
  let indexFrRow = 0;
  while (countFrRow) {
    let row = [];
    let subCount = Math.sqrt(boardSize);
    while (subCount) {
      row.push(indexFrRow);
      indexFrRow++;
      subCount--;
    }
    winningPoints.push(row);
    countFrRow--;
  }
  //col check
  let countFrCol = Math.sqrt(boardSize);
  let rowIndex = 0;
  let indexFrCol = 0;
  while (countFrCol) {
    let col = [];
    let subCount = Math.sqrt(boardSize);
    indexFrCol = rowIndex;
    while (subCount) {
      col.push(indexFrCol);
      indexFrCol += Math.sqrt(boardSize);
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
    let subCount = Math.sqrt(boardSize);
    indexFrDiag1 = indexStartPointDiag1;
    while (subCount) {
      diag1.push(indexFrDiag1);
      indexFrDiag1 += Math.sqrt(boardSize) + 1;
      subCount--;
    }

    winningPoints.push(diag1);

    countFrDiag1--;
  }
  //diagonal two check from right corner
  let countFrDiag2 = 1;

  let indexStartPointDiag2 = Math.sqrt(boardSize)-1;
  let indexFrDiag2 = 0;
  while (countFrDiag2) {
    let diag2 = [];
    let subCount = Math.sqrt(boardSize);
    indexFrDiag2 = indexStartPointDiag2;
    while (subCount) {
      diag2.push(indexFrDiag2);
      indexFrDiag2 += Math.sqrt(boardSize) - 1;
      subCount--;
    }

    winningPoints.push(diag2);

    countFrDiag2--;
  }
}

// ============= TOSS
function tose() {
  let chooser = 0;
  console.log("\nToss Winner →", chooser === 0 ? "PLAYER" : "COMPUTER");
  if (chooser === 0) {
    selectLetter();
  } else {
    computer();
  }
  return;
}

// ================== ASK PLAYER
function askPlayer() {
  input.question("Enter your position (1-9)= ", (num) => {
    let position = Number(num) - 1;

    if (isNaN(position) || position < 0 || position > 8) {
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
  let count = Math.sqrt(boardSize);
  let index = 0;
  while (count) {
    let subCount = Math.sqrt(boardSize);
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
      for (
        let i = 0;
        i < Math.sqrt(boardSize) + (Math.sqrt(boardSize) - 1);
        i++
      ) {
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
    console.log(mark);
    positions[index] = mark;
    marked[index] = true;
  }

  printPositions();

  //Condition for winning
  for (let i = 0; i < winningPoints.length; i++) {
    let count = 0;
    let tem = winningPoints[i];
    for (let j = 0; j < winningPoints.length; j++) {
      if (positions[tem[j]] === playerLetter) {
        console.log(tem);
        count++;
      }
    }
    if (count === Math.sqrt(boardSize)) {
      console.log("X is winner");
      input.close();
      return;
    } else {
      count = 0;
    }
  }

  // DRAW CHECK
  if (!marked.includes(false)) {
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

  let randomPick = emptyPlace[Math.floor(Math.random() * emptyPlace.length)];
  positions[randomPick] = computerLetter;
  marked[randomPick] = true;

  printPositions();

  // WIN CHECK (using empty string "")
  for (let i = 0; i < winningPoints.length; i++) {
    let count = 0;
    let tem = winningPoints[i];

    for (let j = 0; j < winningPoints.length; j++) {
      if (positions[tem[j]] === computerLetter) {
        console.log(tem);
        count++;
      }
    }
    if (count === Math.sqrt(boardSize)) {
      console.log("Machine is winner");
      input.close();
      return;
    } else {
      count = 0;
    }
  }

  // DRAW CHECK
  if (!marked.includes(false)) {
    console.log("Match Draw!");
    input.close();
    return;
  }

  nextTurn(1); // next: player
}

// ================= switching players
function nextTurn(who) {
  if (who === 0) {
    computer();
    return;
  } else {
    askPlayer();
    return;
  }
}
