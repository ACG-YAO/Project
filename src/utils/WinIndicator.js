export class WinIndicator {
    constructor() {
        this.container = document.getElementById('win-indicator');
    }

    display() {
        // Show the win indicator
        this.container.style.display = 'block';

        // Optionally hide the indicator after a certain period
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }
}

export default WinIndicator;