// ============ TETRIS GAME - MULTIPLAYER ============

// Color Themes
const THEMES = {
    default: {
        name: 'default',
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'],
        bg: '#667eea',
        bgClass: 'theme-purple'
    },
    dark: {
        name: 'dark',
        colors: ['#00FF00', '#00FFFF', '#FFFF00', '#FF00FF', '#00FF7F', '#FF6347', '#00CED1'],
        bg: '#1a1a2e',
        bgClass: 'theme-dark'
    },
    ocean: {
        name: 'ocean',
        colors: ['#00BFFF', '#1E90FF', '#00CED1', '#20B2AA', '#40E0D0', '#48D1CC', '#00FA9A'],
        bg: '#0a4d68',
        bgClass: 'theme-ocean'
    },
    sunset: {
        name: 'sunset',
        colors: ['#FF1744', '#FF6E40', '#FFAB40', '#FFD600', '#FFC400', '#FF9100', '#FF5722'],
        bg: '#ff6b6b',
        bgClass: 'theme-sunset'
    },
    forest: {
        name: 'forest',
        colors: ['#2E7D32', '#558B2F', '#7CB342', '#9CCC65', '#C0CA33', '#F57F17', '#33691E'],
        bg: '#2d6a4f',
        bgClass: 'theme-forest'
    },
    candy: {
        name: 'candy',
        colors: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF', '#06FFA5', '#FF10F0'],
        bg: '#ff006e',
        bgClass: 'theme-candy'
    }
};

// Tetris Pieces
const PIECES = {
    I: {
        shape: [[1, 1, 1, 1]],
        color: 0
    },
    O: {
        shape: [[1, 1], [1, 1]],
        color: 1
    },
    T: {
        shape: [[0, 1, 0], [1, 1, 1]],
        color: 2
    },
    S: {
        shape: [[0, 1, 1], [1, 1, 0]],
        color: 3
    },
    Z: {
        shape: [[1, 1, 0], [0, 1, 1]],
        color: 4
    },
    J: {
        shape: [[1, 0, 0], [1, 1, 1]],
        color: 5
    },
    L: {
        shape: [[0, 0, 1], [1, 1, 1]],
        color: 6
    }
};

const PIECE_NAMES = Object.keys(PIECES);

// Game Configuration
const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const BLOCK_SIZE = 30;

// Particle System
class Particle {
    constructor(x, y, vx, vy, color, size = 4) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // gravity
        this.life -= this.decay;
    }

    draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Game Instance
class TetrisGame {
    constructor(canvasId, nextCanvasId, playerId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById(nextCanvasId);
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.playerId = playerId;
        this.grid = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(0));
        this.currentPiece = null;
        this.nextPiece = null;
        this.position = { x: 3, y: 0 };
        this.rotation = 0;
        
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.isPaused = false;
        
        this.dropCounter = 0;
        this.dropInterval = 500;
        this.particles = [];
        
        this.currentThemeIndex = 0;
        this.currentTheme = THEMES.default;
        
        this.moveLeft = false;
        this.moveRight = false;
        this.moveDown = false;
        this.rotate = false;
        
        this.initialize();
    }

    initialize() {
        this.spawnPiece();
        this.draw();
    }

    spawnPiece() {
        if (!this.nextPiece) {
            this.nextPiece = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
        }
        
        this.currentPiece = this.nextPiece;
        this.nextPiece = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
        this.position = { x: 3, y: 0 };
        this.rotation = 0;
        
        if (this.checkCollision()) {
            this.gameOver = true;
        }
    }

    getRotatedPiece() {
        const piece = PIECES[this.currentPiece];
        let shape = piece.shape;
        
        for (let i = 0; i < this.rotation % 4; i++) {
            shape = this.rotateCW(shape);
        }
        
        return shape;
    }

    rotateCW(shape) {
        const n = shape.length;
        const m = shape[0].length;
        const rotated = Array(m).fill(null).map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                rotated[j][n - 1 - i] = shape[i][j];
            }
        }
        
        return rotated;
    }

    checkCollision(offsetX = 0, offsetY = 0, rotation = this.rotation) {
        const piece = PIECES[this.currentPiece];
        let shape = piece.shape;
        
        for (let i = 0; i < rotation % 4; i++) {
            shape = this.rotateCW(shape);
        }
        
        const x = this.position.x + offsetX;
        const y = this.position.y + offsetY;
        
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j]) {
                    const gridX = x + j;
                    const gridY = y + i;
                    
                    if (gridX < 0 || gridX >= GRID_WIDTH || gridY >= GRID_HEIGHT) {
                        return true;
                    }
                    
                    if (gridY >= 0 && this.grid[gridY][gridX]) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    movePiece(dx) {
        if (!this.checkCollision(dx, 0)) {
            this.position.x += dx;
        }
    }

    rotatepiece() {
        if (!this.checkCollision(0, 0, this.rotation + 1)) {
            this.rotation = (this.rotation + 1) % 4;
        }
    }

    dropPiece() {
        if (!this.checkCollision(0, 1)) {
            this.position.y += 1;
        } else {
            this.lockPiece();
        }
    }

    lockPiece() {
        const piece = PIECES[this.currentPiece];
        const shape = this.getRotatedPiece();
        const colorIndex = piece.color;
        
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j]) {
                    const gridX = this.position.x + j;
                    const gridY = this.position.y + i;
                    
                    if (gridY >= 0) {
                        this.grid[gridY][gridX] = colorIndex + 1;
                    }
                }
            }
        }
        
        this.clearLines();
        this.spawnPiece();
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let i = GRID_HEIGHT - 1; i >= 0; i--) {
            if (this.grid[i].every(cell => cell !== 0)) {
                linesCleared++;
                this.createClearEffect(i);
                this.grid.splice(i, 1);
                this.grid.unshift(Array(GRID_WIDTH).fill(0));
                i++;
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * linesCleared * 100;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 500 - (this.level - 1) * 30);
            
            // Change theme when clearing lines
            if (this.lines > 0 && this.lines % 5 === 0) {
                this.changeTheme();
            }
        }
    }

    createClearEffect(row) {
        const lineHeight = this.canvas.height / GRID_HEIGHT;
        const lineY = row * lineHeight + lineHeight / 2;
        
        for (let i = 0; i < GRID_WIDTH; i++) {
            const x = i * BLOCK_SIZE + BLOCK_SIZE / 2 + 50; // offset for canvas position
            
            for (let p = 0; p < 8; p++) {
                const angle = (Math.PI * 2 * p) / 8;
                const vx = Math.cos(angle) * (3 + Math.random() * 2);
                const vy = Math.sin(angle) * (3 + Math.random() * 2);
                const color = this.currentTheme.colors[Math.floor(Math.random() * this.currentTheme.colors.length)];
                
                this.particles.push(new Particle(x, lineY, vx, vy, color, 6));
            }
        }
    }

    changeTheme() {
        const themes = Object.keys(THEMES);
        this.currentThemeIndex = (this.currentThemeIndex + 1) % themes.length;
        this.currentTheme = THEMES[themes[this.currentThemeIndex]];
        document.body.className = this.currentTheme.bgClass;
    }

    update() {
        if (this.gameOver || this.isPaused) return;
        
        // Handle input
        if (this.moveLeft) {
            this.movePiece(-1);
            this.moveLeft = false;
        }
        if (this.moveRight) {
            this.movePiece(1);
            this.moveRight = false;
        }
        if (this.rotate) {
            this.rotatepiece();
            this.rotate = false;
        }
        
        // Drop piece
        this.dropCounter += 16; // ~60 FPS
        if (this.moveDown) {
            this.dropCounter = this.dropInterval;
        }
        
        if (this.dropCounter >= this.dropInterval) {
            this.dropPiece();
            this.dropCounter = 0;
        }
        
        // Update particles
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => p.update());
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid background
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i <= GRID_WIDTH; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * BLOCK_SIZE, 0);
            this.ctx.lineTo(i * BLOCK_SIZE, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= GRID_HEIGHT; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * BLOCK_SIZE);
            this.ctx.lineTo(this.canvas.width, i * BLOCK_SIZE);
            this.ctx.stroke();
        }
        
        // Draw placed pieces
        for (let i = 0; i < GRID_HEIGHT; i++) {
            for (let j = 0; j < GRID_WIDTH; j++) {
                if (this.grid[i][j]) {
                    this.drawBlock(j, i, this.currentTheme.colors[this.grid[i][j] - 1]);
                }
            }
        }
        
        // Draw current piece
        if (this.currentPiece) {
            const shape = this.getRotatedPiece();
            const piece = PIECES[this.currentPiece];
            
            for (let i = 0; i < shape.length; i++) {
                for (let j = 0; j < shape[i].length; j++) {
                    if (shape[i][j]) {
                        this.drawBlock(
                            this.position.x + j,
                            this.position.y + i,
                            this.currentTheme.colors[piece.color]
                        );
                    }
                }
            }
        }
        
        // Draw particles
        this.particles.forEach(p => p.draw(this.ctx));
        
        // Draw game over overlay
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
        }
        
        // Draw pause overlay
        if (this.isPaused && !this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    drawBlock(x, y, color) {
        const blockX = x * BLOCK_SIZE;
        const blockY = y * BLOCK_SIZE;
        
        // Main block
        this.ctx.fillStyle = color;
        this.ctx.fillRect(blockX + 1, blockY + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
        
        // Highlight
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(blockX + 1, blockY + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
        
        // Shadow
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(blockX + 2, blockY + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
    }

    drawNextPiece() {
        this.nextCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            const shape = PIECES[this.nextPiece].shape;
            const color = this.currentTheme.colors[PIECES[this.nextPiece].color];
            
            const offsetX = (4 - shape[0].length) * 6;
            const offsetY = (4 - shape.length) * 6;
            
            for (let i = 0; i < shape.length; i++) {
                for (let j = 0; j < shape[i].length; j++) {
                    if (shape[i][j]) {
                        const x = offsetX + j * 12;
                        const y = offsetY + i * 12;
                        this.nextCtx.fillStyle = color;
                        this.nextCtx.fillRect(x + 1, y + 1, 10, 10);
                    }
                }
            }
        }
    }

    reset() {
        this.grid = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(0));
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.isPaused = false;
        this.dropCounter = 0;
        this.dropInterval = 500;
        this.rotation = 0;
        this.position = { x: 3, y: 0 };
        this.particles = [];
        this.spawnPiece();
    }

    updateScore() {
        document.getElementById(`score${this.playerId}`).textContent = this.score;
        document.getElementById(`lines${this.playerId}`).textContent = this.lines;
        document.getElementById(`level${this.playerId}`).textContent = this.level;
    }
}

// Main Game Controller
class GameController {
    constructor() {
        this.game1 = new TetrisGame('gameCanvas1', 'nextCanvas1', 1);
        this.game2 = null;
        this.isMultiplayer = false;
        this.isRunning = false;
        this.animationId = null;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('singlePlayerBtn').addEventListener('click', () => this.setSinglePlayer());
        document.getElementById('multiPlayerBtn').addEventListener('click', () => this.setMultiplayer());
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Setup tutorial
        this.setupTutorial();
    }

    setupTutorial() {
        const modal = document.getElementById('tutorialModal');
        const closeModal = document.getElementById('closeModal');
        const startTutorialBtn = document.getElementById('startTutorialBtn');
        const tabBtns = document.querySelectorAll('.tab-btn');

        // Show tutorial on page load
        modal.classList.remove('hidden');

        // Close modal when X is clicked
        closeModal.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Close modal when "Mulai Bermain" is clicked
        startTutorialBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Tab switching functionality
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');

                // Remove active class from all buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                // Show selected tab content
                document.getElementById(tabName).classList.add('active');
            });
        });

        // Close tutorial when modal background is clicked
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    setSinglePlayer() {
        this.isMultiplayer = false;
        document.getElementById('player2Container').style.display = 'none';
        document.getElementById('singlePlayerBtn').classList.add('active');
        document.getElementById('multiPlayerBtn').classList.remove('active');
        document.getElementById('gameWrapper').style.justifyContent = 'center';
        this.resetGame();
    }

    setMultiplayer() {
        this.isMultiplayer = true;
        document.getElementById('player2Container').style.display = 'flex';
        document.getElementById('multiPlayerBtn').classList.add('active');
        document.getElementById('singlePlayerBtn').classList.remove('active');
        document.getElementById('gameWrapper').style.justifyContent = 'center';
        
        if (!this.game2) {
            this.game2 = new TetrisGame('gameCanvas2', 'nextCanvas2', 2);
        }
        
        this.resetGame();
    }

    startGame() {
        this.isRunning = true;
        this.gameLoop();
    }

    togglePause() {
        if (this.isRunning) {
            this.game1.isPaused = !this.game1.isPaused;
            if (this.game2) this.game2.isPaused = !this.game2.isPaused;
        }
    }

    resetGame() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.game1.reset();
        if (this.game2) this.game2.reset();
    }

    handleKeyDown(e) {
        if (!this.isRunning) return;
        
        // Player 1 controls (Arrow Keys + Z/X)
        if (e.key === 'ArrowLeft') {
            this.game1.moveLeft = true;
        }
        if (e.key === 'ArrowRight') {
            this.game1.moveRight = true;
        }
        if (e.key === 'ArrowDown') {
            this.game1.moveDown = true;
        }
        if (e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'x') {
            this.game1.rotate = true;
        }
        
        // Player 2 controls (A/D + S + Q/E)
        if (this.game2) {
            if (e.key.toLowerCase() === 'a') {
                this.game2.moveLeft = true;
            }
            if (e.key.toLowerCase() === 'd') {
                this.game2.moveRight = true;
            }
            if (e.key.toLowerCase() === 's') {
                this.game2.moveDown = true;
            }
            if (e.key.toLowerCase() === 'q' || e.key.toLowerCase() === 'e') {
                this.game2.rotate = true;
            }
        }
    }

    handleKeyUp(e) {
        if (e.key.toLowerCase() === 'arrowdown' || e.key === 'ArrowDown') {
            this.game1.moveDown = false;
        }
        if (this.game2) {
            if (e.key.toLowerCase() === 's') {
                this.game2.moveDown = false;
            }
        }
    }

    gameLoop() {
        this.game1.update();
        this.game1.draw();
        this.game1.drawNextPiece();
        this.game1.updateScore();
        
        if (this.game2) {
            this.game2.update();
            this.game2.draw();
            this.game2.drawNextPiece();
            this.game2.updateScore();
        }
        
        // Check if both games are over
        const allGameOver = this.game1.gameOver && (!this.game2 || this.game2.gameOver);
        
        if (!allGameOver && this.isRunning) {
            this.animationId = requestAnimationFrame(() => this.gameLoop());
        } else if (allGameOver && this.isRunning) {
            this.isRunning = false;
        }
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    const gameController = new GameController();
});
