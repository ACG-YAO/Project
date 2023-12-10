import { FixedObject } from '../FixedObject.js';

export class Reward extends FixedObject {

    static score = 0;
    static Finalscore = 19;

    constructor() {
        super();
        this.reward = true;
    }

    disappear() {
        this.reward = false;
        Reward.score++;
        this.updateScoreDisplay();
        this.displaywin();
        this.checkstate();
    }

    checkstate() {
        if (Reward.score == Reward.Finalscore) {
            this.displaywin();
        }
    }

    displaywin() {
        document.getElementById('reward-indicator').style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('reward-indicator').style.display = 'none';
        }, 1000);
    }

    updateScoreDisplay() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = Reward.score;
        }
    }
}
export default Reward;