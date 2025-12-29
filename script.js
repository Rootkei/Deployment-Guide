// ===================================
// Navigation & Tab Switching
// ===================================

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeCodeTabs();
    initializeAccordions();
    initializeCopyButtons();
    initializeSmoothScroll();
});

// Navigation between deployment methods
function initializeNavigation() {
    const pills = document.querySelectorAll('.pill');
    const sections = document.querySelectorAll('.deployment-section');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            const method = pill.dataset.method;
            
            // Update active pill
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            // Update active section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === method) {
                    section.classList.add('active');
                    
                    // Smooth scroll to section
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            
            // Update URL hash without jumping
            history.pushState(null, null, `#${method}`);
        });
    });

    // Handle initial hash on page load
    const hash = window.location.hash.slice(1);
    if (hash) {
        const targetPill = document.querySelector(`.pill[data-method="${hash}"]`);
        if (targetPill) {
            targetPill.click();
        }
    }
}

// Code tabs switching
function initializeCodeTabs() {
    const tabButtons = document.querySelectorAll('.code-tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            const tabsContainer = button.closest('.code-tabs');
            
            // Update active button
            tabsContainer.querySelectorAll('.code-tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Update active content
            tabsContainer.querySelectorAll('.code-tab-content').forEach(content => {
                content.classList.remove('active');
                if (content.dataset.tab === tabName) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// ===================================
// Accordion Functionality
// ===================================
function initializeAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.closest('.accordion-item');
            const isActive = accordionItem.classList.contains('active');
            
            // Close all accordions in the same group
            const accordion = header.closest('.accordion');
            accordion.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current accordion
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}

// ===================================
// Copy Code Functionality
// ===================================
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    
    // Copy to clipboard
    navigator.clipboard.writeText(code).then(() => {
        // Visual feedback
        const originalHTML = button.innerHTML;
        button.innerHTML = '<span class="copy-icon">✓</span>Copied!';
        button.style.background = 'var(--color-accent-green)';
        
        // Reset after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
        button.innerHTML = '<span class="copy-icon">✗</span>Failed';
        button.style.background = 'var(--color-accent-red)';
        
        setTimeout(() => {
            button.innerHTML = '<span class="copy-icon">📋</span>Copy';
            button.style.background = '';
        }, 2000);
    });
}

// ===================================
// Smooth Scroll
// ===================================
function initializeSmoothScroll() {
    // Smooth scroll for anchor links
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
}

// ===================================
// Scroll Progress Indicator
// ===================================
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--gradient-primary);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize scroll progress
createScrollProgress();

// ===================================
// Checklist Progress Tracking
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    
    checkboxes.forEach(checkbox => {
        // Load saved state from localStorage
        const checklistId = checkbox.closest('.deployment-section').id;
        const checkboxIndex = Array.from(checkboxes).indexOf(checkbox);
        const storageKey = `checklist-${checklistId}-${checkboxIndex}`;
        
        const savedState = localStorage.getItem(storageKey);
        if (savedState === 'true') {
            checkbox.checked = true;
        }
        
        // Save state on change
        checkbox.addEventListener('change', () => {
            localStorage.setItem(storageKey, checkbox.checked);
            updateChecklistProgress(checklistId);
        });
    });
    
    // Update progress on load
    document.querySelectorAll('.deployment-section').forEach(section => {
        updateChecklistProgress(section.id);
    });
});

function updateChecklistProgress(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const checkboxes = section.querySelectorAll('.checklist-checkbox');
    const checkedCount = section.querySelectorAll('.checklist-checkbox:checked').length;
    const totalCount = checkboxes.length;
    
    if (totalCount === 0) return;
    
    const percentage = Math.round((checkedCount / totalCount) * 100);
    
    // You can add a progress indicator here if needed
    console.log(`${sectionId} progress: ${percentage}%`);
}

// ===================================
// Keyboard Shortcuts
// ===================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search (if you add search later)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Focus search input if exists
    }
    
    // Arrow keys to navigate between deployment methods
    if (e.altKey) {
        const pills = Array.from(document.querySelectorAll('.pill'));
        const activePill = document.querySelector('.pill.active');
        const currentIndex = pills.indexOf(activePill);
        
        if (e.key === 'ArrowRight' && currentIndex < pills.length - 1) {
            e.preventDefault();
            pills[currentIndex + 1].click();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            pills[currentIndex - 1].click();
        }
    }
});

// ===================================
// Lazy Loading for Images (if added later)
// ===================================
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===================================
// Print Styles Helper
// ===================================
window.addEventListener('beforeprint', () => {
    // Expand all accordions for printing
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.add('active');
    });
});

window.addEventListener('afterprint', () => {
    // Collapse accordions after printing
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
    });
});

// ===================================
// Performance Monitoring
// ===================================
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page load time:', entry.loadEventEnd - entry.fetchStart, 'ms');
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['navigation'] });
}

// ===================================
// Dark Mode Toggle (Optional Enhancement)
// ===================================
function createDarkModeToggle() {
    // This site is already dark by default
    // But you can add a light mode toggle here if needed
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = '🌙';
    toggle.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--gradient-primary);
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: all var(--transition-base);
        z-index: 1000;
    `;
    
    toggle.addEventListener('mouseenter', () => {
        toggle.style.transform = 'scale(1.1) rotate(20deg)';
    });
    
    toggle.addEventListener('mouseleave', () => {
        toggle.style.transform = 'scale(1) rotate(0deg)';
    });
    
    // Uncomment to add to page
    // document.body.appendChild(toggle);
}

// ===================================
// Analytics Helper (Optional)
// ===================================
function trackEvent(category, action, label) {
    // Add your analytics tracking here
    // Example: Google Analytics, Mixpanel, etc.
    console.log('Event tracked:', { category, action, label });
}

// Track navigation between methods
document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
        trackEvent('Navigation', 'Method Switch', pill.dataset.method);
    });
});

// Track code copies
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.closest('.deployment-section').id;
        trackEvent('Interaction', 'Code Copy', section);
    });
});

// ===================================
// Service Worker Registration (Optional)
// ===================================
if ('serviceWorker' in navigator) {
    // Uncomment to enable offline support
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('/sw.js')
    //         .then(reg => console.log('Service Worker registered'))
    //         .catch(err => console.log('Service Worker registration failed'));
    // });
}

// ===================================
// Easter Egg: Konami Code
// ===================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Add some fun animation or message
    const message = document.createElement('div');
    message.innerHTML = '🎉 You found the secret! AWS Deployment Master! 🎉';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--gradient-primary);
        color: white;
        padding: 2rem 3rem;
        border-radius: 1rem;
        font-size: 1.5rem;
        font-weight: 700;
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        animation: bounceIn 0.5s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => message.remove(), 500);
    }, 3000);
}

// ===================================
// Utility Functions
// ===================================

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate reading time
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
}

// Add reading time to sections
document.querySelectorAll('.deployment-section').forEach(section => {
    const text = section.textContent;
    const readingTime = calculateReadingTime(text);
    // You can display this somewhere in the UI
    console.log(`${section.id} reading time: ${readingTime} minutes`);
});

console.log('🚀 AWS Deployment Guide initialized successfully!');
