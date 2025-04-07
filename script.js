/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const max_words = 10;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const chrono = document.getElementById("chrono")

let premier_appuie = false
let initial_chrono = 0
let inter
let accum_wpm = 0
let accum_accuracy = 0
let accum_error = 0


const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};
// chronometre
const update_chrono = () => {
    initial_chrono ++
    let minute = Math.floor(initial_chrono / 60)
    let second = initial_chrono % 60

    chrono.innerHTML = `${minute}m:${second}s`
}

const start_chrono = () => {
    inter = setInterval(update_chrono, 1000)
}

const stop_chrono = () => {
    clearInterval(inter)
}

// Initialize the typing test
const startTest = (wordCount = max_words) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    chrono.innerHTML = "00m:00s"
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    accum_accuracy = 0
    accum_error = 0
    accum_wpm = 0

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "pink"; // Highlight first word
        wordDisplay.appendChild(span);
    });
    inputField.value = "";
    results.textContent = "";
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Limitation input en fonction mot à  taper
const fn_set_limit_input = (limit) => {
    inputField.setAttribute('maxlength', limit)
}

// fonction accuracy en fonction nbre de mot correct bien positionné
const fn_acc = () => {
    let correct = 0
    let err = 0
    let len_val_input = inputField.value.length
    let len_word = wordsToType[currentWordIndex].length
    if (Math.min([len_val_input, len_word]) === len_val_input) {
        //diviseur = len_val_input
        inputField.value.split("").forEach((letter, index) => {
            if(wordsToType[currentWordIndex][index] === letter)
                correct++
            else
                err++
        })
    }
    else {
        //diviseur = len_word
        wordsToType[currentWordIndex].split("").forEach((letter, index) => {
            if(inputField.value[index] === letter)
                correct++
            else
                err++
         })
    }
    
    return [correct / len_word, err]
}
   

// Calculate and return WPM & accuracy

const getCurrentStats = () => {
    acc_err = fn_acc()
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
    const accuracy = acc_err[0] * 100; //(wordsToType[currentWordIndex].length / inputField.value.length) * 100;
    const err = acc_err[1]
    return { wpm: wpm, accuracy: accuracy, error: err};
    
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " " && inputField.value.length === wordsToType[currentWordIndex].length) { // Check if spacebar is pressed
        if (true) /*(inputField.value.trim() === wordsToType[currentWordIndex])*/ {
            if (!previousEndTime) previousEndTime = startTime;
            const { wpm, accuracy, error } = getCurrentStats();
            accum_wpm += wpm
            accum_accuracy += accuracy
            accum_error += error

            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value = ""; // Clear input field after space
            event.preventDefault(); // Prevent adding extra spaces

            if (currentWordIndex === wordsToType.length) {
                stop_chrono()
                results.textContent = `WPM: ${(accum_wpm / max_words).toFixed(2)}, Accuracy: ${(accum_accuracy / max_words).toFixed(2)}%, Error: ${accum_error}`;
            }
        }
    }
};

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "pink";
    }
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
    fn_set_limit_input(wordsToType[currentWordIndex].length)
    if(!premier_appuie){
        start_chrono()
        premier_appuie = true
    }
        
});
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();
