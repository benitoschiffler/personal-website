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
   GLITCH on name hover
   ============================================ */
const heroName = document.getElementById('heroName');
if (heroName) {
    heroName.dataset.text = heroName.innerText;
    let glitchTimeout;
    heroName.addEventListener('mouseenter', () => {
        heroName.classList.add('glitching');
        clearTimeout(glitchTimeout);
        glitchTimeout = setTimeout(() => heroName.classList.remove('glitching'), 300);
    });
}

/* ============================================
   SCROLL REVEAL
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

/* ============================================
   RISK TABLE — staggered row reveal
   ============================================ */
const riskObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.risk-row').forEach((row, i) => {
                setTimeout(() => {
                    row.style.opacity = '1';
                    row.style.transform = 'translateY(0)';
                }, i * 60);
            });
            riskObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const riskTable = document.querySelector('.risk-table');
if (riskTable) {
    riskTable.querySelectorAll('.risk-row').forEach(row => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    riskObs.observe(riskTable);
}
