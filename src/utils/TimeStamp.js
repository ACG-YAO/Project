export class TimeStamp {
    constructor(totaltime, Indicator, lock) {
        this.end = false;
        this.paused = false;
        this.lock = lock;
        this.Indicator = Indicator;
        this.totaltime = totaltime;
        this.startTime = 0;
        this.currentTime = 0;
        this.pauseTime = 0;
        this.timer = null;
        this.updateDisplay();
    }

    start() {
        if (!this.paused) {
            this.startTime = Date.now();
        } else {
            this.startTime = Date.now() - this.pauseTime;
            this.paused = false;
        }
        this.end = false;
        this.timer = setInterval(() => {
            this.currentTime = Date.now() - this.startTime;
            this.updateDisplay();

            if (this.currentTime >= this.totaltime && !this.end) {
                this.stop();
                this.end = true;
                this.lock();
                this.Indicator.display();
            }
        }, 1000);
    }

    pause() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            this.pauseTime = this.currentTime; 
            this.paused = true;
        }
    }

    reset() {
        this.stop(); 
        this.currentTime = 0; 
        this.pauseTime = 0; 
        this.updateDisplay();
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
        this.paused = false;
        this.pauseTime = 0;
    }

    getCurrentTime() {
        return this.currentTime;
    }

    updateDisplay() {
        const timeElement = document.getElementById('game-time');
        const timeContainer = document.getElementById('time');
        const seconds = Math.floor((this.totaltime - this.currentTime) / 1000);

        if (timeElement) {
            timeElement.textContent = seconds >= 0 ? seconds : 0;
            
            if (seconds <= 10 && seconds >= 0) { 
                timeContainer.classList.add('blink');
                timeContainer.style.color = 'red';
            } else {
                timeContainer.classList.remove('blink');
                timeContainer.style.color = 'white'; 
            }
        }
    }
}

export default TimeStamp;