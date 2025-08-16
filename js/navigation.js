// Enhanced Navigation Controller
class NavigationController {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.backToTop = document.getElementById('back-to-top');
        
        this.isMenuOpen = false;
        this.lastScrollY = 0;
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupSmoothScrolling();
        this.setupBackToTop();
        this.setupActiveNavigation();
    }

    setupMobileMenu() {
        if (!this.navToggle || !this.navMenu) return;

        this.navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isMenuOpen = true;
        this.navToggle.classList.add('active');
        this.navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupScrollEffects() {
        let ticking = false;

        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;
            
            // Hide/show navbar on scroll
            if (currentScrollY > 100) {
                if (currentScrollY > this.lastScrollY) {
                    // Scrolling down
                    this.navbar.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    this.navbar.style.transform = 'translateY(0)';
                }
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }

            // Add background blur on scroll
            if (currentScrollY > 50) {
                this.navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                this.navbar.style.backdropFilter = 'blur(20px)';
            } else {
                this.navbar.style.background = 'rgba(15, 23, 42, 0.9)';
                this.navbar.style.backdropFilter = 'blur(10px)';
            }

            this.lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Handle anchor links
                if (href && href.includes('#')) {
                    const [page, anchor] = href.split('#');
                    
                    // If it's the same page
                    if (!page || page === window.location.pathname.split('/').pop()) {
                        e.preventDefault();
                        const target = document.getElementById(anchor);
                        
                        if (target) {
                            const headerHeight = this.navbar.offsetHeight;
                            const targetPosition = target.offsetTop - headerHeight - 20;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            });
        });
    }

    setupBackToTop() {
        if (!this.backToTop) return;

        let isVisible = false;

        const toggleVisibility = () => {
            const scrollTop = window.pageYOffset;
            const shouldShow = scrollTop > 300;

            if (shouldShow && !isVisible) {
                this.backToTop.classList.add('visible');
                isVisible = true;
            } else if (!shouldShow && isVisible) {
                this.backToTop.classList.remove('visible');
                isVisible = false;
            }
        };

        // Throttled scroll listener
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    toggleVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        });

        this.backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupActiveNavigation() {
        // Set active nav link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Intersection observer for section-based navigation
        if (currentPage === 'index.html' || currentPage === '') {
            this.setupSectionObserver();
        }
    }

    setupSectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;

        const observerOptions = {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active class from all nav links
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to corresponding nav link
                    const activeLink = document.querySelector(`.nav-link[href*="#${entry.target.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// Add navigation styles
const navStyles = document.createElement('style');
navStyles.textContent = `
    .navbar {
        transition: transform 0.3s ease, background-color 0.3s ease, backdrop-filter 0.3s ease;
    }
    
    .nav-toggle {
        transition: all 0.3s ease;
    }
    
    .nav-toggle span {
        transition: all 0.3s ease;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .nav-menu {
        transition: transform 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            background: var(--card-bg);
            flex-direction: column;
            padding: 2rem;
            transform: translateX(-100%);
            border-top: 1px solid var(--border-color);
            box-shadow: 0 10px 30px var(--shadow);
        }
        
        .nav-menu.active {
            transform: translateX(0);
        }
    }
    
    .back-to-top {
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .back-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
`;
document.head.appendChild(navStyles);

// Initialize navigation controller
document.addEventListener('DOMContentLoaded', () => {
    window.navigationController = new NavigationController();
});