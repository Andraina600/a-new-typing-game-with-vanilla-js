const customButton = document.querySelector('.custom-settings__button');
const customMenu = document.querySelector('.custom-settings__menu');

const chronoSelect = document.getElementById("chrono-select");
const numberToggle = document.getElementById("numbers-toggle");
const punctuationToggle = document.getElementById("ponctuation-toggle");
const levelSelect = document.getElementById("level-select");
const hardcoreToggle = document.getElementById("hardcore-toggle");
const languageSelect = document.getElementById("language-select");
const wordCountInput = document.querySelector('.custom-settings__option input');

const modeSelect = levelSelect;
const modeChrono = chronoSelect;
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const chrono = document.getElementById("chrono");

let isHardcore = false;
let premier_appuie = false;
let initial_chrono = 0;
let inter;
let interval;
let accum_wpm = 0;
let accum_accuracy = 0;
let accum_error = 0;
let accum_correct = 0;
let accum_totale = 0;

let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
let wordsToType = [];


// ========== TOGGLE MENU ==========
customButton.addEventListener('click', () => {
    customMenu.classList.toggle('hidden');
});


// ========== DICTIONNAIRES ==========
const wordBank = {
  en: {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
  },
  fr: {
    easy: ["pomme", "banane", "raisin", "orange", "mangue"],
    medium: ["ordinateur", "souris", "jardin", "voiture", "bouteille"],
    hard: ["synchronisation", "développement", "philosophie", "université", "exagération"]
  },
  es: {
    easy: ["gato", "leche", "pan", "libro", "sol"],
    medium: ["ordenador", "ventana", "jardin", "coche", "botella"],
    hard: ["sincronizar", "desarrollo", "universidad", "exageración", "filosofía"]
  },
  numbers: ["12", "37", "401", "7", "98", "234"],
  punctuation: [",", ".", "!", "?", ":", ";", "*", "#", "{", "}"]
};


// ========== CHRONO ==========
const update_chrono = () => {
  initial_chrono++;
  let minute = Math.floor(initial_chrono / 60);
  let second = initial_chrono % 60;
  chrono.innerHTML = `${minute}m:${second}s`;
};

const start_chrono = () => {
  inter = setInterval(update_chrono, 1000);
};

const stop_chrono = () => {
  clearInterval(inter);
};

// ========== WORD GENERATION ==========
const getRandomWord = (lang, level, useNumbers, usePunctuation) => {
    const base = [...wordBank[lang][level]];
    if (useNumbers) base.push(...wordBank.numbers);
    if (usePunctuation) base.push(...wordBank.punctuation);
    return base[Math.floor(Math.random() * base.length)];
};


// ========== ACCURACY ==========
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

// ========== STATS ==========
const getCurrentStats = () => {
    accRatio = fn_acc();
    acc_err = fn_acc();
    acc_correct = fn_acc();
    acc_NumberChar = fn_acc()
    const elapsedTime = (Date.now() - previousEndTime) / 1000;
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60);
    const accuracy = accRatio[0] * 100;
    const err = acc_err[1]
    const correct = acc_correct[2]
    const NumberChar = acc_NumberChar[3]
    return { wpm : wpm, accuracy: accuracy, error: err, correct: correct , totale: NumberChar };
};


// ========== HIGHLIGHT ==========
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;
    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
        wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "pink";
    }
};


// ========== TEST ==========
let times = parseInt(chronoSelect.value); 
const startTest = () => {
    const lang = languageSelect.value;
    const level = levelSelect.value;
    const wordCount = parseInt(wordCountInput.value) || 10;
    const useNumbers = numberToggle.checked;
    const usePunctuation = punctuationToggle.checked;

    update_minuteur();
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    //chrono.innerHTML = `00m:${times}s`
    // if(chronoSelect){
    //     chrono.innerHTML = `00m:${times}s`;
    // }
    // else{
    //     chrono.innerHTML = "00m00s";
    // }
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    accum_accuracy = 0;
    accum_error = 0;
    accum_wpm = 0;
    accum_correct = 0;
    premier_appuie = false;
    inputField.value = "";
    results.textContent = "";

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(lang, level, useNumbers, usePunctuation));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "pink";
        wordDisplay.appendChild(span);
    });
};


// ========== INPUT ==========

const updateWord = (event) => {
   
    if (event.key === " " ) {
        if (!previousEndTime) previousEndTime = startTime;
        const { wpm, accuracy, error , correct , totale} = getCurrentStats();
            if(wordsToType[currentWordIndex].length != inputField.value.length){
                accum_wpm += 0
            }
            else{
                accum_wpm += wpm   
            }
        accum_accuracy += accuracy;
        accum_error += error;
        accum_correct += correct;
        accum_totale += totale
        
        currentWordIndex++;
        previousEndTime = Date.now();
        highlightNextWord();
        inputField.value = "";
        event.preventDefault();

        if (currentWordIndex === wordsToType.length) {
            stop_chrono();
            results.textContent = `WPM: ${Math.floor(accum_wpm / wordsToType.length)}, Accuracy: ${Math.floor(accum_accuracy / wordsToType.length)}%
            , Errors: ${accum_error}/Correct: ${accum_correct}/Totale: ${accum_totale}`;
        }
    }
    
};


// ========== EVENTS ==========
inputField.addEventListener("keydown", (event) => {
    if (!startTime) startTime = Date.now();
    if (chronoSelect) {
        start_minuteur();
    }
    if(!premier_appuie){
        //start_chrono();
        premier_appuie = true
    }
    const typed = inputField.value
    if(isHardcore){
        for(let i = 0 ; i < typed.length ; i++){
            if(typed[i] != wordsToType[currentWordIndex][i]){
            stop_chrono();
            results.textContent = " Game Over - Hardcore mode";
            inputField.disabled = true;
            break;
            }
        }

    }
  updateWord(event);
});

//========== MINUTEUR ===========
const update_minuteur = () => {
    const secd = times % 60
    chrono.innerHTML = `00m:${secd}s`
    times-- 
    if(secd < 0){
        clearInterval(interval)
        return
    }
}

const start_minuteur = () => {
    interval = setInterval(update_minuteur, 1000)
}

chronoSelect.addEventListener("change" , startTest);
languageSelect.addEventListener("change", startTest);
levelSelect.addEventListener("change", startTest);
wordCountInput.addEventListener("change", startTest);
numberToggle.addEventListener("change", startTest);
punctuationToggle.addEventListener("change", startTest);
hardcoreToggle.addEventListener("change", () => {
    isHardcore = hardcoreToggle.checked;
    inputField.disabled = false;
    startTest();
});


startTest();