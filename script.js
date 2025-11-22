const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");
const dinosaurImg = createImg("Dinosaur.png");
const cactusImg = createImg("Cactus.png");
let gameStatus = false;
let gameStart = false;
let score = 0;
let timerScore, timerCactus, jumpUp, jumpDown, dinoTimeOut;
const rocks = [];

function createImg(location) {
    let img = new Image();
    img.src = location;
    return img;
}

const dinosaur = {
    x: 70,
    y: 190,
    vy: 30,
    width: 60,
    height: 75,
}

const cactus = {
    x: 900,
    y: 190,
    vx: 10,
    width: 60,
    height: 75,
}

class rock {
    x = 945;
    y = Math.random() * (275 - 260) + 260;
    vx = 50;
    width = 4;
    height = 2;
}

function drawImg(img, obj) {
    ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height);
}

function drawField() {
    ctx.fillRect(50, 250, 900, 2);
}

function clearDraw(obj) {
    ctx.clearRect(obj.x, obj.y, obj.width, obj.height);
}

function dinosaurUp() {
        jumpUp = setInterval(() => {
            if (dinosaur.y <= 190 - 75) {
                clearInterval(jumpUp);
            }
            clearDraw(dinosaur);
            dinosaur.y  -= dinosaur.vy;
            drawImg(dinosaurImg, dinosaur);
            drawField();
        }, 200)
    }
    
function dinosaurDown() {
        jumpDown = setInterval(() => {
        if (dinosaur.y >= 150) {
            clearInterval(jumpDown);
        }
        clearDraw(dinosaur);
        dinosaur.y  += dinosaur.vy;
        drawImg(dinosaurImg, dinosaur);
        drawField();
    }, 200);    
}

function collisionCheck(dino, obstacle) {
    if ((dino.x + dino.width >= obstacle.x) && 
        (obstacle.x + obstacle.width >= dino.x + dino.width) && 
        (dino.y + dino.height >= obstacle.y)) {
        return true;
    }
}

function gameScore() {
   timerScore = setInterval(() => {
        score += 100;
        ctx.font = "20px serif";
        ctx.clearRect(0, 0, 3000, 20);
        ctx.fillText("Score: " + score, canvas.width - 130, 20);
   }, 1000)
}

function createRocks() {
    for (let i = 0; i < 100; ++i) {
        rocks.push (new rock)
        if ((rocks[i].x - i * 10) < 50) {
            break;
        } else {
            ctx.fillRect(rocks[i].x - i * 10, rocks[i].y, rocks[i].width, rocks[i].height);
        }
    }
}

function moveCactus() {
    if (cactus.x < 50 + cactus.width / 2) {
        clearDraw(cactus);
        ctx.beginPath();
        cactus.x = 900;
        drawImg(cactusImg, cactus);
        drawField();
    }
    if (collisionCheck(dinosaur, cactus)) {
        stopGame();
        gameStatus = false;
    }
    clearDraw(cactus);
    ctx.beginPath();
    cactus.x -= cactus.vx;
    drawImg(cactusImg, cactus);
    drawField();
    createRocks();
}

function stopGame() {
    clearInterval(jumpUp);
    clearInterval(jumpDown);
    clearInterval(timerCactus);
    clearInterval(timerScore);
    clearInterval(dinoTimeOut);
    ctx.fillText("GAME OVER!", canvas.width / 2 - 50 , canvas.height / 2 - 50)
}
function gameLoad() {
    window.addEventListener("load", (e) => {
        drawImg(dinosaurImg, dinosaur);
        ctx.fillRect(50, 250, 100, 2);
    });
}

function startGame() {
    window.addEventListener("keydown", (e) => {
        if (e.code == "Space" && gameStart == false) {
            gameStart = true;
            gameStatus = true;
            gameScore();
            drawImg(dinosaurImg, dinosaur);
            drawImg(cactusImg, cactus);
            drawField();
            createRocks();
            timerCactus = setInterval(moveCactus, 50);
        }
    });
}

function dinoJump() {
    window.addEventListener("keydown", (e) => {
        if (e.code == "Space" && gameStatus == true) {
            dinosaurUp();
            dinoTimeOut = setTimeout(dinosaurDown, 1500);
        }
    });
}

gameLoad();
startGame();
dinoJump();