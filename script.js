// Photos: if an image file hasn't been added yet, show a labeled placeholder box instead.
// It also tries other common endings (.jpeg, .png, .JPG...) so a photo still shows if it was saved that way.
// Galleries: missing photos are simply left out, and the grid adapts to how many remain
const sizeGallery = (g) => {
  const n = g.querySelectorAll('.ph').length;
  g.dataset.count = n;
  if (n === 0) g.closest('section')?.remove();
};
document.querySelectorAll('.gallery').forEach(sizeGallery);
// Captions: add data-caption="..." to a gallery photo
document.querySelectorAll('.gallery .ph[data-caption]').forEach((ph) => {
  const c = document.createElement('span'); c.className = 'caption'; c.textContent = ph.dataset.caption; ph.appendChild(c);
});
const EXTS = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG'];
document.querySelectorAll('.ph img').forEach((img) => {
  const box = img.closest('.ph');
  const base = img.getAttribute('src').replace(/\.[^./]+$/, '');
  let i = 0;
  const tryNext = () => {
    i += 1;
    if (i < EXTS.length) img.src = `${base}.${EXTS[i]}`;
    else if (box.closest('.gallery')) { const g = box.closest('.gallery'); box.remove(); sizeGallery(g); }
    else { img.remove(); box.classList.add('empty'); }
  };
  img.addEventListener('error', tryNext);
  if (img.complete && img.naturalWidth === 0) tryNext();
});

// Fade things in as they scroll into view
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => {
  if (el.classList.contains('reveal')) {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 6) * 80}ms`;
  }
  io.observe(el);
});

// Thin line under the menu once you scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('solid', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// Background video in the top banner: only shown once the file actually loads
const bannerVideo = document.querySelector('.banner-video');
if (bannerVideo) {
  const banner = bannerVideo.closest('.banner');
  // If the video can't load, the poster photo stays up. Reduced-motion users just see the photo.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { bannerVideo.removeAttribute('autoplay'); bannerVideo.pause(); }
  // Don't download the video on wide screens, where it's hidden
  if (matchMedia('(min-aspect-ratio: 1/1)').matches) { bannerVideo.removeAttribute('autoplay'); bannerVideo.preload = 'none'; bannerVideo.pause(); }
}

// Email: assembled here instead of written in the page, so spam bots scanning the HTML can't read it
const mail = ['ude', 'uso'].map((x) => x.split('').reverse().join('')).reverse().join('.');
const addr = ['goodhue', 'cocom.1'].join('-') + String.fromCharCode(64) + mail;
document.querySelectorAll('.js-email').forEach((a) => { a.href = 'mai' + 'lto:' + addr; });
document.querySelectorAll('.js-email-text').forEach((el) => { el.textContent = addr; });

const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
