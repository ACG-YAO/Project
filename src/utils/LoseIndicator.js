export class LoseIndicator {
    constructor() {
        this.overlay = document.getElementById('lose-indicator');
        this.gameOverImage = this.overlay.querySelector('.game-over-image');
    }

    display() {
        this.overlay.style.display = 'block';
        this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        
        setTimeout(() => {
            this.gameOverImage.style.display = 'block'; 
        }, 100); 
    }
}

export default LoseIndicator;