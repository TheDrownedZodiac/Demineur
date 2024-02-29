var grid = document.getElementById('grid');
var form = document.getElementById('container');
let width, height, bombs;
let state = true;
let score = 0;
let mines = [];

function youWIN() {
    grid.innerHTML = "";
    grid.insertAdjacentHTML("beforeend", "<img src=\"win.jpg\">");
}

function clickEvent() {
    if (state && this.classList.contains('unset')) {
        this.classList.remove('unset');
        score += 1;
        document.getElementById('score').textContent = "Score: " + score;
        if (score == (width * height) - bombs) {
            return youWIN();
        }
        updateGrid();
    }
}

function initializeGrid() {
    grid.innerHTML = "";
    state = true;
    score = 0;
    document.getElementById('score').textContent = "Score: " + score;
    for (let i = 0; i < width; i++) {
        var line = document.createElement('div');
        line.classList.add('line');
        grid.appendChild(line);
        for (let j = 0; j < height; j++) {
            var cell = document.createElement('button');
            cell.classList.add('cell');
            cell.classList.add('unset');
            cell.dataset.x = j;
            cell.dataset.y = i;
            cell.textContent = 0;
            line.appendChild(cell);
            cell.addEventListener('click', clickEvent);
        }
    }
}

function generateMines() {
    mines = [];
    while (mines.length < bombs) {
        var x = Math.floor(Math.random() * width);
        var y = Math.floor(Math.random() * height);
        if (!mines.some(mine => mine.x == x && mine.y == y)) {
            mines.push({ x, y });
        }
    }
}

function isMine(x, y) {
    return mines.some(mine => mine.x == x && mine.y == y);
}

function calculateAdjacentMines(x, y) {
    let count = 0;

    if (isMine(x + 1, y)) {
        count += 1;
    }
    if (isMine(x - 1, y)) {
        count += 1;
    }
    if (isMine(x - 1, y + 1)) {
        count += 1;
    }
    if (isMine(x, y + 1)) {
        count += 1;
    }
    if (isMine(x + 1, y + 1)) {
        count += 1;
    }
    if (isMine(x - 1, y - 1)) {
        count += 1;
    }
    if (isMine(x, y - 1)) {
        count += 1;
    }
    if (isMine(x + 1, y - 1)) {
        count += 1;
    }
    return count;
}

function updateGrid() {
    var cells = document.querySelectorAll('.cell');
    for (cell of cells) {
        var x = parseInt(cell.dataset.x);
        var y = parseInt(cell.dataset.y);
        if (isMine(x, y) && !cell.classList.contains("unset")) {
            cell.textContent = "x";
            cell.classList.add("r-x");
            if (state) {
                gameover();
            }
        } else if (!cell.classList.contains("unset")) {
            var adjacentMines = calculateAdjacentMines(x, y);
            cell.classList.add("r-" + adjacentMines);
            cell.textContent = adjacentMines;
        }
    }
}

function handlerSubmit(e) {
    e.preventDefault();
    width = parseInt(document.getElementById('width').value);
    height = parseInt(document.getElementById('height').value);
    bombs = parseInt(document.getElementById('bombs').value);
    if (!isNaN(width) && !isNaN(height) && !isNaN(bombs) && height * width > bombs) {
        initializeGrid();
        generateMines();
    }
}

function gameover() {
    var cells = document.querySelectorAll('.cell');

    state = false;
    document.getElementById('score').textContent = "Score: " + (score - 1);
    for (cell of cells) {
        if (cell.classList.contains("unset")) {
            cell.classList.remove("unset")
        }
    }
    updateGrid();
}

form.addEventListener('submit', handlerSubmit);