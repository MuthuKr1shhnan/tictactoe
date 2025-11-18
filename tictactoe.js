import readline from "readline";

//0,1,2,3,4,5,6,7,8
let positions = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

let winningPoints = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let marked = new Array(positions.length).fill(false);
let playerLetter = "X";
let computerLetter = "O";

// ================= TOSS
let tose = () => {
  let chooser = Math.floor(Math.random() * 2);
  console.log("\nToss Winner →", chooser === 0 ? "PLAYER" : "COMPUTER");
  if (chooser === 0) {
    selectLetter();
  } else {
    computer();
  }
  return;
};

// ================== READLINE SETUP
let input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
    // Trim spaces and convert to uppercase for consistency
    letter = letter.trim().toUpperCase();

    if ((letter !== "X" && letter !== "O") || !isNaN(letter)) {
      console.log("Invalid input! Try again. Choose either X or O");
      selectLetter();
      return;
    } else {
      playerLetter = letter;

      askPlayer();
      return;
    }
  });
}
// ================== PRINT BOARD
function printPositions() {
  console.log(
    `
   ${positions[0]} | ${positions[1]} | ${positions[2]}
  -----------
   ${positions[3]} | ${positions[4]} | ${positions[5]}
  -----------
   ${positions[6]} | ${positions[7]} | ${positions[8]}
  `
  );
}

// ================= PLAYER
function player(index, mark) {
  if (mark === "X" || mark === "O") {
    console.log(mark);
    positions[index] = mark;
    marked[index] = true;
  }

  printPositions();

  let first = "";
  let second = "";
  let third = "";

  for (let idx in winningPoints) {
    first = "";
    second = "";
    third = "";

    for (let pos of winningPoints[idx]) {
      if (first === "") {
        first = pos;
      } else if (second === "") {
        second = pos;
      } else if (third === "") {
        third = pos;
      }
    }

    if (
      positions[first] === playerLetter &&
      positions[second] === playerLetter &&
      positions[third] === playerLetter
    ) {
      console.log("Player Won The Game!!!");
      input.close();
      return;
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
  let first = "";
  let second = "";
  let third = "";

  for (let idx in winningPoints) {
    first = "";
    second = "";
    third = "";

    for (let pos of winningPoints[idx]) {
      if (first === "") {
        first = pos;
      } else if (second === "") {
        second = pos;
      } else if (third === "") {
        third = pos;
      }
    }

    if (
      positions[first] === computerLetter &&
      positions[second] === computerLetter &&
      positions[third] === computerLetter
    ) {
      console.log("Machine Won The Game!!!");
      input.close();
      return;
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

// START GAME
tose();
