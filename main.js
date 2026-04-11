// ========================
// Bilder
// ========================

const backgroundImg = new Image();
backgroundImg.src = "images/origbig.png";

const chickenLeftImg = new Image();
chickenLeftImg.src = "images/moorhuhn-links.png";

const chickenRightImg = new Image();
chickenRightImg.src = "images/moorhuhn-rechts.png";

// ========================
// Sachen vom HTML
// ========================

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
  canvas.height = window.innerHeight;

  // Hühner richtig nach resize ins Bild setzen
  chickens.forEach(chicken => {
    chicken.x = Math.max(0, Math.min(chicken.x, canvas.width - 50));
    chicken.y = Math.random() * (canvas.height - 50);
  });
}

window.addEventListener("resize", resizeCanvas);

// ========================
// Hühner
// ========================
class Chicken {
  constructor() {
    this.direction = Math.random() < 0.5 ? "right" : "left";

    if (this.direction === "right") {
      this.x = -50;
      this.speed = 1 + Math.random() * 1.5;
    } else {
      this.x = canvas.width + 50;
      this.speed = -(1 + Math.random() * 1.5);
    }

    this.y = Math.random() * (canvas.height - 50);
    this.alive = true;
  }

  move() {
    if (!gameRunning) return;
    this.x += this.speed;

    if (this.x > canvas.width + 50 || this.x < -50) {
      this.respawn();
    }
  }

  respawn() {
    this.direction = Math.random() < 0.5 ? "right" : "left";

    if (this.direction === "right") {
      this.x = -50;
      this.speed = 1 + Math.random() * 1.5;
    } else {
      this.x = canvas.width + 50;
      this.speed = -(1 + Math.random() * 1.5);
    }

    this.y = Math.random() * (canvas.height - 50);
    this.alive = true;
  }

  draw() {
    if (this.direction === "right") {
      ctx.drawImage(chickenRightImg, this.x, this.y, 40, 40);
    } else {
      ctx.drawImage(chickenLeftImg, this.x, this.y, 40, 40);
    }
  }
}

// ========================
// gameLoop
// ========================
const chickens = [new Chicken(), new Chicken()];
let score = 0;
let animationId;

function gameLoop() {
//  if (!gameRunning) return;  // läuft immer weiter!, stoppt nur die Bewegungen

  // Hintergrund zuerst zeichnen
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  chickens.forEach(chicken => {
    if (chicken.alive) {
      chicken.move();
      chicken.draw();
    }
  });

  // ========================
  // HUD IMMER ZULETZT (damit es oben liegt)
  // ========================
  // Hintergrundbox
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(10, 10, 180, 50);
  ctx.fillRect(canvas.width - 180, 10, 170, 50);

  // Text
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";

  // Score links
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 20, 40);

  // Zeit rechts
  ctx.textAlign = "right";
  ctx.fillText("Time: " + timeLeft, canvas.width - 20, 40);

  animationId = requestAnimationFrame(gameLoop);
}

resizeCanvas();

// Bilder zuerst laden
let assetsLoaded = 0;
const totalAssets = 3;

function checkStart() {
  assetsLoaded++;
  if (assetsLoaded >= totalAssets) {
    resizeCanvas();
    gameLoop();
  }
}

backgroundImg.onload = checkStart;
chickenLeftImg.onload = checkStart;
chickenRightImg.onload = checkStart;

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

      setTimeout(() => {
        chicken.respawn();
        chicken.alive = true;
      }, 200);

      console.log("Treffer! Score:", score);
    }
  });
}

// ========================
// Für Mobile Touch statt Klick
// ========================
canvas.addEventListener("touchstart", function(event) {
  event.preventDefault();

  const rect = canvas.getBoundingClientRect();
  const touch = event.changedTouches[0];

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const mouseX = (touch.clientX - rect.left) * scaleX;
  const mouseY = (touch.clientY - rect.top) * scaleY;

  trefferErkennung(mouseX, mouseY);
}, { passive: false });

// ========================
// Timer
// ========================
const timer = setInterval(() => {
  if (!gameRunning) return;

  if (timeLeft <= 0) {
    endGame();
    return;
  }

  timeLeft--;
}, 1000);

// ========================
// Game Over
// ========================
function endGame() {
  gameRunning = false;

  clearInterval(timer);
  cancelAnimationFrame(animationId);

  console.log("Game Over! Score:", score);
}


