const gameName = 'Guess The Word';
window.document.title = gameName;
document.querySelector('h1').textContent = gameName;
document.querySelector('footer').textContent = `${gameName} Created by Reda`

//settings for game options
let numberOfGuesses = 6;
let wordLength = 6;
let currentGuess = 1;
let numberOfHints = 2;

// manage words list
let wordToGuess  = '';
const words = ["create","reader","update","delete","apples","object","string","number","writer","script","arrays","object","member"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toUpperCase();
let messageArea = document.querySelector('.message');
// console.log(wordToGuess)

// manage hints
document.querySelector('.hint span').textContent = numberOfHints;
const getHintButton = document.querySelector('.hint');
getHintButton.addEventListener('click', getHint);


function generateInput(){
    const inputContainer = document.querySelector('.inputs');
    //ceate div for each try
    for (let i = 1; i <= numberOfGuesses; i++) {
        const tryDiv = document.createElement('div');
        tryDiv.classList.add('try'+i);
        tryDiv.innerHTML = `<span> Try${i} </span>`;

        if (i !== 1) tryDiv.classList.add('disabled-inputs');
        //create input for each letter
        for (let j = 1; j <= wordLength; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `guess${i}-letter-${j}`;
            input.setAttribute('maxlength', 1);
            tryDiv.appendChild(input)
        }
        inputContainer.appendChild(tryDiv);
    }
    // focus on the first input in the first try
    inputContainer.children[0].children[1].focus()
    // disable inputs expect the first one
    const inputsInDisabled = document.querySelectorAll('.disabled-inputs input');
    inputsInDisabled.forEach(input => {
        input.disabled = true
    })
    //focus input after input is active
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input , index ) => {
        input.addEventListener('input', function(){
            input.value = input.value.toUpperCase();
            const nextInput = inputs[index+1];
            if(nextInput) nextInput.focus();
        })
        input.addEventListener('keydown', function(event){
            //  console.log(event.target)
            const currentIndex = Array.from(inputs).indexOf(event.target);
            // console.log(currentIndex)
            if(event.key === 'ArrowRight'){
                const nextInput = currentIndex + 1;
                if(nextInput < inputs.length) inputs[nextInput].focus();
            }
            if(event.key === 'ArrowLeft'){
                const prevInput = currentIndex - 1;
                if(prevInput >= 0 && prevInput < inputs.length) inputs[prevInput].focus();
            }
        })
    })
}

const guessButton = document.querySelector('.check');
guessButton.addEventListener('click', handleGuesses);

console.log('78 the word : ',wordToGuess)
function handleGuesses(){
   let successGuess = true;
   for(let i = 1; i <= numberOfGuesses; i++){
       const inputField = document.querySelector(`#guess${currentGuess}-letter-${i}`);
       const letter = inputField.value;
       const correctLetter = wordToGuess[i-1];

    // game logic 
    if (letter === correctLetter) {
        //letter is correct and in place
        inputField.classList.add('in-place');
    }else if (wordToGuess.includes(letter) && letter !== "") {
        //letter is correct but not in place
        inputField.classList.add('not-in-place');
        successGuess = false;
    }else{
        //letter is not in word
        inputField.classList.add('no');
        successGuess = false;
    }
   }
   // check if the game is over
   if(successGuess){
       messageArea.innerHTML = `You won in ${currentGuess} Tries, the word <span>${wordToGuess}</span> `;
       if (numberOfHints === 2){
        messageArea.innerHTML = `You won in ${currentGuess} Tries, the word <span>${wordToGuess}</span> 
                                    <p>congrstulation you didnt use hint</p> `
       }
       //disable inputs
       let allTries = document.querySelectorAll('.inputs > div');
       allTries.forEach(tryDiv => { tryDiv.classList.add('disabled-inputs');})
       //disable button
       guessButton.classList.add('finish'); 
       getHintButton.classList.add('finish'); 
   }else{
        document.querySelector(`.try${currentGuess}`).classList.add('disabled-inputs');
        const currentTryInputs = document.querySelectorAll(`.try${currentGuess} input`);
        currentTryInputs.forEach(input => {
            input.disabled = true;
        })
        currentGuess++;        

        let el = document.querySelector(`.try${currentGuess}`);
        if(el){
            document.querySelector(`.try${currentGuess}`).classList.remove('disabled-inputs');
            const nextTryInputs = document.querySelectorAll(`.try${currentGuess} input`);
            nextTryInputs.forEach(input => {
            input.disabled = false;
            })
            el.children[1].focus();
        }else {
            //disable guess buttton
            guessButton.classList.add('finish'); 
            getHintButton.classList.add('finish'); 
            messageArea.innerHTML = `You lost, the word was <span>${wordToGuess}</span> `
        }
    }
}

// getHint 
function getHint(){
    if(numberOfHints > 0){
        numberOfHints--;
        document.querySelector('.hint span').textContent = numberOfHints;
    }
    if(numberOfHints === 0){
        getHintButton.classList.add('finish');
    }

    const enabledInputs = document.querySelectorAll('input:not([disabled])');
    // console.log('enabledInputs',enabledInputs)
    const emptyEnabledInputs = Array.from(enabledInputs).filter(input => input.value === "");
    // console.log('empty',emptyEnabledInputs)
    if(emptyEnabledInputs.length > 0){
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex]
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput)
            //  console.log('randomIndex',randomIndex)
            //  console.log('randomInput',randomInput)
            //  console.log('indexToFill',indexToFill)
        if(randomInput !== -1){
            randomInput.value = wordToGuess[indexToFill];
        }
    }
}

function handleBackspace(event) {
    if (event.key === "Backspace"){
        const inputs = document.querySelectorAll('input:not([disabled])');
        const currentIndex = Array.from(inputs).indexOf(event.target);
        console.log(currentIndex)
        if(currentIndex > 0){
            const currentInput = inputs[currentIndex]
            const prevInput = inputs[currentIndex - 1]
            currentInput.value = "";
            prevInput.value = "";
            prevInput.focus()
        }
    } 
}
document.addEventListener('keydown', handleBackspace)

window.onload = () => {
    generateInput()
}