const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const responseMessage = document.getElementById("response-message");
const card = document.querySelector(".card");

let yesScale = 1;
let attempts = 0;
const MAX_ATTEMPTS = 6; // Dopo 6 volte si arrende
let isSurrendered = false;

// Funzione per muovere il bottone No
function moveButton() {
  if (isSurrendered) return; // Se si è arreso, non scappa più

  attempts++;

  // Se abbiamo raggiunto il limite, il bottone si arrende
  if (attempts >= MAX_ATTEMPTS) {
    surrenderButton();
    return;
  }

  // Dimensioni della card e del bottone
  // Usiamo offsetWidth/Height per avere le dimensioni reali incluso padding
  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;
  const btnWidth = noButton.offsetWidth;
  const btnHeight = noButton.offsetHeight;

  // Calcoliamo i limiti massimi per restare DENTRO la card (con un margine di sicurezza di 20px)
  // La card ha position: relative, quindi absolute 0,0 è l'angolo in alto a sinistra della card
  const maxLeft = cardWidth - btnWidth - 20;
  const maxTop = cardHeight - btnHeight - 20;
  const minLeft = 20;
  const minTop = 20; // Un po' di spazio dall'alto per non finire sopra l'immagine

  // Genera coordinate random all'interno dei limiti
  const randomLeft = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
  const randomTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

  // Applica la posizione assoluta
  noButton.style.position = "absolute";
  noButton.style.left = `${randomLeft}px`;
  noButton.style.top = `${randomTop}px`;
  
  // Ingrandisce il Sì ogni volta che il No scappa
  growYesButton();
  
  // Frasi divertenti mentre scappa
  const texts = ["Mancato!", "Troppo lenta!", "Sono qui!", "Oplà!", "Non mi prendi!"];
  noButton.textContent = texts[Math.floor(Math.random() * texts.length)];
}

function surrenderButton() {
  isSurrendered = true;
  noButton.textContent = "Ok, mi arrendo... 🏳️";
  noButton.classList.add("button--surrender");
  noButton.style.position = "static"; // Torna al suo posto (o resta dov'è, ma static lo rimette nel flusso se vogliamo)
  // Per estetica, lasciamolo dove si è fermato ma rimuoviamo l'evento mouseover
  // Rimuoviamo il listener clonando il nodo (trick veloce) o gestendo flag
  // Qui usiamo il flag isSurrendered nel mouseover
}

// Funzione per ingrandire il bottone Sì
function growYesButton() {
  if (yesScale < 2.5) { // Limite massimo per non rompere tutto il layout
    yesScale += 0.15;
    yesButton.style.transform = `scale(${yesScale})`;
  }
}

// Evento click sul Sì
yesButton.addEventListener("click", () => {
  victory();
});

function victory() {
  responseMessage.innerHTML = "Sapevo che avresti detto sì! <br> Ti amo Aurora! 💖🐷";
  noButton.style.display = "none";
  yesButton.style.transform = "scale(1)";
  yesButton.textContent = "Sìììì! 🎉";
  
  // Lancia coriandoli o cuori extra (simulato col testo per ora)
  document.querySelector(".card__title").textContent = "EVVIVA! 🎉💖";
}

// Eventi per Desktop (Mouseover)
noButton.addEventListener("mouseover", () => {
  moveButton();
});

// Eventi per Mobile/Click
noButton.addEventListener("click", (e) => {
  e.preventDefault();
  
  if (!isSurrendered) {
    moveButton();
  } else {
    // COLPO DI SCENA: Se clicca quando si è arreso, diventa un SÌ!
    noButton.textContent = "Scherzavo, è un SÌ! 😍";
    noButton.classList.remove("button--ghost", "button--surrender");
    noButton.classList.add("button--transformed");
    
    // Dopo un attimo, triggera la vittoria
    setTimeout(() => {
      victory();
    }, 600);
  }
});
