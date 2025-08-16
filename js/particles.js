// Advanced Particle System
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles-container');
        this.particles = [];
        this.connections = [];
        this.maxParticles = this.getMaxParticles();
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }

    getMaxParticles() {
        const width = window.innerWidth;
        if (width < 480) return 30;
        if (width < 768) return 50;
        if (width < 1024) return 80;
        return 100;
    }

    init() {
        if (!this.container) return;
        
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = {
            element: document.createElement('div'),
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 8 + 2,
            opacity: Math.random() * 0.5 + 0.3,
            hue: Math.random() * 60 + 200, // Blue to purple range
            life: Math.random() * 100 + 50,
            maxLife: Math.random() * 100 + 50
        };

        // Set particle appearance
        particle.element.className = 'particle';
        particle.element.style.cssText = `
            position: absolute;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: hsl(${particle.hue}, 70%, 60%);
            border-radius: 50%;
            pointer-events: none;
            opacity: ${particle.opacity};
            box-shadow: 0 0 ${particle.size * 2}px hsl(${particle.hue}, 70%, 60%);
            transform: translate(${particle.x}px, ${particle.y}px);
            transition: all 0.3s ease;
        `;

        this.container.appendChild(particle.element);
        this.particles.push(particle);

        return particle;
    }

    updateParticle(particle) {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > window.innerWidth) {
            particle.vx *= -1;
            particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
        }
        if (particle.y < 0 || particle.y > window.innerHeight) {
            particle.vy *= -1;
            particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
        }

        // Update life
        particle.life--;
        const lifeRatio = particle.life / particle.maxLife;
        particle.opacity = lifeRatio * 0.5 + 0.1;

        // Mouse interaction
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx += (dx / distance) * force * 0.01;
            particle.vy += (dy / distance) * force * 0.01;
            particle.opacity = Math.min(1, particle.opacity + force * 0.3);
        }

        // Apply velocity damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Update DOM element
        particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        particle.element.style.opacity = particle.opacity;

        // Respawn if dead
        if (particle.life <= 0) {
            this.respawnParticle(particle);
        }
    }

    respawnParticle(particle) {
        particle.x = Math.random() * window.innerWidth;
        particle.y = Math.random() * window.innerHeight;
        particle.vx = (Math.random() - 0.5) * 0.5;
        particle.vy = (Math.random() - 0.5) * 0.5;
        particle.life = particle.maxLife;
        particle.hue = Math.random() * 60 + 200;
        particle.element.style.background = `hsl(${particle.hue}, 70%, 60%)`;
        particle.element.style.boxShadow = `0 0 ${particle.size * 2}px hsl(${particle.hue}, 70%, 60%)`;
    }

    createConnections() {
        // Clear existing connections
        this.connections.forEach(connection => {
            if (connection.element && connection.element.parentNode) {
                connection.element.parentNode.removeChild(connection.element);
            }
        });
        this.connections = [];

        // Create new connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.createConnection(p1, p2, distance);
                }
            }
        }
    }

    createConnection(p1, p2, distance) {
        const connection = {
            element: document.createElement('div'),
            p1: p1,
            p2: p2
        };

        const opacity = (120 - distance) / 120 * 0.3;
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

        connection.element.className = 'particle-connection';
        connection.element.style.cssText = `
            position: absolute;
            width: ${distance}px;
            height: 1px;
            background: linear-gradient(90deg, 
                hsl(${p1.hue}, 70%, 60%), 
                hsl(${(p1.hue + p2.hue) / 2}, 70%, 60%), 
                hsl(${p2.hue}, 70%, 60%)
            );
            opacity: ${opacity};
            transform: translate(${p1.x}px, ${p1.y}px) rotate(${angle}deg);
            transform-origin: 0 0;
            pointer-events: none;
        `;

        this.container.appendChild(connection.element);
        this.connections.push(connection);
    }

    animate() {
        // Update particles
        this.particles.forEach(particle => this.updateParticle(particle));

        // Update connections less frequently for performance
        if (Math.random() < 0.1) {
            this.createConnections();
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });

        // Theme change
        window.addEventListener('themeChanged', () => {
            this.updateParticleColors();
        });
    }

    handleResize() {
        const newMaxParticles = this.getMaxParticles();
        
        if (newMaxParticles > this.maxParticles) {
            // Add particles
            for (let i = this.maxParticles; i < newMaxParticles; i++) {
                this.createParticle();
            }
        } else if (newMaxParticles < this.maxParticles) {
            // Remove particles
            const toRemove = this.particles.splice(newMaxParticles);
            toRemove.forEach(particle => {
                if (particle.element && particle.element.parentNode) {
                    particle.element.parentNode.removeChild(particle.element);
                }
            });
        }
        
        this.maxParticles = newMaxParticles;
    }

    updateParticleColors() {
        this.particles.forEach(particle => {
            particle.hue = Math.random() * 60 + 200;
            particle.element.style.background = `hsl(${particle.hue}, 70%, 60%)`;
            particle.element.style.boxShadow = `0 0 ${particle.size * 2}px hsl(${particle.hue}, 70%, 60%)`;
        });
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }

    destroy() {
        this.pause();
        
        // Remove all particles
        this.particles.forEach(particle => {
            if (particle.element && particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        });
        
        // Remove all connections
        this.connections.forEach(connection => {
            if (connection.element && connection.element.parentNode) {
                connection.element.parentNode.removeChild(connection.element);
            }
        });
        
        this.particles = [];
        this.connections = [];
    }

    // Special effects
    createBurst(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const burstParticle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / count;
            const velocity = Math.random() * 5 + 2;
            const size = Math.random() * 6 + 2;
            
            burstParticle.className = 'particle-burst';
            burstParticle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: hsl(${Math.random() * 60 + 200}, 70%, 60%);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.container.appendChild(burstParticle);
            
            // Animate burst particle
            let life = 60;
            const animate = () => {
                life--;
                const progress = life / 60;
                
                burstParticle.style.transform = `translate(${Math.cos(angle) * velocity * (60 - life)}px, ${Math.sin(angle) * velocity * (60 - life)}px) scale(${progress})`;
                burstParticle.style.opacity = progress;
                
                if (life > 0) {
                    requestAnimationFrame(animate);
                } else {
                    burstParticle.remove();
                }
            };
            
            animate();
        }
    }
}

// Constellation Effect
class ConstellationEffect {
    constructor() {
        this.container = document.getElementById('particles-container');
        this.stars = [];
        this.constellations = [];
        
        if (this.container) {
            this.init();
        }
    }

    init() {
        this.createStars();
        this.createConstellations();
    }

    createStars() {
        const starCount = Math.floor(window.innerWidth / 50);
        
        for (let i = 0; i < starCount; i++) {
            const star = {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                element: document.createElement('div')
            };
            
            star.element.className = 'constellation-star';
            star.element.style.cssText = `
                left: ${star.x}px;
                top: ${star.y}px;
                animation-delay: ${Math.random() * 3}s;
            `;
            
            this.container.appendChild(star.element);
            this.stars.push(star);
        }
    }

    createConstellations() {
        // Create connections between nearby stars
        for (let i = 0; i < this.stars.length; i++) {
            for (let j = i + 1; j < this.stars.length; j++) {
                const star1 = this.stars[i];
                const star2 = this.stars[j];
                const distance = Math.sqrt(
                    Math.pow(star1.x - star2.x, 2) + 
                    Math.pow(star1.y - star2.y, 2)
                );
                
                if (distance < 200 && Math.random() < 0.3) {
                    this.createConstellationLine(star1, star2, distance);
                }
            }
        }
    }

    createConstellationLine(star1, star2, distance) {
        const line = document.createElement('div');
        const angle = Math.atan2(star2.y - star1.y, star2.x - star1.x) * 180 / Math.PI;
        
        line.className = 'constellation-line';
        line.style.cssText = `
            width: ${distance}px;
            left: ${star1.x}px;
            top: ${star1.y}px;
            transform: rotate(${angle}deg);
            transform-origin: 0 0;
            animation-delay: ${Math.random() * 4}s;
        `;
        
        this.container.appendChild(line);
        this.constellations.push(line);
    }
}

// Initialize particle systems when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        window.particleSystem = new ParticleSystem();
        
        // Add constellation effect on larger screens
        if (window.innerWidth > 768) {
            setTimeout(() => {
                window.constellationEffect = new ConstellationEffect();
            }, 2000);
        }
        
        // Add click burst effect
        document.addEventListener('click', (e) => {
            if (window.particleSystem && Math.random() < 0.3) {
                window.particleSystem.createBurst(e.clientX, e.clientY, 8);
            }
        });
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.particleSystem) {
        window.particleSystem.destroy();
    }
});