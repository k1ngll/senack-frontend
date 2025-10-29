// frontend/script.js

// --- Elementos do HTML ---
const mainTitle = document.getElementById('mainTitle');
const gameCanvasContainer = document.getElementById('gameCanvasContainer');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreDisplay = document.getElementById('finalScoreDisplay');
const playerNameInput = document.getElementById('playerNameInput');
const submitScoreBtn = document.getElementById('submitScoreBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

const currentScoreDisplay = document.getElementById('currentScoreDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const leaderboardDiv = document.getElementById('leaderboard');
const resetRankingBtn = document.getElementById('resetRankingBtn'); // NOVO BOTÃO

// Botões de controle
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// --- Configurações do Jogo ---
const gridSize = 20;
const tileCount = gameCanvas.width / gridSize;
const gameSpeed = 1000 / 10;

// --- Estado do Jogo ---
let snake, food, velocity, score, isGameOver, gameStarted;
let playerName = "Jogador";
let highScores = [];
let gameLoopInterval;

// --- Funções de Controle de Tela ---
function showStartOverlay() {
    startOverlay.classList.remove('hidden');
    gameOverOverlay.classList.add('hidden');
}

function hideStartOverlay() {
    startOverlay.classList.add('hidden');
}

function showGameOverOverlay() {
    gameOverOverlay.classList.remove('hidden');
    finalScoreDisplay.textContent = score;
    playerNameInput.value = playerName;
}

function hideGameOverOverlay() {
    gameOverOverlay.classList.add('hidden');
    playerNameInput.value = '';
}

// Controle do jogo
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = generateFoodPosition();
    velocity = { x: 0, y: 0 };
    score = 0;
    isGameOver = false;
    gameStarted = false;
    currentScoreDisplay.textContent = score;
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    draw();
}

function gameLoop() {
    if (isGameOver) {
        handleGameOver();
        return;
    }
    if (gameStarted) {
        update();
    }
    draw();
}

function handleGameOver() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    showGameOverOverlay();
}

// logica do jogo
function update() {
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) { isGameOver = true; return; }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) { isGameOver = true; return; }
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        currentScoreDisplay.textContent = score;
        food = generateFoodPosition();
    } else {
        snake.pop();
    }
}

function generateFoodPosition() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = 'lime';
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2));
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// --- Controles (Teclado e Botões) ---
function handleDirectionChange(newVelocity) {
    if (!gameStarted) {
        gameStarted = true;
        hideStartOverlay();
        gameLoopInterval = setInterval(gameLoop, gameSpeed);
    }
    if ((newVelocity.x * -1 !== velocity.x || newVelocity.y * -1 !== velocity.y) || (velocity.x === 0 && velocity.y === 0)) {
        velocity = newVelocity;
    }
}

document.addEventListener('keydown', e => {
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Impede o comportamento padrão do navegador (rolar a página)
        e.preventDefault();
    }
    switch (e.key) {
        case 'ArrowUp': handleDirectionChange({ x: 0, y: -1 }); break;
        case 'ArrowDown': handleDirectionChange({ x: 0, y: 1 }); break;
        case 'ArrowLeft': handleDirectionChange({ x: -1, y: 0 }); break;
        case 'ArrowRight': handleDirectionChange({ x: 1, y: 0 }); break;
    }
});

upBtn.addEventListener('click', () => handleDirectionChange({ x: 0, y: -1 }));
downBtn.addEventListener('click', () => handleDirectionChange({ x: 0, y: 1 }));
leftBtn.addEventListener('click', () => handleDirectionChange({ x: -1, y: 0 }));
rightBtn.addEventListener('click', () => handleDirectionChange({ x: 1, y: 0 }));

// MENU PARA JOGADOR ESCOLHER O NOME
submitScoreBtn.addEventListener('click', () => {
    const enteredName = playerNameInput.value.trim();
    if (enteredName !== '') {
        playerName = enteredName;
    } else {
        playerName = 'Anônimo';
    }
    submitScore(playerName, score);
    hideGameOverOverlay();
    resetGame();
    showStartOverlay();
});

playAgainBtn.addEventListener('click', () => {
    hideGameOverOverlay();
    resetGame();
    showStartOverlay();
});


//ROTAS - BACKEND


// DELETE RANKING
resetRankingBtn.addEventListener('click', async () => {
    // Pede confirmação ao usuário antes de uma ação destrutiva
    if (confirm('Você tem certeza que deseja resetar todo o ranking? Esta ação não pode ser desfeita.')) {
        try {
            await fetch('https://senack-backend.vercel.app/api/ranking', { 
                method: 'DELETE',
            });
            // Após resetar, atualiza a exibição do ranking
            await fetchAndDisplayRanking();
        } catch (error) {
            console.error('Erro ao resetar o ranking:', error);
            alert('Não foi possível resetar o ranking.');
        }
    }
});



// GET
async function fetchAndDisplayRanking() {
    try {
        const response = await fetch('https://senack-backend.vercel.app/api/ranking');
        const ranking = await response.json();
        if (ranking.length > 0) {
            highScores = ranking;
            highScoreDisplay.textContent = ranking[0].score;
        } else {
            highScores = [];
            highScoreDisplay.textContent = '0';
        }
        leaderboardDiv.innerHTML = '<ol></ol>';
        const ol = leaderboardDiv.querySelector('ol');
        ranking.forEach((player, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${index + 1}. ${player.name}</span> <span>${player.score}</span>`;
            ol.appendChild(li);
        });
    } catch (error) {
        leaderboardDiv.innerHTML = '<p>Erro ao carregar ranking.</p>';
        console.error('Erro ao buscar ranking:', error);
    }
}


// POST
async function submitScore(name, score) {
    if (score === 0) {
        console.log("Pontuação 0, não enviado ao ranking.");
        return;
    }
    try {
        await fetch('https://senack-backend.vercel.app/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score }),
        });
        fetchAndDisplayRanking();
    } catch (error) {
        console.error('Erro ao submeter pontuação:', error);
    }
}

// inicio do programa
resetGame(); 
showStartOverlay(); 
fetchAndDisplayRanking();