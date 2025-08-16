// Enhanced Theme Controller
class ThemeController {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme, false);
        this.setupEventListeners();
        this.setupSystemThemeListener();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme, animate = true) {
        if (animate) {
            document.body.classList.add('theme-transitioning');
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 300);
        }

        document.body.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        this.updateIcon(theme);
        this.updateMetaThemeColor(theme);
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    }

    updateIcon(theme) {
        if (!this.themeIcon) return;
        
        const isDark = theme === 'dark';
        this.themeIcon.className = isDark ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
        
        // Add rotation animation
        this.themeIcon.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.themeIcon.style.transform = 'rotate(0deg)';
        }, 300);
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        const color = theme === 'dark' ? '#0f172a' : '#ffffff';
        
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color);
        } else {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            metaThemeColor.content = color;
            document.head.appendChild(metaThemeColor);
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
                
                // Add click animation
                this.themeToggle.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.themeToggle.style.transform = 'scale(1)';
                }, 150);
            });
        }

        // Keyboard shortcut (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Add theme transition styles
const themeStyles = document.createElement('style');
themeStyles.textContent = `
    .theme-transitioning * {
        transition: background-color 0.3s ease,
                   color 0.3s ease,
                   border-color 0.3s ease,
                   box-shadow 0.3s ease !important;
    }
    
    .theme-icon {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(themeStyles);

// Initialize theme controller
document.addEventListener('DOMContentLoaded', () => {
    window.themeController = new ThemeController();
});