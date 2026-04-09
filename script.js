/* ─────────────────────────────────────────────
   Bennett Schiff — script.js
   ───────────────────────────────────────────── */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Canvas dot field ── */
const canvas = document.getElementById('field');
const ctx    = canvas.getContext('2d');

const SPACING  = 44;
const DOT_R    = 1.4;
const REPEL_R  = 130;
const REPEL_F  = 0.38;
const FRICTION = 0.82;
const SPRING   = 0.072;

let W, H, dots = [], mouse = { x: -9999, y: -9999 };

function buildGrid() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;

    const cols = Math.ceil(W / SPACING) + 1;
    const rows = Math.ceil(H / SPACING) + 1;

    dots = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dots.push({
                ox: c * SPACING,
                oy: r * SPACING,
                x:  c * SPACING,
                y:  r * SPACING,
                vx: 0,
                vy: 0,
            });
        }
    }
}

function drawDots() {
    ctx.clearRect(0, 0, W, H);

    for (const d of dots) {
        // Spring back to origin
        d.vx += (d.ox - d.x) * SPRING;
        d.vy += (d.oy - d.y) * SPRING;

        if (!prefersReducedMotion) {
            // Mouse repulsion
            const dx = d.x - mouse.x;
            const dy = d.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < REPEL_R && dist > 0) {
                const force = (1 - dist / REPEL_R) * REPEL_F;
                d.vx += (dx / dist) * force * REPEL_R * 0.08;
                d.vy += (dy / dist) * force * REPEL_R * 0.08;
            }
        }

        d.vx *= FRICTION;
        d.vy *= FRICTION;
        d.x  += d.vx;
        d.y  += d.vy;

        // Brightness based on displacement
        const disp = Math.hypot(d.x - d.ox, d.y - d.oy);
        const alpha = 0.13 + Math.min(disp / 28, 1) * 0.52;

        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
    }

    requestAnimationFrame(drawDots);
}

buildGrid();
drawDots();

window.addEventListener('resize', () => {
    buildGrid();
}, { passive: true });

/* ── Mouse / touch tracking ── */
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }
}, { passive: true });

window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
}, { passive: true });

/* ── Orbs via createAnimatable ── */
if (!prefersReducedMotion && typeof anime !== 'undefined') {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;

    const orbA = anime.createAnimatable('#orb-a', {
        x: { duration: 280,  ease: 'out(4)' },
        y: { duration: 280,  ease: 'out(4)' },
    });
    const orbB = anime.createAnimatable('#orb-b', {
        x: { duration: 720,  ease: 'out(3)' },
        y: { duration: 720,  ease: 'out(3)' },
    });
    const orbC = anime.createAnimatable('#orb-c', {
        x: { duration: 1450, ease: 'out(2)' },
        y: { duration: 1450, ease: 'out(2)' },
    });

    // Start at screen center
    orbA.x(cx); orbA.y(cy);
    orbB.x(cx); orbB.y(cy);
    orbC.x(cx); orbC.y(cy);

    window.addEventListener('mousemove', (e) => {
        orbA.x(e.clientX); orbA.y(e.clientY);
        orbB.x(e.clientX); orbB.y(e.clientY);
        orbC.x(e.clientX); orbC.y(e.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const tx = e.touches[0].clientX;
            const ty = e.touches[0].clientY;
            orbA.x(tx); orbA.y(ty);
            orbB.x(tx); orbB.y(ty);
            orbC.x(tx); orbC.y(ty);
        }
    }, { passive: true });
}

/* ── Hero name: split into chars + spring-in ── */
function splitChars(lineEl) {
    const text = lineEl.textContent;
    lineEl.innerHTML = text
        .split('')
        .map(ch => `<span class="char">${ch === ' ' ? '&nbsp;' : ch}</span>`)
        .join('');
    return lineEl.querySelectorAll('.char');
}

function animateName() {
    const lines = document.querySelectorAll('.name-line');
    let allChars = [];

    lines.forEach(line => {
        const chars = splitChars(line);
        allChars = [...allChars, ...chars];
    });

    if (prefersReducedMotion) {
        allChars.forEach(c => { c.style.opacity = 1; c.style.transform = 'none'; });
        return;
    }

    anime.animate(allChars, {
        translateY: ['1.05em', 0],
        opacity:    [0, 1],
        delay:      anime.stagger(55, { start: 120 }),
        duration:   1100,
        easing:     'spring(1, 72, 9, 0)',
    });

    // Char hover bounce — attach after chars exist
    allChars.forEach((ch) => {
        ch.addEventListener('mouseenter', () => {
            anime.animate(ch, {
                translateY: [0, '-0.18em', 0],
                duration:   600,
                easing:     'spring(1, 80, 10, 0)',
            });
        });
    });
}

// Run on DOMContentLoaded (fonts preloaded via <link>)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateName);
} else {
    animateName();
}
