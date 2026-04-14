// ========================
// Bilder
// ========================

const backgroundImg = new Image();
backgroundImg.src = "assets/images/Farm.jpg";

const chickenLeftImg = new Image();
chickenLeftImg.src = "assets/images/Chicken/moorhuhn-links.png";

const chickenRightImg = new Image();
chickenRightImg.src = "assets/images/Chicken/moorhuhn-rechts.png";

const crosshairImg = new Image();
crosshairImg.src = "assets/images/crosshair0.png";

// ========================
// Sachen vom HTML
// ========================

const gameOverScreen = document.getElementById("gameOverScreen");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");

const finalScore = document.getElementById("finalScore");

let timeLeft = 30; // Sekunden
let gameRunning = true;

// ========================
// canvas / Volle Seitenbreite
// ========================
let chickenSize = 40; // Chicken relative Größe

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.addEventListener("mousemove", function (event) {
  const rect = canvas.getBoundingClientRect();

  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Skalierung abhängig von Bildschirmbreite
  chickenSize = Math.min(canvas.width, canvas.height) * 0.08; // 8% der Bildschirmbreite

  chickens.forEach(chicken => {
    chicken.x = Math.max(0, Math.min(chicken.x, canvas.width - chickenSize));
    chicken.y = Math.random() * (canvas.height - chickenSize);
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
      ctx.drawImage(chickenRightImg, this.x, this.y, chickenSize, chickenSize);
    } else {
      ctx.drawImage(chickenLeftImg, this.x, this.y, chickenSize, chickenSize);
    }   
  }
}  

// ========================
// gameLoop
// ========================
const chickens = [new Chicken(), new Chicken()];
let score = 0;
let animationId;

let mouseX = 0;
let mouseY = 0;

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
// Runde Canvas Boxen bauen
function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.fill();
}

// Zeit formatieren
function formatTime(seconds) {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

  // Hintergrundbox
  ctx.fillStyle = "black";
  drawRoundedRect(canvas.width - 145, 7, 140, 40, 20);  //150=canvas.width, 10=position von oben, 140=Breite, 40=Höhe, 20=Rundung
  drawRoundedRect(160, 7, 140, 40, 20);

  // Text
  ctx.font = "24px 'Press Start 2P'";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;

  // Score links
  ctx.textAlign = "left";
  ctx.strokeText("Score: " + score, 20, 40);
  ctx.fillText("Score: " + score, 20, 40);

  // Zeit rechts
  ctx.textAlign = "right";
  ctx.strokeText("Time: " + formatTime(timeLeft), canvas.width - 20, 40);
  ctx.fillText("Time: " + formatTime(timeLeft), canvas.width - 20, 40);

  ctx.drawImage(crosshairImg, mouseX - 20, mouseY - 20, 40, 40);

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
      mausX < chicken.x + chickenSize &&
      mausY > chicken.y &&
      mausY < chicken.y + chickenSize
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

  // Score einsetzen
  finalScore.textContent = "Score: " + score;

  // Overlay anzeigen
  gameOverScreen.style.display = "flex";

  console.log("Game Over! Score:", score);
}

// ========================
// Restart Button
// ========================
restartBtn.addEventListener("click", () => {
  location.reload();
});

// ========================
// Menü Button
// ========================
menuBtn.addEventListener("click", () => {
  window.location.href = "";  // play_a_Game-Seite
});