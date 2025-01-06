class AudioController {
    constructor() {
        this.flipSound = new Audio('../../static/styles/audio/flip.wav');
        // this.match = new Audio() // this is to play a clip of an album track
    }
    flip (){
        this.flipSound.play();
    }
}

class MixOrMatch{
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('num-flips');
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToCheck = null; // the card that you flip first to look for a match
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCardsArray = [];
        this.busy = true;
        this.shuffleCards();
        setTimeout(() => {
            
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500) // wait 500ms before executing whatever is inside setTimeout
        this.hideCards();
        // resetting timer and ticker in the html text before starting another game:
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks; 

    }
    hideCards(){
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
        });
    }
    startCountdown(){ // similar to setTimeout func, except this one is called every 1000 ms (1 sec)
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0){
                this.gameOver();
            }
        }, 1000);
    }
    gameOver(){
        clearInterval(this.countdown);
        document.getElementById('game-over-text').classList.add('visible')
    }
    victory(){
        clearInterval(this.countdown);
        document.getElementById('victory-text').classList.add('visible')
    }


    flipCard(card) {
        if (this.canFlipCard(card)){
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks; // why do we need both ticker AND totalClicks???
            card.classList.add('visible');

            if (this.cardToCheck){ // if cardtocheck is not null; in other words, if cardtocheck has been flipped
                this.checkForCardMatch(card); // check for match
            }else { // if cardtocheck is null; in other words, if cardtocheck has not been flipped yet
                this.cardToCheck = card;
            }
        }

    }
    checkForCardMatch(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)){
            this.cardMatch(card, this.cardToCheck);
        } else {
            this.misMatch(card, this.cardToCheck);
        }
        this.cardToCheck = null;
    }
    getCardType(card){
        return card.getElementsByClassName('album')[0].src;
    }
    misMatch(card1, card2){
        this.busy = true; // can't flip cards while this.busy is true
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false; // can flip cards when this.busy is false
        }, 1000);
    }
    cardMatch(card1, card2){
        this.matchedCardsArray.push(card1);
        this.matchedCardsArray.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        // this.audioController.match(); // play a clip of the album track
        if (this.matchedCardsArray.length === this.cardsArray.length){
            this.victory();
        }
    }

    shuffleCards(){ // Using the Fisher–Yates shuffle algorithm!!!!!!!!!!!!
        for(let i = this.cardsArray.length-1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            // shuffle the order of the cards being displayed. use css property called "order". you are doing this to access the css grid method
            this.cardsArray[randomIndex].style.order = i; // you're using "style" cuz its css and "order" is a css property.
            this.cardsArray[i].style.order = randomIndex;
        }
    }

    canFlipCard(card) { //3 conditions must be met in order to flip: 1) can't be busy 2) card can't be in matched cards array 3) can't be the card that you flip first to look for a match 
        return (!this.busy && !this.matchedCardsArray.includes(card) && card !== this.cardToCheck) 
        //return true; 
    }
}

function ready(){
    let overlays = Array.from(document.getElementsByClassName('overlay-text')); // returns an array of all elements with the class overlay-text
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(50, cards);

    //loop over overlays and cards and add click event listeners to them
    //forEach() takes a funciton you want to get called for every item in the array
    overlays.forEach(overlay => { // loops through each overlay element in the overlays array.
        overlay.addEventListener('click', () => { // adds a click event listener to each overlay
            overlay.classList.remove('visible'); //removes the visible class from the clicked overlay
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        })
    })
}

if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ready()); // checks to see if the index.html page is finished loading before running the ready() function
} else {
    ready();
}
