const customButton = document.querySelector('.custom-settings__button');
const customMenu = document.querySelector('.custom-settings__menu');
const customSettings = document.querySelector('.custom-settings')

const typingToggle1 = document.querySelector(".typing-options__toggle1")
const typingToggle2 = document.querySelector(".typing-options__toggle2")
const typingToggle3 = document.querySelector(".typing-options__toggle3")
const chronoSelect = document.getElementById("chrono-select");
const numberToggle = document.getElementById("numbers-toggle");
const punctuationToggle = document.getElementById("ponctuation-toggle");
const levelSelect = document.getElementById("level-select");
const hardcoreToggle = document.getElementById("hardcore-toggle");
const languageSelect = document.getElementById("language-select");
const wordCountInput = document.querySelector('.custom-settings__option input');

const modeSelect = levelSelect;
const wordDisplay = document.getElementById("word-display");
const restDisplay = document.getElementById("restant-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const chrono = document.getElementById("chrono");
const refresh = document.getElementById("refresh__icon")

let limit_temps = 0
let restant = 0
let highlight_index = 0;
let isHardcore = false;
let premier_appuie = false;
let initial_chrono = 0;
let inter;
let accum_wpm = 0;
let accum_accuracy = 0;
let accum_error = 0;
let accum_correct = 0;
let accum_totale = 0;
let List_number = 30;

let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
let wordsToType = [];


function range(list, start, end, step = 1) {
    const result = [];
    for (let i = start; i < end; i += step) {
        result.push(list[i]);
    }
    return result;
}
  

// ========== TOGGLE MENU ==========
customButton.addEventListener('click', () => {
  customMenu.classList.toggle('hidden');
});

customButton.addEventListener('click', () => {
    customButton.classList.toggle('custom-settings__button--pink');
})

numberToggle.addEventListener('change', () => {
    typingToggle1.classList.toggle('typing-options__toggle--pink');
})

punctuationToggle.addEventListener('change', () => {
    typingToggle2.classList.toggle('typing-options__toggle--pink');
})

hardcoreToggle.addEventListener('change', () => {
    typingToggle3.classList.toggle('typing-options__toggle--pink');
})


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
    if (limit_temps === -99) {
        initial_chrono++;
  
        let minute = Math.floor(initial_chrono / 60);
        let second = initial_chrono % 60;
        chrono.innerHTML = `${minute}m:${second}s`;
    }

    else {
        initial_chrono++;

        let temp = limit_temps - initial_chrono 
        
        let minute = Math.floor(temp / 60);
        let second = temp % 60;
        chrono.innerHTML = `${minute}m:${second}s`;
    }
      
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
const highlightNextWord = (index) => {
    const wordElements = wordDisplay.children;
    if (index < wordElements.length) {
        if (index > 0) {
        wordElements[index - 1].style.color = "black";
        }
        wordElements[index].style.color = "pink" ;
    }
};


// ========== TEST INIT ==========
const startTest = () => {
    const lang = languageSelect.value;
    const level = levelSelect.value;
    const wordCount = parseInt(wordCountInput.value) || 10;
    const useNumbers = numberToggle.checked;
    const usePunctuation = punctuationToggle.checked;

    
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    if(chronoSelect.value !== "-99"){
        chrono.innerHTML = `00m:${chronoSelect.value}s`
    }
    else{
        chrono.innerHTML = "00m:00s";
    }
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
    limit_temps = parseInt(chronoSelect.value);

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(lang, level, useNumbers, usePunctuation));
    }

    restant = wordsToType.length - (currentWordIndex)
    restDisplay.innerHTML = restant
    

    wordsToType.forEach((word, index) => {

        if(index < List_number) {
            const span = document.createElement("span");
            span.textContent = word + " ";
            if (index === 0) span.style.color = "pink";
            wordDisplay.appendChild(span);
        } 
            
    });
};


const update_wordDisplay = (index)=> {
    new_word_display = range(wordsToType, index, index + List_number, 1)
    wordDisplay.innerHTML = "";
    new_word_display.forEach((word, index) => {
        if (word !== undefined){
            const span = document.createElement("span");
            span.textContent = word + " ";
            if (index === 0) span.style.color = "pink";
            wordDisplay.appendChild(span);
        }
            
            
    });
};

// ========== INPUT LOGIC ==========

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
        highlight_index ++;

        if (currentWordIndex % List_number === 0 &&  currentWordIndex != wordsToType.length){
            update_wordDisplay(currentWordIndex)
            highlight_index = 0
        }
        restant = wordsToType.length - (currentWordIndex)
        restDisplay.innerHTML = restant

        previousEndTime = Date.now();
        highlightNextWord(highlight_index);
        inputField.value = "";
        event.preventDefault();
        console.log(chronoSelect.value, limit_temps)
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
    if (!premier_appuie) {
        start_chrono();
        premier_appuie = true;
    }
    
    const typed = inputField.value
    if(isHardcore){
        for(let i = 0 ; i < typed.length ; i++){
            if(typed[i] != wordsToType[currentWordIndex][i]){
                stop_chrono();
                results.textContent = "Game Over - Hardcore mode";
                inputField.disabled = true;
                break;
            }
        }

    }
  updateWord(event);
});

//========== MINUTEUR ===========
chronoSelect.addEventListener("change", () => {
    startTest()
    stop_chrono()
});

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

chrono.addEventListener("input", (event) => {
    if (chronoSelect.value !== "-99" && limit_temps <= 0) {
        stop_chrono();
        results.textContent = `WPM: ${Math.floor(accum_wpm / wordsToType.length)}, Accuracy: ${Math.floor(accum_accuracy / wordsToType.length)}%
        , Errors: ${accum_error}/Correct: ${accum_correct}/Totale: ${accum_totale}`;
    }
})


// ========== INITIAL ==========
startTest();