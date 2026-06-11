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
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

class Particle {
  constructor() { this.reset(true); }
  reset(initial) {
    this.x  = Math.random() * canvas.width;
    this.y  = initial ? Math.random() * canvas.height : -5;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r  = Math.random() * 1.2 + 0.3;
    this.a  = Math.random() * 0.3 + 0.05;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
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
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 16000), 80);
  particles = Array.from({ length: count }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 130) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(100,150,255,${(1-d/130)*0.1})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
    if (mouse.x !== null) {
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 150) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(10,132,255,${(1-d/150)*0.3})`;
        ctx.lineWidth = 0.7;
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
   NAV
   ============================================================ */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ============================================================
   SCROLL FADE-IN
   ============================================================ */
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ============================================================
   PROJECT MODAL DATA
   ============================================================ */
const projects = {
  governance: {
    tag: 'MSc Thesis (Management) · Current',
    title: 'AI Governance & Deployment Readiness Framework for Clinical ML',
    overview: 'Developing a governance and deployment readiness framework for operationalising a segmentation-guided lung cancer classification model within a clinical radiology setting, using Design Science Research methodology.',
    highlights: [
      'Mapping the existing ML pipeline against EU AI Act requirements, ISO/IEC 42001 controls, and FDA/IMDRF medical AI lifecycle guidance to identify compliance gaps and missing operational controls.',
      'Designing a model risk management and lifecycle framework covering data quality accountability, explainability for clinical decision support, monitoring, change management, and human oversight protocols.',
      'Producing an implementation roadmap and operating model for responsible AI deployment, addressing validation, transparency, and role design for human-AI teaming in diagnostic workflows.',
    ],
    tech: ['EU AI Act', 'ISO/IEC 42001', 'FDA/IMDRF', 'Design Science Research', 'MLOps', 'Responsible AI', 'Model Risk Management'],
  },
  lungcancer: {
    tag: 'MSc Thesis (Data Science) · 2025',
    title: 'Automated Lung Cancer Segmentation & Classification Pipeline',
    overview: 'Developed an end-to-end segmentation-classification pipeline in PyTorch processing CT scans to predict lung tumour malignancy, from raw DICOM ingestion through to model inference.',
    highlights: [
      'Worked with the LIDC-IDRI dataset (130 GB), engineering preprocessing workflows: DICOM loading, slice extraction, binary mask generation, and semantic feature extraction (roundness, solidity).',
      'Designed a multi-branch deep neural architecture: (1) a CNN processing raw CT image crops, (2) a parallel CNN on binary tumour masks, and (3) an MLP ingesting semantic shape features; branch embeddings concatenated for unified prediction with adaptive classification weighting driven by segmentation confidence.',
      'Applied Grad-CAM and calibration plots to assess interpretability and model trust, prioritising explainability to reduce black-box risk in clinical diagnostic workflows (Responsible AI).',
    ],
    tech: ['PyTorch', 'CNN', 'Grad-CAM', 'DICOM', 'LIDC-IDRI', 'Segmentation', 'Multi-branch Architecture', 'Responsible AI'],
  },
  brain: {
    tag: '2024 · Deep Learning',
    title: 'AI-Powered Brain Tumour Classification & Segmentation',
    overview: 'Built a custom deep learning pipeline in TensorFlow/Keras for simultaneous segmentation and classification of brain tumours from MRI data.',
    highlights: [
      'Preprocessed 2D MRI data from .mat files using h5py, scipy, and skimage — including resizing, normalisation, and structured label extraction.',
      'Designed a combined CNN and dense layer architecture with data augmentation to address class imbalance.',
      'Designed iterative evaluation workflows using accuracy metrics and visual inspection, with SGD variant experimentation (momentum, variance reduction) to improve model convergence.',
    ],
    tech: ['TensorFlow', 'Keras', 'CNN', 'MRI', 'h5py', 'scipy', 'skimage', 'Segmentation', 'Classification'],
  },
  predictive: {
    tag: '2024 · Machine Learning',
    title: 'Predictive Modelling & Feature Engineering',
    overview: 'Built and systematically compared a suite of regression models, with a focus on structured experimentation, dimensionality reduction, and robust evaluation.',
    highlights: [
      'Built and compared regression models using Scikit-learn — Ridge, Lasso, KNN, and Kernel Ridge — with PCA for dimensionality reduction.',
      'Applied GridSearchCV for hyperparameter tuning across all model types, with structured cross-validation to ensure generalisability.',
      'Tracked experiments and evaluated model performance using RMSE as the selection criterion.',
    ],
    tech: ['Scikit-learn', 'Ridge Regression', 'Lasso', 'KNN', 'Kernel Ridge', 'PCA', 'GridSearchCV', 'Cross-validation', 'RMSE'],
  },
};

/* ============================================================
   MODAL LOGIC
   ============================================================ */
const overlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');

function openModal(key) {
  const p = projects[key];
  if (!p) return;

  modalBody.innerHTML = `
    <div class="modal-tag">${p.tag}</div>
    <h2 class="modal-title">${p.title}</h2>
    <div class="modal-section">
      <p class="modal-section-label">Overview</p>
      <p>${p.overview}</p>
    </div>
    <div class="modal-section">
      <p class="modal-section-label">Key Highlights</p>
      <ul class="modal-bullets">
        ${p.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>
    <div class="modal-section">
      <p class="modal-section-label">Technologies</p>
      <div class="modal-tech">
        ${p.tech.map(t => `<span>${t}</span>`).join('')}
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
