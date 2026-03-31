/* ============================================
   NAV scroll effect
   ============================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ============================================
   MOBILE MENU
   ============================================ */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function setMenu(open) {
    menuOpen = open;
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const [s1, s2] = navToggle.querySelectorAll('span');
    s1.style.transform = open ? 'rotate(45deg) translate(3.5px, 3.5px)' : '';
    s2.style.transform = open ? 'rotate(-45deg) translate(3.5px, -3.5px)' : '';
}

navToggle.addEventListener('click', () => setMenu(!menuOpen));
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => setMenu(false)));

/* ============================================
   SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
});

/* ============================================
   HERO GLITCH on hover
   ============================================ */
const heroName = document.getElementById('heroName');
if (heroName) {
    heroName.dataset.text = 'BENNETT\nSCHIFF.';
    let glitchTimeout;
    heroName.addEventListener('mouseenter', () => {
        heroName.classList.add('glitching');
        clearTimeout(glitchTimeout);
        glitchTimeout = setTimeout(() => heroName.classList.remove('glitching'), 300);
    });
}

/* ============================================
   STAT COUNTERS (HUD)
   ============================================ */
let statsAnimated = false;

function countUp(el, prefix, end, suffix, duration = 1400) {
    const start = performance.now();
    function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + Math.round(eased * end) + suffix;
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        document.querySelectorAll('.hud-num').forEach(el => {
            countUp(el, el.dataset.prefix, +el.dataset.target, el.dataset.suffix);
        });
        document.querySelectorAll('.hud-fill').forEach(el => {
            el.style.width = el.dataset.w + '%';
        });
    }
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObs.observe(statsSection);

/* ============================================
   ACHIEVEMENT TOASTS
   ============================================ */
const achData = [
    { emoji: '💰', name: 'Revenue Machine' },
    { emoji: '🤝', name: 'Network Effect' },
    { emoji: '🎤', name: 'Event Lord' },
    { emoji: '📈', name: 'Lead Gen Legend' },
    { emoji: '✍️', name: 'The Closer' },
    { emoji: '🖥️', name: 'Platform Whisperer' },
    { emoji: '🚀', name: 'Launch Crew' },
    { emoji: '🤖', name: 'AI Powered' },
];

function showToast(index) {
    const d = achData[index];
    if (!d) return;
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="toast-emoji">${d.emoji}</span>
        <div class="toast-text">
            <span class="toast-label">Achievement Unlocked</span>
            <span class="toast-name">${d.name}</span>
        </div>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3200);
}

let achToastsShown = false;
const achObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !achToastsShown) {
        achToastsShown = true;
        [0, 2, 7].forEach((i, offset) => setTimeout(() => showToast(i), offset * 1100));
    }
}, { threshold: 0.2 });

const achSection = document.getElementById('achievements');
if (achSection) achObs.observe(achSection);

/* ============================================
   ACHIEVEMENT CARDS — staggered reveal
   ============================================ */
const achCardObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.ach-card').forEach((card, i) => {
                setTimeout(() => card.classList.add('visible'), i * 80);
            });
            achCardObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const achGrid = document.querySelector('.ach-grid');
if (achGrid) achCardObs.observe(achGrid);

/* ============================================
   SKILL BARS — animate on scroll
   ============================================ */
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
                setTimeout(() => { fill.style.width = fill.dataset.w + '%'; }, i * 80);
            });
            skillObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

const skillTree = document.querySelector('.skill-tree');
if (skillTree) skillObs.observe(skillTree);

/* ============================================
   GENERIC SCROLL REVEAL
   ============================================ */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
