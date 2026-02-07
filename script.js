const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const responseMessage = document.getElementById("response-message");
const card = document.querySelector(".card");

// Rilevamento Mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 0);

let yesScale = 1;
let attempts = 0;
const MAX_ATTEMPTS = isMobile ? 4 : 6; // Meno tentativi su mobile per non frustrare troppo
let isSurrendered = false;

// Funzione per muovere il bottone No
function moveButton() {
  if (isSurrendered) return;

  attempts++;

  if (attempts >= MAX_ATTEMPTS) {
    surrenderButton();
    return;
  }

  // Dimensioni card e bottone
  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;
  const btnWidth = noButton.offsetWidth;
  const btnHeight = noButton.offsetHeight;

  // Limiti di sicurezza (padding interno)
  const maxLeft = cardWidth - btnWidth - 20;
  const maxTop = cardHeight - btnHeight - 20;
  const minLeft = 20;
  const minTop = 20;

  // Nuove coordinate random
  const randomLeft = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
  const randomTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

  // Applica posizione
  noButton.style.position = "absolute";
  noButton.style.left = `${randomLeft}px`;
  noButton.style.top = `${randomTop}px`;
  
  // Aggiunge classe shake per animazione
  noButton.classList.add("button--shake");
  setTimeout(() => noButton.classList.remove("button--shake"), 300);

  // Azioni accessorie
  growYesButton();
  changeNoText();
  
  // Vibrazione su mobile (se supportata)
  if (isMobile && navigator.vibrate) {
    navigator.vibrate(50);
  }
}

function changeNoText() {
  const texts = isMobile 
    ? ["Troppo lenta!", "Mancato!", "Dito veloce?", "Oplà!", "Riprova!"] 
    : ["Mancato!", "Troppo lenta!", "Sono qui!", "Oplà!", "Non mi prendi!"];
    
  noButton.textContent = texts[Math.floor(Math.random() * texts.length)];
  
  // Rotazione casuale
  const randomRot = Math.floor(Math.random() * 20) - 10;
  noButton.style.transform = `rotate(${randomRot}deg)`;
}

function surrenderButton() {
  isSurrendered = true;
  noButton.textContent = "Ok, mi arrendo... 🏳️";
  noButton.classList.add("button--surrender");
  noButton.style.transform = "rotate(0deg)";
}

function growYesButton() {
  // Crescita più aggressiva su mobile per riempire prima lo schermo
  const growthRate = isMobile ? 0.4 : 0.2; 
  const maxScale = isMobile ? 1.8 : 2.5; // Limite diverso per schermi piccoli

  if (yesScale < maxScale) {
    yesScale += growthRate;
    yesButton.style.transform = `scale(${yesScale})`;
    yesButton.style.zIndex = 100; // Assicura che stia sopra
  }
}

function victory() {
  responseMessage.innerHTML = "Sapevo che avresti detto sì! <br> Ti amo Aurora! 💖🐷";
  noButton.style.display = "none";
  yesButton.style.transform = "scale(1)";
  yesButton.textContent = "Sìììì! 🎉";
  document.querySelector(".card__title").textContent = "EVVIVA! 🎉💖";
  
  // Vibrazione di vittoria
  if (isMobile && navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }
}

// Evento click sul Sì
yesButton.addEventListener("click", victory);

// --- GESTIONE INTERAZIONI ---

// Desktop: Mouseover
noButton.addEventListener("mouseover", () => {
  if (!isMobile) moveButton();
});

// Mobile: Touchstart (più reattivo del click)
noButton.addEventListener("touchstart", (e) => {
  if (!isSurrendered) {
    e.preventDefault(); // Previene il click standard
    moveButton();
  } else {
    // Se si è arreso, il tocco lo trasforma in SÌ
    e.preventDefault();
    transformAndWin();
  }
});

// Fallback Click (per casi ibridi o se touchstart fallisce)
noButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (isSurrendered) {
    transformAndWin();
  } else {
    // Su desktop il click non dovrebbe mai avvenire perché scappa al mouseover,
    // ma se succede (es. tab navigation), lo facciamo scappare
    moveButton();
  }
});

function transformAndWin() {
  noButton.textContent = "Scherzavo, è un SÌ! 😍";
  noButton.classList.remove("button--ghost", "button--surrender");
  noButton.classList.add("button--transformed");
  
  setTimeout(victory, 800);
}
