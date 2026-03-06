const featuredGrid = document.getElementById('featuredGrid');
const galleryGrid = document.getElementById('galleryGrid');
const videoGrid = document.getElementById('videoGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.getElementById('closeLightbox');
const welcomeOverlay = document.getElementById('welcomeOverlay');
const enterWithMusic = document.getElementById('enterWithMusic');
const enterWithoutMusic = document.getElementById('enterWithoutMusic');
const heroMusicButton = document.getElementById('heroMusicButton');
const highlightPlayButton = document.getElementById('highlightPlayButton');
const bgMusic = document.getElementById('bgMusic');
const musicDock = document.getElementById('musicDock');
const dockPlayPause = document.getElementById('dockPlayPause');
const volumeControl = document.getElementById('volumeControl');
const progressBar = document.getElementById('progressBar');

const featuredNumbers = [8, 7, 12, 5, 2, 9, 1, 4];
const galleryNumbers = Array.from({ length: 42 }, (_, i) => i + 1);
const videoNumbers = [1, 2, 3, 4];

function padNumber(number) {
  return String(number).padStart(2, '0');
}

function imagePath(number) {
  return `assets/images/foto-${padNumber(number)}.jpeg`;
}

function videoPath(number) {
  return `assets/videos/video-${padNumber(number)}.mp4`;
}

function openLightbox(src) {
  lightboxImage.src = src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  document.body.style.overflow = '';
}

function createPhotoButton(src, className, altText) {
  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';
  button.innerHTML = `<img src="${src}" alt="${altText}" loading="lazy" />`;
  button.addEventListener('click', () => openLightbox(src));
  return button;
}

function renderFeaturedPhotos() {
  featuredGrid.innerHTML = '';

  featuredNumbers.forEach((number) => {
    const src = imagePath(number);
    const button = createPhotoButton(src, 'photo-card', `Foto romântica ${number} do casal`);
    featuredGrid.appendChild(button);
  });
}

function renderGallery() {
  galleryGrid.innerHTML = '';

  galleryNumbers.forEach((number) => {
    const src = imagePath(number);
    const button = createPhotoButton(src, 'gallery-item', `Foto ${number} do casal`);
    galleryGrid.appendChild(button);
  });
}

function renderVideos() {
  videoGrid.innerHTML = '';

  videoNumbers.forEach((number) => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <video controls preload="metadata" playsinline>
        <source src="${videoPath(number)}" type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>
    `;
    videoGrid.appendChild(card);
  });
}

function showMusicDock() {
  musicDock.classList.remove('hidden');
}

function updatePlayButtonState() {
  const isPaused = bgMusic.paused;
  dockPlayPause.textContent = isPaused ? '▶' : '❚❚';
  heroMusicButton.textContent = isPaused ? 'Tocar nossa música' : 'Pausar nossa música';
  highlightPlayButton.textContent = isPaused ? 'Ouvir agora' : 'Pausar música';
}

async function playMusic() {
  try {
    bgMusic.volume = Number(volumeControl.value);
    await bgMusic.play();
    showMusicDock();
    updatePlayButtonState();
  } catch (error) {
    console.error('Não foi possível iniciar a música.', error);
    showMusicDock();
    updatePlayButtonState();
  }
}

function pauseMusic() {
  bgMusic.pause();
  showMusicDock();
  updatePlayButtonState();
}

function toggleMusic() {
  if (bgMusic.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
}

function enterSite(startMusic) {
  welcomeOverlay.classList.add('hidden');
  document.body.style.overflow = '';
  showMusicDock();

  if (startMusic) {
    playMusic();
  } else {
    pauseMusic();
  }
}

function updateProgress() {
  if (!bgMusic.duration || Number.isNaN(bgMusic.duration)) {
    progressBar.style.width = '0%';
    return;
  }

  const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
  progressBar.style.width = `${percent}%`;
}

renderFeaturedPhotos();
renderGallery();
renderVideos();
updatePlayButtonState();
document.body.style.overflow = 'hidden';

enterWithMusic.addEventListener('click', () => enterSite(true));
enterWithoutMusic.addEventListener('click', () => enterSite(false));
heroMusicButton.addEventListener('click', toggleMusic);
highlightPlayButton.addEventListener('click', toggleMusic);
dockPlayPause.addEventListener('click', toggleMusic);
volumeControl.addEventListener('input', (event) => {
  bgMusic.volume = Number(event.target.value);
});

bgMusic.addEventListener('play', updatePlayButtonState);
bgMusic.addEventListener('pause', updatePlayButtonState);
bgMusic.addEventListener('timeupdate', updateProgress);
bgMusic.addEventListener('loadedmetadata', updateProgress);

closeLightbox.addEventListener('click', closeModal);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

window.addEventListener('load', () => {
  showMusicDock();
  updatePlayButtonState();
});
