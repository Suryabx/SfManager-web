// Main Application Controller
class App {
    constructor() {
        this.isLoaded = false;
        this.currentTheme = 'dark';
        this.components = {};
        
        this.init();
    }

    async init() {
        try {
            await this.showLoadingScreen();
            this.initializeComponents();
            this.setupEventListeners();
            this.initializeAnimations();
            await this.hideLoadingScreen();
            this.isLoaded = true;
        } catch (error) {
            console.error('App initialization failed:', error);
        }
    }

    async showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        return new Promise((resolve) => {
            // Simulate loading time
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

    async hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        return new Promise((resolve) => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                resolve();
            }, 500);
        });
    }

    initializeComponents() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic',
                delay: 100
            });
        }

        // Initialize counter animations
        this.initCounters();
        
        // Initialize scroll effects
        this.initScrollEffects();
        
        // Initialize interactive elements
        this.initInteractiveElements();
    }

    initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

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

    initScrollEffects() {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrollY = window.pageYOffset;
            
            // Parallax effects
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            // Update back to top button
            this.updateBackToTop(scrollY);
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }

    updateBackToTop(scrollY) {
        const backToTop = document.getElementById('back-to-top');
        if (!backToTop) return;

        if (scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    initInteractiveElements() {
        // Enhanced button interactions
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            this.enhanceButton(button);
        });

        // Card hover effects
        const cards = document.querySelectorAll('.feature-card, .stat-item');
        cards.forEach(card => {
            this.enhanceCard(card);
        });

        // Navigation enhancements
        this.enhanceNavigation();
    }

    enhanceButton(button) {
        // Add ripple effect
        button.addEventListener('click', (e) => {
            const ripple = button.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.width = '0';
                ripple.style.height = '0';
                
                setTimeout(() => {
                    ripple.style.width = '300px';
                    ripple.style.height = '300px';
                }, 10);
                
                setTimeout(() => {
                    ripple.style.width = '0';
                    ripple.style.height = '0';
                }, 600);
            }
        });

        // Add hover sound effect (optional)
        button.addEventListener('mouseenter', () => {
            // Could add subtle sound effect here
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    }

    enhanceCard(card) {
        card.addEventListener('mouseenter', () => {
            // Add subtle glow effect
            card.style.boxShadow = '0 25px 60px rgba(59, 130, 246, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });

        // Add tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    }

    enhanceNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add active state animation
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Smooth scroll for anchor links
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    initializeAnimations() {
        // Stagger animations for elements
        const staggerElements = document.querySelectorAll('[data-aos]');
        staggerElements.forEach((element, index) => {
            if (element.classList.contains('stagger-child')) {
                element.setAttribute('data-aos-delay', (index * 100).toString());
            }
        });

        // Initialize typewriter effect
        this.initTypewriter();
        
        // Initialize progress bars
        this.initProgressBars();
    }

    initTypewriter() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            // Start typewriter effect when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'encryptProgress 3s ease-in-out infinite';
                }
            });
        });
        
        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    setupEventListeners() {
        // Back to top button
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Theme change listener
        window.addEventListener('themeChanged', (e) => {
            this.currentTheme = e.detail.theme;
            this.updateThemeElements();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Performance monitoring
        this.monitorPerformance();
    }

    updateThemeElements() {
        // Update any theme-dependent elements
        const themeElements = document.querySelectorAll('[data-theme-element]');
        themeElements.forEach(element => {
            element.classList.toggle('dark-theme', this.currentTheme === 'dark');
            element.classList.toggle('light-theme', this.currentTheme === 'light');
        });
    }

    handleKeyboardShortcuts(e) {
        // Escape key to close modals/menus
        if (e.key === 'Escape') {
            const activeMenu = document.querySelector('.nav-menu.active');
            if (activeMenu) {
                activeMenu.classList.remove('active');
                document.getElementById('nav-toggle')?.classList.remove('active');
            }
        }

        // Space bar to pause animations (for accessibility)
        if (e.key === ' ' && e.ctrlKey) {
            e.preventDefault();
            this.toggleAnimations();
        }
    }

    toggleAnimations() {
        const body = document.body;
        body.classList.toggle('animations-paused');
        
        if (body.classList.contains('animations-paused')) {
            // Pause all animations
            const style = document.createElement('style');
            style.id = 'pause-animations';
            style.textContent = `
                *, *::before, *::after {
                    animation-play-state: paused !important;
                    transition: none !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            // Resume animations
            const pauseStyle = document.getElementById('pause-animations');
            if (pauseStyle) {
                pauseStyle.remove();
            }
        }
    }

    monitorPerformance() {
        // Monitor FPS
        let lastTime = performance.now();
        let frameCount = 0;
        
        const checkFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // Reduce effects if FPS is low
                if (fps < 30) {
                    this.optimizePerformance();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        requestAnimationFrame(checkFPS);
    }

    optimizePerformance() {
        // Reduce particle count
        if (window.particleSystem) {
            window.particleSystem.maxParticles = Math.floor(window.particleSystem.maxParticles * 0.7);
        }
        
        // Disable some animations
        document.body.classList.add('performance-mode');
        
        console.log('Performance mode activated');
    }

    // Public methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--card-bg);
            color: var(--text-color);
            border-radius: var(--border-radius);
            box-shadow: 0 10px 30px var(--shadow);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    preloadImages() {
        const images = [
            'images/satan.png',
            'images/github.png',
            'images/email.png'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}