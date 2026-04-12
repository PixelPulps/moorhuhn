<canvas id="meinCanvas" width="400" height="300"></canvas>

```js
const canvas = document.getElementById("meinCanvas");
const ctx = canvas.getContext("2d");

// Rechteck
ctx.fillStyle = "green";
ctx.fillRect(20, 20, 100, 60);

// Kreis
ctx.beginPath();
ctx.arc(200, 100, 40, 0, Math.PI * 2);
ctx.fillStyle = "orange";
ctx.fill();

// Linie
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(400, 300);
ctx.stroke();
```