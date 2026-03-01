const heartTrigger = document.getElementById('heartTrigger');
const introSection = document.getElementById('introSection');
const messageSection = document.getElementById('messageSection');
const nameContainer = document.getElementById('nameContainer');
const photoSection = document.getElementById('photoSection');
const readMoreBtn = document.getElementById('readMoreBtn');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const confettiLayer = document.getElementById('confettiLayer');
const bgMusic = document.getElementById('bgMusic');
const audioToggle = document.getElementById('audioToggle');
const audioIcon = document.getElementById('audioIcon');

let revealStarted = false;

function launchConfetti(durationMs = 4000) {
  const colors = ['#d2264d', '#f27ea7', '#f9dca0', '#f6a4c6', '#e54e75'];
  const count = 130;

  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.opacity = `${0.45 + Math.random() * 0.5}`;
    piece.style.width = `${6 + Math.random() * 8}px`;
    piece.style.height = `${8 + Math.random() * 10}px`;
    piece.style.animationDuration = `${2.8 + Math.random() * 1.8}s`;
    piece.style.animationDelay = `${Math.random() * 0.45}s`;
    confettiLayer.appendChild(piece);
  }

  window.setTimeout(() => {
    confettiLayer.innerHTML = '';
  }, durationMs + 450);
}

function animateName(name = 'Rory') {
  nameContainer.textContent = '';
  const isSmallScreen = window.matchMedia('(max-width: 560px)').matches;
  const xRange = isSmallScreen ? 80 : 140;
  const yRange = isSmallScreen ? 68 : 120;
  const rotationRange = isSmallScreen ? 180 : 300;

  const fragment = document.createDocumentFragment();
  [...name].forEach((letter) => {
    const span = document.createElement('span');
    span.className = 'name-letter';
    span.textContent = letter;

    const startX = `${Math.round((Math.random() - 0.5) * xRange)}vw`;
    const startY = `${Math.round((Math.random() - 0.5) * yRange)}vh`;
    const startR = `${Math.round((Math.random() - 0.5) * rotationRange)}deg`;

    span.style.setProperty('--start-x', startX);
    span.style.setProperty('--start-y', startY);
    span.style.setProperty('--start-r', startR);

    fragment.appendChild(span);
  });

  nameContainer.appendChild(fragment);

  requestAnimationFrame(() => {
    const letters = nameContainer.querySelectorAll('.name-letter');
    letters.forEach((letter, index) => {
      window.setTimeout(() => {
        letter.classList.add('gather');
      }, index * 150);
    });
  });
}

function openModal() {
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
}

function updateAudioButton() {
  if (bgMusic.muted) {
    audioIcon.textContent = '✕♪';
    audioToggle.setAttribute('aria-label', 'Unmute background music');
    audioToggle.setAttribute('aria-pressed', 'true');
  } else {
    audioIcon.textContent = '♪';
    audioToggle.setAttribute('aria-label', 'Mute background music');
    audioToggle.setAttribute('aria-pressed', 'false');
  }
}

function startReveal() {
  if (revealStarted) {
    return;
  }
  revealStarted = true;

  introSection.classList.add('opened');

  audioToggle.classList.add('active');
  launchConfetti(4000);

  window.setTimeout(() => {
    messageSection.classList.add('reveal');
    messageSection.setAttribute('aria-hidden', 'false');
  }, 420);

  window.setTimeout(() => {
    animateName('Rory');
  }, 900);

  window.setTimeout(() => {
    photoSection.classList.add('show');
    photoSection.setAttribute('aria-hidden', 'false');
  }, 2700);

  const playPromise = bgMusic.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch((error) => {
      console.warn('Music did not start.', error);
    });
  }
}

if (heartTrigger) {
  heartTrigger.addEventListener('click', startReveal, { once: true });
}

if (readMoreBtn) {
  readMoreBtn.addEventListener('click', openModal);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

if (audioToggle) {
  audioToggle.addEventListener('click', () => {
    bgMusic.muted = !bgMusic.muted;
    updateAudioButton();
  });
}

updateAudioButton();
