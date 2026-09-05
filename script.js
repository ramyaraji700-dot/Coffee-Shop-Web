// ========================================
// BEAN & BLOOM CAFÉ - JAVASCRIPT
// ========================================

// DOM Elements
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('header');
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');
const menuBtns = document.querySelectorAll('.btn-primary, .btn-secondary');

// ========================================
// MOBILE NAVIGATION
// ========================================

/**
 * Toggle mobile menu open/close
 */
function toggleMobileMenu() {
    const isOpen = hamburger.classList.contains('active');
    
    if (isOpen) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    } else {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
    }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
}

// Mobile menu toggle event
hamburger.addEventListener('click', toggleMobileMenu);

// Close menu when a link is clicked
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const isClickInsideMenu = mobileMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);
    
    if (!isClickInsideMenu && !isClickOnHamburger && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================

/**
 * Add scroll effect to header
 */
let scrollTimeout;
function updateHeaderScroll() {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateHeaderScroll, 10);
});

// ========================================
// SMOOTH SCROLLING & ACTIVE NAV STATE
// ========================================

/**
 * Get scroll position
 */
function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Update active navigation based on scroll position
 */
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = getScrollTop() + 100; // Offset for header
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Update desktop nav
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            // Update mobile nav
            mobileMenuLinks.forEach(link => link.classList.remove('active'));
            const activeMobileLink = document.querySelector(`.mobile-menu-link[href="#${section.id}"]`);
            if (activeMobileLink) {
                activeMobileLink.classList.add('active');
            }
        }
    });
}

// Update active nav on scroll
window.addEventListener('scroll', updateActiveNav);

/**
 * Smooth scrolling for navigation links
 */
function handleSmoothScroll(e) {
    const href = this.getAttribute('href');
    
    // Check if it's an internal link
    if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            // Close mobile menu if open
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
            
            // Smooth scroll to target
            const offsetTop = target.offsetTop - header.offsetHeight;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', handleSmoothScroll);
});

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', handleSmoothScroll);
});

// ========================================
// MENU FILTERING
// ========================================

/**
 * Filter menu items by category
 */
function filterMenuItems(category) {
    menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.classList.remove('hidden');
            // Trigger animation
            setTimeout(() => {
                item.style.opacity = '1';
            }, 10);
        } else {
            item.classList.add('hidden');
            item.style.opacity = '0';
        }
    });
}

/**
 * Handle filter button clicks
 */
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Filter items
        const category = btn.getAttribute('data-filter');
        filterMenuItems(category);
    });
});

// ========================================
// NEWSLETTER FORM VALIDATION
// ========================================

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show newsletter message
 */
function showNewsletterMessage(message, type) {
    newsletterMessage.textContent = message;
    newsletterMessage.className = `newsletter-message ${type}`;
    
    // Auto-clear after 5 seconds
    setTimeout(() => {
        newsletterMessage.textContent = '';
        newsletterMessage.className = 'newsletter-message';
    }, 5000);
}

/**
 * Handle newsletter form submission
 */
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailInput = newsletterForm.querySelector('.newsletter-input');
    const email = emailInput.value.trim();
    
    // Clear previous message
    newsletterMessage.textContent = '';
    newsletterMessage.className = 'newsletter-message';
    
    // Validate email
    if (!email) {
        showNewsletterMessage('Please enter your email address.', 'error');
        emailInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showNewsletterMessage('Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
    }
    
    // Success
    showNewsletterMessage('✓ Thanks for joining! Check your inbox for updates.', 'success');
    emailInput.value = '';
});

// ========================================
// CTA BUTTON NAVIGATION
// ========================================

/**
 * Handle CTA button clicks to scroll to menu
 */
menuBtns.forEach(btn => {
    if (btn.textContent.includes('Menu') || btn.textContent.includes('View Menu') || btn.textContent.includes('Explore')) {
        btn.addEventListener('click', (e) => {
            const menuSection = document.querySelector('#menu');
            if (menuSection) {
                e.preventDefault();
                const offsetTop = menuSection.offsetTop - header.offsetHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

/**
 * Detect when element is in viewport and add reveal animation
 */
function observeElements() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: add reveal class to all elements
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('reveal');
        });
        return;
    }
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!prefersReducedMotion) {
                    entry.target.classList.add('reveal');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Initialize scroll reveal on load
document.addEventListener('DOMContentLoaded', observeElements);

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

/**
 * Add focus visible styles for keyboard navigation
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ========================================
// PERFORMANCE: Debounce scroll events
// ========================================

/**
 * Debounce function for scroll events
 */
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

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    updateActiveNav();
}, 50);

window.addEventListener('scroll', debouncedScroll, { passive: true });

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize the website
 */
function init() {
    // Set initial active nav
    updateActiveNav();
    
    // Set initial header state
    updateHeaderScroll();
    
    // Initialize menu with all items visible
    filterMenuItems('all');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
