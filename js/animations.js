// Enhanced Animation Controller
class AnimationController {
    constructor() {
        this.observers = [];
        this.animatedElements = new Set();
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupClickEffects();
        this.setupParallaxEffects();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation attributes
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    animateElement(element) {
        const animationType = element.dataset.animate || 'fadeInUp';
        const delay = element.dataset.animateDelay || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in');
            element.style.animationName = animationType;
            
            // Handle staggered children
            const children = element.querySelectorAll('.stagger-child');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('animate-in');
                }, index * 100);
            });
        }, delay);
    }

    setupScrollAnimations() {
        let ticking = false;

        const handleScroll = () => {
            const scrollY = window.pageYOffset;
            
            // Parallax elements
            document.querySelectorAll('[data-parallax]').forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            // Progress bars
            document.querySelectorAll('.progress-bar').forEach(bar => {
                const rect = bar.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    bar.style.animationPlayState = 'running';
                }
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });
    }

    setupHoverEffects() {
        // Enhanced button hover effects
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });

        // Card hover effects
        document.querySelectorAll('.feature-card, .stat-item, .download-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 25px 60px rgba(59, 130, 246, 0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });

            // Tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    setupClickEffects() {
        // Ripple effect for buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = button.querySelector('.btn-ripple');
                if (!ripple) return;

                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-animate');

                setTimeout(() => {
                    ripple.classList.remove('ripple-animate');
                }, 600);
            });
        });

        // Click burst effect
        document.addEventListener('click', (e) => {
            if (Math.random() < 0.1) { // 10% chance
                this.createClickBurst(e.clientX, e.clientY);
            }
        });
    }

    setupParallaxEffects() {
        // Floating shapes
        document.querySelectorAll('.shape').forEach((shape, index) => {
            const speed = 0.5 + (index * 0.2);
            const amplitude = 20 + (index * 10);
            
            setInterval(() => {
                const offset = Math.sin(Date.now() * 0.001 * speed) * amplitude;
                shape.style.transform = `translateY(${offset}px)`;
            }, 16);
        });
    }

    createClickBurst(x, y) {
        const burstContainer = document.createElement('div');
        burstContainer.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
            z-index: 9999;
        `;

        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / 6;
            const velocity = 50 + Math.random() * 50;
            
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--accent-color);
                border-radius: 50%;
                transform: translate(-50%, -50%);
            `;
            
            burstContainer.appendChild(particle);
            
            // Animate particle
            let life = 30;
            const animate = () => {
                life--;
                const progress = life / 30;
                const distance = velocity * (1 - progress);
                
                particle.style.transform = `
                    translate(-50%, -50%) 
                    translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)
                    scale(${progress})
                `;
                particle.style.opacity = progress;
                
                if (life > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            animate();
        }
        
        document.body.appendChild(burstContainer);
        
        setTimeout(() => {
            burstContainer.remove();
        }, 1000);
    }

    // Counter animation
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }

    // Typewriter effect
    typeWriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };

        type();
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.animatedElements.clear();
    }
}

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    [data-animate] {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    [data-animate].animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .stagger-child {
        opacity: 0;
        transform: translateX(-20px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .stagger-child.animate-in {
        opacity: 1;
        transform: translateX(0);
    }
    
    .btn-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        pointer-events: none;
    }
    
    .btn-ripple.ripple-animate {
        animation: rippleEffect 0.6s ease-out;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
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
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes encryptProgress {
        0% { width: 0%; }
        50% { width: 100%; }
        100% { width: 100%; }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        [data-animate],
        .stagger-child {
            animation: none !important;
            transition: none !important;
        }
        
        [data-animate] {
            opacity: 1;
            transform: none;
        }
        
        .stagger-child {
            opacity: 1;
            transform: none;
        }
    }
`;
document.head.appendChild(animationStyles);

// Initialize animation controller
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});