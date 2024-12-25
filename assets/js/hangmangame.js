const container = document.querySelector('.container');
let healthCounter = 7;
let selectedWordLetters;
let matchedLetters = [];
let selectedWordLettersBtns;

function render(){
  dialog.close();
  healthCounter = 7;
  matchedLetters = [];
  container.innerHTML = `
    <div class="starter-menu">
      <img class="logo" src="assets/images/logo.svg" alt="Logo">
      <button id="startBtn"><img src="assets/images/start-icon.png" alt="Icon"></button>
      <button id="howToPlayBtn">HOW TO PLAY</button>
    </div>
  `;
  howToPlayBtn.addEventListener('click', showHowToPlayMenu);
  startBtn.addEventListener('click', pickCategory);
}

function showHowToPlayMenu(){
  container.innerHTML = `
    <div class="how-to-play-menu">
      <div class="header">
        <button id="headerGoBackBtn"><img src="assets/images/back-icon.png" alt="Icon"></button>
        <p>How to Play</p>
      </div>
      <div class="rules-container">
        <div class="rule">
          <h2><span>01</span>CHOOSE A CATEGORY</h2>
          <p>First, choose a word category, like animals or movies. The computer then randomly selects a secret word from that topic and shows you blanks for each letter of the word.</p>
        </div>
        <div class="rule">
          <h2><span>02</span>GUESS LETTERS</h2>
          <p>Take turns guessing letters. The computer fills in the relevant blank spaces if your guess is correct. If it’s wrong, you lose some health, which empties after eight incorrect guesses.</p>
        </div>
        <div class="rule">
          <h2><span>03</span>WIN OR LOSE</h2>
          <p>You win by guessing all the letters in the word before your health runs out. If the health bar empties before you guess the word, you lose.</p>
        </div>
      </div>
    </div>
  `;
  headerGoBackBtn.addEventListener('click', render);
}

function pickCategory(){
  dialog.close();
  healthCounter = 7;
  matchedLetters = [];
  container.innerHTML = `
    <div class="pick-category">
      <div class="header">
        <button id="headerGoBackBtn"><img src="assets/images/back-icon.png" alt="Icon"></button>
        <p>Pick a Category</p>
      </div>
      <div class="categories">
        <div class="category" data-category="movies">MOVIES</div>
        <div class="category" data-category="tvshows">TV SHOWS</div>
        <div class="category" data-category="countries">COUNTRIES</div>
        <div class="category" data-category="capitalcities">CAPITAL CITIES</div>
        <div class="category" data-category="animals">ANIMALS</div>
        <div class="category" data-category="sports">SPORTS</div>
      </div>
    </div>
  `;
  headerGoBackBtn.addEventListener('click', render);
  bindCategoryBtns();
}

function bindCategoryBtns(){
  const categoryBtns = document.querySelectorAll('.category');
  for (const categoryBtn of categoryBtns) {
    categoryBtn.addEventListener('click', playGame);
  }
}

function playGame(){
  healthCounter = 7;
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const randomNumber = Math.floor(Math.random() * 40);
  const selectedCategory = this.dataset.category;
  const selectedCategoryWords = words.filter(word => word.category == selectedCategory);
  const selectedWord = selectedCategoryWords[randomNumber].word.toUpperCase();
  selectedWordLetters = selectedWord.split('');
  container.innerHTML = `
    <div class="game-screen">
      <div class="header">
        <div class="header__wrapper">
          <button id="hamburgerMenuBtn"><img src="assets/images/hamburger-menu.png" alt="Icon"></button>
          <p class="category-name">${selectedCategory.toUpperCase()}</p>
        </div>
        <div class="health-bar">
          <div class="interactive-health-bar">
            <div id="healthBar"></div>
          </div>
          <img src="assets/images/heart-icon.svg" alt="Heart Icon">
        </div>
      </div>
      <div class="word-letters">
        ${selectedWordLetters.map(letter => letter === ' ' ?  `<div class="word-letter new-line"></div>`  :`
          <div class="word-letter disabled" data-value="${letter}">
            ${letter}
          </div>
          `).join('')}
      </div>
      <div class="keyboard">
        ${alphabet.map(letter => `<div class="letter" data-value="${letter}">${letter}</div>`).join('')}
      </div>
    </div>
  `;
  selectedWordLettersBtns = Array.from(document.querySelectorAll('.word-letter'));
  bindLetterBtns();
  bindEvents();
  handleHealthBar();
}

function bindLetterBtns(){
  const letterBtns = document.querySelectorAll('.letter');
  for (const letterBtn of letterBtns) {
    letterBtn.addEventListener('click', pickLetter);
  }
}

function pickLetter(){
  const spaces = Array.from(document.querySelectorAll('.new-line'));
  const selectedLetter = this.dataset.value;
  const matchedLetterBtns = selectedWordLettersBtns.filter(x => x.dataset.value == selectedLetter);
  const selectedLetterIndex = matchedLetters.findIndex(x => x.dataset.value == selectedLetter);
  if(selectedWordLetters.includes(selectedLetter)){
    for (const matchedLetterBtn of matchedLetterBtns) {
      matchedLetterBtn.classList.add('default');
      matchedLetterBtn.classList.remove('disabled');
      if(selectedLetterIndex === -1){
        matchedLetters.push(matchedLetterBtn);
      }
    }
    continueBtn.innerText = 'PLAY AGAIN!';
  } else{
    if(!(this.classList.contains('disabled'))){
      healthCounter = healthCounter -1;
      continueBtn.innerText = 'PLAY AGAIN!';

    }
  }
  if(healthCounter ==  0){
    dialog.showModal();
    result.innerHTML = 'You Lose';
  } else if(matchedLetters.length == selectedWordLettersBtns.length - spaces.length){
    dialog.showModal();
    result.innerHTML = 'You Win';
  }
  this.classList.add('disabled');
  bindEvents();
  handleHealthBar();
}

function bindEvents(){
  hamburgerMenuBtn.addEventListener('click', () => {
    dialog.showModal();
    result.innerHTML = 'Paused';
    continueBtn.innerText = 'CONTINUE';
  });
  quit.addEventListener('click', render);
  newCategory.addEventListener('click', pickCategory);
  continueBtn.addEventListener('click', () => {
    if(result.innerText == 'Paused'){
      dialog.close();
    } else{
      healthCounter = 7;
      matchedLetters = [];
      for (const btn of selectedWordLettersBtns) {
        btn.classList.remove('default');
        btn.classList.add('disabled');
      }
      const letterBtns = document.querySelectorAll('.letter');
      for (const letterBtn of letterBtns) {
        letterBtn.classList.remove('disabled');
      }
      dialog.close();
      handleHealthBar();
    }
  });
}

function handleHealthBar(){
  console.log(healthCounter);
  healthBar.style.width = `${healthCounter * (100 / 7)}%`;
}

render();