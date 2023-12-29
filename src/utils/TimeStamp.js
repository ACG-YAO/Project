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
        const seconds = Math.floor((this.totaltime - this.currentTime) / 1000);
        let time_bar = document.getElementById('time');
        console.log(time_bar);
        time_bar.style.setProperty('--p', Math.round(100.0 * seconds / (this.totaltime / 1000)));
        time_bar.style.setProperty('--c', `'${seconds}'`);
    }
}

export default TimeStamp;