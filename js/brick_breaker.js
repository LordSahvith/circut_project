var canvas, canvasContext;

var ballX      = 150;
var ballY      = 270;
var ballSpeedX = 5;
var ballSpeedY = 7;

var paddleX                 = 400;
const PADDLE_WIDTH          = 75;
const PADDLE_THICKNESS      = 10;
const PADDLE_DIST_FROM_EDGE = 20;

var mouseX, mouseY;

const BRICK_GAP = 2;
const BRICK_W = 50;
const BRICK_H = 25; // temp double
const BRICK_COLS = 5;
const BRICK_ROWS = 7; // temp halved
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    paddleX = mouseX - (PADDLE_WIDTH / 2);
}

function brickReset() {
    for(var i = 0; i < BRICK_COLS * BRICK_ROWS; i++) 
    {
        brickGrid[i] = true;
    }
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(updateAll, 1000 / framesPerSecond);

    canvas.addEventListener('mousemove', updateMousePos);

    brickReset();
}

function updateAll() {
    moveAll();
    drawAll();
}

function ballReset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // ball horizontal travel
    if(ballX < 0) { // left side
        ballSpeedX *= -1;
    }
    if(ballX > canvas.width) { // right side
        ballSpeedX *= -1;
    }            

    // ball vertical travel            
    if(ballY < 0) { // top
        ballSpeedY *= -1;
    }
    if(ballY > canvas.height) { // bottom
        ballReset();
    } 
}

function ballPaddleHandling() {
    var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleTopEdgeY + PADDLE_THICKNESS;

    if(ballY > paddleTopEdgeY && // below the top of paddle 
       ballY < paddleBottomEdgeY && // above bottom of paddle
       ballX > paddleLeftEdgeX && // right of the left side of paddle
       ballX < paddleRightEdgeX) {// left of the right side of paddle
            ballSpeedY *= -1;

            var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
            var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
            ballSpeedX = ballDistFromPaddleCenterX * 0.35;
    }
}

function ballBrickHandling() {
    var ballBrickCol = Math.floor(ballX / BRICK_W);
    var ballBrickRow = Math.floor(ballY / BRICK_H);
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

    if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&
       ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
        if(brickGrid[brickIndexUnderBall]) {
            brickGrid[brickIndexUnderBall] = false;

            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevBrickCol = Math.floor(prevBallX / BRICK_W);
            var prevBrickRow = Math.floor(prevBallY / BRICK_H);

            var bothTestsFailed = true;

            if(prevBrickCol != ballBrickCol) {
                var adjBrickSide = rowColToArrayIndex(prevBrickCol, ballBrickRow);

                if(brickGrid[adjBrickSide] == false) {
                    ballSpeedX *= -1;
                    bothTestsFailed = false;
                }
            }

            if(prevBrickRow != ballBrickRow) {
                var adjBrickTopBot = rowColToArrayIndex(ballBrickCol, prevBrickRow);

                if(brickGrid[adjBrickTopBot] == false) {
                    ballSpeedY *= -1; 
                    bothTestsFailed = false;
                }
            }

            if(bothTestsFailed) {
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }                    
        } // end brick found
    } // end of col and row
}

function moveAll() { 
    ballMove();

    ballBrickHandling();

    ballPaddleHandling();
}

function rowColToArrayIndex(col, row) {
    return col + BRICK_COLS * row;
}

function drawBricks() {            
    for(var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
        for(var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if(brickGrid[arrayIndex]) {
                colorRect(BRICK_W * eachCol, BRICK_H * eachRow, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'red');
            }
        }
    } // for loop row
}

function drawAll() {   
    // draw/clear screen
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    // draw ball
    colorCircle(ballX, ballY, 10, 'white');

    // draw paddle
    colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');

    drawBricks();
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}