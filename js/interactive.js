// Particle effect
class ParticleEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.createParticles();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.canvas.className = 'particle-canvas';
        document.querySelector('.hero').appendChild(this.canvas);
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                color: `rgba(212, 175, 55, ${Math.random() * 0.28})`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap particles around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            // Connect particles near mouse
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(212, 175, 55, ${0.18 * (1 - distance/100)})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.moveTo(this.mouseX, this.mouseY);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.stroke();
            }
        });

        requestAnimationFrame(() => this.animate());
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
}

// Magnetic buttons effect
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.bound = element.getBoundingClientRect();
        this.threshold = 40;
        
        this.addEventListeners();
    }

    addEventListeners() {
        this.element.addEventListener('mousemove', (e) => this.handleMouse(e));
        this.element.addEventListener('mouseleave', () => this.reset());
    }

    handleMouse(e) {
        const { clientX, clientY } = e;
        const { left, top, width, height } = this.bound;
        const x = clientX - left;
        const y = clientY - top;
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(Math.sqrt(deltaX**2 + deltaY**2), this.threshold);
        
        const translateX = distance * Math.cos(angle);
        const translateY = distance * Math.sin(angle);
        
        this.element.style.transform = `translate(${translateX/3}px, ${translateY/3}px)`;
    }

    reset() {
        this.element.style.transform = 'translate(0px, 0px)';
    }
}

// Tilt effect for cards
class TiltEffect {
    constructor(element) {
        this.element = element;
        this.size = element.getBoundingClientRect();
        this.mouseX = 0;
        this.mouseY = 0;
        this.centerX = this.size.width / 2;
        this.centerY = this.size.height / 2;
        
        this.addEventListeners();
    }

    addEventListeners() {
        this.element.addEventListener('mousemove', (e) => this.handleMouse(e));
        this.element.addEventListener('mouseleave', () => this.reset());
    }

    handleMouse(e) {
        const { left, top } = this.element.getBoundingClientRect();
        this.mouseX = e.clientX - left;
        this.mouseY = e.clientY - top;
        
        const angleX = ((this.mouseY - this.centerY) / this.centerY) * 10;
        const angleY = ((this.mouseX - this.centerX) / this.centerX) * 10;
        
        this.element.style.transform = `perspective(1000px) rotateX(${-angleX}deg) rotateY(${angleY}deg) scale3d(1.05, 1.05, 1.05)`;
    }

    reset() {
        this.element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
}

// Initialize interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add particle effect to hero section
    if (document.querySelector('.hero')) {
        new ParticleEffect();
    }

    // Add magnetic effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        new MagneticButton(button);
    });

    // Add tilt effect to cards
    document.querySelectorAll('.feature-card, .service-card, .value-card, .testimonial-card').forEach(card => {
        new TiltEffect(card);
    });

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });

    // Add custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Interactive logo tracking
        const heroLogo = document.querySelector('.animated-logo');
        if (heroLogo && window.innerHeight > 768) {
            const rect = heroLogo.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angleX = (e.clientY - centerY) / 20;
            const angleY = (e.clientX - centerX) / 20;
            
            heroLogo.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        }
    });

    // Highlight elements on hover
    document.querySelectorAll('a, button, .card').forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
    
    // Reset logo rotation on mouse leave
    document.addEventListener('mouseleave', () => {
        const heroLogo = document.querySelector('.animated-logo');
        if (heroLogo) {
            heroLogo.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        }
    });
});