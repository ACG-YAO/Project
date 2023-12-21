import { Game } from './game.js';

let game = new Game();
window.addEventListener("load", function() {
    document.getElementById("loadingScreen").style.display = 'none';
    document.getElementById("startScreen").style.display = 'none';
    document.getElementById("ruleScreen").style.display = 'none';
    document.getElementById("settingScreen").style.display = 'none';
    document.getElementById("menuScreen").style.display = 'none';
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
    document.getElementById('restartButton1').addEventListener('click', () => {
        document.getElementById('settingScreen').style.display = 'none';
        document.getElementById("startScreen").style.display = 'flex';
    });
    document.getElementById('restartButton2').addEventListener('click', () => {
        document.getElementById('lose-indicator').style.display = 'none';
        document.getElementById("startScreen").style.display = 'flex';
    });
    document.getElementById('restartButton3').addEventListener('click', () => {
        document.getElementById('win-indicator').style.display = 'none';
        document.getElementById("startScreen").style.display = 'flex';
    });
    let enter_setting = 0;
    document.getElementById('settingButton1').addEventListener('click', () => {
        document.getElementById('settingScreen').style.display = 'none';
        document.getElementById("invaliderror").style.display = 'none';
        document.getElementById("repeaterror").style.display = 'none';
        enter_setting = 1;
        document.getElementById('menuScreen').style.display = 'flex';
    });
    document.getElementById('settingButton2').addEventListener('click', () => {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById("invaliderror").style.display = 'none';
        document.getElementById("repeaterror").style.display = 'none';
        enter_setting = 2;
        document.getElementById('menuScreen').style.display = 'flex';
    });

   // JavaScript
    let activeButton = null;
    // Create a dictionary to hold the button ID and its assigned key
    let buttonKeyMapping = {
        'forward': 'KeyW',
        'backward': 'KeyS',
        'left': 'KeyA',
        'right': 'KeyD',
        'map': 'KeyM',
        'pause': 'KeyL',
        'changeview': 'KeyR'
    };
    let audio_control = 'on';
    let audioButtonInner = document.querySelector('#audio .inner');
    audioButtonInner.textContent = 'On'; // Initialize as 'Off'
    audioButtonInner.classList.add('on'); // Add the 'off' class for styling
    function toggleActiveState(clickedButton) {
        // Special case for the 'audio' button
        if (clickedButton.id === 'audio') {
            // Toggle between 'on' and 'off'
            let innerDiv = clickedButton.querySelector('.inner');
            if (audio_control === 'off') {
                innerDiv.textContent = 'On';
                audio_control = 'on';
                innerDiv.classList.replace('off', 'on');
                game.toggleSounds();
                game.loseIndicator.audio = 'on';
            } else {
                innerDiv.textContent = 'Off';
                audio_control = 'off';
                innerDiv.classList.replace('on', 'off');
                game.pauseAllMedia();
                game.loseIndicator.audio = 'off';
            }
            return; // Return early so no other logic is applied to the 'audio' button
        }

        // If the clicked button is already active, deactivate it and remove the key listener
        if (activeButton === clickedButton) {
            clickedButton.classList.remove('active');
            document.removeEventListener('keydown', changeButtonText);
            activeButton = null;
        } else {
            // If there is a different active button, remove the active class from it
            // and remove the key listener from the old active button
            if (activeButton) {
                activeButton.classList.remove('active');
                document.removeEventListener('keydown', changeButtonText);
            }
            // Add the active class to the clicked button and set it as the new activeButton
            clickedButton.classList.add('active');
            activeButton = clickedButton;
            document.addEventListener('keydown', changeButtonText);
        }
    }

    function changeButtonText(event) {
        if (!activeButton) return;  

        var keyName = event.key;
        var innerDiv = activeButton.querySelector('.inner');
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
            event.preventDefault();
        }
        if (keyName === 'ArrowUp') {
            innerDiv.textContent = '↑';
            buttonKeyMapping[activeButton.id] = 'ArrowUp';
        } else if (keyName === 'ArrowDown') {
            innerDiv.textContent = '↓';
            buttonKeyMapping[activeButton.id] = 'ArrowDown';
        } else if (keyName === 'ArrowLeft') {
            innerDiv.textContent = '←';
            buttonKeyMapping[activeButton.id] = 'ArrowLeft';
        } else if (keyName === 'ArrowRight') {
            innerDiv.textContent = '→';
            buttonKeyMapping[activeButton.id] = 'ArrowRight';
        } else if (keyName === ' ') {
            innerDiv.textContent = '[space]';
            buttonKeyMapping[activeButton.id] = event.code;
        } else if (keyName.length === 1) {
            innerDiv.textContent = keyName.toUpperCase();
            buttonKeyMapping[activeButton.id] = event.code;
        } else {
            document.getElementById("invaliderror").style.display = 'flex';
            setTimeout(function() {
                document.getElementById("invaliderror").style.display = 'none';
            }, 2000); // Time in milliseconds
        }
    }

    function deactivateAllButtons() {
        if (activeButton) {
            activeButton.classList.remove('active');
            document.removeEventListener('keydown', changeButtonText);
            activeButton = null;
        }
    }
    
    function isClickInsideElement(event, className) {
        let target = event.target;
        while (target != null) {
            if (target.classList.contains(className)) {
                return true;
            }
            target = target.parentElement;
        }
        return false;
    }
    
    function deactivateAllButtons() {
        document.querySelectorAll('.customCheckBox').forEach(button => {
            button.classList.remove('active');
        });
        // Assuming activeButton is a global or accessible variable
        activeButton = null;
    }
    
    document.addEventListener('click', function(event) {
        console.log(isClickInsideElement(event, 'customCheckBox'));
        if (!isClickInsideElement(event, 'customCheckBox')) {
            //deactivateAllButtons();
        }
    });
    
    // Assuming toggleActiveState is already defined and works as expected
    document.querySelectorAll('.customCheckBox').forEach(button => {
        button.addEventListener('click', function() {
            toggleActiveState(this);
        });
    });

    function checkForDuplicateValues(mapping) {
        let valueCounts = {};
        let duplicates = [];
        for (let key in mapping) {
            if (mapping.hasOwnProperty(key)) {
                let value = mapping[key];
                valueCounts[value] = (valueCounts[value] || 0) + 1;
            }
        }
        for (let value in valueCounts) {
            if (valueCounts.hasOwnProperty(value) && valueCounts[value] > 1) {
                duplicates.push(value);
            }
        }
        return duplicates.length > 0 ? duplicates : true;
    }

    document.getElementById("backButton3").addEventListener("click", function() {
        let check = checkForDuplicateValues(buttonKeyMapping);
        deactivateAllButtons();
        if (check === true) {
            game.control = buttonKeyMapping;
            game.audio = audio_control;
            game.resetController();
            if (enter_setting === 1) {
                document.getElementById("menuScreen").style.display = 'none';
                document.getElementById("settingScreen").style.display = 'flex';
                enter_setting = 0;
            } else if (enter_setting === 2) {
                document.getElementById("menuScreen").style.display = 'none';
                document.getElementById("startScreen").style.display = 'flex';
                enter_setting = 0;
            }

        } else {
            document.getElementById("repeaterror").style.display = 'flex';
            setTimeout(function() {
                document.getElementById("repeaterror").style.display = 'none';
            }, 2000); // Time in milliseconds
        }

    });
});
window.addEventListener('resize', function() {
    game.WindowResizeHandler();
});
document.addEventListener('click', function () {
    game.MouseClickHandler();
}, false);
document.addEventListener('keydown', (event) => {
    if (event.code === game.control['pause'] && game.locked == false) {
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