export class WinIndicator {
    constructor() {
        this.container = document.getElementById('win-indicator');
        this.WinImage = this.container.querySelector('.win-image');
    }

    display() {
        // Show the win indicator
        this.container.style.display = 'block';
        this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        setTimeout(function() {
            document.getElementById("restartButton3").style.display = 'flex';
        }, 8000); 
        this.WinImage.style.display = 'block'; 
        setTimeout(function() {
            document.getElementById("myImagewin").style.display = 'block';
        }, 4000); 
    }
}

export default WinIndicator;