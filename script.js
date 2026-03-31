const body = document.body;
const portal = document.getElementById("portal");
const doorButton = document.getElementById("doorButton");
const siteNav = document.getElementById("siteNav");
const cursorGlow = document.getElementById("cursorGlow");
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");
const themeButtons = document.querySelectorAll(".theme-switch");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

body.dataset.theme = "sunset";

if (!prefersReducedMotion) {
    body.style.overflow = "hidden";
}

function openPortal() {
    if (!portal || portal.classList.contains("is-opening")) {
        return;
    }

    portal.classList.add("is-opening");
    body.classList.add("portal-open");
    body.style.overflow = "";

    window.setTimeout(() => {
        portal.classList.add("is-open");
        portal.setAttribute("aria-hidden", "true");
    }, prefersReducedMotion ? 0 : 1150);
}

if (doorButton) {
    doorButton.addEventListener("click", openPortal);
}

window.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        if (document.activeElement === doorButton) {
            event.preventDefault();
            openPortal();
        }
    }
});

window.addEventListener("scroll", () => {
    if (siteNav) {
        siteNav.classList.toggle("scrolled", window.scrollY > 20);
    }
}, { passive: true });

function setMenu(open) {
    if (!navToggle || !mobileMenu) {
        return;
    }

    navToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.classList.toggle("open", open);

    const bars = navToggle.querySelectorAll("span");
    if (bars.length === 2) {
        bars[0].style.transform = open ? "translateY(7px) rotate(45deg)" : "";
        bars[1].style.transform = open ? "translateY(-7px) rotate(-45deg)" : "";
    }
}

if (navToggle) {
    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        setMenu(!isOpen);
    });
}

document.querySelectorAll(".mob-link, .nav-links a, .brand, .btn").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
});

document.querySelectorAll("[data-tilt-card]").forEach((card) => {
    if (prefersReducedMotion) {
        return;
    }

    card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 10;
        const rotateX = (0.5 - py) * 8;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
    });
});

function formatCount(value, prefix = "", suffix = "") {
    let displayValue;

    if (value >= 1000000) {
        displayValue = `${Math.round(value / 100000) / 10}M`;
    } else if (value >= 1000) {
        displayValue = `${Math.round(value / 1000)}K`;
    } else {
        displayValue = `${Math.round(value)}`;
    }

    return `${prefix}${displayValue}${suffix}`;
}

const signalObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.querySelectorAll(".signal-value").forEach((node) => {
            const total = Number(node.dataset.count || 0);
            const prefix = node.dataset.prefix || "";
            const suffix = node.dataset.suffix || "";
            const startTime = performance.now();
            const duration = prefersReducedMotion ? 10 : 1400;

            function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                node.textContent = formatCount(total * eased, prefix, progress >= 1 ? suffix : "");

                if (progress < 1) {
                    window.requestAnimationFrame(tick);
                }
            }

            window.requestAnimationFrame(tick);
        });

        signalObserver.unobserve(entry.target);
    });
}, { threshold: 0.25 });

document.querySelectorAll(".signal-board").forEach((board) => {
    signalObserver.observe(board);
});

themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        themeButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        body.dataset.theme = button.dataset.theme;
    });
});

if (cursorGlow && !prefersReducedMotion) {
    window.addEventListener("pointermove", (event) => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    });
}

if (prefersReducedMotion) {
    openPortal();
}
