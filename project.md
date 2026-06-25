## Goal

Build a small Flappy Bird-style game that runs locally in the browser.

The player controls a bird, avoids pipes, earns points by passing gaps, and can restart after game over.

Focus on the following:

- Loading all necessary files first (html, css, javascript)
- Using a canvas to draw the game
- Game mechanics:
  - Gravity
  - Jumping
  - Pipes
  - Collision detection
  - Scoring
- Visuals:
  - Sprites for the bird and pipes
  - Background and ground images

---

# Project structure

```txt
flappy-clone/
├─ index.html
├─ style.css
├─ main.js
└─ assets/
   ├─ bird.png
   ├─ pipe.png
   ├─ background.png
   └─ ground.png
```

He can adjust the asset names depending on the sprites he already has.

---

# Phase 1: Basic setup

## Task

Create a page with a canvas.

### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flappy Bird Clone</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <main class="game-shell">
      <canvas id="game" width="864" height="512"></canvas>
    </main>

    <script src="main.js"></script>
  </body>
</html>
```

### `style.css`

```css
body {
  margin: 0;
  height: 100vh;
  display: grid;
  place-items: center;
  background: #ccc;
}

canvas {
  border: 2px solid white;
  background: skyblue;
}
```

### Goal for this phase

When opening `index.html`, the canvas should appear centered in the browser.

---

# Phase 2: Game loop

## Task

Set up a loop that clears and redraws the canvas every frame.

```js
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function update() {
  // update game state
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "skyblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
```

### Goal for this phase

Understand that every game has:

```txt
input -> update -> draw -> repeat
```

---

# Phase 3: Add the bird

## Task

Create a bird object with position, size, velocity, and gravity.

```js
const bird = {
  x: 80,
  y: 250,
  width: 40,
  height: 30,
  velocityY: 0,
  gravity: 0.4,
  jumpStrength: -7,
};
```

Update the bird:

```js
function updateBird() {
  bird.velocityY += bird.gravity;
  bird.y += bird.velocityY;
}
```

Draw the bird:

```js
function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}
```

Add to the existing functions:

```js
function update() {
  updateBird();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "skyblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBird();
}
```

### Goal for this phase

The bird should fall down because of gravity.

---

# Phase 4: Add jumping

## Task

Make the bird jump when the player presses space, clicks, or taps.

```js
function jump() {
  bird.velocityY = bird.jumpStrength;
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    jump();
  }
});

canvas.addEventListener("click", jump);
```

### Goal for this phase

The bird should jump upward when pressing space or clicking.

---

# Phase 5: Add pipes

## Task

Create pipes that move from right to left.

```js
const pipes = [];

const pipeWidth = 70;
const pipeGap = 160;
let pipeTimer = 0;
```

Spawn a pipe pair:

```js
function spawnPipe() {
  const topPipeHeight = Math.random() * 250 + 50;

  pipes.push({
    x: canvas.width,
    topHeight: topPipeHeight,
    bottomY: topPipeHeight + pipeGap,
    width: pipeWidth,
    passed: false,
  });
}
```

Update pipes:

```js
function updatePipes() {
  pipeTimer++;

  if (pipeTimer > 100) {
    spawnPipe();
    pipeTimer = 0;
  }

  for (const pipe of pipes) {
    pipe.x -= 2;
  }

  // remove pipes that left the screen
  while (pipes.length > 0 && pipes[0].x + pipes[0].width < 0) {
    pipes.shift();
  }
}
```

Draw pipes:

```js
function drawPipes() {
  ctx.fillStyle = "green";

  for (const pipe of pipes) {
    // top pipe
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);

    // bottom pipe
    ctx.fillRect(
      pipe.x,
      pipe.bottomY,
      pipe.width,
      canvas.height - pipe.bottomY,
    );
  }
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

```

Add them:

```js
function update() {
  updateBird();
  updatePipes();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "skyblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawPipes();
  drawBird();
}
```

### Goal for this phase

Pipes should continuously appear and move left.

---

# Phase 6: Collision detection

## Task

Detect when the bird hits the ground, ceiling, or a pipe.

```js
let gameOver = false;
```

Rectangle collision helper:

```js
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
```

Check collisions:

```js
function checkCollisions() {
  if (bird.y < 0 || bird.y + bird.height > canvas.height) {
    gameOver = true;
  }

  for (const pipe of pipes) {
    const topPipe = {
      x: pipe.x,
      y: 0,
      width: pipe.width,
      height: pipe.topHeight,
    };

    const bottomPipe = {
      x: pipe.x,
      y: pipe.bottomY,
      width: pipe.width,
      height: canvas.height - pipe.bottomY,
    };

    if (isColliding(bird, topPipe) || isColliding(bird, bottomPipe)) {
      gameOver = true;
    }
  }
}
```

Update the game loop:

```js
function update() {
  if (gameOver) return;

  updateBird();
  updatePipes();
  checkCollisions();
}
```

### Goal for this phase

The game should stop when the bird crashes.

---

# Phase 7: Score

## Task

Add a score when the bird passes pipes.

```js
let score = 0;
```

```js
function updateScore() {
  for (const pipe of pipes) {
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      pipe.passed = true;
      score++;
    }
  }
}
```

Draw score:

```js
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText(score, 20, 40);
}
```

Add it:

```js
function update() {
  if (gameOver) return;

  updateBird();
  updatePipes();
  checkCollisions();
  updateScore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "skyblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawPipes();
  drawBird();
  drawScore();

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over", 140, 300);
    ctx.font = "20px Arial";
    ctx.fillText("Press Space to restart", 145, 340);
  }
}
```

### Goal for this phase

The score should increase when passing pipe gaps.

---

# Phase 8: Restart

## Task

Add a restart function.

```js
function resetGame() {
  bird.y = 250;
  bird.velocityY = 0;

  pipes.length = 0;
  pipeTimer = 0;
  score = 0;
  gameOver = false;
}
```

Update input:

```js
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (gameOver) {
      resetGame();
    } else {
      jump();
    }
  }
});
```

### Goal for this phase

After game over, pressing space restarts the game.

---

# Phase 9: Replace rectangles with sprites

Once the mechanics work, replace the colored rectangles with sprites.

```js
const birdImage = new Image();
birdImage.src = "assets/bird.png";

const pipeImage = new Image();
pipeImage.src = "assets/pipe.png";
```

Draw bird sprite:

```js
function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}
```

For pipes, he can first keep green rectangles. Then, as a second step, draw pipe sprites.

### Goal for this phase

## Gameplay first, then visuals.

# Phase 10: Polish tasks

Once the core game works, he can improve it step by step.

Good optional improvements:

1. Add background image.
2. Add ground sprite.
3. Animate the bird wings.
4. Rotate the bird slightly when falling.
5. Add sound effects.
6. Add a start screen.
7. Add a high score using `localStorage`.
8. Make the game speed increase over time.
9. Make it playable on mobile.
10. Add comments explaining every important function.

---

# Suggested learning order

```txt
1. Canvas setup
2. Game loop
3. Bird movement
4. Gravity
5. Jump input
6. Pipes
7. Collision detection
8. Score
9. Restart
10. Sprites and polish
```

---

# Definition of done

The project is done when:

```txt
- The game runs by opening index.html locally
- The bird falls because of gravity
- The player can jump with space/click
- Pipes move from right to left
- The player gets points by passing pipes
- The game ends on collision
- The player can restart
- Sprites are used instead of plain rectangles
```
