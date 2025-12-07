document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Custom Cursor
    const cursor = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursor.style.left = `${posX}px`;
        cursor.style.top = `${posY}px`;

        outline.style.left = `${posX}px`;
        outline.style.top = `${posY}px`;

        // Add trail effect logic if needed
    });

    // Hover effect for cursor
    const links = document.querySelectorAll('a, button, .btn');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            outline.style.width = '60px';
            outline.style.height = '60px';
            outline.style.backgroundColor = 'rgba(92, 201, 196, 0.1)';
        });
        link.addEventListener('mouseleave', () => {
            outline.style.width = '40px';
            outline.style.height = '40px';
            outline.style.backgroundColor = 'transparent';
        });
    });

    // Fade-in Animation on Scroll
    const sections = document.querySelectorAll('.section, .hero-section');

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    /* =========================================
       N8N Style Node Background Animation
       ========================================= */
    const canvas = document.getElementById('bg-animation');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 100; // Number of nodes
    const connectionDistance = 150; // Max distance to connect
    const flightSpeed = 1.5; // Speed of "flying" forward

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * width; // Depth for 3D effect
            this.size = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
        }

        update() {
            // Move particle forward (decrease Z to simulate camera moving forward) or just move in 2D
            // Let's go with a "Flow" effect where particles move down/forward

            // "Shaheen flying" effect: Camera moves forward through the starfield.
            // We simulate this by moving particles OUTWARDS from center or simply managing Z.

            // Let's implement pseudo-3D flow for the "Flying" sensation
            // Z decreases (comes closer)
            this.z -= flightSpeed;

            // Reset if behind camera
            if (this.z <= 1) {
                this.z = width;
                this.x = Math.random() * width;
                this.y = Math.random() * height;
            }
        }

        draw() {
            // Perspective projection
            // x2d = (x - center) * (focalLength / z) + center
            // Simple approach: simpler starfield logic

            // Let's stick to 2D network with drift for "Flow" to ensure N8N style connectivity is visible
            // Pure 3D starfield often makes connections hard to see as they cross depth.
            // Hybrid: Particles drift slowly, and we have a "pulse" of movement.

            // Reverting to drifting nodes but with a direction to simulate 'flying' (e.g. diagonal drift)
            // User asked for "flying" and "pure".
            // Let's make them flow diagonally up-right or forward?
            // Let's try "Warp Speed" but slow + Connections.

            // Actually, best "N8N" look is 2D nodes floating.
            // "Shaheen flying" implies speed.
            // Let's do a directional flow: Nodes move from right to left significantly (flying forward)

            this.x -= flightSpeed;
            this.y += this.vy;

            // Wrap around
            if (this.x < 0) this.x = width;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(92, 201, 196, ' + (0.5 + Math.random() * 0.5) + ')'; // Teal
            ctx.fill();
        }
    }

    function init() {
        resize();
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        // Optimization: only check nested loop near each other? 
        // With 100 particles, O(N^2) is fine (10,000 checks)
        ctx.strokeStyle = 'rgba(92, 201, 196, 0.15)';
        ctx.lineWidth = 1;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    });

    init();
    animate();
});
