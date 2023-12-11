export class TimeStamp {
    constructor(totaltime, Indicator) {
        this.end = false;
        this.Indicator = Indicator;
        this.totaltime = totaltime; //Total time
        this.startTime = 0; // Initialize start time
        this.currentTime = 0; // Initialize current time
        this.timer = null; // Initialize timer
    }

    // Start the timer
    start() {
        this.startTime = Date.now();
        this.end = false;
        this.timer = setInterval(() => {
            this.currentTime = Date.now() - this.startTime;
            this.updateDisplay();
    
            if (this.currentTime >= this.totaltime && !this.end) {
                this.stop();
                this.end = true;
                this.Indicator.display(); // 当时间结束时显示胜利信息
                // 其他计时器结束逻辑
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }

    getCurrentTime() {
        return this.currentTime;
    }

    updateDisplay() {
        const timeElement = document.getElementById('game-time');
        const timeContainer = document.getElementById('time');
        const seconds = Math.floor((this.totaltime - this.currentTime) / 1000);

        if (timeElement) {
            timeElement.textContent = seconds >= 0 ? seconds : 0; // Prevent negative display
            
            if (seconds <= 10 && seconds >= 0) { // Only change style for last 10 seconds
                timeContainer.classList.add('blink');
                timeContainer.style.color = 'red';
            } else {
                timeContainer.classList.remove('blink');
                timeContainer.style.color = 'white'; // or any other default color
            }
        }
    }
}

export default TimeStamp;