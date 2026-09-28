const works = [
  { title: '银拱落入雪山', file: '银拱落入雪山.webp', meta: 'NO. 01 / ASTROSCAPE', ratio: 2.143, level: 'hero' },
  { title: '双拱如玉', file: '双拱如玉.webp', meta: 'NO. 02 / MILKY WAY', ratio: 1.673, level: 'featured' },
  { title: '星河流转', file: '星河流转.webp', meta: 'NO. 03 / STAR TRAILS', ratio: 1.5, level: 'featured' },
  { title: '星落古寨', file: '星落古寨.webp', meta: 'NO. 04 / UNDER THE STARS', ratio: 1.102, level: 'featured' },
  { title: '银河下的我们', file: '银河下的我们.webp', meta: 'NO. 05 / NIGHT WALK', ratio: 0.667, level: 'standard' },
  { title: '山脊流星', file: '山脊流星.webp', meta: 'NO. 06 / METEOR', ratio: 0.667, level: 'standard' },
  { title: '栈道星桥', file: '栈道星桥.webp', meta: 'NO. 07 / NIGHT PATH', ratio: 1.675, level: 'supporting' },
  { title: '檐上流年', file: '檐上流年.webp', meta: 'NO. 08 / OLD ROOFTOPS', ratio: 1.5, level: 'supporting' },
  { title: '草原星夜', file: '草原星夜.webp', meta: 'NO. 09 / OPEN FIELD', ratio: 1.5, level: 'supporting' },
  { title: '冬季星河', file: '冬季星河.webp', meta: 'NO. 10 / WINTER SKY', ratio: 1.5, level: 'supporting' },
];

const gallery = document.querySelector('#gallery');
gallery.innerHTML = works.map((work, i) => `
  <button class="gallery-item ${work.level === 'supporting' ? 'is-supporting' : ''} ${work.level === 'featured' ? 'is-featured' : ''} ${work.level === 'hero' ? 'is-gallery-hero' : ''}" type="button" data-index="${i}" aria-label="查看作品：${work.title}">
    <img src="assets/works/${work.file}" alt="${work.title}" width="${Math.round(work.ratio * 1000)}" height="1000" loading="lazy" decoding="async" draggable="false">
    <span class="gallery-open">VIEW FRAME ↗</span>
    ${work.level === 'hero' || work.level === 'featured' ? '<span class="gallery-rank">SELECTED</span>' : ''}
    <span class="gallery-caption"><span class="gallery-title">${work.title}</span><span class="gallery-meta">${work.meta}</span></span>
  </button>`).join('');

function arrangeGallery() {
  const columns = getComputedStyle(gallery).gridTemplateColumns.split(' ').length;
  const gap = parseFloat(getComputedStyle(gallery).columnGap) || 0;
  const rowHeight = parseFloat(getComputedStyle(gallery).gridAutoRows) || 8;
  const columnWidth = (gallery.clientWidth - gap * (columns - 1)) / columns;
  gallery.querySelectorAll('.gallery-item').forEach((item, index) => {
    const ratio = works[index].ratio;
    const level = works[index].level;
    const span = level === 'hero' ? columns : (level === 'featured' && columns > 2 ? 2 : 1);
    const width = columnWidth * span + gap * (span - 1);
    const height = width / ratio;
    const rows = Math.max(1, Math.ceil((height + gap) / (rowHeight + gap)));
    item.style.setProperty('--gallery-span', span);
    item.style.setProperty('--gallery-rows', rows);
  });
}
arrangeGallery();
window.addEventListener('resize', arrangeGallery, { passive: true });

document.addEventListener('contextmenu', (event) => {
  if (event.target.closest('img, .gallery-item, .hero-image-wrap, .overview-photo')) event.preventDefault();
});
document.addEventListener('dragstart', (event) => {
  if (event.target.closest('img')) event.preventDefault();
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxTitle = lightbox.querySelector('.lightbox-title');
const lightboxCount = lightbox.querySelector('.lightbox-count');
let activeIndex = 0;
let lastFocused = null;

function showWork(index) {
  activeIndex = (index + works.length) % works.length;
  const work = works[activeIndex];
  lightboxImage.src = `assets/works/${work.file}`;
  lightboxImage.alt = work.title;
  lightboxTitle.textContent = work.title;
  lightboxCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(works.length).padStart(2, '0')}`;
}
function openLightbox(index) {
  lastFocused = document.activeElement;
  showWork(index);
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox-close').focus();
}
function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocused?.focus();
}

gallery.addEventListener('click', (event) => {
  const item = event.target.closest('.gallery-item');
  if (item) openLightbox(Number(item.dataset.index));
});
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showWork(activeIndex - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showWork(activeIndex + 1));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showWork(activeIndex - 1);
  if (event.key === 'ArrowRight') showWork(activeIndex + 1);
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '关闭导航' : '打开导航');
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const progress = document.querySelector('.scroll-progress');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = ['home', 'projects', 'photography'].map((id) => document.getElementById(id));
let scrollTicking = false;
function updateScrollState() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
  const marker = window.scrollY + window.innerHeight * 0.34;
  let current = 0;
  sections.forEach((section, index) => { if (section.offsetTop <= marker) current = index; });
  navLinks.forEach((link, index) => link.classList.toggle('is-active', index === current));
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollState);
    scrollTicking = true;
  }
}, { passive: true });
updateScrollState();
