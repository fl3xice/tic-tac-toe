class ColorFlow {
  hsl = [240, 100, 50];
  pong = false;

  constructor(offset) {
    if (offset) {
      this.hsl[0] += offset;
    }
  }

  next() {
    if (this.pong == true) {
      this.hsl[0] -= 1;
    } else {
      this.hsl[0] += 1;
    }

    if (this.hsl[0] === 300 && this.pong == false) {
      this.pong = true;
    }

    if (this.hsl[0] === 240 && this.pong == true) {
      this.pong = false;
    }
  }

  reset() {
    this.pong = false;
    this.hsl = [240, 100, 50];
  }

  getToFormat() {
    return `hsl(${this.hsl[0]}, ${this.hsl[1]}%, ${this.hsl[2]}%)`;
  }
}

// ---

const canvas = document.getElementById("ticTacToe");

let gridAnimationFrame;
let gridAnimationDelay = 10;
let gridAnimationTimeStamp = 0;
const ctxGrid = canvas.getContext("2d");

const cellSize = 100;
const fontSize = 80;
const fontFace = "Pixelify Sans";
let moves = 0;

let matrix = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let currentPlayer = "X";

function render() {
  gridAnimationFrame = requestAnimationFrame(drawGrid);
}

const colors = [
  "hsl(240, 60%, 40%)",
  "hsl(240, 60%, 40%)",
  "hsl(240, 60%, 40%)",
  "hsl(240, 60%, 40%)",
  "hsl(240, 60%, 40%)",
  "hsl(240, 60%, 40%)",
];

const lines = [
  createColorFlow(),
  createColorFlow(30),
  createColorFlow(50),
  createColorFlow(55),
];

function createColorFlow(offset) {
  return new ColorFlow(offset);
}

function getRandomFromArray(array) {
  if (array.length === 0) {
    return undefined; // Return undefined if the array is empty
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function drawGrid(timestamp) {
  const deltaTime = timestamp - gridAnimationTimeStamp;

  // Check if it's time for the delay
  if (deltaTime >= gridAnimationDelay) {
    ctxGrid.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctxGrid.lineWidth = 5;
    // Draw horizontal lines with dynamic colors
    for (let i = 0; i < lines.length; i++) {
      ctxGrid.beginPath();
      ctxGrid.moveTo(0, 101 * (i + 1)); // Start at (0, 100 * (i + 1))
      ctxGrid.lineTo(301, 101 * (i + 1)); // Draw a line to (300, 100 * (i + 1))
      ctxGrid.strokeStyle = lines[i].getToFormat();
      lines[i].next();
      ctxGrid.stroke();
    }

    // Draw vertical lines with dynamic colors
    for (let i = 0; i < lines.length; i++) {
      ctxGrid.beginPath();
      ctxGrid.moveTo(101 * (i + 1), 0); // Start at (100 * (i + 1), 0)
      ctxGrid.lineTo(101 * (i + 1), 300); // Draw a line to (100 * (i + 1), 300)
      ctxGrid.strokeStyle = lines[i].getToFormat();
      lines[i].next();
      ctxGrid.stroke();
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cellValue = matrix[row][col];
        if (cellValue === "X" || cellValue === "O") {
          const x = col * cellSize + cellSize / 2;
          const y = row * cellSize + cellSize / 2;
          drawSymbol(cellValue, x, y);
        }
      }
    }

    // Reset the lastTimestamp
    gridAnimationTimeStamp = timestamp;
  }

  requestAnimationFrame(drawGrid);
}

canvas.addEventListener("click", (ev) => {
  let column;
  let row;

  // C: 0 R: 0
  if (ev.offsetX < 100) {
    column = 0;
  }

  if (ev.offsetY < 100) {
    row = 0;
  }

  // C: 1 R:1
  if (ev.offsetX > 100) {
    column = 1;
  }

  if (ev.offsetY > 100) {
    row = 1;
  }

  // C: 0 R: 0
  if (ev.offsetX > 200) {
    column = 2;
  }

  if (ev.offsetY > 200) {
    row = 2;
  }

  if (matrix[row][column] == "") {
    matrix[row][column] = currentPlayer;
    revertPlayer();
    handleMatrix();
  }
});

function handleMatrix() {
  moves++;
  const winner = checkWinner(matrix);
  if (winner) {
    addWinnerToHistory(winner);
    resetGame();
  }

  if (moves == 9) {
    addWinnerToHistory("N");
    resetGame();
  }
}

const winnersHistory = document.getElementById("winners");

function addWinnerToHistory(winner) {
  const newElm = document.createElement("span");
  newElm.innerText = winner;
  winnersHistory.insertBefore(newElm, winnersHistory.firstChild);
}

function resetGame() {
  matrix = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  currentPlayer = "X";
  moves = 0;
}

// Function to draw X or O on the canvas
function drawSymbol(symbol, x, y) {
  ctxGrid.font = `${fontSize}px ${fontFace}`;
  ctxGrid.textAlign = "center";
  ctxGrid.textBaseline = "middle";

  if (symbol === "X") {
    ctxGrid.fillStyle = "white"; // You can set the color for X
  } else if (symbol === "O") {
    ctxGrid.fillStyle = "white"; // You can set the color for O
  }

  ctxGrid.fillText(symbol, x, y);
}

function checkWinner(matrix) {
  // Check rows, columns, and diagonals
  for (let i = 0; i < 3; i++) {
    // Check rows
    if (
      matrix[i][0] !== "" &&
      matrix[i][0] === matrix[i][1] &&
      matrix[i][1] === matrix[i][2]
    ) {
      return matrix[i][0];
    }

    // Check columns
    if (
      matrix[0][i] !== "" &&
      matrix[0][i] === matrix[1][i] &&
      matrix[1][i] === matrix[2][i]
    ) {
      return matrix[0][i];
    }
  }

  // Check diagonals
  if (
    matrix[0][0] !== "" &&
    matrix[0][0] === matrix[1][1] &&
    matrix[1][1] === matrix[2][2]
  ) {
    return matrix[0][0];
  }
  if (
    matrix[0][2] !== "" &&
    matrix[0][2] === matrix[1][1] &&
    matrix[1][1] === matrix[2][0]
  ) {
    return matrix[0][2];
  }

  // If no winner found
  return null;
}

function revertPlayer() {
  currentPlayer = currentPlayer == "X" ? "O" : "X";
}

window.addEventListener("DOMContentLoaded", () => {
  render();
});
