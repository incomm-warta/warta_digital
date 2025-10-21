// ====== CONFIG (Warta Digital) ======
const totalPages = 29;               // Jumlah halaman majalah
const folder = "pages/";             // Nama folder tempat gambar disimpan
const baseName = "Slide";            // Nama dasar file gambar (Slide1.png, Slide2.png, dst)
const padDigits = 0;                 // Tidak pakai 01, 02
const ext = ".png";                  // Ekstensi file

// Fungsi pembentuk nama file otomatis
const pad = (n) => padDigits > 0 ? String(n).padStart(padDigits, '0') : n;
const pages = Array.from({length: totalPages}, (_, i) => `${folder}${baseName}${pad(i+1)}${ext}`);

// ====== VARIABEL UTAMA ======
let current = 0; // index halaman kiri (0-based)
let zoom = 1.0;

// Ambil elemen HTML
const flipbook = document.getElementById('flipbook');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const jumpInput = document.getElementById('jumpInput');
const jumpBtn = document.getElementById('jumpBtn');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
const zoomVal = document.getElementById('zoomVal');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const flipbookWrapper = document.getElementById('flipbookWrapper');
const downloadLink = document.getElementById('downloadLink');

// ====== FUNGSI RENDER HALAMAN ======
function render() {
  flipbook.innerHTML = '';
  const total = pages.length;

  // Halaman kiri
  const leftIdx = current;
  const leftPage = document.createElement('div');
  leftPage.className = 'page left';
  const leftImg = document.createElement('img');
  leftImg.src = pages[leftIdx];
  leftImg.alt = `Page ${leftIdx+1}`;
  leftPage.appendChild(leftImg);
  flipbook.appendChild(leftPage);

  // Halaman kanan
  if (leftIdx + 1 < total) {
    const rightIdx = leftIdx + 1;
    const rightPage = document.createElement('div');
    rightPage.className = 'page right';
    const rightImg = document.createElement('img');
    rightImg.src = pages[rightIdx];
    rightImg.alt = `Page ${rightIdx+1}`;
    rightPage.appendChild(rightImg);
    flipbook.appendChild(rightPage);

    // Animasi klik kanan untuk flip
    rightPage.addEventListener('click', () => {
      rightPage.classList.add('flipping');
      setTimeout(() => {
        current = Math.min(current + 2, total - 1);
        render();
      }, 700);
    });
  }

  // Update tampilan info
  pageInfo.textContent = `${Math.min(leftIdx + 1, total)} / ${total}`;
  jumpInput.value = Math.min(leftIdx + 1, total);
  downloadLink.href = pages[leftIdx];
  applyZoom();
}

// ====== KONTROL FLIP HALAMAN ======
prevBtn.addEventListener('click', () => {
  current = Math.max(0, current - 2);
  render();
});

nextBtn.addEventListener('click', () => {
  current = Math.min(totalPages - (totalPages % 2 === 0 ? 2 : 1), current + 2);
  render();
});

// ====== KONTROL JUMP TO PAGE ======
jumpBtn.addEventListener('click', () => {
  let v = parseInt(jumpInput.value) || 1;
  v = Math.max(1, Math.min(totalPages, v));
  const leftIndex = (v % 2 === 1) ? v - 1 : v - 2;
  current = Math.max(0, Math.min(totalPages - 1, leftIndex));
  render();
});

// ====== KONTROL ZOOM ======
function applyZoom() {
  const wrapper = document.getElementById('flipbookWrapper');
  wrapper.style.transform = `scale(${zoom})`;
  wrapper.style.transformOrigin = 'center top';
  zoomVal.textContent = `${Math.round(zoom * 100)}%`;
}

function zoomTo(v) {
  zoom = Math.max(0.6, Math.min(2.0, v)); // batas zoom min dan max
  applyZoom();
}

zoomIn.addEventListener('click', () => zoomTo(zoom + 0.1));
zoomOut.addEventListener('click', () => zoomTo(zoom - 0.1));

// ====== KONTROL FULLSCREEN ======
fullscreenBtn.addEventListener('click', async () => {
  const el = flipbookWrapper;
  if (!document.fullscreenElement) {
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      el.classList.add('fullscreen');
      fullscreenBtn.textContent = '⤡'; // ikon keluar fullscreen
    } catch (err) {
      console.warn('Gagal masuk fullscreen:', err);
    }
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    el.classList.remove('fullscreen');
    fullscreenBtn.textContent = '⤢'; // ikon masuk fullscreen
  }
});

// ====== KONTROL KEYBOARD ======
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextBtn.click();
  if (e.key === 'ArrowLeft') prevBtn.click();
  if (e.key === '+') zoomTo(zoom + 0.1);
  if (e.key === '-') zoomTo(zoom - 0.1);
});

// ====== INISIALISASI ======
render();
applyZoom();
