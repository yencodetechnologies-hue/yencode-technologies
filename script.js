// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;

if (menuToggle && nav) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = nav.classList.toggle('active');
        if (menuIcon) {
            menuIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        }
    });

    // Close menu when clicking a nav link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            if (menuIcon) menuIcon.className = 'fa-solid fa-bars';
            // Force active state and indicator update on click
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateNavIndicator(link);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            if (menuIcon) menuIcon.className = 'fa-solid fa-bars';
        }
    });
}

// NAVBAR EFFECT
const navbar = document.getElementById("navbar");
const navIndicator = document.querySelector('.nav-indicator');
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');

function updateNavIndicator(activeLink) {
    if (!navIndicator || !activeLink) return;

    // Only show indicator on desktop (or when menu is not in mobile stack mode if preferred)
    if (window.innerWidth > 768) {
        navIndicator.style.opacity = '1';
        navIndicator.style.width = `${activeLink.offsetWidth}px`;
        navIndicator.style.left = `${activeLink.offsetLeft}px`;
    } else {
        navIndicator.style.opacity = '0';
    }
}

function scrollSpy() {
    let currentSectionId = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 150)) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentSectionId)) {
            link.classList.add('active');
            updateNavIndicator(link);
        }
    });
}

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
    scrollSpy();
});

// Initial call and resize handler
window.addEventListener('resize', () => {
    const activeLink = document.querySelector('nav a.active');
    updateNavIndicator(activeLink);
});
scrollSpy();

// COUNT UP ANIMATION
const counts = document.querySelectorAll('.count-up');
counts.forEach(count => {
    const target = parseInt(count.getAttribute('data-target'));
    gsap.to(count, {
        innerText: target,
        duration: 2,
        ease: "power2.out",
        snap: { innerText: 1 },
        scrollTrigger: {
            trigger: count,
            start: "top 95%",
            toggleActions: "restart none none none",
            onEnter: () => gsap.to(count, { innerText: target, duration: 2, ease: "power2.out", snap: { innerText: 1 } }),
            onEnterBack: () => gsap.to(count, { innerText: target, duration: 2, ease: "power2.out", snap: { innerText: 1 } })
        }
    });
});

// GSAP ANIMATION
gsap.registerPlugin(ScrollTrigger)

// Specialized heading reveal
gsap.utils.toArray('.section-content h2, .section-content h3, .section-title').forEach(el => {
    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => el.classList.add('revealed'),
        toggleActions: "play none none none"
    });
});

// Scroll-based reveal (Vertical)
gsap.utils.toArray('.reveal:not(h2):not(.section-title)').forEach(el => {
    gsap.from(el, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: "restart none none none"
        }
    })
})

// Scroll-based reveal (Horizontal Left)
gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.from(el, {
        opacity: 0,
        x: -80,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: "restart none none none"
        }
    })
})

// Scroll-based reveal (Horizontal Right)
gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.from(el, {
        opacity: 0,
        x: 80,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: "restart none none none"
        }
    })
})

// ═══════════ PARTICLES ═══════════
const canvas = document.getElementById('globe-canvas');
const ctx = canvas.getContext('2d');
let CX, CY;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    CX = canvas.width / 2;
    CY = canvas.height / 2;
}
window.addEventListener('resize', resize);
resize();

let aT = 0; // Declaration moved to top
const pts = [];
const numPts = 800;

// Shape Generators
function createSphere(p) {
    const phi = Math.acos(-1 + (2 * p.i) / numPts);
    const theta = Math.sqrt(numPts * Math.PI) * phi;
    return {
        x: 190 * Math.cos(theta) * Math.sin(phi),
        y: 190 * Math.sin(theta) * Math.sin(phi),
        z: 190 * Math.cos(phi)
    };
}

function createCube(p) {
    const side = 260;
    const r = () => (Math.random() - 0.5) * side;
    const face = p.i % 6;
    let x = 0, y = 0, z = 0;
    if (face === 0) { x = side / 2; y = r(); z = r(); }
    if (face === 1) { x = -side / 2; y = r(); z = r(); }
    if (face === 2) { x = r(); y = side / 2; z = r(); }
    if (face === 3) { x = r(); y = -side / 2; z = r(); }
    if (face === 4) { x = r(); y = r(); z = side / 2; }
    if (face === 5) { x = r(); y = r(); z = -side / 2; }
    return { x, y, z };
}

function createTorus(p) {
    const R = 150, r = 70;
    const u = p.i / numPts * Math.PI * 2 * 2.5;
    const v = p.i / numPts * Math.PI * 2 * 6;
    const x = (R + r * Math.cos(v)) * Math.cos(u);
    const y = (R + r * Math.cos(v)) * Math.sin(u);
    const z = r * Math.sin(v);
    return { x, y, z };
}

function createHelix(p) {
    const turns = 7, radius = 120, height = 420;
    const t = p.i / numPts * Math.PI * 2 * turns;
    const prog = p.i / numPts;
    const x = radius * Math.cos(t + prog * 1.5);
    const y = (prog - 0.5) * height;
    const z = radius * Math.sin(t + prog * 1.5);
    return { x, y, z };
}

function createIcosahedron(p) {
    const t = (1 + Math.sqrt(5)) / 2;
    const s = 160;
    const vertices = [
        0, 1, t, 0, 1, -t, 0, -1, t, 0, -1, -t, 1, t, 0, 1, -t, 0, -1, t, 0, -1, -t, 0,
        t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, -1
    ].map(v => v * s);
    const idx = p.i % (vertices.length / 3);
    return {
        x: vertices[idx * 3],
        y: vertices[idx * 3 + 1],
        z: vertices[idx * 3 + 2]
    };
}

function createGlowChart(p) {
    const numBars = 9, ptsPerBar = Math.floor(numPts / numBars);
    const barIdx = Math.floor(p.i / ptsPerBar);
    const idxInBar = p.i % ptsPerBar;
    const x = (barIdx - 4) * 42;
    const heights = [0.38, 0.62, 0.78, 0.95, 1.0, 0.88, 0.72, 0.55, 0.4];
    const h = heights[barIdx] * 340;
    let y = (idxInBar / (ptsPerBar - 1)) * h - h / 2;
    y += Math.sin(aT * 3 + p.i * 0.1) * 12;
    const z = (Math.random() - 0.5) * 25 + Math.sin(aT * 1.2 + x * 0.04) * 8;
    return { x, y, z };
}

function createKnot(p) {
    const R = 130, q = 3, pk = 5;
    const t = p.i / numPts * Math.PI * 2 * 3;
    const x = R * (Math.cos(pk * t) + 2) * Math.cos(q * t);
    const y = R * (Math.cos(pk * t) + 2) * Math.sin(q * t);
    const z = R * Math.sin(pk * t);
    return { x, y, z };
}

function createDiamond(p) {
    const m = 200;
    const u = Math.random(), v = Math.random() * (1 - u), w = 1 - u - v;
    const sx = (p.i % 2 ? 1 : -1), sy = ((p.i >> 1) % 2 ? 1 : -1), sz = ((p.i >> 2) % 2 ? 1 : -1);
    return { x: u * m * sx, y: v * m * sy, z: w * m * sz };
}

function createWave(p) {
    const grid = 28, sp = 17;
    const col = p.i % grid, row = Math.floor(p.i / grid);
    const x = (col - grid / 2) * sp;
    const z = (row - grid / 2) * sp;
    const y = Math.sin(x * 0.04 + aT * 1.8) * Math.cos(z * 0.035 + aT * 0.9) * 80 +
        Math.sin(z * 0.05 + aT * 1.4) * 40;
    return { x, y, z };
}

function createCylinder(p) {
    const radius = 180, height = 350;
    const theta = (p.i / numPts) * Math.PI * 2 * 2; // Spiral around
    const h = ((p.i / numPts) - 0.5) * height;
    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);
    return { x, y: h, z };
}

function createWholePage(p) {
    // Cluster more towards center while still spreading wide
    const ang = Math.random() * Math.PI * 2;
    const rad = Math.pow(Math.random(), 0.7) * 1200;
    return {
        x: Math.cos(ang) * rad,
        y: (Math.random() - 0.5) * 1400,
        z: (Math.random() - 0.5) * 600
    };
}

function createStar(p) {
    const arms = 5, rInner = 50, rOuter = 220;
    const angle = (p.i / numPts) * Math.PI * 2;
    const armIndex = Math.floor((angle / (Math.PI * 2)) * arms);
    const isOuter = (p.i % 2 === 0);
    const r = isOuter ? rOuter : rInner;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    const z = (Math.random() - 0.5) * 100;
    return { x, y, z };
}

for (let i = 0; i < numPts; i++) {
    const p = { i, s: 0.9 + Math.random() * 1.5 };
    p.sphere = createSphere(p);
    p.cube = createCube(p);
    p.torus = createTorus(p);
    p.helix = createHelix(p);
    p.icosahedron = createIcosahedron(p);
    p.glowChart = createGlowChart(p);
    p.knot = createKnot(p);
    p.diamond = createDiamond(p);
    p.wave = createWave(p);
    p.cylinder = createCylinder(p);
    p.star = createStar(p);
    p.wholePage = createWholePage(p);
    p.cx = p.wholePage.x; p.cy = p.wholePage.y; p.cz = p.wholePage.z;
    pts.push(p);
}

let mouseCX = 0, mouseCY = 0;
document.addEventListener('mousemove', e => {
    mouseCX = (e.clientX - window.innerWidth / 2) * 0.035;
    mouseCY = (e.clientY - window.innerHeight / 2) * 0.035;
});

let curCX = window.innerWidth / 2, curCY = window.innerHeight / 2;
let tCX = curCX, tCY = curCY;
let canSc = 1, tCanSc = 1;
let sectionShape = 'sphere';
let hoverShape = null;

function updCanvasPos() {
    const vh = window.innerHeight, vw = window.innerWidth;
    const sections = ['home', 'about', 'services', 'development', 'design', 'marketing', 'solutions', 'offline', 'portfolio', 'contact'];
    let activeSectionIdx = 0;
    for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top < vh * 0.5) activeSectionIdx = i;
    }

    const sectionName = sections[activeSectionIdx];
    const activeSectionEl = document.getElementById(sectionName);
    const visualEl = activeSectionEl ? (activeSectionEl.querySelector('.section-visual') || activeSectionEl.querySelector('.hero-visual')) : null;

    // Shape Mapping
    if (sectionName === 'home' || sectionName === 'services' || sectionName === 'contact' || sectionName === 'about') sectionShape = 'wholePage';
    else if (sectionName === 'development') sectionShape = 'cube';
    else if (sectionName === 'marketing') sectionShape = 'glowChart';
    else if (sectionName === 'solutions') sectionShape = 'cylinder';
    else if (sectionName === 'offline') sectionShape = 'wave';
    else if (sectionName === 'portfolio') sectionShape = 'star';
    else if (sectionName === 'design') sectionShape = 'diamond';

    if (vw <= 991) {
        // Mobile behavior: Stay centered in the visual area
        if (sectionName === 'home' || sectionName === 'services' || sectionName === 'contact' || sectionName === 'about') {
            tCX = vw * 0.5;
            tCY = vh * 0.5;
            tCanSc = 1.4;
        } else {
            sectionShape = (activeSectionIdx % 2 === 0) ? 'cube' : 'icosahedron';
            if (visualEl) {
                const rect = visualEl.getBoundingClientRect();
                tCX = rect.left + rect.width / 2;
                tCY = rect.top + rect.height / 2;
                tCanSc = 0.7;
            } else {
                tCX = vw * 0.5;
                tCY = vh * 0.35;
                tCanSc = 0.75;
            }
        }
        canvas.style.opacity = (sectionName === 'about') ? 0 : 1;
    } else {
        // Desktop behavior: Track visual element
        if (sectionName === 'home' || sectionName === 'services' || sectionName === 'contact' || sectionName === 'about') {
            tCX = vw * 0.5;
            tCY = vh * 0.5;
            tCanSc = 1.0;
        } else if (visualEl) {
            const rect = visualEl.getBoundingClientRect();
            tCX = rect.left + rect.width / 2;
            tCY = rect.top + rect.height / 2;
            tCanSc = 0.8;
        } else {
            // Fallback
            let txp = (activeSectionIdx % 2 === 0) ? 0.78 : 0.22;
            if (sectionName === 'contact') txp = 0.5;
            tCX = vw * txp;
            tCY = vh * 0.5;
            tCanSc = 0.8;
        }

        canvas.style.opacity = 1;
    }
}

window.addEventListener('scroll', updCanvasPos, { passive: true });
window.addEventListener('resize', updCanvasPos);
updCanvasPos();

(function draw() {
    requestAnimationFrame(draw); aT += .006;
    curCX += (tCX - curCX) * .07; curCY += (tCY - curCY) * .07;
    canSc += (tCanSc - canSc) * .07;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const targetShape = hoverShape || sectionShape;

    pts.forEach(p => {
        // Morphing
        const target = p[targetShape];
        p.cx += (target.x - p.cx) * 0.06;
        p.cy += (target.y - p.cy) * 0.06;
        p.cz += (target.z - p.cz) * 0.06;

        // 3D Rotation
        let rx = p.cx, ry = p.cy, rz = p.cz;
        // Rotation Y (Mouse + Auto)
        const cosY = Math.cos(aT + mouseCX * 0.05), sinY = Math.sin(aT + mouseCX * 0.05);
        const x1 = rx * cosY - rz * sinY, z1 = rx * sinY + rz * cosY;
        rx = x1; rz = z1;
        // Rotation X (Mouse)
        const cosX = Math.cos(mouseCY * 0.05), sinX = Math.sin(mouseCY * 0.05);
        const y2 = ry * cosX - rz * sinX, z2 = ry * sinX + rz * cosX;
        ry = y2; rz = z2;

        // Perspective Projection
        const camZ = 520;
        const scale = camZ / (camZ + rz + 100) * canSc;
        const px = curCX + rx * scale, py = curCY + ry * scale;

        // Dynamic alpha & size
        const alpha = Math.max(0.12, Math.min(1, (1 - rz / 400) * 1.1)) * 0.95;
        const hNorm = Math.max(0, Math.min(1, (-ry + 180) / 360));
        let dotSize = p.s * scale * (0.9 + hNorm * 1.3);
        dotSize *= 1 + Math.sin(aT * 5.5 + p.i * 0.22) * 0.18; // breathing

        // Neon Gradient
        const r = 40 + hNorm * 80;
        const g = 180 + hNorm * 75;
        const b = 220 + hNorm * 35;
        const glowAlpha = alpha * (0.7 + hNorm * 0.3);

        ctx.beginPath(); ctx.arc(px, py, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${glowAlpha})`;
        ctx.fill();

        // Bloom halo
        if (hNorm > 0.6) {
            ctx.beginPath(); ctx.arc(px, py, dotSize * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(80, 220, 255, ${alpha * 0.12})`;
            ctx.fill();
        }
    });
})();

// Helper for Sub-sliders
function initSubSlider(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const track = container.querySelector('.sub-slider-track');
    const slides = Array.from(container.querySelectorAll('.sub-slide'));
    const prevBtn = container.querySelector('.sub-prev');
    const nextBtn = container.querySelector('.sub-next');
    const dotsContainer = container.querySelector('.sub-dots');
    let current = 0;

    // Dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'sub-dot' + (i === 0 ? ' active' : '');
        d.onclick = () => move(i);
        dotsContainer.appendChild(d);
    });
    const dots = Array.from(dotsContainer.querySelectorAll('.sub-dot'));

    function move(idx) {
        current = (idx + slides.length) % slides.length;
        if (slides[current]) {
            const offset = slides[current].offsetLeft;
            track.style.transform = `translateX(-${offset}px)`;
        }
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.onclick = () => move(current - 1);
    if (nextBtn) nextBtn.onclick = () => move(current + 1);

    // Make sure it resets correctly on resize
    window.addEventListener('resize', () => move(current));
}

// Hover listeners for Services
document.querySelectorAll('#services .card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const titleText = card.querySelector('h3').innerText.toLowerCase();
        if (titleText.includes('marketing')) hoverShape = 'glowChart';
        else if (titleText.includes('design')) hoverShape = 'diamond';
        else if (titleText.includes('development')) hoverShape = 'helix';
        else if (titleText.includes('solutions')) hoverShape = 'cylinder';
    });
    card.addEventListener('mouseleave', () => { hoverShape = null; });
});

// Initialize Sub-sliders
initSubSlider('dev-slider');
initSubSlider('mkt-slider');
initSubSlider('sol-slider');
initSubSlider('design-slider');
