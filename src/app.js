import { Game } from './game.js';

let game = new Game();
window.addEventListener("load", function() {
    document.getElementById("loadingScreen").style.display = 'none';
    document.getElementById("startScreen").style.display = 'none';
    document.getElementById("ruleScreen").style.display = 'none';
    document.getElementById("settingScreen").style.display = 'none';
    document.getElementById("enterButton").addEventListener("click", function() {
        document.getElementById("titleScreen").style.display = 'none';
        document.getElementById("startScreen").style.display = 'flex';
    });
    document.getElementById("startButton").addEventListener("click", function() {
        document.getElementById("startScreen").style.display = 'none';
        document.getElementById("loadingScreen").style.display = 'flex';
        game.initialize();
        setTimeout(function() {
            document.getElementById("loadingScreen").style.display = 'none';
            game.start();
        }, 2000); 
    });
    document.getElementById("ruleButton").addEventListener("click", function() {
        document.getElementById("startScreen").style.display = 'none';
        document.getElementById("ruleScreen").style.display = 'flex';
    });
    document.getElementById("backButton1").addEventListener("click", function() {
        document.getElementById("ruleScreen").style.display = 'none';
        document.getElementById("startScreen").style.display = 'flex';
    });
    document.getElementById('resumeButton').addEventListener('click', () => {
        document.getElementById('settingScreen').style.display = 'none';
        game.resume();
    });
    document.getElementById('restartButton').addEventListener('click', () => {
        document.getElementById('settingScreen').style.display = 'none';
        document.getElementById("loadingScreen").style.display = 'flex';
        game.initialize();
        setTimeout(function () {
            document.getElementById("loadingScreen").style.display = 'none';
            game.start();
        }, 2000);
    });
    document.getElementById('settingButton').addEventListener('click', () => {
        // Implement additional settings logic
    });
});
window.addEventListener('resize', function() {
    game.WindowResizeHandler();
});
document.addEventListener('click', function () {
    game.MouseClickHandler();
}, false);
document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyL' && game.locked == false) {
        document.getElementById('settingScreen').style.display = 'flex';
        game.pause();
    }
    game.KeyDownHandler(event);
});
document.addEventListener('keyup', (event) => {
    game.KeyUpHandler(event);
});
document.addEventListener('mousedown', function (event) {
    game.MouseDownHandler(event);
});
document.addEventListener('mousemove', function (event) {
    game.MouseMoveHandler(event);
});
document.addEventListener('mouseup', function (event) {
    game.MouseUpHandler(event);
});
