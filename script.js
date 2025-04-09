/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const max_words = 3;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const chrono = document.getElementById("chrono")
const minuteur = document.getElementById("minuteur")

let premier_appuie = false
let initial_chrono = 0
let inter
let interval
let accum_wpm = 0
let accum_accuracy = 0
let accum_error = 0
let accum_correct = 0
let accum_NumberChar = 0


const words = {
    easy: ["dog", "chases", "ball", "the", "big", "quickly", "and", "in", "park", "my", "friend",
         "reads", "book", "under", "tree", "I", "eat", "apple", "with", "fork", "he", "plays", 
         "guitar", "at", "home", "she", "drinks", "water", "from", "bottle"],
    
    medium: ["keyboard", "monitor", "printer", "charger", "battery" , "journey", "mysterious", 
        "discover", "mountain", "adventure", "explore", "ancient", "challenge", "whisper", 
        "travel", "hidden", "distant", "knowledge", "library", "question", "answer", "forest",
         "meditate", "island", "discover", "treasure", "puzzle", "reflection", "insight", 
         "beyond", "experience", "unique", "enlightenment", "mystery", "enigma", "understand"],
    
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception" , "ephemeral", 
        "serendipity", "ineffable", "conundrum", "juxtapose", "quixotic", "cogitation", "melancholy", 
        "antithesis", "cacophony", "inevitable", "luminous", "reverie", "sonder", 
        "labyrinthine", "euphoria", "nebulous", "paradox"]
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
//minuteur

let times = 10 
const update_minuteur = () => {
    const secd = times % 60
    minuteur.innerHTML = `${secd}s`
    times-- 
    if(times < 0){
        clearInterval(interval)
    }
}

const start_minuteur = () => {
    interval = setInterval(update_minuteur, 1000)
}



// Initialize the typing test
const startTest = (wordCount = max_words) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    chrono.innerHTML = "00m:00s"
    minuteur.innerHTML = "10s"
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
// const fn_set_limit_input = (limit) => {
//     inputField.setAttribute('maxlength', limit)
// }

// fonction accuracy en fonction nbre de mot correct bien positionné
const fn_acc = () => {
    let correct = 0
    let err = 0
    let len_val_input = inputField.value.length
    let len_word = wordsToType[currentWordIndex].length
    let sum_totale = 0

    if (Math.min([len_val_input, len_word]) === len_val_input) {
        inputField.value.split("").forEach((letter, index) => {
            if(wordsToType[currentWordIndex][index] === letter)
                correct++
            else
                err++
        })
        sum_totale = correct + err
    }
    else {
        wordsToType[currentWordIndex].split("").forEach((letter, index) => {
            if(inputField.value[index] === letter)
                correct++
            else
                err++
         })
         sum_totale = correct + err
    }  
    
    return [correct / len_word, err, correct, sum_totale]
}
   

// Calculate and return WPM & accuracy & error

const getCurrentStats = () => {
    acc_err = fn_acc()
    acc_correct = fn_acc()
    acc_NumberChar = fn_acc()
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
    const accuracy = acc_err[0] * 100; //(wordsToType[currentWordIndex].length / inputField.value.length) * 100;
    const err = acc_err[1]
    const correct = acc_correct[2]
    const NumberChar = acc_NumberChar[3]
    return { wpm: wpm, accuracy: accuracy, error: err, correct: correct , totale: NumberChar};
    
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed
        if (true) {
            if (!previousEndTime) {
                previousEndTime = startTime
            };
            const { wpm, accuracy, error , correct , totale} = getCurrentStats();
            if(wordsToType[currentWordIndex].length != inputField.value.length){
                accum_wpm += 0
            }
            else{
                accum_wpm += wpm   
            }
            accum_accuracy += accuracy
            accum_error += error
            accum_correct += correct
            accum_NumberChar += totale

            currentWordIndex++; 
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value += " "; // add space input field after space
            event.preventDefault(); // Prevent adding extra spaces
        }
    }
    if (currentWordIndex === wordsToType.length) {
        stop_chrono()
        results.textContent = `WPM: ${Math.floor(accum_wpm / max_words)} , Accuracy: ${Math.floor(accum_accuracy / max_words)}%, Error: ${accum_error}/Correct: ${accum_correct}/Totale: ${accum_NumberChar}`;
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
    //fn_set_limit_input(wordsToType[currentWordIndex].length)
    if(!premier_appuie){
        start_chrono()
        start_minuteur()
        premier_appuie = true
    }
        
});
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();
