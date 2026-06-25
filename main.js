const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const loader = document.getElementById("loader");
const gameWrapper = document.getElementById("game-wrapper");
const startScreen = document.getElementById("start-screen");

const backgroundImage = new Image();
backgroundImage.src = "Backgroundapmneu.png";
/*
backgroundImage.src = "background-mario.png";
*/

const birdImage = new Image();
birdImage.src = "pflegeheld_fliegt.png";
/*
birdImage.src = "Marioflappy.png";
*/

/*
  Pipe-Bilder mit drei Größenstufen.
*/

const scoreImage = new Image();
scoreImage.src = "pflegeheld_daumen-hoch.png";


const topPipeSmallImage = new Image();
topPipeSmallImage.src = "Papier(fallend).png";

/*topPipeSmallImage.src = "Röhre2.png";
topPipeSmallImage.src = "Akten-Asteroiden.png";*/

const topPipeMediumImage = new Image();
topPipeMediumImage.src = "Gehhilfe.png";

/*topPipeMediumImage.src = "Piranjapflanze2.png";
topPipeMediumImage.src = "Deadline-Blitze.png";*/

const topPipeBigImage = new Image();
topPipeBigImage.src = "Gehhilfe.png";

/*topPipeBigImage.src = "Röhre2.png";
topPipeBigImage.src = "Lade-Balken.png";*/

const bottomPipeSmallImage = new Image();
bottomPipeSmallImage.src = "Medikamente.png";

/*bottomPipeSmallImage.src = "Röhre.png";
bottomPipeSmallImage.src = "Passwort-Panik.png";*/

const bottomPipeMediumImage = new Image();
bottomPipeMediumImage.src = "Tisch.png";

/*bottomPipeMediumImage.src = "Piranjapflanze.png";
bottomPipeMediumImage.src = "Meeting-Mauer.png";*/

const bottomPipeBigImage = new Image();
bottomPipeBigImage.src = "Bett.png";

/*bottomPipeBigImage.src = "Röhre.png";
bottomPipeBigImage.src = "Ticket-Tornado.png";*/

let gameStarted = false;
let gameOver = false;
let score = 0;
let animationId = null;
let deathPipeName = "";

const bird = {
  x: 80,
  y: 250,
  width: 28 + 8,
  height: 32,
  /*
  w: 40; h: 30
  */
  velocityY: 0,
  gravity: 0.4,
  jumpStrength: -7,
};

const pipes = [];

const pipeWidth = 70;
const pipeGap = 160;
let pipeTimer = 0;

window.addEventListener("load", function () {
  setTimeout(function () {
    loader.style.display = "none";
    gameWrapper.style.display = "block";

    drawStartBackground();
  }, 600);
});

function canDrawImage(image) {
  return image.complete && image.naturalWidth > 0;
}

function drawBackground() {
  const imageWidth = canvas.width;
  /*
  / 3 = 3 mal bild hintereinander
  */
  const imageHeight = canvas.height;

  if (canDrawImage(backgroundImage)) {
    for (let i = 0; i < 3; i++) {
      ctx.drawImage(
        backgroundImage,
        i * imageWidth,
        0,
        imageWidth,
        imageHeight
      );
    }
  } else {
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawStartBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawBird();
  drawScore();
}

function startGame() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }

  gameStarted = true;
  gameOver = false;
  startScreen.style.display = "none";

  gameLoop();
}

function updateBird() {
  bird.velocityY += bird.gravity;
  bird.y += bird.velocityY;
}

function drawBird() {
  /*
    Die Hitbox bleibt 40 x 30 oder wieauchimmer oben eingestellt.
    Das Bild wird als 32 x 32 gezeichnet
    und um 1 Pixel nach rechts verschoben (x Achse).

    Dadurch kannst du Bild und Hitbox getrennt kontrollieren.
  */
  let angle;

  if (bird.velocityY < 0) {
    angle = -15;
  } else {
    angle = 30;
  }

  ctx.save();

  ctx.translate(
    bird.x + 20,
    bird.y + 15
  );

  ctx.rotate(angle * Math.PI / 180);

  ctx.drawImage(
    birdImage,
    -16,
    -16,
    42, /*32*/
    42  /*32*/
  );

  ctx.restore();

  console.log(bird.velocityY);
}

function jump() {
  bird.velocityY = bird.jumpStrength;
}

function spawnPipe() {
  const topPipeHeight = Math.random() * 250 + 50;

  let topPipeName;
  let bottomPipeName;

  if (topPipeHeight > 240) {
  topPipeName = "Gehhilfe";  /*topPipeName = "Lade-Balken";*/
} else if (topPipeHeight > 140) {
  topPipeName = "Gehhilfe";    /*topPipeName = "Deadline-Blitze";*/
} else {
  topPipeName = "Papier";    /*topPipeName = "Akten-Asteroiden";*/
}


const bottomPipeHeight =
  canvas.height - (topPipeHeight + pipeGap);

if (bottomPipeHeight > 240) {
  bottomPipeName = "Bett";   /*bottomPipeName = "Ticket-Tornado";*/
} else if (bottomPipeHeight > 140) {
  bottomPipeName = "Tisch";    /*bottomPipeName = "Meeting-Mauer";*/
} else {
  bottomPipeName = "Medikamenten";   /*bottomPipeName = "Passwort-Panik";*/
} 

  pipes.push({
  x: canvas.width,
  topHeight: topPipeHeight,
  bottomY: topPipeHeight + pipeGap,
  width: pipeWidth,
  passed: false,

  topPipeName: topPipeName,
  bottomPipeName: bottomPipeName
});
}

function updatePipes() {
  pipeTimer++;

  if (pipeTimer > 100) {
    spawnPipe();
    pipeTimer = 0;
  }

  for (const pipe of pipes) {
    pipe.x -= 2;
  }

  while (pipes.length > 0 && pipes[0].x + pipes[0].width < 0) {
    pipes.shift();
  }
}

function getTopPipeImage(topPipeHeight) {
  if (topPipeHeight > 240) {
    return topPipeBigImage;
  }

  if (topPipeHeight > 140) {
    return topPipeMediumImage;
  }

  return topPipeSmallImage;
}

function getBottomPipeImage(bottomPipeHeight) {
  if (bottomPipeHeight > 240) {
    return bottomPipeBigImage;
  }

  if (bottomPipeHeight > 140) {
    return bottomPipeMediumImage;
  }

  return bottomPipeSmallImage;
}

function drawPipes() {
  for (const pipe of pipes) {
    const topPipeHeight = pipe.topHeight;
    const bottomPipeHeight = canvas.height - pipe.bottomY;

    const topPipeImage = getTopPipeImage(topPipeHeight);
    const bottomPipeImage = getBottomPipeImage(bottomPipeHeight);

    if (canDrawImage(topPipeImage)) {
      ctx.drawImage(
        topPipeImage,
        pipe.x,
        0,
        pipe.width,
        topPipeHeight
      );
    } else {
      ctx.fillStyle = "green";
      ctx.fillRect(pipe.x, 0, pipe.width, topPipeHeight);
    }

    if (canDrawImage(bottomPipeImage)) {
      ctx.drawImage(
        bottomPipeImage,
        pipe.x,
        pipe.bottomY,
        pipe.width,
        bottomPipeHeight
      );
    } else {
      ctx.fillStyle = "green";
      ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, bottomPipeHeight);
    }
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

    if (isColliding(bird, topPipe)) {
    deathPipeName = pipe.topPipeName;
    gameOver = true;
    }

    if (isColliding(bird, bottomPipe)) {
    deathPipeName = pipe.bottomPipeName;
    gameOver = true;
    }
  }
}

function updateScore() {
  for (const pipe of pipes) {
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      pipe.passed = true;
      score++;
    }
  }
}

function drawScore() {
  if (canDrawImage(scoreImage)) {
    ctx.drawImage(scoreImage, 20, 15, 32, 32);
  }

  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText(score, 60, 40);
}

function drawDeathScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.font = "48px Arial";
  ctx.fillText("Nächstes Mal wirds besser", canvas.width / 2, 200);
  
  ctx.font = "30px Arial";
  ctx.fillText("Aufgehalten von: " + deathPipeName, canvas.width / 2, 250);
/*
  ctx.fillText("Mamamaia du hast Verloren", canvas.width / 2, 210);
*/

  if (canDrawImage(scoreImage)) {
    /*
    ctx.drawImage(scoreImage, canvas.width / 2 - 55, 236, 32, 32);
    */
  }
 if (scoreImage.complete && scoreImage.naturalWidth > 0) {
  ctx.drawImage(scoreImage, canvas.width / 2 - 110, 255, 64, 64);
}

ctx.font = "28px Arial";
ctx.fillText("         Heldenscore: " + score, canvas.width / 2 + 20, 300);

/*
ctx.fillText("Score: " + score, canvas.width / 2 + 20, 260);
*/

  ctx.font = "22px Arial";
  ctx.fillText("B für Neustart", canvas.width / 2, 340);
  ctx.fillText("oder ins Spielfeld klicken", canvas.width / 2, 370);

  ctx.textAlign = "left";
}

function update() {
  if (gameOver) return;

  updateBird();
  updatePipes();
  checkCollisions();
  updateScore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  drawPipes();
  drawBird();

  if (gameOver) {
    drawDeathScreen();
  } else {
    drawScore();
  }
}

function gameLoop() {
  if (!gameStarted) return;

  update();
  draw();

  animationId = requestAnimationFrame(gameLoop);
}

function resetGame() {
  bird.y = 250;
  bird.velocityY = 0;

  pipes.length = 0;
  pipeTimer = 0;
  score = 0;
  gameOver = false;
  deathPipeName = "";
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    if (!gameStarted) {
      startGame();
    } else if (!gameOver) {
      jump();
    }
  }

  if (event.code === "KeyB") {
    if (gameOver) {
      resetGame();
    }
  }
});

canvas.addEventListener("click", function () {
  if (!gameStarted) {
    startGame();
  } else if (gameOver) {
    resetGame();
  } else {
    jump();
  }
});