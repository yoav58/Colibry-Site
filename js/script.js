// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== FADE IN ANIMATION ON SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ===== NAVBAR BACKGROUND ON SCROLL =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// ===== INTERACTIVE BUTTON EFFECTS =====
document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===== FEATURE CARDS INTERACTIVE HOVER =====
document.querySelectorAll('.feature-card, .product-card, .career-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.feature-icon, .product-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.feature-icon, .product-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// ===== CONTACT FORM HANDLING =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
    const submitButton = this.querySelector('.form-submit');
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Let the form submit naturally to Formspree
    // The loading state will be visible during submission
});

// ===== ENHANCED FORM VALIDATION =====
const formInputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = '#F56565';
        } else if (this.type === 'email' && this.value && !this.value.includes('@')) {
            this.style.borderColor = '#F56565';
        } else {
            this.style.borderColor = '#48BB78';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '#38B2AC';
    });
});

// ===== ANIMATED STATISTICS =====
function animateStats() {
    const stats = document.querySelectorAll('.stat-item h3');
    stats.forEach(stat => {
        const originalText = stat.textContent;
        let currentValue = 0;
        let finalValue;
        let increment;
        
        if (originalText.includes('500+')) {
            finalValue = 500;
            increment = 10;
        } else if (originalText.includes('98%')) {
            finalValue = 98;
            increment = 2;
        } else if (originalText.includes('3.5x')) {
            finalValue = 3.5;
            increment = 0.1;
        } else {
            return; // Skip 24/7
        }
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = originalText;
                clearInterval(timer);
            } else {
                if (originalText.includes('%')) {
                    stat.textContent = Math.floor(currentValue) + '%';
                } else if (originalText.includes('x')) {
                    stat.textContent = currentValue.toFixed(1) + 'x';
                } else if (originalText.includes('+')) {
                    stat.textContent = Math.floor(currentValue) + '+';
                }
            }
        }, 50);
    });
}

// ===== TRIGGER STATS ANIMATION WHEN SECTION COMES INTO VIEW =====
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== MOBILE MENU TOGGLE (for future enhancement) =====
function initMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.style.display = 'none';
    mobileMenuBtn.style.background = 'none';
    mobileMenuBtn.style.border = 'none';
    mobileMenuBtn.style.fontSize = '1.5rem';
    mobileMenuBtn.style.color = '#38B2AC';
    mobileMenuBtn.style.cursor = 'pointer';
    
    // Insert mobile menu button
    navContainer.insertBefore(mobileMenuBtn, navLinks);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
    });
    
    // Show/hide mobile menu button based on screen size
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
            navLinks.style.display = navLinks.classList.contains('mobile-active') ? 'flex' : 'none';
        } else {
            mobileMenuBtn.style.display = 'none';
            navLinks.style.display = 'flex';
            navLinks.classList.remove('mobile-active');
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll event
const optimizedScrollHandler = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Focus management for form elements
formInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.type !== 'textarea') {
            e.preventDefault();
            const form = input.closest('form');
            const formElements = Array.from(form.querySelectorAll('input, select, textarea, button'));
            const currentIndex = formElements.indexOf(input);
            const nextElement = formElements[currentIndex + 1];
            
            if (nextElement) {
                nextElement.focus();
            }
        }
    });
});

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    
    // Add loading class to body initially
    document.body.classList.add('loading');
    
    // Remove loading class after page is fully loaded
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
    });
});

// ===== LAZY LOADING FOR FUTURE IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== THEME TOGGLE (for future dark mode) =====
function initThemeToggle() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
    }
}

// ===== ANALYTICS HELPER (for future Google Analytics) =====
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, properties);
    
    // Example for Google Analytics 4
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, properties);
    // }
}

// Track button clicks
document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button').forEach(button => {
    button.addEventListener('click', () => {
        trackEvent('button_click', {
            button_text: button.textContent.trim(),
            button_location: button.closest('section')?.className || 'unknown'
        });
    });
});

// Track form submission
document.getElementById('contactForm').addEventListener('submit', () => {
    trackEvent('form_submit', {
        form_name: 'contact_form'
    });
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send errors to a logging service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log(
    '%c🐦 Colibry %c- Advanced Business Solutions',
    'color: #38B2AC; font-size: 20px; font-weight: bold;',
    'color: #2D2E32; font-size: 16px;'
);
console.log(
    '%cInterested in our technology? Check out our careers section!',
    'color: #6C757D; font-size: 12px;'
);