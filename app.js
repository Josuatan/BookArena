/* BookArena — JavaScript murni. Reservasi ini simulasi lokal, tanpa backend. */
'use strict';

const ICONS = {
  court: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M12 5v14M3 9h4v6H3m18-6h-4v6h4"/><circle cx="12" cy="12" r="3"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="m12 7 4 3-1.5 4.5h-5L8 10l4-3Zm0-4v4m9 3-5 .5M17 20l-2.5-5.5M7 20l2.5-5.5M3 10l5 .5"/>',
  racket: '<ellipse cx="14" cy="8" rx="5" ry="6" transform="rotate(35 14 8)"/><path d="m10 13-6 8m6-12 7-6m-6 9 7-6m-7-3 6 7"/>',
  pin: '<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18m-13 4h2m4 0h2m-8 3h2"/>',
  'calendar-check': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18m-12 5 2 2 4-4"/>',
  ticket: '<path d="M4 4h16v6a2 2 0 0 0 0 4v6H4v-6a2 2 0 0 0 0-4V4Z"/><path d="M14 4v2m0 3v2m0 3v2m0 3v1"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  'arrow-up-right': '<path d="M6 18 18 6M6 6h12v12"/>',
  'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  x: '<path d="m6 6 12 12M6 18 18 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  tag: '<path d="M3 3h8l10 10-8 8L3 11V3Z"/><circle cx="7" cy="7" r="1"/>',
  star: '<path d="m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3-4.6-4.5 6.4-.9L12 3Z"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  sparkles: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm8 0v4m-2-2h4"/>'
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.court}</svg>`;
function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
}
const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const rupiah = (amount) => new Intl.NumberFormat('id-ID', {style:'currency',currency:'IDR',maximumFractionDigits:0}).format(amount);
const clockLabel = (hour) => `${String(hour).padStart(2, '0')}.00`;
const sportLabel = (sport) => sport === 'futsal' ? 'Futsal' : 'Bulu tangkis';
function jakartaToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const part = type => parts.find(p => p.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
function jakartaHour() {
  return Number(new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Jakarta',hour:'2-digit',hourCycle:'h23'}).format(new Date()));
}
function dateLabel(date) {
  return new Intl.DateTimeFormat('id-ID', {weekday:'short',day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Jakarta'}).format(new Date(`${date}T12:00:00+07:00`));
}
const VENUES = [
  {id:'arena',name:'Arena Futsal Kemang',sport:'futsal',area:'Jakarta Selatan',district:'Kemang',rating:4.9,price:75000,peak:100000,promo:true,amenities:['Rumput sintetis','Indoor','Parkir'],image:'assets/futsal.png',images:['assets/futsal.png','assets/arena-2.png']},
  {id:'rally',name:'Rally Badminton Club',sport:'badminton',area:'Jakarta Selatan',district:'Cilandak',rating:4.8,price:50000,peak:75000,promo:false,amenities:['Lantai vinyl','Indoor','Ruang ganti'],image:'assets/badminton.png',images:['assets/badminton.png','assets/rally-2.png']},
  {id:'kickoff',name:'Kickoff Futsal Center',sport:'futsal',area:'Jakarta Barat',district:'Kebon Jeruk',rating:4.7,price:65000,peak:90000,promo:true,amenities:['Rumput sintetis','Indoor','Kantin'],image:'assets/kickoff-1.png',images:['assets/kickoff-1.png','assets/kickoff-2.png']},
  {id:'smash',name:'Smash House Badminton',sport:'badminton',area:'Jakarta Barat',district:'Kembangan',rating:4.9,price:55000,peak:80000,promo:true,amenities:['Lantai vinyl','Indoor','Parkir'],image:'assets/smash-1.png',images:['assets/smash-1.png','assets/smash-2.png']},
  {id:'extra',name:'Extra Time Futsal',sport:'futsal',area:'Jakarta Timur',district:'Duren Sawit',rating:4.8,price:60000,peak:85000,promo:false,amenities:['Rumput sintetis','Indoor','Ruang ganti'],image:'assets/extra-1.png',images:['assets/extra-1.png','assets/extra-2.png']},
  {id:'shuttle',name:'Shuttle Space',sport:'badminton',area:'Jakarta Timur',district:'Rawamangun',rating:4.7,price:45000,peak:70000,promo:false,amenities:['Lantai vinyl','Indoor','Kantin'],image:'assets/shuttle-1.png',images:['assets/shuttle-1.png','assets/shuttle-2.png']}
];
const HOURS = Array.from({length:14}, (_, i) => i + 8);
const STORAGE_KEY = 'mainin.bookings.v1';
const FAVORITE_KEY = 'mainin.favorites.v1';
let memoryBookings = [];
let storageUnavailable = false;

function validStoredBooking(item) {
  return item && typeof item.id === 'string' && VENUES.some(v => v.id === item.venueId)
    && typeof item.name === 'string' && item.name.length <= 80 && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
    && !Number.isNaN(new Date(`${item.date}T12:00:00+07:00`).getTime())
    && Number.isInteger(item.start) && item.start >= 8 && Number.isInteger(item.duration) && item.duration > 0
    && item.start + item.duration <= 22 && Number.isFinite(item.total) && item.total >= 0
    && ['active','cancelled'].includes(item.status);
}
function readBookings() {
  if (storageUnavailable) return memoryBookings;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    memoryBookings = Array.isArray(stored) ? stored.filter(validStoredBooking) : [];
  } catch { storageUnavailable = true; }
  return memoryBookings;
}
function saveBookings(records) {
  memoryBookings = records;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); return true; }
  catch { storageUnavailable = true; return false; }
}
let favorites = [];
try { const stored = JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]'); if (Array.isArray(stored)) favorites = stored.filter(id => VENUES.some(v => v.id === id)); } catch { /* Favorit tetap dapat digunakan di sesi ini. */ }
let filters = {area:'all',sport:'all',date:jakartaToday(),promo:false,sort:'recommended'};
let selectedVenue = null;
let toastTimer;

// Slot hanya terisi jika ada booking aktif; waktu yang sudah berlalu ditandai Lewat.
function slotStatus(venue, date, hour, records = readBookings()) {
  if (date < jakartaToday() || (date === jakartaToday() && hour <= jakartaHour())) return 'passed';
  if (records.some(b => b.status === 'active' && b.venueId === venue.id && b.date === date && hour >= b.start && hour < b.start + b.duration)) return 'occupied';
  return 'available';
}
function calculatePrice(venue, start, duration) {
  let subtotal = 0;
  for (let h = start; h < start + duration; h++) subtotal += h >= 18 ? venue.peak : venue.price;
  const discount = venue.promo ? Math.round(subtotal * .1) : 0;
  return {subtotal,discount,total:subtotal - discount};
}
function showToast(message) {
  $('#toast-message').textContent = message;
  $('#toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 3800);
}
function scrollToVenues() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setActiveNavigation('#lapangan');
  $('#lapangan').scrollIntoView({behavior:reduced ? 'instant' : 'smooth'});
}

// Navigasi aktif ditandai dengan bold; perpindahan bagian memakai scroll halus.
const navigationLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
function setActiveNavigation(hash) {
  navigationLinks.forEach(link => {
    const active = link.getAttribute('href') === hash;
    link.classList.toggle('nav-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function updateActiveNavigation() {
  const hash = window.location?.hash || '#lapangan';
  const knownSection = navigationLinks.some(link => link.getAttribute('href') === hash);
  setActiveNavigation(knownSection ? hash : '#lapangan');
}
navigationLinks.forEach(link => link.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
  const hash = link.getAttribute('href');
  const section = $(hash);
  if (!section) return;
  event.preventDefault();
  setActiveNavigation(hash);
  if (window.location.hash !== hash) window.history.pushState(null, '', hash);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  section.scrollIntoView({behavior:reduced ? 'instant' : 'smooth', block:'start'});
}));
window.addEventListener('hashchange', updateActiveNavigation);
window.addEventListener('popstate', updateActiveNavigation);
window.addEventListener('load', updateActiveNavigation);
function syncTabs() {
  document.querySelectorAll('[data-sport]').forEach(button => {
    const active = button.dataset.sport === filters.sport;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $('#promo-filter').setAttribute('aria-pressed', String(filters.promo));
}
function renderGallery(venue, context) {
  const images = venue.images || [venue.image];
  const id = `gallery-${context}-${venue.id}`;
  const favorite = context === 'card' ? `<button class="favorite-button icon-button" data-favorite="${venue.id}" aria-label="Simpan ${venue.name} ke favorit" aria-pressed="${favorites.includes(venue.id)}">${icon('heart')}</button>` : '';
  if (context === 'card') return `<div class="venue-image-wrap wadah"><img src="${venue.image}" alt="${venue.name}" width="1536" height="1024" loading="lazy">${favorite}${venue.promo ? '<span class="promo-label label">Promo! · 10%</span>' : ''}<span class="sport-label">${icon(venue.sport === 'futsal' ? 'ball' : 'racket')}${sportLabel(venue.sport)}</span></div>`;
  return `<div class="venue-gallery wadah ${context === 'card' ? 'venue-image-wrap' : 'booking-image-wrap'}">
    <div class="gallery-track" id="${id}" role="region" tabindex="0" aria-label="Galeri foto ${venue.name}. Geser kiri atau kanan untuk melihat foto lain.">
      ${images.map((src,index) => `<div class="gallery-slide"><img src="${src}" alt="${venue.name}, foto ${index+1} dari ${images.length}" width="1536" height="1024" loading="lazy" draggable="false"></div>`).join('')}
    </div>
    ${favorite}
    ${venue.promo ? '<span class="promo-label label">Promo! · 10%</span>' : ''}
    <button class="gallery-arrow gallery-prev" data-gallery-direction="-1" aria-controls="${id}" aria-label="Foto sebelumnya ${venue.name}">${icon('arrow-right')}</button>
    <button class="gallery-arrow gallery-next" data-gallery-direction="1" aria-controls="${id}" aria-label="Foto berikutnya ${venue.name}">${icon('arrow-right')}</button>
    <span class="sport-label">${icon(venue.sport === 'futsal' ? 'ball' : 'racket')}${sportLabel(venue.sport)}</span>
    <div class="gallery-dots" role="group" aria-label="Pilih foto ${venue.name}">${images.map((_,index) => `<button class="gallery-dot" data-gallery-index="${index}" aria-controls="${id}" aria-label="Foto ${index+1} ${venue.name}" aria-pressed="${index === 0}"><span></span></button>`).join('')}</div>
    <span class="gallery-count">1 / ${images.length}</span>
  </div>`;
}
function updateGallery(track) {
  if (!track.clientWidth) return;
  const gallery = track.closest('.venue-gallery');
  const total = track.children.length;
  const index = Math.max(0, Math.min(total - 1, Math.round(track.scrollLeft / track.clientWidth)));
  if (track.dataset.activeIndex === String(index)) return;
  track.dataset.activeIndex = String(index);
  gallery.querySelector('.gallery-count').textContent = `${index+1} / ${total}`;
  gallery.querySelectorAll('.gallery-dot').forEach((dot,i) => dot.setAttribute('aria-pressed', String(i === index)));
}
function goToGalleryImage(track, index) {
  const target = ((index % track.children.length) + track.children.length) % track.children.length;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  track.scrollTo({left:target * track.clientWidth,behavior:reduced ? 'instant' : 'smooth'});
}
function handleGalleryNavigation(event) {
  const control = event.target.closest('[data-gallery-direction], [data-gallery-index]');
  if (!control) return false;
  const track = control.closest('.venue-gallery').querySelector('.gallery-track');
  const current = Math.round(track.scrollLeft / track.clientWidth);
  const next = control.dataset.galleryIndex !== undefined ? Number(control.dataset.galleryIndex) : current + Number(control.dataset.galleryDirection);
  scheduleGalleryAutoplay();
  goToGalleryImage(track, next);
  return true;
}
function initializeGalleries() {
  document.querySelectorAll('.gallery-track').forEach(track => {
    if (!track.dataset.initialized) {
      track.dataset.initialized = 'true';
      track.addEventListener('scroll', () => updateGallery(track), {passive:true});
      track.addEventListener('pointerdown', scheduleGalleryAutoplay, {passive:true});
      track.addEventListener('keydown', event => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        scheduleGalleryAutoplay();
        const current = Math.round(track.scrollLeft / track.clientWidth);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? track.children.length-1 : current + (event.key === 'ArrowRight' ? 1 : -1);
        goToGalleryImage(track, next);
      });
    }
    updateGallery(track);
  });
}
let galleryTimer;
let galleryPaused = false;
function scheduleGalleryAutoplay() {
  clearTimeout(galleryTimer);
  if (galleryPaused || !$('#booking-dialog').open || document.hidden) return;
  galleryTimer = setTimeout(() => {
    const track = document.querySelector('#booking-gallery .gallery-track');
    if (!track || galleryPaused || !$('#booking-dialog').open || document.hidden) return;
    goToGalleryImage(track, Math.round(track.scrollLeft / track.clientWidth) + 1);
    scheduleGalleryAutoplay();
  }, 4500);
}
$('#booking-dialog').addEventListener('close', () => clearTimeout(galleryTimer));
// Banner utama berputar otomatis; interaksi manual mengatur ulang jeda.
let heroTimer;
let heroIndex = 0;
function showHeroSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  heroIndex = (index + slides.length) % slides.length;
  $('#hero-track').style.transform = `translateX(-${heroIndex * 100}%)`;
  slides.forEach((slide,i) => { slide.inert = i !== heroIndex; slide.setAttribute('aria-hidden', String(i !== heroIndex)); });
  document.querySelectorAll('[data-hero-index]').forEach((dot,i) => dot.setAttribute('aria-pressed', String(i === heroIndex)));
}
function scheduleHeroAutoplay() {
  clearTimeout(heroTimer);
  if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !document.querySelectorAll('.hero-slide').length) return;
  heroTimer = setTimeout(() => {
    if (!$('#booking-dialog').open && !$('#orders-dialog').open && !$('#success-dialog').open) showHeroSlide(heroIndex + 1);
    scheduleHeroAutoplay();
  }, 5500);
}
$('#hero-banner').addEventListener('click', event => {
  const dot = event.target.closest('[data-hero-index]');
  if (!dot) return;
  showHeroSlide(Number(dot.dataset.heroIndex));
  scheduleHeroAutoplay();
});
document.addEventListener('visibilitychange', () => { scheduleGalleryAutoplay(); scheduleHeroAutoplay(); });
showHeroSlide(0);
scheduleHeroAutoplay();

window.addEventListener('resize', initializeGalleries);
function renderVenues() {
  const matching = VENUES.filter(v => (filters.area === 'all' || v.area === filters.area) && (filters.sport === 'all' || v.sport === filters.sport) && (!filters.promo || v.promo));
  if (filters.sort === 'price') matching.sort((a,b) => a.price * (a.promo ? .9 : 1) - b.price * (b.promo ? .9 : 1));
  if (filters.sort === 'rating') matching.sort((a,b) => b.rating - a.rating);
  $('#results-count').textContent = `${matching.length} lapangan ditemukan`;
  $('#empty-state').hidden = matching.length > 0;
  $('#venue-grid').innerHTML = matching.map((v, index) => `
    <article class="venue-card" data-venue-sport="${v.sport}" style="--card-index:${index}">
      ${renderGallery(v, 'card')}
      <div class="venue-content"><div class="venue-title-row"><h3>${v.name}</h3><span class="rating" aria-label="Rating demo ${v.rating} dari 5">${icon('star')}${v.rating.toFixed(1)}</span></div>
        <p class="venue-location">${icon('pin')}${v.district}, ${v.area}</p>
        <div class="amenities">${v.amenities.map(a => `<span class="amenity">${a}</span>`).join('')}</div>
        <div class="venue-bottom"><div class="venue-price"><span>Mulai dari${v.promo ? ' · setelah promo' : ''}</span><strong>${rupiah(v.price * (v.promo ? .9 : 1))}</strong> <small>/ jam</small></div><button class="venue-book" data-book="${v.id}" aria-label="Lihat jadwal ${v.name}">Lihat jadwal ${icon('arrow-up-right')}</button></div>
      </div>
    </article>`).join('');
  syncTabs();
  initializeGalleries();
}

function clearErrors() {
  ['name','time','duration'].forEach(id => { $(`#${id}-error`).textContent = ''; });
  ['customer-name','start-time','duration'].forEach(id => { $(`#${id}`).removeAttribute('aria-invalid'); });
  $('#booking-error').hidden = true;
}
function openBooking(id) {
  selectedVenue = VENUES.find(v => v.id === id);
  if (!selectedVenue) return;
  const v = selectedVenue;
  $('#booking-gallery').innerHTML = renderGallery(v, 'booking');
  $('#booking-venue-name').textContent = v.name;
  $('#booking-sport').textContent = sportLabel(v.sport).toUpperCase();
  $('#booking-location').textContent = `${v.district}, ${v.area} · Buka 08.00–22.00 WIB`;
  $('#booking-amenities').innerHTML = v.amenities.map(a => `<span class="amenity">${a}</span>`).join('');
  $('#booking-date').min = jakartaToday();
  $('#booking-date').value = filters.date >= jakartaToday() ? filters.date : jakartaToday();
  $('#duration').value = '1';
  clearErrors();
  renderSchedule();
  $('#booking-dialog').showModal();
  initializeGalleries();
  galleryPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scheduleGalleryAutoplay();
  $('#booking-dialog').scrollTop = 0;
}
function renderSchedule(preferredStart) {
  if (!selectedVenue) return;
  const date = $('#booking-date').value;
  const records = readBookings();
  const current = preferredStart === undefined ? $('#start-time').value : String(preferredStart);
  const available = HOURS.filter(h => slotStatus(selectedVenue, date, h, records) === 'available');
  $('#start-time').innerHTML = available.length
    ? '<option value="">Pilih jam main</option>' + available.map(h => `<option value="${h}">${clockLabel(h)} WIB</option>`).join('')
    : '<option value="">Tidak ada slot kosong</option>';
  $('#start-time').value = available.includes(Number(current)) ? current : '';
  $('#schedule-body').innerHTML = HOURS.map(h => {
    const status = slotStatus(selectedVenue, date, h, records);
    const hourlyPrice = calculatePrice(selectedVenue, h, 1).total;
    return `<tr data-hour="${h}"><td>${status === 'available' ? `<button class="time-button" type="button" data-time="${h}" aria-label="Pilih jam ${clockLabel(h)}">${clockLabel(h)}–${clockLabel(h+1)}</button>` : `${clockLabel(h)}–${clockLabel(h+1)}`}</td><td><span class="status ${status === 'available' ? 'available' : 'occupied'}">${status === 'available' ? 'Kosong' : status === 'passed' ? 'Lewat' : 'Terisi'}</span></td><td>${rupiah(hourlyPrice)}</td></tr>`;
  }).join('');
  updateSummary();
}
function validDuration(value) { return Number.isInteger(value) && value > 0 && value <= 14; }
function bookingIssue(date, start, duration, records = readBookings()) {
  if (!date || date < jakartaToday()) return 'Pilih tanggal main hari ini atau setelahnya.';
  if (!Number.isInteger(start) || start < 8 || start >= 22) return 'Pilih jam main yang tersedia terlebih dahulu.';
  if (!validDuration(duration)) return 'Lama main harus bilangan bulat lebih dari 0, maksimal 14 jam.';
  if (start + duration > 22) return 'Durasi melewati jam tutup 22.00 WIB. Kurangi lama main.';
  for (let h = start; h < start + duration; h++) {
    const status = slotStatus(selectedVenue, date, h, records);
    if (status === 'passed') return 'Waktu tersebut sudah lewat. Pilih jadwal lain.';
    if (status === 'occupied') return `Slot ${clockLabel(h)}–${clockLabel(h+1)} sudah terisi. Pilih jam lain atau kurangi durasi.`;
  }
  return '';
}
function updateSummary() {
  if (!selectedVenue) return;
  const rawStart = $('#start-time').value;
  const start = Number(rawStart);
  const duration = Number($('#duration').value);
  const usable = rawStart !== '' && validDuration(duration) && start + duration <= 22;
  const price = usable ? calculatePrice(selectedVenue, start, duration) : {subtotal:0,discount:0,total:0};
  $('#subtotal').textContent = rupiah(price.subtotal);
  $('#discount').textContent = `−${rupiah(price.discount)}`;
  $('#discount-row').hidden = !selectedVenue.promo;
  $('#booking-total').textContent = rupiah(price.total);
  $('#booking-period').textContent = usable ? `${dateLabel($('#booking-date').value)} · ${clockLabel(start)}–${clockLabel(start+duration)} WIB · ${duration} jam` : 'Pilih waktu dan durasi mainmu.';
  const issue = usable ? bookingIssue($('#booking-date').value, start, duration) : '';
  $('#booking-error').hidden = !issue;
  $('#booking-error').textContent = issue;
  document.querySelectorAll('[data-hour]').forEach(row => {
    const hour = Number(row.dataset.hour);
    row.classList.toggle('selected', usable && hour >= start && hour < start + duration);
  });
}
function fieldError(field, target, message) {
  $(field).setAttribute('aria-invalid', 'true');
  $(target).textContent = message;
}

// Kriteria proyek: cegah submit, validasi lama main > 0, lalu confirm().
$('#booking-form').addEventListener('submit', event => {
  event.preventDefault();
  clearErrors();
  const name = $('#customer-name').value.trim();
  const date = $('#booking-date').value;
  const start = Number($('#start-time').value);
  const duration = Number($('#duration').value);
  let firstInvalid;
  if (!name) { fieldError('#customer-name','#name-error','Nama pemesan wajib diisi.'); firstInvalid = $('#customer-name'); }
  if (!$('#start-time').value) { fieldError('#start-time','#time-error','Pilih jam main yang kosong.'); firstInvalid ||= $('#start-time'); }
  if (!validDuration(duration)) { fieldError('#duration','#duration-error','Lama main harus bilangan bulat lebih dari 0, maksimal 14 jam.'); firstInvalid ||= $('#duration'); }
  if (firstInvalid) { firstInvalid.focus(); return; }
  let issue = bookingIssue(date, start, duration);
  if (issue) { $('#booking-error').textContent = issue; $('#booking-error').hidden = false; $('#booking-error').focus(); return; }
  const price = calculatePrice(selectedVenue, start, duration);
  const confirmed = window.confirm(`Total sewa untuk ${duration} jam: ${rupiah(price.total)}.\n\n${selectedVenue.name}\n${dateLabel(date)}, ${clockLabel(start)}–${clockLabel(start+duration)} WIB\nNama: ${name}\n${selectedVenue.promo ? 'Promo 10% sudah termasuk.\n' : ''}\nIni reservasi demo, tanpa pembayaran nyata. Lanjutkan?`);
  if (!confirmed) return;
  // Baca ulang sebelum menyimpan, untuk mendeteksi reservasi dari tab lain.
  const records = readBookings();
  issue = bookingIssue(date, start, duration, records);
  if (issue) { renderSchedule(); $('#booking-error').textContent = issue; $('#booking-error').hidden = false; $('#booking-error').focus(); return; }
  const id = `MAIN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  const booking = {id,venueId:selectedVenue.id,name,date,start,duration,total:price.total,status:'active',createdAt:new Date().toISOString()};
  const persisted = saveBookings([...records, booking]);
  $('#booking-dialog').close();
  renderOrders();
  renderTicket(booking, persisted);
  $('#success-dialog').showModal();
});

function renderTicket(booking, persisted) {
  const venue = VENUES.find(v => v.id === booking.venueId);
  $('#success-dialog>p').textContent = persisted ? 'Bukti reservasi demo tersimpan di Booking saya.' : 'Penyimpanan browser tidak tersedia. Booking hanya tersimpan selama halaman ini terbuka.';
  $('#ticket-details').innerHTML = `<div><span>Kode booking</span><strong>${escapeHTML(booking.id)}</strong></div><div><span>Lapangan</span><strong>${venue.name}</strong></div><div><span>Pemesan</span><strong>${escapeHTML(booking.name)}</strong></div><div><span>Tanggal</span><strong>${dateLabel(booking.date)}</strong></div><div><span>Jam main</span><strong>${clockLabel(booking.start)}–${clockLabel(booking.start+booking.duration)} WIB</strong></div><div><span>Durasi</span><strong>${booking.duration} jam</strong></div><div class="ticket-total"><span>Total sewa</span><strong>${rupiah(booking.total)}</strong></div>`;
}
function renderOrders() {
  const records = [...readBookings()].reverse();
  const active = records.filter(b => b.status === 'active');
  $('#order-count').textContent = active.length;
  $('#order-count').hidden = active.length === 0;
  $('#orders-list').innerHTML = records.length ? records.map(b => {
    const venue = VENUES.find(v => v.id === b.venueId);
    const past = b.date < jakartaToday() || (b.date === jakartaToday() && b.start + b.duration <= jakartaHour());
    const label = b.status === 'cancelled' ? 'Dibatalkan' : past ? 'Selesai' : 'Terkonfirmasi';
    return `<article class="order-item"><div class="order-item-header"><div><h3>${venue.name}</h3><div class="order-id">${escapeHTML(b.id)}</div></div><span class="status ${b.status === 'cancelled' ? 'occupied' : 'available'}">${label}</span></div><p>${dateLabel(b.date)} · ${clockLabel(b.start)}–${clockLabel(b.start+b.duration)} WIB · ${b.duration} jam</p><p>Pemesan: ${escapeHTML(b.name)} · ${venue.area}</p><div class="order-item-footer"><strong>${rupiah(b.total)}</strong>${b.status === 'active' && !past ? `<button class="text-button cancel-button" data-cancel="${escapeHTML(b.id)}">Batalkan booking</button>` : '<span class="field-hint">Reservasi demo</span>'}</div></article>`;
  }).join('') : `<div class="orders-empty"><span>${icon('ticket')}</span><h3>Belum ada waktu main?</h3><p>Lapangan pilihanmu menunggu. Yuk, buat booking pertama.</p><button class="button button-primary" id="empty-find-court">Cari lapangan ${icon('arrow-up-right')}</button></div>`;
}
function showPromo() {
  filters.promo = true;
  renderVenues();
  scrollToVenues();
  showToast('Menampilkan lapangan dengan promo 10%.');
}

$('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!$('#search-date').value || $('#search-date').value < jakartaToday()) { $('#search-date').min = jakartaToday(); $('#search-date').reportValidity(); return; }
  filters.area = $('#location-filter').value;
  filters.sport = $('#sport-filter').value;
  filters.date = $('#search-date').value;
  renderVenues();
  scrollToVenues();
});
document.querySelectorAll('[data-sport]').forEach(button => button.addEventListener('click', () => {
  filters.sport = button.dataset.sport;
  $('#sport-filter').value = filters.sport;
  renderVenues();
}));
$('#promo-filter').addEventListener('click', () => { filters.promo = !filters.promo; renderVenues(); });
$('#sort-filter').addEventListener('change', event => { filters.sort = event.target.value; renderVenues(); });
$('#reset-filters').addEventListener('click', () => {
  filters = {area:'all',sport:'all',date:jakartaToday(),promo:false,sort:'recommended'};
  $('#location-filter').value = 'all'; $('#sport-filter').value = 'all'; $('#search-date').value = filters.date; $('#sort-filter').value = 'recommended';
  renderVenues();
});
$('#show-promo').addEventListener('click', showPromo);
$('#venue-grid').addEventListener('click', event => {
  if (handleGalleryNavigation(event)) return;
  const book = event.target.closest('[data-book]');
  if (book) { openBooking(book.dataset.book); return; }
  const favorite = event.target.closest('[data-favorite]');
  if (favorite) {
    const id = favorite.dataset.favorite;
    const removing = favorites.includes(id);
    favorites = removing ? favorites.filter(v => v !== id) : [...favorites,id];
    try { localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites)); } catch { /* Favorit sesi tetap aktif. */ }
    favorite.setAttribute('aria-pressed', String(!removing));
    showToast(removing ? 'Lapangan dihapus dari favorit.' : 'Lapangan disimpan ke favorit.');
  }
});
$('#booking-gallery').addEventListener('click', handleGalleryNavigation);
$('#schedule-body').addEventListener('click', event => {
  const button = event.target.closest('[data-time]');
  if (button) { $('#start-time').value = button.dataset.time; clearErrors(); updateSummary(); }
});
$('#booking-date').addEventListener('change', () => {
  clearErrors();
  if (!$('#booking-date').value || $('#booking-date').value < jakartaToday()) {
    $('#booking-date').value = jakartaToday();
    showToast('Tanggal main tidak boleh sebelum hari ini.');
  }
  renderSchedule();
});
$('#start-time').addEventListener('change', () => { clearErrors(); updateSummary(); });
$('#duration').addEventListener('input', () => { clearErrors(); updateSummary(); });
$('#customer-name').addEventListener('input', () => { $('#name-error').textContent = ''; $('#customer-name').removeAttribute('aria-invalid'); });
$('#increase-duration').addEventListener('click', () => { $('#duration').value = Math.min(14, (Number($('#duration').value) || 0) + 1); clearErrors(); updateSummary(); });
$('#decrease-duration').addEventListener('click', () => { $('#duration').value = Math.max(1, (Number($('#duration').value) || 1) - 1); clearErrors(); updateSummary(); });
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => { $(`#${button.dataset.close}`).close(); }));
// Backdrop dapat diklik; klik pada isi dialog tidak menutupnya.
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
}));
$('#orders-button').addEventListener('click', () => { renderOrders(); $('#orders-dialog').showModal(); });
$('#view-orders').addEventListener('click', () => { $('#success-dialog').close(); renderOrders(); $('#orders-dialog').showModal(); });
$('#orders-list').addEventListener('click', event => {
  if (event.target.closest('#empty-find-court')) { $('#orders-dialog').close(); scrollToVenues(); return; }
  const cancel = event.target.closest('[data-cancel]');
  if (!cancel) return;
  if (!window.confirm('Batalkan reservasi demo ini? Slot main akan tersedia kembali.')) return;
  const records = readBookings().map(b => b.id === cancel.dataset.cancel ? {...b,status:'cancelled'} : b);
  const persisted = saveBookings(records);
  renderOrders();
  if (selectedVenue) renderSchedule();
  showToast(persisted ? 'Booking dibatalkan. Slot tersedia kembali.' : 'Booking dibatalkan untuk sesi ini. Penyimpanan browser tidak tersedia.');
});
window.addEventListener('storage', event => {
  if (event.key === STORAGE_KEY) { renderOrders(); if ($('#booking-dialog').open) renderSchedule(); }
});

hydrateIcons();
$('#search-date').min = jakartaToday();
$('#search-date').value = filters.date;
$('#copyright-year').textContent = new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Jakarta',year:'numeric'}).format(new Date());
renderVenues();
renderOrders();
updateActiveNavigation();
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('motion-enabled');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
