export class LoseIndicator {
    constructor(is_audio, music, background) {
        this.overlay = document.getElementById('lose-indicator');
        this.gameOverImage = this.overlay.querySelector('.game-over-image');
        this.audio = is_audio;
        this.music = music;
        this.background = background;
    }

    display() {
        this.overlay.style.display = 'block';
        this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        setTimeout(() => {
            this.gameOverImage.style.display = 'block'; 
        }, 100); 
        setTimeout(function() {
            document.getElementById("restartButton2").style.display = 'flex';
        }, 6000); 
        setTimeout(function() {
            document.getElementById("myImage").style.display = 'block';
        }, 4000); 
        if (this.audio === 'on'){
            this.background.pause();
            this.music.play();
            setTimeout(() => {
                this.background.play();
            }, 6000); 
        }
    }
}

export default LoseIndicator;