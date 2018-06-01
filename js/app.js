/**
 * Variable declarations
 */
 const cards = document.querySelectorAll('.card');
 const deck = document.querySelector('.deck');
 const restart = document.querySelector('.restart');
 const clock = document.querySelector('.timer');
 const stars = document.querySelectorAll('.fa-star');
 const modal = document.querySelector('.modal');
 const modalClose = document.querySelector('.close');
 const playAgain = document.querySelector('.playAgain');
 const winningStat = document.querySelector('.winningStat');
 const timeInfo = document.querySelector('.timeInfo');
 let timer;
 let openCards = [];
 let moves = document.querySelector('.moves');
 let numberOfMoves = 0;

 displayCards();

/**
 * @description Display the cards on the page
 *   			shuffle the list of cards using the provided "shuffle" method below
 *   			loop through each card and create its HTML
 *   			add each card's HTML to the page
 */

 function displayCards(){
 	numberOfMoves = 0;
 	openCards = [];
 	moves.textContent = Number(0);

 	const shuffledList = shuffle(Array.from(cards));
 	deck.innerHTML = "";
 	let html = "";
 	for (let i = 0; i < shuffledList.length; i++) {
 		html += shuffledList[i].outerHTML;
 	}
 	deck.innerHTML = html;
 }


/**
 * @description Shuffle function from http://stackoverflow.com/a/2450976
 * @param {array} array
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * @description when a card is clicked, its added to a list of open cards
 * 				card is flipped to display the symbol and checked if there is already a matching card opened
 * 				if there is no matching card opened current and previous cards are both turned down
 * 				non matching cards are removed from the list
 * 				number of moves is incremented
 */
deck.addEventListener('click', function(evt){

	if(numberOfMoves == 0){
		startTimer();
	}

	if(evt.target.nodeName === 'LI'){
		flipToShow(evt.target);
		addCardToList(evt.target);

		if(openCards.length > 1){

			const currentCard = openCards[openCards.length-1];
			const previousCard = openCards[openCards.length-2];

			if(!isLastCardMatched(previousCard)){
				if(currentCard.firstElementChild.classList[1] === previousCard.firstElementChild.classList[1]){
					matched(previousCard, currentCard);
				} else {
					setTimeout(function(){
						flipToHide(previousCard, currentCard);
					}, 1000);

					openCards.splice(openCards.length-2);

				}
			}
		}

		numberOfMoves++;
		moves.textContent = numberOfMoves;
	}

	if(openCards.length == 16) {
		stopTimer();
		modal.style.display = 'block';

		winningStat.textContent = "With " + numberOfMoves + " Moves and " +
									document.querySelectorAll('.fa-star').length +
									" Stars";
		timeInfo.textContent =  "Time to Complete: " + getTimeToComplete();
	}

	evaluateStarLevel();
});

/**
 * @ description clicking on the restart button re-shuffles the deck
 *				 and resets the moves and timer
 */
restart.addEventListener('click', reset);

/**
 * @description clicking on the close button makes the modal window go away
 */
modalClose.addEventListener('click', function(){
	modal.style.display = 'none';
});

/**
 * @description clicking on the play again button calls the reset function and hides the modal window
 */
playAgain.addEventListener('click', function(){
	modal.style.display = 'none';
	reset();
});

/**
 * @description clicking anywhere outside the modal window also hides the window
 */
modal.addEventListener('click', function(evt){
	if(evt.target.nodeName === 'DIV'){
		modal.style.display = 'none';
	}
});

/**
 * @description adds the card to the list of open cards
 * @param {HTMLElement} card
 */
function addCardToList(card){
	openCards.push(card);
}

/**
 * @description flips the card to display the symbol
 * @param {HTMLElement} card
 */
function flipToShow(card){
	card.setAttribute("class", "card open show");

}

/**
 * @description flips the card to hide
 * @param {HTMLElement} previousCard
 * @param {HTMLElement} currentCard
 */
function flipToHide(previousCard, currentCard){
	previousCard.classList.add('not-matched');
	currentCard.classList.add('not-matched');
	previousCard.style.backgroundColor = '#c52b2b';
	currentCard.style.backgroundColor = '#c52b2b';
	setTimeout(function(){
		previousCard.style.cssText = "";
		currentCard.style.cssText = "";
		previousCard.setAttribute("class", "card");
		currentCard.setAttribute("class", "card");
	}, 500);

}

/**
 * @description checks to see if the last opened card matches the current card
 * @param {HTMLElement} card
 */
function isLastCardMatched(card){
	return card.classList.contains('match');
}

/**
 * @description if the cards do match it locks them into open position
 * @param {HTMLElement} previousCard
 * @param {HTMLElement} currentCard
 */
function matched(previousCard, currentCard) {

	currentCard.classList.add('matched');
	previousCard.classList.add('matched');
	setTimeout(function(){
		currentCard.setAttribute("class", "card open show match");
		previousCard.setAttribute("class", "card open show match");
	}, 500);
}

/**
 * @description resets the deck and re-shuffles the cards
 */
function reset(){
	displayCards();
	stopTimer();
	for(const star of stars){
		star.setAttribute('class','fa fa-star');
	}
	clock.textContent = "00:00";
}

/**
 * @description starts the timer as soon as user begins playing
 */
const startTimer = function(){
	let time = 0;
	let minute = 0;
	let second = 0;

	timer = setInterval(function(){
		time++;
		minute = parseInt(time / 60);
		second = parseInt(time % 60);

		minute = minute < 10? "0" + minute: minute;
		second = second < 10? "0" + second: second;

		clock.textContent = minute + ":" + second;

	}, 1000);

}

/**
 * @description stops the timer
 */
function stopTimer(){
	clearInterval(timer);
}

/**
 * @description evaluates user performance and takes stars off with poor performance
 */
function evaluateStarLevel() {

	if(numberOfMoves >= 20 && numberOfMoves < 30){
		stars[2].classList.replace('fa-star', 'fa-star-o');
	} else if(numberOfMoves >= 30) {
		stars[1].classList.replace('fa-star', 'fa-star-o');
	}
}

/**
 * @description returns the time taken to complete the game
 */
function getTimeToComplete(){
	const time = clock.textContent.split(":");
	const minute = Number(time[0]);
	const second = Number(time[1]);

	return minute === 0? second + "  Seconds." :
	minute + "  Minutes and " + second  + " Seconds";

}