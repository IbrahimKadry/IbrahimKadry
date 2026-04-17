// script.js - Enhanced with better mobile support

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initNavigation();
    initScrollReveal();
    initSkillBars();
    initCounterAnimation();
    initHeroCanvas();
    initContactForm();
    initTouchOptimizations();
});

// Cursor Follower - Desktop Only
function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor || window.matchMedia('(hover: none)').matches) return;
    
    let isVisible = false;
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        
        if (!isVisible) {
            cursor.classList.add('visible');
            isVisible = true;
        }
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('visible');
        isVisible = false;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        cursorX += (targetX - cursorX) * 0.15;
        cursorY += (targetY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-category, .cert-card, .contact-link');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Scroll effect with throttle
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.scrollY;
                
                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Mobile menu toggle
    function toggleMobileMenu() {
        const isOpen = navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        navToggle.setAttribute('aria-expanded', isOpen);
        mobileMenu.setAttribute('aria-hidden', !isOpen);
    }
    
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            navToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        });
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

// Scroll Reveal with IntersectionObserver
function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        reveals.forEach(el => el.classList.add('revealed'));
        return;
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    let delay = 0;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Stagger the animations
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                delay += 100;
                
                // Reset delay after a group
                if (delay > 400) delay = 0;
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    reveals.forEach(reveal => observer.observe(reveal));
}

// Skill Bars Animation
function initSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target.getAttribute('data-skill');
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    // Check for reduced motion
                    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        progressBar.style.transition = 'none';
                    }
                    setTimeout(() => {
                        progressBar.style.width = skillLevel + '%';
                    }, 200);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillItems.forEach(item => observer.observe(item));
}

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                
                // Check for reduced motion
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    entry.target.textContent = target + '+';
                } else {
                    animateCounter(entry.target, target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30;
    const duration = 1500;
    const stepTime = duration / 30;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// Hero Canvas Animation - Optimized
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMouseInCanvas = false;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    
    function initParticles() {
        particles = [];
        // Fewer particles on mobile for performance
        const density = window.innerWidth < 768 ? 25000 : 15000;
        const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / density));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4 + 0.2
            });
        }
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseInCanvas = true;
    });
    
    document.addEventListener('mouseleave', () => {
        isMouseInCanvas = false;
    });
    
    // Touch support
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            isMouseInCanvas = true;
        }
    });
    
    document.addEventListener('touchend', () => {
        isMouseInCanvas = false;
    });
    
    // Draw geometric shapes - static for mobile
    let shapes = [];
    
    function initShapes() {
        shapes = [
            { x: canvas.width * 0.2, y: canvas.height * 0.3, size: Math.min(80, canvas.width * 0.15), rotation: 0 },
            { x: canvas.width * 0.8, y: canvas.height * 0.6, size: Math.min(60, canvas.width * 0.1), rotation: 0 },
            { x: canvas.width * 0.6, y: canvas.height * 0.2, size: Math.min(40, canvas.width * 0.08), rotation: 0 },
        ];
    }
    
    initShapes();
    
    function drawGeometry(time) {
        // Draw subtle grid
        ctx.strokeStyle = 'rgba(212, 165, 116, 0.03)';
        ctx.lineWidth = 1;
        
        const gridSize = Math.min(80, canvas.width / 10);
        
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw floating shapes
        const rotationSpeed = window.innerWidth < 768 ? 0.0003 : 0.0005;
        
        shapes.forEach(shape => {
            ctx.save();
            ctx.translate(shape.x, shape.y);
            shape.rotation += prefersReducedMotion ? 0 : rotationSpeed * (shapes.indexOf(shape) % 2 === 0 ? 1 : -1);
            ctx.rotate(shape.rotation);
            ctx.strokeStyle = 'rgba(212, 165, 116, 0.08)';
            ctx.lineWidth = 1;
            ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
            ctx.restore();
        });
    }
    
    function drawConnections() {
        const maxDistance = window.innerWidth < 768 ? 80 : 120;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(212, 165, 116, ${0.08 * (1 - distance / maxDistance)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background gradient
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width * 0.7
        );
        gradient.addColorStop(0, 'rgba(26, 26, 36, 0.5)');
        gradient.addColorStop(1, 'rgba(10, 10, 15, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const time = Date.now();
        drawGeometry(time);
        
        // Update and draw particles
        particles.forEach(particle => {
            if (!prefersReducedMotion) {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Mouse interaction
                if (isMouseInCanvas) {
                    const dx = mouseX - particle.x;
                    const dy = mouseY - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        const force = (100 - distance) / 100;
                        particle.x -= dx * force * 0.02;
                        particle.y -= dy * force * 0.02;
                    }
                }
                
                // Wrap around
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
            }
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 165, 116, ${particle.opacity})`;
            ctx.fill();
        });
        
        drawConnections();
        
        animationId = requestAnimationFrame(animate);
    }
    
    if (!prefersReducedMotion) {
        animate();
    } else {
        // Draw static version for reduced motion
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width * 0.7
        );
        gradient.addColorStop(0, 'rgba(26, 26, 36, 0.5)');
        gradient.addColorStop(1, 'rgba(10, 10, 15, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGeometry(0);
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 165, 116, ${particle.opacity})`;
            ctx.fill();
        });
        drawConnections();
    }
    
    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        } else if (!document.hidden && !prefersReducedMotion && !animationId) {
            animate();
        }
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span>Message Sent!</span>';
        btn.style.background = '#22c55e';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 3000);
    });
}

// Touch Optimizations
function initTouchOptimizations() {
    // Improve touch scrolling
    document.querySelectorAll('.skill-tags').forEach(container => {
        container.style.webkitOverflowScrolling = 'touch';
    });
    
    // Prevent double-tap zoom on buttons
    document.querySelectorAll('.btn, .project-link, .contact-link').forEach(el => {
        el.addEventListener('touchend', (e) => {
            e.preventDefault();
            el.click();
        }, { passive: false });
    });
    
    // Handle viewport height on mobile browsers
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });
        }
    });
});