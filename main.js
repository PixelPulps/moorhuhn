/* TODO:
* - [x] Timer + gameover seite 
* - [ ] mehrere Hühner
* - [ ]  
* - [ ] 
*/

const scoreElement = document.getElementById("score");

const timeElement = document.getElementById("time");
const gameOverElement = document.getElementById("gameOver");

let timeLeft = 30; // Sekunden
let gameRunning = true;

// ========================
// canvas / Volle Seitenbreite
// ========================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.5;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ========================
// Huhn
// ========================
class Chicken {
  constructor() {
  this.x = Math.random() * (canvas.width - 50);  // muss dynamisch sein, keine fixe breite, this.x = Math.random() * 700;
  this.y = Math.random() * (canvas.height - 50);  // muss dynamisch sein, keine fixe breite, this.y = Math.random() * 300;
  this.speed = 1 + Math.random() * 1.5; // speed = BASIS + Zufall * SPANNE // war auf 2 + Math.random() * 3
  this.alive = true;
  }
  move() {
    this.x += this.speed;
    if (this.x > canvas.width) this.x = -50;  // muss dynamisch sein, keine fixe breite, if (this.x > 800) this.x = -50;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, 40, 40); 
  }
}

// ========================
// gameLoop
// ========================
const chickens = [new Chicken(), new Chicken()];
let score = 0;

function gameLoop () {
  if (!gameRunning) return;  // Für Game Over

  ctx.clearRect (0, 0, canvas.width, canvas.height);
  
  chickens.forEach(chicken => {
    if (chicken.alive) {
      chicken.move ();
      chicken.draw ();
    } 
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();

// ========================
// schießen
// ========================
canvas.addEventListener("click", function(event) {
  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  trefferErkennung(mouseX, mouseY);
});

// ========================
// Treffererkennung
// ========================
function trefferErkennung(mausX, mausY) {
  chickens.forEach(chicken => {
    if (
      chicken.alive &&
      mausX > chicken.x &&
      mausX < chicken.x + 40 &&
      mausY > chicken.y &&
      mausY < chicken.y + 40
    ) {
      chicken.alive = false;
      score++;
      scoreElement.textContent = score;

      console.log("Treffer! Score:", score);
    }
  });
}

// ========================
// Für Mobile Touch statt Klick
// ========================
canvas.addEventListener("touchstart", function(event) {
  const rect = canvas.getBoundingClientRect();

  const touch = event.touches[0];
  const mouseX = touch.clientX - rect.left;
  const mouseY = touch.clientY - rect.top;

  trefferErkennung(mouseX, mouseY);
});

// ========================
// Timer
// ========================
const timer = setInterval(() => {
  if (!gameRunning) return;

  timeLeft--;
  timeElement.textContent = "Time: " + timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}, 1000);

// ========================
// Game Over
// ========================
function endGame() {
  gameRunning = false;

  if (score < 5) {
    gameOverElement.style.display = "block";
  }

  console.log("Game Over! Score:", score);
}


