const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const BLOCK_SIZE = 30;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

canvas.width = BLOCK_SIZE * GRID_WIDTH;
canvas.height = BLOCK_SIZE * GRID_HEIGHT;

let score = 0;
let gameOver = false;
let grid = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(0));
let currentPiece = null;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

const PIECES = [
    {
        shape: [
            [1, 1, 1, 1]
        ],
        color: '#00f0f0'
    },
    {
        shape: [
            [1, 0],
            [1, 0],
            [1, 1]
        ],
        color: '#f0a000'
    },
    {
        shape: [
            [0, 1],
            [0, 1],
            [1, 1]
        ],
        color: '#0000f0'
    },
    {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: '#f0f000'
    },
    {
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        color: '#a000f0'
    }
];

class Piece {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.x = Math.floor(GRID_WIDTH / 2) - Math.floor(shape[0].length / 2);
        this.y = 0;
    }
}

function createPiece() {
    const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
    return new Piece(piece.shape, piece.color);
}

function collide() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x] !== 0) {
                const newX = currentPiece.x + x;
                const newY = currentPiece.y + y;
                
                if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
                    return true;
                }
                
                if (newY >= 0 && grid[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function merge() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                grid[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            }
        }
    }
}

function rotate() {
    const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );
    
    const previousShape = currentPiece.shape;
    currentPiece.shape = rotated;
    
    if (collide()) {
        currentPiece.shape = previousShape;
    }
}

function clearLines() {
    let linesCleared = 0;
    
    outer: for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (!grid[y][x]) continue outer;
        }
        
        grid.splice(y, 1);
        grid.unshift(Array(GRID_WIDTH).fill(0));
        linesCleared++;
    }
    
    if (linesCleared > 0) {
        score += linesCleared * 100;
        document.getElementById('score').textContent = score;
    }
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (grid[y][x]) {
                ctx.fillStyle = grid[y][x];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        }
    }
    
    if (currentPiece) {
        ctx.fillStyle = currentPiece.color;
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    ctx.fillRect(
                        (currentPiece.x + x) * BLOCK_SIZE,
                        (currentPiece.y + y) * BLOCK_SIZE,
                        BLOCK_SIZE - 1,
                        BLOCK_SIZE - 1
                    );
                }
            }
        }
    }
}

function update(time = 0) {
    if (gameOver) return;
    
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    
    if (dropCounter > dropInterval) {
        currentPiece.y++;
        if (collide()) {
            currentPiece.y--;
            merge();
            clearLines();
            currentPiece = createPiece();
            
            if (collide()) {
                gameOver = true;
                document.getElementById('gameOver').style.display = 'block';
                document.getElementById('finalScore').textContent = score;
                return;
            }
        }
        dropCounter = 0;
    }
    
    draw();
    requestAnimationFrame(update);
}

function restartGame() {
    grid = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(0));
    score = 0;
    gameOver = false;
    document.getElementById('score').textContent = '0';
    document.getElementById('gameOver').style.display = 'none';
    currentPiece = createPiece();
    update();
}

document.addEventListener('keydown', event => {
    if (gameOver) return;
    
    switch (event.keyCode) {
        case 37:
            currentPiece.x--;
            if (collide()) currentPiece.x++;
            break;
        case 39:
            currentPiece.x++;
            if (collide()) currentPiece.x--;
            break;
        case 40: 
            currentPiece.y++;
            if (collide()) {
                currentPiece.y--;
                merge();
                clearLines();
                currentPiece = createPiece();
                if (collide()) {
                    gameOver = true;
                    document.getElementById('gameOver').style.display = 'block';
                    document.getElementById('finalScore').textContent = score;
                }
            }
            dropCounter = 0;
            break;
        case 38:
            rotate();
            break;
        case 32:
            while (!collide()) {
                currentPiece.y++;
            }
            currentPiece.y--;
            merge();
            clearLines();
            currentPiece = createPiece();
            if (collide()) {
                gameOver = true;
                document.getElementById('gameOver').style.display = 'block';
                document.getElementById('finalScore').textContent = score;
            }
            break;
    }
});


currentPiece = createPiece();
update(); 