document.addEventListener("DOMContentLoaded", () => {
    const playBoard = document.querySelector(".play-board");
    const scoreElement = document.querySelector(".score");
    const highScoreElement = document.querySelector(".high-score");
    const controls = document.querySelectorAll(".controls i");

    let gameOver = false;
    let foodX, foodY;
    let snakeX = 15, snakeY = 15; // Start at center
    let velocityX = 0, velocityY = 0;
    let snakeBody = [];
    let setIntervalId;
    let score = 0;

    let highScore = localStorage.getItem("high-score") || 0;
    highScoreElement.innerText = `High Score: ${highScore}`;

    const updateFoodPosition = () => {
        foodX = Math.floor(Math.random() * 30) + 1;
        foodY = Math.floor(Math.random() * 30) + 1;
    };

    const handleGameOver = () => {
        clearInterval(setIntervalId);
        alert("Game Over! Press OK to restart.");
        location.reload();
    };

    const changeDirection = (e) => {
        let key = e.key || e.dataset?.key;
        if ((key === "ArrowUp") && velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        } else if ((key === "ArrowDown") && velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        } else if ((key === "ArrowLeft") && velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        } else if ((key === "ArrowRight") && velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        }
    };

    controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

    const initGame = () => {
        if (gameOver) return handleGameOver();
        let html = `<div class="food" style="grid-row: ${foodY}; grid-column: ${foodX}"></div>`;

        if (snakeX === foodX && snakeY === foodY) {
            updateFoodPosition();
            snakeBody.push([foodX, foodY]); // Add new segment
            score++;
            highScore = Math.max(score, highScore);
            localStorage.setItem("high-score", highScore);
            scoreElement.innerText = `Score: ${score}`;
            highScoreElement.innerText = `High Score: ${highScore}`;
        }

        // Move the snake
        snakeBody.unshift([snakeX, snakeY]); // Add new head
        snakeX += velocityX;
        snakeY += velocityY;

        // Remove tail to keep size
        if (snakeBody.length > score + 1) {
            snakeBody.pop();
        }

        // Check collisions with walls
        if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
            gameOver = true;
        }

        // Render snake
        snakeBody.forEach(([x, y], index) => {
            html += `<div class="head" style="grid-row: ${y}; grid-column: ${x}"></div>`;
            if (index !== 0 && snakeX === x && snakeY === y) {
                gameOver = true;
            }
        });

        playBoard.innerHTML = html;
    };

    updateFoodPosition();
    setIntervalId = setInterval(initGame, 150);
    document.addEventListener("keydown", changeDirection);
});
