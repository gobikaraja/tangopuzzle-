const size = 6; // 6x6 matrix
const puzzle = document.getElementById("puzzle");
const result = document.getElementById("result");
const restartBtn = document.getElementById("restartBtn");

let cells = [];
let conditions = [];

function generatePuzzle() {
  puzzle.innerHTML = "";
  cells = [];
  conditions = [];

  // Build grid (cells + connectors)
  for (let i = 0; i < size * 2 - 1; i++) {
    for (let j = 0; j < size * 2 - 1; j++) {
      if (i % 2 === 0 && j % 2 === 0) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = Math.floor(i / 2);
        cell.dataset.col = Math.floor(j / 2);
        cell.dataset.state = "empty";
        cell.addEventListener("click", toggleCell);
        puzzle.appendChild(cell);
        cells.push(cell);
      } else if (i % 2 !== j % 2) {
        const connector = document.createElement("div");
        connector.classList.add("connector");
        connector.textContent = "";
        connector.dataset.active = "false";
        puzzle.appendChild(connector);
      } else {
        const empty = document.createElement("div");
        empty.classList.add("empty");
        puzzle.appendChild(empty);
      }
    }
  }

  // Pick 8–15 random connectors
  let allConnectors = Array.from(document.querySelectorAll(".connector"));
  let count = Math.floor(Math.random() * 8) + 8; // 8–15
  let selected = [];

  while (selected.length < count) {
    let idx = Math.floor(Math.random() * allConnectors.length);
    if (!selected.includes(idx)) {
      selected.push(idx);
    }
  }

  selected.forEach(idx => {
    let connector = allConnectors[idx];
    let type = Math.random() < 0.5 ? "=" : "*";
    connector.textContent = type;
    connector.dataset.active = "true";
    connector.dataset.rule = type;
    conditions.push(connector);
  });
}

function toggleCell(e) {
  const cell = e.currentTarget;
  if (cell.dataset.state === "empty") {
    cell.dataset.state = "blue";
    cell.classList.add("blue");
  } else if (cell.dataset.state === "blue") {
    cell.dataset.state = "pink";
    cell.classList.remove("blue");
    cell.classList.add("pink");
  } else {
    cell.dataset.state = "empty";
    cell.classList.remove("blue", "pink");
  }
}

function checkSolution() {
  result.style.display = "block";

  // Rule 1: Each row/column has 3 blue + 3 pink
  for (let r = 0; r < size; r++) {
    let rowCells = cells.filter(c => parseInt(c.dataset.row) === r);
    let blues = rowCells.filter(c => c.dataset.state === "blue").length;
    let pinks = rowCells.filter(c => c.dataset.state === "pink").length;
    if (blues !== 3 || pinks !== 3) {
      result.textContent = "❌ Row rule broken!";
      result.style.color = "red";
      return;
    }
  }

  for (let c = 0; c < size; c++) {
    let colCells = cells.filter(cell => parseInt(cell.dataset.col) === c);
    let blues = colCells.filter(cell => cell.dataset.state === "blue").length;
    let pinks = colCells.filter(cell => cell.dataset.state === "pink").length;
    if (blues !== 3 || pinks !== 3) {
      result.textContent = "❌ Column rule broken!";
      result.style.color = "red";
      return;
    }
  }

  // Rule 2: Check connector conditions
  for (let conn of conditions) {
    if (conn.dataset.active === "true") {
      let index = Array.from(puzzle.children).indexOf(conn);
      let cell1 = null, cell2 = null;

      if (conn.previousSibling && conn.previousSibling.classList.contains("cell")) {
        cell1 = conn.previousSibling;
        cell2 = conn.nextSibling;
      } else if (
        index >= (size * 2 - 1) &&
        puzzle.children[index - (size * 2 - 1)].classList.contains("cell")
      ) {
        cell1 = puzzle.children[index - (size * 2 - 1)];
        cell2 = puzzle.children[index + (size * 2 - 1)];
      }

      if (cell1 && cell2) {
        let s1 = cell1.dataset.state;
        let s2 = cell2.dataset.state;
        if (conn.dataset.rule === "=" && s1 !== "empty" && s2 !== "empty" && s1 !== s2) {
          result.textContent = "❌ '=' rule broken!";
          result.style.color = "red";
          return;
        }
        if (conn.dataset.rule === "*" && s1 !== "empty" && s2 !== "empty" && s1 === s2) {
          result.textContent = "❌ '*' rule broken!";
          result.style.color = "red";
          return;
        }
      }
    }
  }

  result.textContent = "✅ Correct! You solved it!";
  result.style.color = "green";
}

document.getElementById("checkBtn").addEventListener("click", checkSolution);
restartBtn.addEventListener("click", () => {
  result.style.display = "none";
  generatePuzzle();
});

generatePuzzle();
