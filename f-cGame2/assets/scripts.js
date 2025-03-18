const wordDisplay = document.getElementById('wordDisplay');
const wordInput = document.getElementById('wordInput');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const levelElement = document.getElementById('level');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

let words = [
    'hello', 'world', 'game', 'programming', 'javascript',
    'computer', 'keyboard', 'mouse', 'screen', 'coding',
    'developer', 'application', 'website', 'internet', 'software'
];

let currentWord = '';
let score = 0;
let timeLeft = 60;
let level = 1;
let gameInterval;
let isPlaying = false;

// Initialize the game
function init() {
    wordInput.value = '';
    score = 0;
    timeLeft = 60;
    level = 1;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    levelElement.textContent = level;
    wordInput.disabled = true;
    resetButton.disabled = true;
    startButton.disabled = false;
}

// Start the game
function startGame() {
    isPlaying = true;
    wordInput.disabled = false;
    startButton.disabled = true;
    resetButton.disabled = false;
    wordInput.focus();
    showWord();
    gameInterval = setInterval(updateTimer, 1000);
}

// Show a random word
function showWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    wordDisplay.textContent = currentWord;
}

// Update timer
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerElement.textContent = timeLeft;
    } else {
        gameOver();
    }
}

// Game over
function gameOver() {
    isPlaying = false;
    clearInterval(gameInterval);
    wordInput.disabled = true;
    wordDisplay.textContent = `Game Over! Final Score: ${score}`;
    startButton.disabled = true;
}

// Reset game
function resetGame() {
    clearInterval(gameInterval);
    init();
    wordDisplay.textContent = 'Start typing...';
}

// Check if word matches
function matchWords() {
    if (wordInput.value === currentWord) {
        wordInput.value = '';
        score += 10 * level;
        scoreElement.textContent = score;
        
        // Increase level every 50 points
        if (score > 0 && score % 50 === 0) {
            level++;
            levelElement.textContent = level;
            timeLeft += 5; // Bonus time for leveling up
            timerElement.textContent = timeLeft;
        }
        
        showWord();
        return true;
    }
    return false;
}

// Event listeners
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
wordInput.addEventListener('input', () => {
    if (isPlaying) {
        matchWords();
    }
});

// Initialize the game when the page loads
init();