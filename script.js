/* ============================================
   NAV: backdrop blur on scroll
   ============================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
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
    if (open) {
        s1.style.transform = 'rotate(45deg) translate(3.5px, 3.5px)';
        s2.style.transform = 'rotate(-45deg) translate(3.5px, -3.5px)';
    } else {
        s1.style.transform = '';
        s2.style.transform = '';
    }
}

navToggle.addEventListener('click', () => setMenu(!menuOpen));
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => setMenu(false)));

/* ============================================
   SCROLL REVEAL
   ============================================ */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ============================================
   SMOOTH SCROLL for anchor links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ============================================
   STAT COUNT-UP ANIMATION
   ============================================ */
const statData = [
    { prefix: '$', value: 2, suffix: 'M+' },
    { prefix: '',  value: 45, suffix: '' },
    { prefix: '$', value: 550, suffix: 'K+' },
    { prefix: '',  value: 125, suffix: '+' },
];

const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

function countUp(el, prefix, end, suffix) {
    const duration = 1400;
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.innerHTML = prefix + Math.round(eased * end) + '<span class="stat-plus">' + suffix + '</span>';
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNums.forEach((el, i) => {
            const d = statData[i];
            if (d) countUp(el, d.prefix, d.value, d.suffix);
        });
    }
}, { threshold: 0.4 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObs.observe(statsSection);
