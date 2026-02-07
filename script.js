const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const responseMessage = document.getElementById("response-message");
const card = document.querySelector(".card");

let yesScale = 1;

// Funzione per muovere il bottone No
function moveButton() {
  // Dimensioni della card e del bottone
  const cardRect = card.getBoundingClientRect();
  const btnRect = noButton.getBoundingClientRect();

  // Calcola un'area sicura all'interno della card (padding di 20px)
  const maxX = cardRect.width - btnRect.width - 40;
  const maxY = cardRect.height - btnRect.height - 40;

  // Genera coordinate random
  const randomX = Math.floor(Math.random() * maxX) + 20;
  const randomY = Math.floor(Math.random() * maxY) + 20;

  // Applica la posizione assoluta rispetto alla card
  noButton.style.position = "absolute";
  noButton.style.left = `${randomX}px`;
  noButton.style.top = `${randomY}px`;
}

// Funzione per ingrandire il bottone Sì
function growYesButton() {
  yesScale += 0.5; // Aumenta molto di più!
  yesButton.style.transform = `scale(${yesScale})`;
  
  // Aumenta z-index per assicurarsi che copra tutto man mano che cresce
  yesButton.style.zIndex = 100;
}

// Lista di frasi per il bottone No
const noTexts = [
  "No",
  "Sei sicura?",
  "Davvero?",
  "Pensaci bene...",
  "Ultima chance!",
  "Daiii!",
  "Non farlo!",
  "Ti prego!",
  "Sbagliato!",
  "Riprova!",
  "Cuore spezzato 💔",
  "Ma io ti amo!",
  "Non puoi!",
  "Impossibile!",
  "Clicca l'altro!",
];

// Funzione per cambiare testo e muovere
function escapeNo() {
  moveButton();
  growYesButton();
  
  // Cambio testo bottone No
  const randomText = noTexts[Math.floor(Math.random() * noTexts.length)];
  noButton.textContent = randomText;
  
  // Rotazione casuale per renderlo più "pazzo"
  const randomRot = Math.floor(Math.random() * 40) - 20;
  noButton.style.transform = `rotate(${randomRot}deg)`;
}

// Evento click sul Sì
yesButton.addEventListener("click", () => {
  responseMessage.innerHTML = "Sapevo che avresti detto sì! <br> Ti amo Aurora! 💖🐷";
  // Nascondi il bottone No quando dice sì
  noButton.style.display = "none";
  // Reset scala
  yesButton.style.transform = "scale(1)";
  yesButton.style.zIndex = 10;
});

// Eventi per Desktop (Mouseover)
noButton.addEventListener("mouseover", () => {
  escapeNo();
});

// Eventi per Mobile (Click/Touch)
noButton.addEventListener("click", (e) => {
  e.preventDefault();
  escapeNo();
});
