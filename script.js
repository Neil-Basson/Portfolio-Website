/* ============================================================
   CANVAS PARTICLE BACKGROUND
   ============================================================ */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.reset(true);
  }

  reset(initial) {
    this.x  = Math.random() * canvas.width;
    this.y  = initial ? Math.random() * canvas.height : -5;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r  = Math.random() * 1.4 + 0.4;
    this.a  = Math.random() * 0.35 + 0.08;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.a})`;
    ctx.fill();
  }
}

function initParticles() {
  const density = Math.floor((canvas.width * canvas.height) / 14000);
  const count   = Math.min(density, 90);
  particles = Array.from({ length: count }, () => new Particle());
}

function drawConnections() {
  const maxDist  = 140;
  const mouseDist = 160;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(100,150,255,${(1 - dist / maxDist) * 0.12})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    if (mouse.x !== null) {
      const dx   = particles[i].x - mouse.x;
      const dy   = particles[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouseDist) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,113,227,${(1 - dist / mouseDist) * 0.35})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animate);
}

initParticles();
animate();

/* ============================================================
   NAV SCROLL EFFECT
   ============================================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================================================
   SCROLL FADE-IN
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));
