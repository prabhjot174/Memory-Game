/*
 * Create a list that holds all of your cards
 */
 const cards = document.querySelectorAll('.card');
 const deck = document.querySelector('.deck');
 let openCards = [];
 let moves = document.querySelector('.moves');
 let numberOfMoves = 0;
 const restart = document.querySelector('.restart');
 const clock = document.querySelector('.timer');
 const stars = document.querySelectorAll('.fa-star');
 const modal = document.querySelector('.modal');
 const modalClose = document.querySelector('.close');
 const playAgain = document.querySelector('.playAgain');
 const winningStat = document.querySelector('.winningStat');
 const timeInfo = document.querySelector('.timeInfo');
 let timer;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 displayCards();


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


// Shuffle function from http://stackoverflow.com/a/2450976
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

restart.addEventListener('click', reset);

modalClose.addEventListener('click', function(){
	modal.style.display = 'none';
});

playAgain.addEventListener('click', function(){
	modal.style.display = 'none';
	reset();
});

modal.addEventListener('click', function(evt){
	if(evt.target.nodeName === 'DIV'){
		modal.style.display = 'none';
	}
});

function addCardToList(card){
	openCards.push(card);
}

function flipToShow(card){
	card.setAttribute("class", "card open show");

}

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

function isLastCardMatched(card){
	return card.classList.contains('match');
}

function matched(previousCard, currentCard) {

	currentCard.classList.add('matched');
	previousCard.classList.add('matched');

	// previousCard.classList.add('match');
	// currentCard.classList.add('match');
	setTimeout(function(){
		currentCard.setAttribute("class", "card open show match");
		previousCard.setAttribute("class", "card open show match");
	}, 300);
}

function reset(){
	displayCards();
	stopTimer();
	for(const star of stars){
		star.setAttribute('class','fa fa-star');
	}
	clock.textContent = "00:00";
}

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

function stopTimer(){
	clearInterval(timer);
}

function evaluateStarLevel() {

	if(numberOfMoves >= 20 && numberOfMoves < 30){
		stars[2].classList.replace('fa-star', 'fa-star-o');
	} else if(numberOfMoves >= 30) {
		stars[1].classList.replace('fa-star', 'fa-star-o');
	}
}

function getTimeToComplete(){
	const time = clock.textContent.split(":");
	const minute = Number(time[0]);
	const second = Number(time[1]);

	return minute === 0? second + "  Seconds." :
	minute + "  Minutes and " + second  + " Seconds";

}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
