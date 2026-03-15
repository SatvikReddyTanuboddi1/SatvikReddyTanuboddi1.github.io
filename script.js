// ===== PARTICLE NETWORK CANVAS =====
(function () {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const force = (200 - dist) / 200 * 0.01;
                    this.vx += dx * force;
                    this.vy += dy * force;
                }
            }

            this.vx *= 0.99;
            this.vy *= 0.99;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`;
            ctx.fill();
        }
    }

    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
})();

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== TYPEWRITER EFFECT =====
const typewriterEl = document.getElementById('typewriter');
const phrases = [
    'Pipelines that scale.',
    'Models that predict.',
    'Dashboards that decide.',
    'Data, end to end.',
    'Cloud-native solutions.'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 80;

function typewrite() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
        typewriterEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
    } else {
        typewriterEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400;
    }
    setTimeout(typewrite, typeSpeed);
}
typewrite();

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== SKILL BARS ANIMATION =====
const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const level = entry.target.dataset.level;
            entry.target.style.setProperty('--level', level + '%');
            entry.target.classList.add('animated');
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillItems.forEach(item => skillObserver.observe(item));

// ===== COUNTER ANIMATION =====
const statNumbers = document.querySelectorAll('.stat-number[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            let count = 0;
            const increment = target / 40;
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    entry.target.textContent = target;
                    clearInterval(timer);
                } else {
                    entry.target.textContent = Math.floor(count);
                }
            }, 30);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => counterObserver.observe(num));

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = 'var(--accent)';
        }
    });
});

// ===== TECH STACK FILTER =====
const techFilters = document.querySelectorAll('.tech-filter');
const techHexes = document.querySelectorAll('.tech-hex');

techFilters.forEach(btn => {
    btn.addEventListener('click', () => {
        techFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        techHexes.forEach(hex => {
            hex.classList.remove('dimmed', 'highlighted');
            if (filter === 'all') return;
            if (hex.dataset.category === filter) {
                hex.classList.add('highlighted');
            } else {
                hex.classList.add('dimmed');
            }
        });
    });
});
