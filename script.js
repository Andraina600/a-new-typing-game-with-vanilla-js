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
const del = document.querySelector('.not_resultat')

const modeSelect = levelSelect;
const wordDisplay = document.getElementById("word-display");
const restDisplay = document.getElementById("restant-display");
const inputField = document.getElementById("input-field");
const result = document.querySelector('.result')
const results = document.getElementById("results");
const chrono = document.getElementById("chrono");

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
      easy: ["apple", "banana", "grape", "orange", "cherry", "dog", "cat", "house", "tree", "book", 
             "water", "sun", "moon", "star", "fish", "bird", "car", "door", "pen", "paper",
             "food", "hand", "foot", "eye", "nose", "hat", "shoe", "ball", "desk", "chair",
             "cup", "milk", "bread", "egg", "rice", "soup", "bed", "lamp", "wall", "clock"],
      medium: ["keyboard", "monitor", "printer", "charger", "battery", "garden", "window", "bottle", 
               "computer", "school", "teacher", "student", "country", "city", "street", "language",
               "program", "system", "network", "internet", "website", "browser", "message", "email",
               "picture", "camera", "mobile", "number", "letter", "sentence", "paragraph", "document",
               "weather", "summer", "winter", "spring", "autumn", "holiday", "travel", "airport"],
      hard: ["synchronize", "complicated", "development", "extravagant", "misconception", "philosophy",
             "university", "exaggeration", "architecture", "civilization", "demonstration", "environment",
             "psychology", "mathematics", "engineering", "communication", "organization", "international",
             "government", "population", "revolution", "temperature", "dictionary", "intelligence",
             "information", "technology", "application", "electricity", "experiment", "professional",
             "relationship", "opportunity", "challenge", "responsible", "significant", "traditional",
             "understanding", "requirement", "improvement", "competition"]
    },
    fr: {
      easy: ["pomme", "banane", "raisin", "orange", "mangue", "chien", "chat", "maison", "arbre", "livre",
             "eau", "soleil", "lune", "étoile", "poisson", "oiseau", "voiture", "porte", "stylo", "papier",
             "nourriture", "main", "pied", "œil", "nez", "chapeau", "chaussure", "ballon", "bureau", "chaise",
             "tasse", "lait", "pain", "œuf", "riz", "soupe", "lit", "lampe", "mur", "horloge"],
      medium: ["ordinateur", "souris", "jardin", "voiture", "bouteille", "fenêtre", "école", "professeur",
               "élève", "pays", "ville", "rue", "langue", "programme", "système", "réseau", "internet",
               "site", "navigateur", "message", "courriel", "image", "appareil", "téléphone", "numéro",
               "lettre", "phrase", "paragraphe", "document", "météo", "été", "hiver", "printemps", "automne",
               "vacances", "voyage", "aéroport", "clavier", "écran", "imprimante"],
      hard: ["synchronisation", "développement", "philosophie", "université", "exagération", "architecture",
             "civilisation", "démonstration", "environnement", "psychologie", "mathématiques", "ingénierie",
             "communication", "organisation", "international", "gouvernement", "population", "révolution",
             "température", "dictionnaire", "intelligence", "information", "technologie", "application",
             "électricité", "expérience", "professionnel", "relation", "opportunité", "défi", "responsable",
             "significatif", "traditionnel", "compréhension", "exigence", "amélioration", "compétition",
             "caractéristique", "participation", "reconnaissance"]
    },
    es: {
      easy: ["gato", "leche", "pan", "libro", "sol", "perro", "casa", "árbol", "agua", "luna",
             "estrella", "pez", "pájaro", "coche", "puerta", "pluma", "papel", "comida", "mano",
             "pie", "ojo", "nariz", "sombrero", "zapato", "pelota", "mesa", "silla", "taza", "arroz",
             "huevo", "sopa", "cama", "lámpara", "pared", "reloj", "banana", "uva", "naranja", "pescado", "techo"],
      medium: ["ordenador", "ventana", "jardín", "botella", "escuela", "profesor", "estudiante", "país",
               "ciudad", "calle", "idioma", "programa", "sistema", "red", "internet", "sitio", "navegador",
               "mensaje", "correo", "imagen", "cámara", "teléfono", "número", "letra", "frase", "párrafo",
               "documento", "clima", "verano", "invierno", "primavera", "otoño", "vacaciones", "viaje",
               "aeropuerto", "teclado", "monitor", "impresora", "cargador", "batería"],
      hard: ["sincronizar", "desarrollo", "universidad", "exageración", "filosofía", "arquitectura",
             "civilización", "demostración", "medioambiente", "psicología", "matemáticas", "ingeniería",
             "comunicación", "organización", "internacional", "gobierno", "población", "revolución",
             "temperatura", "diccionario", "inteligencia", "información", "tecnología", "aplicación",
             "electricidad", "experimento", "profesional", "relación", "oportunidad", "desafío",
             "responsable", "significativo", "tradicional", "comprensión", "requisito", "mejora",
             "competencia", "característica", "participación", "reconocimiento"]
    },
    de: {
      easy: ["Apfel", "Banane", "Traube", "Orange", "Kirsche", "Hund", "Katze", "Haus", "Baum", "Buch",
             "Wasser", "Sonne", "Mond", "Stern", "Fisch", "Vogel", "Auto", "Tür", "Stift", "Papier",
             "Essen", "Hand", "Fuß", "Auge", "Nase", "Hut", "Schuh", "Ball", "Tisch", "Stuhl",
             "Tasse", "Milch", "Brot", "Ei", "Reis", "Suppe", "Bett", "Lampe", "Wand", "Uhr"],
      medium: ["Tastatur", "Monitor", "Drucker", "Ladegerät", "Batterie", "Garten", "Fenster", "Flasche",
               "Computer", "Schule", "Lehrer", "Schüler", "Land", "Stadt", "Straße", "Sprache",
               "Programm", "System", "Netzwerk", "Internet", "Website", "Browser", "Nachricht", "Email",
               "Bild", "Kamera", "Handy", "Nummer", "Buchstabe", "Satz", "Absatz", "Dokument",
               "Wetter", "Sommer", "Winter", "Frühling", "Herbst", "Urlaub", "Reise", "Flughafen"],
      hard: ["synchronisieren", "kompliziert", "Entwicklung", "extravagant", "Missverständnis", "Philosophie",
             "Universität", "Übertreibung", "Architektur", "Zivilisation", "Demonstration", "Umwelt",
             "Psychologie", "Mathematik", "Ingenieurwesen", "Kommunikation", "Organisation", "international",
             "Regierung", "Bevölkerung", "Revolution", "Temperatur", "Wörterbuch", "Intelligenz",
             "Information", "Technologie", "Anwendung", "Elektrizität", "Experiment", "professionell",
             "Beziehung", "Gelegenheit", "Herausforderung", "verantwortlich", "bedeutend", "traditionell",
             "Verständnis", "Anforderung", "Verbesserung", "Wettbewerb"]
    },
    it: {
      easy: ["mela", "banana", "uva", "arancia", "ciliegia", "cane", "gatto", "casa", "albero", "libro",
             "acqua", "sole", "luna", "stella", "pesce", "uccello", "macchina", "porta", "penna", "carta",
             "cibo", "mano", "piede", "occhio", "naso", "cappello", "scarpa", "palla", "tavolo", "sedia",
             "tazza", "latte", "pane", "uovo", "riso", "zuppa", "letto", "lampada", "muro", "orologio"],
      medium: ["tastiera", "monitor", "stampante", "caricatore", "batteria", "giardino", "finestra", "bottiglia",
               "computer", "scuola", "insegnante", "studente", "paese", "città", "strada", "lingua",
               "programma", "sistema", "rete", "internet", "sito", "browser", "messaggio", "email",
               "immagine", "fotocamera", "cellulare", "numero", "lettera", "frase", "paragrafo", "documento",
               "tempo", "estate", "inverno", "primavera", "autunno", "vacanza", "viaggio", "aeroporto"],
      hard: ["sincronizzare", "complicato", "sviluppo", "stravagante", "equivoco", "filosofia",
             "università", "esagerazione", "architettura", "civiltà", "dimostrazione", "ambiente",
             "psicologia", "matematica", "ingegneria", "comunicazione", "organizzazione", "internazionale",
             "governo", "popolazione", "rivoluzione", "temperatura", "dizionario", "intelligenza",
             "informazione", "tecnologia", "applicazione", "elettricità", "esperimento", "professionale",
             "relazione", "opportunità", "sfida", "responsabile", "significativo", "tradizionale",
             "comprensione", "requisito", "miglioramento", "competizione"]
    },
    pt: {
      easy: ["maçã", "banana", "uva", "laranja", "cereja", "cão", "gato", "casa", "árvore", "livro",
             "água", "sol", "lua", "estrela", "peixe", "pássaro", "carro", "porta", "caneta", "papel",
             "comida", "mão", "pé", "olho", "nariz", "chapéu", "sapato", "bola", "mesa", "cadeira",
             "copo", "leite", "pão", "ovo", "arroz", "sopa", "cama", "lâmpada", "parede", "relógio"],
      medium: ["teclado", "monitor", "impressora", "carregador", "bateria", "jardim", "janela", "garrafa",
               "computador", "escola", "professor", "aluno", "país", "cidade", "rua", "língua",
               "programa", "sistema", "rede", "internet", "site", "navegador", "mensagem", "email",
               "imagem", "câmera", "celular", "número", "letra", "frase", "parágrafo", "documento",
               "tempo", "verão", "inverno", "primavera", "outono", "férias", "viagem", "aeroporto"],
      hard: ["sincronizar", "complicado", "desenvolvimento", "extravagante", "equívoco", "filosofia",
             "universidade", "exagero", "arquitetura", "civilização", "demonstração", "meio ambiente",
             "psicologia", "matemática", "engenharia", "comunicação", "organização", "internacional",
             "governo", "população", "revolução", "temperatura", "dicionário", "inteligência",
             "informação", "tecnologia", "aplicação", "eletricidade", "experimento", "profissional",
             "relação", "oportunidade", "desafio", "responsável", "significativo", "tradicional",
             "compreensão", "requisito", "melhoria", "competição"]
    },
    pl: {
      easy: ["jabłko", "banan", "winogrono", "pomarańcza", "wiśnia", "pies", "kot", "dom", "drzewo", "książka",
             "woda", "słońce", "księżyc", "gwiazda", "ryba", "ptak", "samochód", "drzwi", "długopis", "papier",
             "jedzenie", "ręka", "stopa", "oko", "nos", "kapelusz", "but", "piłka", "stół", "krzesło",
             "kubek", "mleko", "chleb", "jajko", "ryż", "zupa", "łóżko", "lampa", "ściana", "zegar"],
      medium: ["klawiatura", "monitor", "drukarka", "ładowarka", "bateria", "ogród", "okno", "butelka",
               "komputer", "szkoła", "nauczyciel", "uczeń", "kraj", "miasto", "ulica", "język",
               "program", "system", "sieć", "internet", "strona", "przeglądarka", "wiadomość", "email",
               "zdjęcie", "aparat", "telefon", "numer", "litera", "zdanie", "akapit", "dokument",
               "pogoda", "lato", "zima", "wiosna", "jesień", "wakacje", "podróż", "lotnisko"],
      hard: ["synchronizacja", "skomplikowany", "rozwój", "ekstrawagancki", "nieporozumienie", "filozofia",
             "uniwersytet", "przesada", "architektura", "cywilizacja", "demonstracja", "środowisko",
             "psychologia", "matematyka", "inżynieria", "komunikacja", "organizacja", "międzynarodowy",
             "rząd", "populacja", "rewolucja", "temperatura", "słownik", "inteligencja",
             "informacja", "technologia", "aplikacja", "elektryczność", "eksperyment", "profesjonalny",
             "związek", "okazja", "wyzwanie", "odpowiedzialny", "znaczący", "tradycyjny",
             "zrozumienie", "wymóg", "ulepszenie", "konkurencja"]
    },
    sv: {
      easy: ["äpple", "banan", "druva", "apelsin", "körsbär", "hund", "katt", "hus", "träd", "bok",
             "vatten", "sol", "måne", "stjärna", "fisk", "fågel", "bil", "dörr", "penna", "papper",
             "mat", "hand", "fot", "öga", "näsa", "hatt", "sko", "boll", "bord", "stol",
             "mugg", "mjölk", "bröd", "ägg", "ris", "soppa", "säng", "lampa", "vägg", "klocka"],
      medium: ["tangentbord", "skärm", "skrivare", "laddare", "batteri", "trädgård", "fönster", "flaska",
               "dator", "skola", "lärare", "elev", "land", "stad", "gata", "språk",
               "program", "system", "nätverk", "internet", "webbplats", "webbläsare", "meddelande", "email",
               "bild", "kamera", "mobil", "nummer", "bokstav", "mening", "stycke", "dokument",
               "väder", "sommar", "vinter", "vår", "höst", "semester", "resa", "flygplats"],
      hard: ["synkronisera", "komplicerad", "utveckling", "extravagant", "missförstånd", "filosofi",
             "universitet", "överdrift", "arkitektur", "civilisation", "demonstration", "miljö",
             "psykologi", "matematik", "teknik", "kommunikation", "organisation", "internationell",
             "regering", "befolkning", "revolution", "temperatur", "ordbok", "intelligens",
             "information", "teknologi", "applikation", "elektricitet", "experiment", "professionell",
             "relation", "möjlighet", "utmaning", "ansvarig", "betydande", "traditionell",
             "förståelse", "krav", "förbättring", "konkurrens"]
    },
    da: {
      easy: ["æble", "banan", "drue", "appelsin", "kirsebær", "hund", "kat", "hus", "træ", "bog",
             "vand", "sol", "måne", "stjerne", "fisk", "fugl", "bil", "dør", "pen", "papir",
             "mad", "hånd", "fod", "øje", "næse", "hat", "sko", "bold", "bord", "stol",
             "kop", "mælk", "brød", "æg", "ris", "suppe", "seng", "lampe", "væg", "ur"],
      medium: ["tastatur", "skærm", "printer", "lader", "batteri", "have", "vindue", "flaske",
               "computer", "skole", "lærer", "elev", "land", "by", "gade", "sprog",
               "program", "system", "netværk", "internet", "hjemmeside", "browser", "besked", "email",
               "billede", "kamera", "mobil", "nummer", "bogstav", "sætning", "afsnit", "dokument",
               "vejr", "sommer", "vinter", "forår", "efterår", "ferie", "rejse", "lufthavn"],
      hard: ["synkronisere", "kompliceret", "udvikling", "ekstravagant", "misforståelse", "filosofi",
             "universitet", "overdrivelse", "arkitektur", "civilisation", "demonstration", "miljø",
             "psykologi", "matematik", "ingeniørkunst", "kommunikation", "organisation", "international",
             "regering", "befolkning", "revolution", "temperatur", "ordbog", "intelligens",
             "information", "teknologi", "applikation", "elektricitet", "eksperiment", "professionel",
             "forhold", "mulighed", "udfordring", "ansvarlig", "betydelig", "traditionel",
             "forståelse", "krav", "forbedring", "konkurrence"]
    },
    no: {
      easy: ["eple", "banan", "drue", "appelsin", "kirsebær", "hund", "katt", "hus", "tre", "bok",
             "vann", "sol", "måne", "stjerne", "fisk", "fugl", "bil", "dør", "penn", "papir",
             "mat", "hånd", "fot", "øye", "nese", "hatt", "sko", "ball", "bord", "stol",
             "kopp", "melk", "brød", "egg", "ris", "suppe", "seng", "lampe", "vegg", "klokke"],
      medium: ["tastatur", "skjerm", "skriver", "lader", "batteri", "hage", "vindu", "flaske",
               "datamaskin", "skole", "lærer", "elev", "land", "by", "gate", "språk",
               "program", "system", "nettverk", "internett", "nettsted", "nettleser", "melding", "epost",
               "bilde", "kamera", "mobil", "nummer", "bokstav", "setning", "avsnitt", "dokument",
               "vær", "sommer", "vinter", "vår", "høst", "ferie", "reise", "flyplass"],
      hard: ["synkronisere", "komplisert", "utvikling", "ekstravagant", "misforståelse", "filosofi",
             "universitet", "overdrivelse", "arkitektur", "sivilisasjon", "demonstrasjon", "miljø",
             "psykologi", "matematikk", "ingeniørkunst", "kommunikasjon", "organisasjon", "internasjonal",
             "regjering", "befolkning", "revolusjon", "temperatur", "ordbok", "intelligens",
             "informasjon", "teknologi", "applikasjon", "elektrisitet", "eksperiment", "profesjonell",
             "forhold", "mulighet", "utfordring", "ansvarlig", "betydelig", "tradisjonell",
             "forståelse", "krav", "forbedring", "konkurranse"]
    },
    tr: {
      easy: ["elma", "muz", "üzüm", "portakal", "kiraz", "köpek", "kedi", "ev", "ağaç", "kitap",
             "su", "güneş", "ay", "yıldız", "balık", "kuş", "araba", "kapı", "kalem", "kağıt",
             "yemek", "el", "ayak", "göz", "burun", "şapka", "ayakkabı", "top", "masa", "sandalye",
             "bardak", "süt", "ekmek", "yumurta", "pirinç", "çorba", "yatak", "lamba", "duvar", "saat"],
      medium: ["klavye", "monitör", "yazıcı", "şarj", "pil", "bahçe", "pencere", "şişe",
               "bilgisayar", "okul", "öğretmen", "öğrenci", "ülke", "şehir", "sokak", "dil",
               "program", "sistem", "ağ", "internet", "site", "tarayıcı", "mesaj", "email",
               "resim", "kamera", "telefon", "numara", "harf", "cümle", "paragraf", "belge",
               "hava", "yaz", "kış", "ilkbahar", "sonbahar", "tatil", "seyahat", "havaalanı"],
      hard: ["senkronize", "karmaşık", "gelişme", "aşırı", "yanlış anlama", "felsefe",
             "üniversite", "abartı", "mimari", "uygarlık", "gösteri", "çevre",
             "psikoloji", "matematik", "mühendislik", "iletişim", "organizasyon", "uluslararası",
             "hükümet", "nüfus", "devrim", "sıcaklık", "sözlük", "zeka",
             "bilgi", "teknoloji", "uygulama", "elektrik", "deney", "profesyonel",
             "ilişki", "fırsat", "meydan okuma", "sorumlu", "önemli", "geleneksel",
             "anlayış", "gereksinim", "iyileştirme", "rekabet"]
    },
    numbers: ["12", "37", "401", "98", "234", "56", "789", "1000", "42",
              "15", "63", "204", "8", "91", "365", "777", "1234", "500", "99",
              "18", "72", "306", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
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
        if(temp <= 0){
            stop_chrono()
            del.classList.toggle('del-none')
            result.classList.toggle('result-end')
            results.textContent = `WPM: ${Math.floor(accum_wpm / wordsToType.length)},  Accuracy: ${Math.floor(accum_accuracy / wordsToType.length)}%
            ,  Errors: ${accum_error}/Correct: ${accum_correct}/Totale: ${accum_totale}`;
        }
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
    const wordCount = parseInt(wordCountInput.value) || 30;
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
            del.classList.toggle('del-none')
            result.classList.toggle('result-end')
            results.textContent = `WPM: ${Math.floor(accum_wpm / wordsToType.length)},  Accuracy: ${Math.floor(accum_accuracy / wordsToType.length)}%
            ,  Errors: ${accum_error}/Correct: ${accum_correct}/Totale: ${accum_totale}`;
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
                del.classList.toggle('del-none')
                result.classList.toggle('result-end')
                stop_chrono();
                results.textContent = "Game Over - Hardcore mode";
                inputField.disabled = true;
                break;
            }
        }
    }
  updateWord(event);
});


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

// chrono.addEventListener("input", (event) => {
//     if (chronoSelect.value !== "-99" && limit_temps <= 0) {
//         stop_chrono();
//         results.textContent = `WPM: ${Math.floor(accum_wpm / wordsToType.length)}, Accuracy: ${Math.floor(accum_accuracy / wordsToType.length)}%
//         , Errors: ${accum_error}/Correct: ${accum_correct}/Totale: ${accum_totale}`;
//     }
// })


// ========== INITIAL ==========
startTest();