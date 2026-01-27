// Conversion-Optimized Landing Page JavaScript

// ==================== //
// Mobile Navigation    //
// ==================== //
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ==================== //
// Smooth Scrolling     //
// ==================== //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================== //
// Countdown Timer      //
// ==================== //
function startCountdown() {
    const deadline = new Date().getTime() + (5 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000); // 5 days 12 hours from now

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = deadline - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(timer);
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }, 1000);
}

startCountdown();

// ==================== //
// Seats Left Counter   //
// ==================== //
let seatsLeft = 147;
const seatsElement = document.getElementById('seatsLeft');

function updateSeatsLeft() {
    if (seatsLeft > 100) {
        seatsLeft--;
        seatsElement.textContent = seatsLeft;
        setTimeout(updateSeatsLeft, Math.random() * 30000 + 20000); // Random 20-50 seconds
    }
}

// Start decreasing seats after 10 seconds
setTimeout(updateSeatsLeft, 10000);

// ==================== //
// Stats Counter        //
// ==================== //
function formatStatNumber(num, allowFloat) {
    if (allowFloat) {
        // Show 1 decimal place, remove .0
        return parseFloat(num.toFixed(1)).toString();
    }
    return Math.floor(num).toLocaleString();
}

function animateCounter(element, target, suffix = '+', allowFloat = false) {
    const duration = 2000;
    const frameDuration = 16;
    let current = 0;
    let animationFrameId;

    // Pre-allocate space
    element.style.opacity = '1';
    element.textContent = formatStatNumber(target, allowFloat) + suffix;

    const startTime = performance.now();

    function frame(currentTime) {
        const elapsed = currentTime - startTime;
        current = Math.min((elapsed / duration) * target, target);

        element.textContent = formatStatNumber(current, allowFloat) + suffix;

        if (current < target) {
            animationFrameId = requestAnimationFrame(frame);
        } else {
            element.textContent = formatStatNumber(target, allowFloat) + suffix;
        }
    }

    animationFrameId = requestAnimationFrame(frame);
}

// Trigger counter when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number-new');

            if (statNumbers.length > 0) {
                statNumbers.forEach(stat => {
                    const targetAttr = stat.getAttribute('data-target');
                    if (targetAttr) {
                        let target = parseInt(targetAttr);
                        let suffix = '+';
                        let allowFloat = false;

                        if (target === 95) suffix = '%';

                        // "Very less numbers" logic: use k for >= 1000
                        if (target >= 1000) {
                            target = target / 1000;
                            suffix = 'k+';
                            allowFloat = true; // Allow decimals for k values like 1.3k
                        }

                        animateCounter(stat, target, suffix, allowFloat);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.1 });

const statsSection = document.querySelector('.stats-section-new');
if (statsSection) {
    statsObserver.observe(statsSection);
}

const legacySection = document.querySelector('.legacy-section');
if (legacySection) {
    statsObserver.observe(legacySection);
}

// ==================== //
// Application Modal    //
// ==================== //
const modal = document.getElementById('applicationModal');

function openApplicationModal(department = '') {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Pre-select department if provided
    if (department) {
        const departmentSelect = document.getElementById('modalDepartment');
        if (departmentSelect) {
            departmentSelect.value = department;
        }
    }

    // Track conversion event
    trackEvent('Application Modal Opened', { department: department || 'general' });
}

function closeApplicationModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeApplicationModal();
    }
});

// ==================== //
// Form Submissions     //
// ==================== //
function submitHeroForm(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    // Show success message
    showSuccessMessage('Thank you! Our counselor will contact you within 24 hours.');

    // Track conversion
    trackEvent('Hero Form Submitted', data);

    // Reset form
    event.target.reset();

    // Simulate form submission (replace with actual API call)
    console.log('Hero Form Data:', data);
}

function submitApplication(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    // Close modal
    closeApplicationModal();

    // Show success message
    showSuccessMessage('Application Submitted Successfully! Check your email for confirmation.');

    // Track conversion
    trackEvent('Application Submitted', data);

    // Reset form
    event.target.reset();

    // Simulate form submission (replace with actual API call)
    console.log('Application Data:', data);

    // Redirect to thank you page after 2 seconds (optional)
    // setTimeout(() => {
    //     window.location.href = '/thank-you.html';
    // }, 2000);
}

// ==================== //
// Success Message      //
// ==================== //
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #48BB78, #38A169);
        color: white;
        padding: 20px 40px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10001;
        font-weight: 600;
        font-size: 16px;
        animation: slideDown 0.5s ease;
    `;
    successDiv.textContent = '✅ ' + message;

    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => successDiv.remove(), 500);
    }, 4000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== //
// Scroll Animations    //
// ==================== //
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.program-card, .why-card, .testimonial-card');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });
});

// ==================== //
// Exit Intent Popup    //
// ==================== //
let exitIntentShown = false;

document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !exitIntentShown && !modal.classList.contains('active')) {
        exitIntentShown = true;

        // Show exit intent modal
        const exitModal = document.createElement('div');
        exitModal.className = 'modal active';
        exitModal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content" style="max-width: 600px;">
                <button class="modal-close" onclick="this.closest('.modal').remove(); document.body.style.overflow='auto';">&times;</button>
                <h2 class="modal-title" style="color: #F56565;">⚠️ Wait! Don't Miss Out!</h2>
                <p class="modal-subtitle" style="font-size: 18px; margin-bottom: 20px;">
                    Only <strong>${seatsLeft} seats</strong> left for 2026 admissions!
                </p>
                <p style="margin-bottom: 24px; font-size: 16px;">
                    🎓 Get <strong>FREE admission counseling</strong><br>
                    💰 Learn about <strong>scholarship opportunities</strong><br>
                    ⚡ <strong>Priority application</strong> processing
                </p>
                <button class="btn-submit-modal" onclick="this.closest('.modal').remove(); openApplicationModal();">
                    Yes, I Want Free Counseling! →
                </button>
                <p style="text-align: center; margin-top: 16px;">
                    <a href="#" onclick="this.closest('.modal').remove(); document.body.style.overflow='auto'; return false;" 
                       style="color: #718096; text-decoration: underline; font-size: 14px;">
                        No thanks, I'll miss this opportunity
                    </a>
                </p>
            </div>
        `;

        document.body.appendChild(exitModal);
        document.body.style.overflow = 'hidden';

        trackEvent('Exit Intent Shown');
    }
});

// ==================== //
// CTA Button Tracking  //
// ==================== //
document.querySelectorAll('.btn-apply-sticky, .btn-apply-nav, .btn-apply-program, .btn-cta-large, .btn-footer-apply').forEach(btn => {
    btn.addEventListener('click', () => {
        const buttonType = btn.className;
        trackEvent('CTA Button Clicked', { button: buttonType });
    });
});

// ==================== //
// Analytics Tracking   //
// ==================== //
function trackEvent(eventName, data = {}) {
    // Replace with your actual analytics tracking
    console.log('📊 Event Tracked:', eventName, data);

    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, data);
    // }

    // Example: Facebook Pixel
    // if (typeof fbq !== 'undefined') {
    //     fbq('track', eventName, data);
    // }
}

// Track page view
trackEvent('Page Viewed', {
    page: 'Landing Page',
    timestamp: new Date().toISOString()
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercent > maxScroll) {
        maxScroll = Math.floor(scrollPercent / 25) * 25; // Track in 25% increments

        if (maxScroll === 25 || maxScroll === 50 || maxScroll === 75 || maxScroll === 100) {
            trackEvent('Scroll Depth', { depth: maxScroll + '%' });
        }
    }
});

// Track time on page
let timeOnPage = 0;
setInterval(() => {
    timeOnPage += 30;
    if (timeOnPage % 60 === 0) {
        trackEvent('Time on Page', { seconds: timeOnPage });
    }
}, 30000); // Every 30 seconds

// ==================== //
// Sticky CTA Bar       //
// ==================== //
// Sticky CTA Bar - Always Visible
const stickyBar = document.querySelector('.sticky-cta-bar');
// Removed scroll hiding logic to keep it visible continuously

// ==================== //
// Social Proof         //
// ==================== //
function showSocialProof() {
    const names = ['Amit K.', 'Priya S.', 'Rahul M.', 'Sneha P.', 'Vikram R.', 'Anjali T.'];
    const departments = ['CSE', 'MBA', 'Law', 'ECE', 'Civil', 'Mechanical'];

    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        background: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        z-index: 9998;
        max-width: 300px;
        animation: slideInLeft 0.5s ease;
    `;

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomDept = departments[Math.floor(Math.random() * departments.length)];
    const randomTime = Math.floor(Math.random() * 10) + 1;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #4FD1C5, #3DBFB3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                👤
            </div>
            <div>
                <div style="font-weight: 700; font-size: 14px; color: #2D3748;">
                    ${randomName} just applied!
                </div>
                <div style="font-size: 12px; color: #718096;">
                    ${randomDept} • ${randomTime} min ago
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutLeft 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Show social proof notifications every 15-30 seconds
setInterval(() => {
    if (Math.random() > 0.3) { // 70% chance
        showSocialProof();
    }
}, Math.random() * 15000 + 15000);

// Add slide animations
const socialProofStyle = document.createElement('style');
socialProofStyle.textContent = `
    @keyframes slideInLeft {
        from {
            transform: translateX(-400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutLeft {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(-400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(socialProofStyle);

// ==================== //
// Loading Animation    //
// ==================== //
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// WhatsApp Button logic moved to HTML/CSS for better stability

console.log('🎓 SSV College - Conversion Landing Page Loaded Successfully!');
console.log('📊 All tracking and conversion elements active');

// ==================== //
// Why Choose Accordion //
// ==================== //
document.addEventListener('DOMContentLoaded', () => {
    const whyItems = document.querySelectorAll('.why-choose-item');

    whyItems.forEach(item => {
        item.addEventListener('click', () => {
            // Check if this item is already open
            const isOpen = item.classList.contains('why-choose-item-expanded');

            // Close all items
            whyItems.forEach(otherItem => {
                otherItem.classList.remove('why-choose-item-expanded');
            });

            // If it wasn't open, open it
            if (!isOpen) {
                item.classList.add('why-choose-item-expanded');
            }
        });
    });
});


// ==================== //
// Placements Carousel  //
// ==================== //
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.slides-wrapper');
    const slides = document.querySelectorAll('.placement-card');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (!wrapper || slides.length === 0) return;

    let currentSlide = 0;
    const gap = 20;
    const totalSlides = slides.length;

    // Helper to get items per view based on screen width
    // Now showing 2 items on mobile as well
    const getItemsPerView = () => 2;

    // Helper to get max index
    const getMaxIndex = () => Math.max(0, totalSlides - getItemsPerView());

    function updateCarousel() {
        const itemsPerView = getItemsPerView();
        const slideWidth = slides[0].offsetWidth;
        const moveAmount = (slideWidth + gap) * currentSlide;
        wrapper.style.transform = `translateX(-${moveAmount}px)`;

        // Update active classes if needed for other effects (optional)
        slides.forEach((slide, index) => {
            if (index >= currentSlide && index < currentSlide + itemsPerView) {
                slide.classList.add('visible');
            } else {
                slide.classList.remove('visible');
            }
        });
    }

    // Initial update
    updateCarousel();

    // Update on resize
    window.addEventListener('resize', updateCarousel);

    if (nextBtn) {
        // Clone to safely remove old listeners if any
        const newNext = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNext, nextBtn);

        newNext.addEventListener('click', () => {
            currentSlide++;
            const maxIdx = getMaxIndex();
            // Wrap logic: if we go past the end, go back to 0
            if (currentSlide > maxIdx) {
                currentSlide = 0;
            }
            updateCarousel();
        });
    }

    if (prevBtn) {
        const newPrev = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrev, prevBtn);

        newPrev.addEventListener('click', () => {
            currentSlide--;
            const maxIdx = getMaxIndex();
            // Wrap logic: if we go past start, go to end
            if (currentSlide < 0) {
                currentSlide = maxIdx;
            }
            updateCarousel();
        });
    }

    // Resize handler
    window.addEventListener('resize', updateCarousel);

    // Auto slide
    setInterval(() => {
        currentSlide++;
        const maxIdx = getMaxIndex();
        if (currentSlide > maxIdx) currentSlide = 0;
        updateCarousel();
    }, 3000);
});
