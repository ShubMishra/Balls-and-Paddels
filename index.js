const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const canvasH = canvas.height;
const canvasW = canvas.width;
let bricks = [];
let brickW = 40;
let bricOffset = 8;
let brickH = 10;

let leftPressed = false;
let rightPressed = false;

let interval, x, y, dx, dy;
let paddleW = 50;
let paddleX = canvasW / 2 - paddleW / 2;
let paddleY = canvasH - 10;
let radius = 10;
let score = 0;
let brickCount = 6;
let brickRows = 3;

setVariables();
drawBall();
drawPaddle();
createBricks();
drawBricks();
drawScore();
paddleNavigation();

// startGame();

function drawScore() {
  ctx.beginPath();

  ctx.fillStyle = "#1A4D2E";
  ctx.fill();
  ctx.fillText("Score: " + score, 9, 10);
  ctx.closePath();
}

function createBricks() {
  for (let j = 0; j < brickRows; j++) {
    bricks[j] = [];

    for (let i = 0; i < brickCount; i++) {
      bricks[j][i] = { x: 0, y: 0, isVisible: true };
    }
  }
}

function drawBricks() {
  for (let j = 0; j < brickRows; j++) {
    for (let i = 0; i < brickCount; i++) {
      if (bricks[j][i].isVisible) {
        let bricX = 10 + i * (brickW + bricOffset);
        let bricY = (j + 1) * (bricOffset + 10);
        bricks[j][i].x = bricX;
        bricks[j][i].y = bricY;

        ctx.beginPath();
        ctx.rect(bricX, bricY, brickW, brickH);
        ctx.fillStyle = "#18978F";
        ctx.fill();

        ctx.closePath();
      }
    }
  }
}

function paddleNavigation() {
  document.addEventListener("keydown", handelKeyDown);
  document.addEventListener("keyup", handelKeyUp);

  function handelKeyDown(e) {
    if (e.key === "ArrowRight") {
      rightPressed = true;
    }
    if (e.key === "ArrowLeft") {
      leftPressed = true;
    }
  }
  function handelKeyUp(e) {
    if (e.key === "ArrowRight") {
      rightPressed = false;
    }
    if (e.key === "ArrowLeft") {
      leftPressed = false;
    }
   
  }
}

function detectCollision() {
  if (x + dx >= canvasW || x + dx <= 0) {
    dx = -dx;
  }
  if (y + dy > canvasH - radius) {
    if (x + dx > paddleX && x + dx < paddleX + paddleW) {
      dy = -dy;
      dx=dx+(x+dx-paddleX)/100;
    }
  }

  if (y + dy < 0) {
    dy = -dy;
  }

  for (let b = 0; b < bricks.length; b++) {
    for (let i = 0; i < bricks[b].length; i++) {
      let brick = bricks[b][i];
      if (brick.isVisible) {
        if (
          x > brick.x &&
          x < brick.x + brickW &&
          y > brick.y &&
          y < brick.y + brickH
        ) {
          brick.isVisible = false;
          score += 1;
          dy = -dy;
          checkYouWon();
        }
      }
    }
  }
}

function startGame() {
  if (!interval) {
    interval = setInterval(() => {
      if (rightPressed) {
        paddleX = paddleX + 5;
      }
      if (leftPressed) {
        paddleX = paddleX - 5;
      }
      detectCollision();
      x = x + dx;
      y = y + dy;
      checkGameOver();

      ctx.clearRect(0, 0, canvasW, canvasH);
      drawPaddle();
      drawBall();
      drawBricks();
      drawScore();
    }, 30);
  }
}

function checkGameOver() {
  if (y === canvasH) {
    alert("GameOVER!!!");
    clearInterval(interval);
    interval = null;
   
    setVariables();
  }
}

function checkYouWon() {
  if (score === 18) {
    alert("You Won!!!");
    clearInterval(interval);
    interval = null;

    setVariables();
  }
}

function setVariables() {
  x = canvasW / 2;
  y = canvasH - 20;
  dx = 5;
  dy = -5;
  radius = 10;
  paddleW = 50;
  paddleX = canvasW / 2 - paddleW / 2;
  paddleY = canvasH - 10;
  
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

  ctx.fillStyle = "#18978F";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleW, 10);

  ctx.fillStyle = "#18978F";
  ctx.fill();

  ctx.closePath();
}
