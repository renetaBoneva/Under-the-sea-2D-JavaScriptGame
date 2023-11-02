// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
let gameSpeed = 1;

// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    X: canvas.width / 2,
    Y: canvas.height / 2,
    click: false
}

canvas.addEventListener('mousedown', function (event) {
    mouse.click = true;
    mouse.X = event.x - canvasPosition.left;
    mouse.Y = event.y - canvasPosition.top;
})
canvas.addEventListener('mouseup', function (event) {
    mouse.click = false;
})

// Player
const playerRight = new Image();
playerRight.src = 'images/fish_swim_right.png';
const playerLeft = new Image();
playerLeft.src = 'images/fish_swim_left.png';

class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }

    update() {
        const dx = this.x - mouse.X;
        const dy = this.y - mouse.Y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        if (mouse.X != this.x) {
            this.x -= dx / 30;
        }

        if (mouse.Y != this.y) {
            this.y -= dy / 30;
        }
    }
    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.X, mouse.Y);
            ctx.stroke();
        }
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (this.x >= mouse.X) {
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 4, this.spriteHeight / 4);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 4, this.spriteHeight / 4);
        }
        ctx.restore();
    }
}
const player1 = new Player();

// Bubbles
let bubbleArray = [];
const bubbleImage = new Image();
bubbleImage.src = 'images/whole_bubble.png'

class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = 100 + canvas.height;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player1.x;
        const dy = this.y - player1.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }

    draw() {
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(bubbleImage, this.x - 55, this.y - 55, this.radius * 2.2, this.radius * 2.2);
    }
}
const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'audio/Plop.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'audio/pop-up.mp3';

function handleBubbles() {
    if (gameFrame % 50 == 0) {
        bubbleArray.push(new Bubble());
    }

    for (let i = 0; i < bubbleArray.length; i++) {
        bubbleArray[i].update();
        bubbleArray[i].draw()
        if (bubbleArray[i].y < 0 - this.radius * 2) {
            bubbleArray.splice(i, 1);
            i--;
        } else if (bubbleArray[i].distance < bubbleArray[i].radius + player1.radius) {
            if (!bubbleArray[i].counted) {
                if (bubbleArray[i].sound == "sound1") {
                    bubblePop1.play();
                } else {
                    bubblePop2.play();
                }

                score++;
                bubbleArray[i].counted = true;
                bubbleArray.splice(i, 1);
                i--;
            }
        }
    }
}

//Repeating background
const background = new Image();
background.src = 'images/background1.png';

const bgr = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height
}

function handleBackground() {
    bgr.x1 -= gameSpeed;
    if (bgr.x1 < -bgr.width) { bgr.x1 = bgr.width }
    ctx.drawImage(background, bgr.x1, bgr.y, bgr.width, bgr.height);

    bgr.x2 -= gameSpeed;
    if (bgr.x2 < -bgr.width) { bgr.x2 = bgr.width }
    ctx.drawImage(background, bgr.x2, bgr.y, bgr.width, bgr.height);
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleBubbles();
    player1.update();
    player1.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 50);
    gameFrame++;
    requestAnimationFrame(animate);
}
animate()

window.addEventListener("resize", () => {
    canvasPosition = canvas.getBoundingClientRect();
})