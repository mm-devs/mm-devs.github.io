// --- Suite Mnemonica (ordre fixe des 52 cartes) ---
const mnemonica = [
  "4C","2H","7D","3C","4H","6D","AS","5H","9S","2S","QH","3D","QC",
  "8H","6S","5S","9H","KC","2D","JH","3S","8S","6H","10C","5D",
  "KD","2C","3H","8D","5C","KS","JD","8C","10S","KH","JC","7S",
  "10H","AD","4S","7H","4D","AC","9C","JS","QD","7C","QS","10D",
  "6C","AH","9D"
];

// --- Fonctions utilitaires pour générer des valeurs aléatoires ---
function getRandomCard() {
  const suits = ["S","H","D","C"];
  const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const value = values[Math.floor(Math.random() * values.length)];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  return value + suit; 
}

function getRandomNumber() {
  return Math.floor(Math.random() * 52) + 1;
}

// --- Récupération des éléments HTML ---
const cardDisplay = document.getElementById("cardDisplay");
const numberDisplay = document.getElementById("numberDisplay");
const changeCardBtn = document.getElementById("changeCardBtn");
const changeNumberBtn = document.getElementById("changeNumberBtn");

// --- Variables de contrôle ---
let pendingReveal = null;
let lastCard = null;      
let lastNumber = null;    
let neutralMode = false;  
let idleTimer = null;     

// --- Réinitialisation du timer d'inactivité ---
function resetIdleTimer() {
  neutralMode = false;
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    neutralMode = true;
  }, 3000);
}

// --- Vérifier cohérence carte ↔ numéro ---
function isCoherent() {
  if (lastCard === null || lastNumber === null) return false;
  return mnemonica[lastNumber - 1] === lastCard;
}

// --- Fonctions de synchronisation ---
function syncCardWithNumber() {
  const cardCode = mnemonica[lastNumber - 1];
  cardDisplay.src = `images/${cardCode}.svg`;
  lastCard = cardCode;
}

function syncNumberWithCard() {
  const index = mnemonica.indexOf(lastCard);
  numberDisplay.textContent = index + 1;
  lastNumber = index + 1;
}

// --- Gestion des clics sur la carte ---
cardDisplay.addEventListener("click", () => {
  if (neutralMode) {
    if (!isCoherent()) {
      if (lastNumber !== null) {
        syncCardWithNumber();
      } else if (lastCard !== null) {
        syncNumberWithCard();
      }
    } else {
      const newCard = getRandomCard();
      cardDisplay.src = `images/${newCard}.svg`;
      lastCard = newCard;
      pendingReveal = "number";
    }
    neutralMode = false;
  } else if (pendingReveal === "card") {
    if (!isCoherent()) {
      syncCardWithNumber();
    } else {
      const newCard = getRandomCard();
      cardDisplay.src = `images/${newCard}.svg`;
      lastCard = newCard;
      pendingReveal = "number";
    }
    pendingReveal = null;
  } else {
    const newCard = getRandomCard();
    cardDisplay.src = `images/${newCard}.svg`;
    lastCard = newCard;
    pendingReveal = "number";
  }
  resetIdleTimer();
});

// --- Gestion des clics sur le nombre ---
numberDisplay.addEventListener("click", () => {
  if (neutralMode) {
    if (!isCoherent()) {
      if (lastCard !== null) {
        syncNumberWithCard();
      } else if (lastNumber !== null) {
        syncCardWithNumber();
      }
    } else {
      const newNumber = getRandomNumber();
      numberDisplay.textContent = newNumber;
      lastNumber = newNumber;
      pendingReveal = "card";
    }
    neutralMode = false;
  } else if (pendingReveal === "number") {
    if (!isCoherent()) {
      syncNumberWithCard();
    } else {
      const newNumber = getRandomNumber();
      numberDisplay.textContent = newNumber;
      lastNumber = newNumber;
      pendingReveal = "card";
    }
    pendingReveal = null;
  } else {
    const newNumber = getRandomNumber();
    numberDisplay.textContent = newNumber;
    lastNumber = newNumber;
    pendingReveal = "card";
  }
  resetIdleTimer();
});

// --- Boutons supplémentaires ---
changeCardBtn.addEventListener("click", () => {
  cardDisplay.click();
});
changeNumberBtn.addEventListener("click", () => {
  numberDisplay.click();
});

// --- Initialisation : As de pique (AS) et numéro 52 ---
lastCard = "AS";
lastNumber = 52;
cardDisplay.src = `images/${lastCard}.svg`;
numberDisplay.textContent = lastNumber;

// --- Lancer le timer dès le départ ---
resetIdleTimer();
