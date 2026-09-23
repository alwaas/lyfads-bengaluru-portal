/**
 * LYFAds Bengaluru - Optical Illusions & Micro-Interactions Engine
 * 1. Gravitational Particle Canvas (Fluid 60FPS physics)
 * 2. 3D Gyroscopic Card Tilt & Dynamic Glare Optics
 * 3. Interactive Cursor Glow Atmosphere
 */

(function () {
  'use strict';

  // ==========================================
  // 1. Gravitational Canvas Particle Nebula
  // ==========================================
  function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };
    let animationFrameId;

    function resize() {
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
      createParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.9;
        this.vy = (Math.random() - 0.5) * 0.9;
        this.radius = Math.random() * 2 + 1.2;
        this.baseColor = Math.random() > 0.4 ? 'rgba(139, 92, 246,' : 'rgba(6, 182, 212,';
        this.alpha = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce from boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse attraction / deflection physics
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            // Gentle gravitational pull
            this.x += Math.cos(angle) * force * 1.8;
            this.y += Math.sin(angle) * force * 1.8;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor + this.alpha + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#8b5cf6';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function createParticles() {
      particles = [];
      // Adjust density for mobile vs desktop
      const count = window.innerWidth < 768 ? 32 : 65;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDist = window.innerWidth < 768 ? 90 : 130;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.28;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(147, 112, 219, ${opacity})`;
            ctx.lineWidth = 0.85;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();

      animationFrameId = requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Pause when hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    });

    resize();
    animate();
  }

  // ==========================================
  // 2. 3D Card Tilt & Specular Light Optics
  // ==========================================
  function initTiltCards() {
    // Only apply on non-touch devices for performance
    if (window.matchMedia('(pointer: coarse)').matches) return;

    function bindTilt(card) {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = 'true';

      // Ensure glare element exists
      let glare = card.querySelector('.tilt-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const rotateX = -deltaY * 9; // Max 9 deg rotation
        const rotateY = deltaX * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

        // Update specular light position
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22), transparent 75%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.4s ease-out';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
      });
    }

    // Bind existing tilt cards
    document.querySelectorAll('.tilt-card').forEach(bindTilt);

    // Watch for dynamically added cards (mutation observer)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.classList.contains('tilt-card')) bindTilt(node);
            node.querySelectorAll?.('.tilt-card').forEach(bindTilt);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ==========================================
  // 3. Ambient Cursor Glow Atmosphere
  // ==========================================
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let glow = document.getElementById('cursor-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.id = 'cursor-glow';
      glow.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 450px;
        height: 450px;
        border-radius: 50%;
        pointer-events: none;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.03) 50%, transparent 75%);
        transform: translate(-50%, -50%);
        z-index: 0;
        transition: opacity 0.3s ease;
        mix-blend-mode: screen;
      `;
      document.body.appendChild(glow);
    }

    let mouseX = -500, mouseY = -500;
    let currentX = -500, currentY = -500;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderGlow() {
      // Smooth lerp (linear interpolation)
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      glow.style.transform = `translate(${currentX - 225}px, ${currentY - 225}px)`;
      requestAnimationFrame(renderGlow);
    }

    renderGlow();
  }

  // Auto initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initParticleCanvas();
      initTiltCards();
      initCursorGlow();
    });
  } else {
    initParticleCanvas();
    initTiltCards();
    initCursorGlow();
  }

  // Expose hooks
  window.initParticleCanvas = initParticleCanvas;
  window.initTiltCards = initTiltCards;
})();

