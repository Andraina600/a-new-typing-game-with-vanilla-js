const customButton = document.querySelector('.custom-settings__button');
const customMenu = document.querySelector('.custom-settings__menu');

const chronoSelect = document.getElementById("chrono-select");
const numberToggle = document.getElementById("numbers-toggle");
const punctuationToggle = document.getElementById("ponctuation-toggle");
const levelSelect = document.getElementById("level-select");
const hardcoreToggle = document.getElementById("hardcore-toggle");
const languageSelect = document.getElementById("language-select");
const wordCountInput = document.querySelector('.custom-settings__option input');

const modeSelect = levelSelect; // alias
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const chrono = document.getElementById("chrono");

let premier_appuie = false;
let initial_chrono = 0;
let inter;
let accum_wpm = 0;
let accum_accuracy = 0;
let accum_error = 0;

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
  let correct = 0;
  let err = 0;
  let input = inputField.value;
  let target = wordsToType[currentWordIndex];

  for (let i = 0; i < target.length; i++) {
    if (input[i] === target[i]) correct++;
    else if (input[i]) err++;
  }

  return [correct / target.length, err];
};


// ========== STATS ==========
const getCurrentStats = () => {
  const [accRatio, err] = fn_acc();
  const elapsedTime = (Date.now() - previousEndTime) / 1000;
  const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60);
  const accuracy = accRatio * 100;
  return { wpm, accuracy, error: err };
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


// ========== TEST INIT ==========
const startTest = () => {
  // lecture des options
  const lang = languageSelect.value;
  const level = levelSelect.value;
  const wordCount = parseInt(wordCountInput.value) || 10;
  const useNumbers = numberToggle.checked;
  const usePunctuation = punctuationToggle.checked;

  wordsToType = [];
  wordDisplay.innerHTML = "";
  chrono.innerHTML = "00m:00s";
  currentWordIndex = 0;
  startTime = null;
  previousEndTime = null;
  accum_accuracy = 0;
  accum_error = 0;
  accum_wpm = 0;
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


// ========== INPUT LOGIC ==========
const updateWord = (event) => {
  const isHardcore = hardcoreToggle.checked;

  if (event.key === " ") {
    const [acc, err] = fn_acc();

    if (isHardcore && err > 0) {
      stop_chrono();
      results.textContent = "❌ Game Over - Hardcore mode";
      inputField.disabled = true;
      return;
    }

    if (!previousEndTime) previousEndTime = startTime;
    const { wpm, accuracy, error } = getCurrentStats();
    accum_wpm += wpm;
    accum_accuracy += accuracy;
    accum_error += error;

    currentWordIndex++;
    previousEndTime = Date.now();
    highlightNextWord();
    inputField.value = "";
    event.preventDefault();

    if (currentWordIndex === wordsToType.length) {
      stop_chrono();
      results.textContent = `WPM: ${(accum_wpm / wordsToType.length).toFixed(2)}, Accuracy: ${(accum_accuracy / wordsToType.length).toFixed(2)}%, Errors: ${accum_error}`;
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
  updateWord(event);
});

chronoSelect.addEventListener("change", () => {
  // Pour l'instant, tu peux ignorer le chrono basé sur le temps si tu n'as pas fini cette logique
});

languageSelect.addEventListener("change", startTest);
levelSelect.addEventListener("change", startTest);
wordCountInput.addEventListener("change", startTest);
numberToggle.addEventListener("change", startTest);
punctuationToggle.addEventListener("change", startTest);
hardcoreToggle.addEventListener("change", () => {
  inputField.disabled = false;
  startTest();
});


// ========== INITIAL ==========
startTest();
