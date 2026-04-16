/* ─────────────────────────────────────────────
   work.js — gallery page: orbs + tabs + lightbox
   ───────────────────────────────────────────── */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Atmospheric orbs ── */
if (!prefersReducedMotion && typeof anime !== 'undefined') {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;

    const orbA = anime.createAnimatable('#orb-a', { x: { duration: 280,  ease: 'out(4)' }, y: { duration: 280,  ease: 'out(4)' } });
    const orbB = anime.createAnimatable('#orb-b', { x: { duration: 720,  ease: 'out(3)' }, y: { duration: 720,  ease: 'out(3)' } });
    const orbC = anime.createAnimatable('#orb-c', { x: { duration: 1450, ease: 'out(2)' }, y: { duration: 1450, ease: 'out(2)' } });

    orbA.x(cx); orbA.y(cy);
    orbB.x(cx); orbB.y(cy);
    orbC.x(cx); orbC.y(cy);

    window.addEventListener('mousemove', (e) => {
        orbA.x(e.clientX); orbA.y(e.clientY);
        orbB.x(e.clientX); orbB.y(e.clientY);
        orbC.x(e.clientX); orbC.y(e.clientY);
    }, { passive: true });
}

/* ── Year tabs ── */
const tabs     = document.querySelectorAll('.year-tab');
const sections = document.querySelectorAll('.year-section');

function activateYear(year) {
    tabs.forEach(t => {
        const isActive = t.dataset.year === year;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', String(isActive));
    });

    sections.forEach(s => {
        const isActive = s.id === `year-${year}`;
        s.classList.toggle('active', isActive);
        if (isActive) s.removeAttribute('hidden');
        else          s.setAttribute('hidden', '');

        if (isActive && !prefersReducedMotion && typeof anime !== 'undefined') {
            anime.animate(s.querySelectorAll('.photo'), {
                opacity:    [0, 1],
                translateY: [18, 0],
                delay:      anime.stagger(55, { start: 80 }),
                duration:   520,
                easing:     'out(3)',
            });
        }
    });
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => activateYear(tab.dataset.year));
});

// Animate initial grid in
if (!prefersReducedMotion && typeof anime !== 'undefined') {
    anime.animate('.year-section.active .photo', {
        opacity:    [0, 1],
        translateY: [20, 0],
        delay:      anime.stagger(65, { start: 150 }),
        duration:   580,
        easing:     'out(3)',
    });
}

/* ── Lightbox ── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');

let activePhotos = [];
let activeIndex  = 0;

function openLightbox(photos, index) {
    activePhotos = photos;
    activeIndex  = index;
    lbImg.src = photos[index].src;
    lbImg.alt = photos[index].alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflowY = 'hidden';
    lbClose.focus();
}

function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflowY = '';
}

function showAdjacentPhoto(dir) {
    activeIndex = (activeIndex + dir + activePhotos.length) % activePhotos.length;
    lbImg.style.opacity = '0';
    // Small delay so fade-out plays before src swap
    setTimeout(() => {
        lbImg.src = activePhotos[activeIndex].src;
        lbImg.alt = activePhotos[activeIndex].alt;
        lbImg.style.opacity = '1';
    }, 130);
}

// Click any photo to open
document.querySelectorAll('.photo-grid').forEach(grid => {
    grid.addEventListener('click', (e) => {
        if (!e.target.matches('.photo')) return;
        const photos = [...grid.querySelectorAll('.photo')];
        openLightbox(photos, photos.indexOf(e.target));
    });
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click',  () => showAdjacentPhoto(-1));
lbNext.addEventListener('click',  () => showAdjacentPhoto(+1));

// Click backdrop to close
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showAdjacentPhoto(-1);
    if (e.key === 'ArrowRight')  showAdjacentPhoto(+1);
});
