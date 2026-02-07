const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const responseMessage = document.getElementById("response-message");
const card = document.querySelector(".card");

// Elementi da evitare (Collision Detection)
const title = document.querySelector(".card__title");
const icon = document.querySelector(".card__icon");

// Rilevamento Mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 0);

let yesScale = 1;
let attempts = 0;
const MAX_ATTEMPTS = isMobile ? 4 : 6; 
let isSurrendered = false;
let dramaLevel = 0; // 0: Resa, 1: Pianto, 2: Cuore spezzato, 3: Finale

// Funzione per verificare sovrapposizioni
function isOverlapping(x, y, width, height, element) {
  // Ottieni la posizione dell'elemento rispetto alla card
  // Nota: Questo è un calcolo approssimativo basato sugli offset attuali
  const elRect = element.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  
  const elLeft = elRect.left - cardRect.left;
  const elTop = elRect.top - cardRect.top;
  const elRight = elLeft + elRect.width;
  const elBottom = elTop + elRect.height;

  const myLeft = x;
  const myTop = y;
  const myRight = x + width;
  const myBottom = y + height;

  // Margine di sicurezza (padding)
  const padding = 10;

  return !(myRight < elLeft - padding || 
           myLeft > elRight + padding || 
           myBottom < elTop - padding || 
           myTop > elBottom + padding);
}

// Funzione per muovere il bottone No
function moveButton() {
  if (isSurrendered) return;

  attempts++;

  if (attempts >= MAX_ATTEMPTS) {
    surrenderButton();
    return;
  }

  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;
  const btnWidth = noButton.offsetWidth;
  const btnHeight = noButton.offsetHeight;

  // Limiti massimi
  const maxLeft = cardWidth - btnWidth - 20;
  const maxTop = cardHeight - btnHeight - 20;

  let randomLeft, randomTop;
  let safe = false;
  let retryCount = 0;

  // Tenta di trovare una posizione sicura (max 50 tentativi per evitare loop infiniti)
  while (!safe && retryCount < 50) {
    randomLeft = Math.floor(Math.random() * (maxLeft - 20 + 1)) + 20;
    randomTop = Math.floor(Math.random() * (maxTop - 20 + 1)) + 20;

    // Controlla collisione con Titolo, Icona e Bottone Sì
    const hitsTitle = isOverlapping(randomLeft, randomTop, btnWidth, btnHeight, title);
    const hitsIcon = isOverlapping(randomLeft, randomTop, btnWidth, btnHeight, icon);
    const hitsYes = isOverlapping(randomLeft, randomTop, btnWidth, btnHeight, yesButton);

    if (!hitsTitle && !hitsIcon && !hitsYes) {
      safe = true;
    }
    retryCount++;
  }

  // Applica posizione
  noButton.style.position = "absolute";
  noButton.style.left = `${randomLeft}px`;
  noButton.style.top = `${randomTop}px`;
  
  noButton.classList.add("button--shake");
  setTimeout(() => noButton.classList.remove("button--shake"), 300);

  growYesButton();
  changeNoText();
  
  if (isMobile && navigator.vibrate) navigator.vibrate(50);
}

function changeNoText() {
  const texts = isMobile 
    ? ["Troppo lenta!", "Mancato!", "Dito veloce?", "Oplà!", "Riprova!"] 
    : ["Mancato!", "Troppo lenta!", "Sono qui!", "Oplà!", "Non mi prendi!"];
    
  noButton.textContent = texts[Math.floor(Math.random() * texts.length)];
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
  const growthRate = isMobile ? 0.4 : 0.2; 
  const maxScale = isMobile ? 1.8 : 2.5; 

  if (yesScale < maxScale) {
    yesScale += growthRate;
    yesButton.style.transform = `scale(${yesScale})`;
    yesButton.style.zIndex = 100; 
  }
}

function victory() {
  responseMessage.innerHTML = "Sapevo che avresti detto sì! <br> Ti amo Aurora! 💖🐷";
  noButton.style.display = "none";
  
  // Rimuovi classe gigante se presente per resettare stili base
  yesButton.classList.remove("button--giant-takeover");
  
  yesButton.style.transform = "scale(1)";
  yesButton.textContent = "Sìììì! 🎉";
  document.querySelector(".card__title").textContent = "EVVIVA! 🎉💖";
  
  if (isMobile && navigator.vibrate) navigator.vibrate([100, 50, 100]);
}

// Gestione della "Storyline" del rifiuto
function handleRejectionStory() {
  dramaLevel++;
  
  if (dramaLevel === 1) {
    noButton.textContent = "Quindi non mi ami proprio? 😢";
    // Rimpicciolisci leggermente il bottone No
    noButton.style.transform = "scale(0.85)";
  } else if (dramaLevel === 2) {
    noButton.textContent = "Mi stai spezzando il cuore... 💔";
    noButton.style.transform = "scale(0.75)";
  } else if (dramaLevel === 3) {
    // FINALE: Giant Takeover
    noButton.style.transition = "all 0.5s ease";
    noButton.style.opacity = "0";
    setTimeout(() => { noButton.style.display = "none"; }, 500);

    // Il Sì diventa gigante
    yesButton.innerHTML = `<span style="display:block; font-size: 1.5rem; margin-bottom: 10px; opacity: 0.8;">ORA NON HAI SCELTA! 😈💖</span>Sì, ti amo amore mio! 😍`;
    yesButton.classList.add("button--giant-takeover");
    
    // Aggiorna messaggio
    responseMessage.textContent = "È inutile resistere...";
  }
}

yesButton.addEventListener("click", victory);

// Desktop: Mouseover
noButton.addEventListener("mouseover", () => {
  if (!isMobile) moveButton();
});

// Mobile: Touchstart
noButton.addEventListener("touchstart", (e) => {
  if (!isSurrendered) {
    e.preventDefault(); 
    moveButton();
  } else {
    e.preventDefault();
    handleRejectionStory();
  }
});

// Fallback Click
noButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (isSurrendered) {
    handleRejectionStory();
  } else {
    moveButton();
  }
});
