// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    

    // Interactive shapes - add click effects
    document.querySelectorAll('.shape, .shape-large, .shape-medium, .shape-small').forEach(shape => {
        shape.addEventListener('click', function() {
            this.style.transform += ' scale(1.2)';
            setTimeout(() => {
                this.style.transform = this.style.transform.replace(' scale(1.2)', '');
            }, 300);
        });
    });

    // Fun facts rotation
    const facts = document.querySelectorAll('.fact');
    facts.forEach((fact, index) => {
        fact.addEventListener('mouseenter', function() {
            // Add a fun bounce effect
            this.style.animation = 'bounce 0.6s ease-in-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });

    // Method cards interaction
    document.querySelectorAll('.method').forEach(method => {
        method.addEventListener('mouseenter', function() {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Parallax effect for hero shapes (subtle)
    let ticking = false;
    
    function updateShapes() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const shapes = document.querySelectorAll('.geometric-shapes .shape');
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            shape.style.transform += ` translateY(${rate * speed}px)`;
        });
        
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateShapes);
            ticking = true;
        }
    });

    // Enhanced Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add the appropriate animation class
                if (element.classList.contains('animate-left')) {
                    element.style.opacity = '1';
                    element.style.animation = 'slideInFromLeft 0.8s ease-out forwards';
                } else if (element.classList.contains('animate-right')) {
                    element.style.opacity = '1';
                    element.style.animation = 'slideInFromRight 0.8s ease-out forwards';
                } else if (element.classList.contains('animate-bottom')) {
                    element.style.opacity = '1';
                    element.style.animation = 'slideInFromBottom 0.8s ease-out forwards';
                } else if (element.classList.contains('animate-scale')) {
                    element.style.opacity = '1';
                    element.style.animation = 'fadeInScale 0.8s ease-out forwards';
                } else {
                    element.classList.add('animate-in');
                }
                
                // Unobserve after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.animate-on-scroll, .stat, .method, .subject-card, .fact, .highlight-item').forEach(el => {
        observer.observe(el);
    });

    // Easter egg: Konami code for fun surprise
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join('') === konamiSequence.join('')) {
            showNotification('🎉 You found the secret! Learning is indeed like a game!', 'success');
            // Add rainbow effect to shapes
            document.querySelectorAll('.shape, .shape-large, .shape-medium, .shape-small').forEach(shape => {
                shape.style.animation = 'rainbow 2s infinite';
            });
        }
    });
});

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 1001;
        max-width: 400px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#E31E24' : type === 'success' ? '#4CAF50' : '#0047AB'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-family: var(--font-primary, 'Inter', sans-serif);
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            closeNotification(notification);
        }
    }, 5000);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 300);
}

// Add additional CSS animations via JavaScript (for elements that need them)
const additionalCSS = `
/* Mobile Navigation Styles */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        left: -100%;
        top: 70px;
        flex-direction: column;
        background-color: var(--primary-white, #ffffff);
        width: 100%;
        text-align: center;
        transition: 0.3s;
        box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
        padding: 2rem 0;
    }

    .nav-menu.active {
        left: 0;
    }

    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }

    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
}

/* Animation classes */
.animate-in {
    animation: slideInUp 0.6s ease-out forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
}

@keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

/* Ripple effect */
.ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: rippleEffect 0.6s linear;
    background-color: rgba(255, 255, 255, 0.3);
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin-left: -10px;
    margin-top: -10px;
}

@keyframes rippleEffect {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* Scrolled navbar */
.navbar.scrolled {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
}

/* Notification styles */
.notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

.notification-close:hover {
    opacity: 0.8;
}
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Fun loading animation
window.addEventListener('load', function() {
    const heroShapes = document.querySelectorAll('.geometric-shapes .shape');
    heroShapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 0.2}s`;
        shape.classList.add('animate-in');
    });
}); 
