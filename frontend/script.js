// ========== SOFT MODERN PORTFOLIO WITH LIGHT GREEN ACCENTS ==========
// VRL Praharsha Vadapalli - Full Stack Developer Portfolio
// Complete Interactive JavaScript

// ========== TYPING ANIMATION ==========
const roles = ['Full Stack Developer', 'Java Enthusiast', 'Problem Solver', 'Tech Explorer'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextElement = document.getElementById('typed-text');

function typeEffect() {
    if (!typedTextElement) return;
    
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(() => {}, 500);
        }
    } else {
        typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(() => {}, 2000);
        }
    }
    
    setTimeout(typeEffect, isDeleting ? 60 : 100);
}

// Start typing animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
});

// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class for navbar
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========== ACTIVE NAVIGATION LINK (SCROLL SPY) ==========
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveSection() {
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveSection);
updateActiveSection();

// ========== SMOOTH SCROLLING FOR NAVIGATION ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (navLinksContainer) navLinksContainer.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            
            // Reset hamburger icon if active
            if (hamburger && hamburger.classList.contains('active')) {
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                hamburger.classList.remove('active');
            }
        }
    });
});

// ========== HAMBURGER MENU (MOBILE) ==========
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = hamburger.querySelectorAll('span');
        if (navLinksContainer.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (navLinksContainer) navLinksContainer.classList.remove('active');
        if (hamburger) {
            hamburger.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
});

// ========== BACK TO TOP BUTTON ==========
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
backToTop.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========== SCROLL REVEAL ANIMATION (Intersection Observer) ==========
const revealElements = document.querySelectorAll(
    '.about-card-glass, .skills-category, .project-card, .achievement-card, .interest-card'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Set initial state
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            entry.target.style.transition = 'all 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
            
            // Animate in
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            // Stop observing after animation
            revealObserver.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.1, 
    rootMargin: '0px 0px -30px 0px' 
});

// Apply initial styles and observe
revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    revealObserver.observe(el);
});

// ========== SKILL PROGRESS BARS ANIMATION ==========
const progressBars = document.querySelectorAll('.progress-fill');

function animateProgressBars() {
    progressBars.forEach(bar => {
        const barPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight - 100;
        
        if (barPosition < screenPosition) {
            // Trigger reflow to ensure animation plays
            const width = bar.style.width;
            bar.style.transition = 'width 1.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        }
    });
}

window.addEventListener('scroll', animateProgressBars);
animateProgressBars();

// ========== PROJECT CARD HOVER ENHANCEMENT ==========
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.project-icon i');
        if (icon) {
            icon.style.transform = 'scale(1.1)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.project-icon i');
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
    });
});

// ========== INTEREST CARDS RIPPLE EFFECT ==========
const interestCards = document.querySelectorAll('.interest-card');

interestCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(156, 187, 138, 0.3)';
        ripple.style.pointerEvents = 'none';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'rippleAnim 0.6s linear';
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to document
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleAnim {
        0% {
            transform: scale(0);
            opacity: 0.5;
            width: 10px;
            height: 10px;
        }
        100% {
            transform: scale(50);
            opacity: 0;
            width: 500px;
            height: 500px;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ========== CONTACT FORM SUBMISSION ==========
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();
        
        // Client-side validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }
        
        if (message.length < 10) {
            showFormMessage('Message must be at least 10 characters', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual backend endpoint)
            // For demo purposes, we'll simulate a successful response
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In production, uncomment this and use your actual backend
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, email, message })
            // });
            // const data = await response.json();
            
            // Simulate success
            showFormMessage('✓ Message sent successfully! I\'ll respond within 48 hours.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Contact form error:', error);
            showFormMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function showFormMessage(message, type) {
    if (!formStatus) return;
    
    formStatus.innerHTML = message;
    formStatus.style.padding = '0.8rem';
    formStatus.style.marginTop = '1rem';
    formStatus.style.borderRadius = '12px';
    formStatus.style.fontSize = '0.85rem';
    formStatus.style.textAlign = 'center';
    formStatus.style.transition = 'all 0.3s ease';
    
    if (type === 'success') {
        formStatus.style.background = 'rgba(156, 187, 138, 0.15)';
        formStatus.style.color = '#6b8a5a';
        formStatus.style.border = '1px solid rgba(156, 187, 138, 0.4)';
    } else {
        formStatus.style.background = 'rgba(245, 207, 223, 0.15)';
        formStatus.style.color = '#c9a0b0';
        formStatus.style.border = '1px solid rgba(245, 207, 223, 0.4)';
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        formStatus.innerHTML = '';
        formStatus.style.padding = '0';
        formStatus.style.background = 'transparent';
        formStatus.style.border = 'none';
    }, 5000);
}

// ========== FORM INPUT FOCUS EFFECTS ==========
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        const icon = input.parentElement.querySelector('i');
        if (icon) {
            icon.style.color = 'var(--sage-green)';
            icon.style.transition = 'color 0.3s ease';
        }
        input.parentElement.style.transform = 'translateX(5px)';
        input.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', () => {
        const icon = input.parentElement.querySelector('i');
        if (icon) {
            icon.style.color = 'var(--text-muted)';
        }
        input.parentElement.style.transform = 'translateX(0)';
    });
});

// ========== SOCIAL ICONS TOOLTIP EFFECT ==========
const socialIcons = document.querySelectorAll('.social-icon');

socialIcons.forEach(icon => {
    let tooltipTimeout;
    
    icon.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('span');
        tooltip.className = 'social-tooltip';
        
        const iconClass = icon.querySelector('i')?.className;
        if (iconClass?.includes('linkedin')) tooltip.textContent = 'LinkedIn';
        else if (iconClass?.includes('github')) tooltip.textContent = 'GitHub';
        else if (iconClass?.includes('envelope')) tooltip.textContent = 'Email';
        
        tooltip.style.position = 'absolute';
        tooltip.style.bottom = '100%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.background = 'var(--glass-bg)';
        tooltip.style.backdropFilter = 'blur(8px)';
        tooltip.style.padding = '0.2rem 0.6rem';
        tooltip.style.borderRadius = '12px';
        tooltip.style.fontSize = '0.7rem';
        tooltip.style.color = 'var(--sage-green)';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.marginBottom = '8px';
        tooltip.style.border = '1px solid var(--glass-border)';
        tooltip.style.fontWeight = '500';
        tooltip.style.zIndex = '100';
        
        icon.style.position = 'relative';
        icon.appendChild(tooltip);
        
        tooltipTimeout = setTimeout(() => tooltip.remove(), 800);
    });
    
    icon.addEventListener('mouseleave', () => {
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        const tooltip = icon.querySelector('.social-tooltip');
        if (tooltip) tooltip.remove();
    });
});

// ========== HERO CARD SUBTLE GLOW ANIMATION ==========
const heroCard = document.querySelector('.hero-card');

if (heroCard) {
    setInterval(() => {
        heroCard.style.transition = 'box-shadow 0.5s ease';
        heroCard.style.boxShadow = 'var(--shadow-glow)';
        setTimeout(() => {
            heroCard.style.boxShadow = 'var(--shadow-soft)';
        }, 800);
    }, 3000);
}

// ========== FLOATING ICONS ANIMATION SPEED VARIATION ==========
const floatingIcons = document.querySelectorAll('.floating-icon');

floatingIcons.forEach((icon, index) => {
    const randomDelay = Math.random() * 2;
    const randomDuration = 3 + Math.random() * 2;
    icon.style.animation = `float ${randomDuration}s ease-in-out infinite`;
    icon.style.animationDelay = `${randomDelay}s`;
});

// ========== SOFT PARALLAX EFFECT ON BLOBS ==========
const blobs = document.querySelectorAll('.blob');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    blobs.forEach((blob, index) => {
        const speed = 0.05 + (index * 0.01);
        blob.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========== PRELOAD IMAGES FOR SMOOTH LOADING ==========
const allImages = document.querySelectorAll('img');

allImages.forEach(img => {
    if (img.complete) {
        img.style.opacity = '1';
    } else {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    }
});

// ========== WINDOW LOAD COMPLETE ==========
window.addEventListener('load', () => {
    console.log('%c✨ VRL Praharsha Vadapalli Portfolio ✨', 'color: #9cbb8a; font-size: 14px; font-weight: bold;');
    console.log('%cLight Green Accents | Full Stack Developer Portfolio', 'color: #b8a9d6; font-size: 12px;');
    console.log('%cPortfolio fully loaded | Ready for opportunities', 'color: #a9c9e8; font-size: 12px;');
    
    // Add entrance animation for hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 0.8s ease-out';
    }
    
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.animation = 'fadeInUp 0.8s ease-out 0.2s backwards';
    }
});

// ========== ADD FADE-IN ANIMATION STYLES ==========
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-12px);
        }
    }
`;
document.head.appendChild(fadeInStyle);

// ========== DETECT PREFERRED COLOR SCHEME (Optional) ==========
// This adds a subtle class to body if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.body.classList.add('reduced-motion');
    // Disable some animations for accessibility
    const style = document.createElement('style');
    style.textContent = `
        .reduced-motion *,
        .reduced-motion *::before,
        .reduced-motion *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    `;
    document.head.appendChild(style);
}

// ========== ADD SCROLL PROGRESS INDICATOR (Optional) ==========
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'var(--gradient-1)';
    progressBar.style.zIndex = '1001';
    progressBar.style.transition = 'width 0.1s ease';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

// Uncomment to enable scroll progress bar
// createScrollProgress();

// ========== EXPORT FOR MODULE USE (if needed) ==========
// This portfolio is fully functional as a standalone application
console.log('JavaScript initialized | Portfolio ready');