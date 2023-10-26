// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

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
    }
}
const player1 = new Player();
// Bubbles
// Animation Loop
function animate() {
    player1.update();
    player1.draw();
    requestAnimationFrame(animate);
}
animate()