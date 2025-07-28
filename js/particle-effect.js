function initParticleEffect() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    // Ensure the canvas size matches the viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const config = {
        particleCount: 1500,
        meteorCount: 5,
        baseSpeed: 0.3,
        mouseRadius: 200,
        mouseStrength: 0.03,
        layers: 3,
        colors: {
            stars: ['#ffffff', '#d4e7ff', '#a8d0ff', '#7cb9ff'],
            meteors: ['#ffffff', '#64b5f6', '#4fc3f7', '#bbdefb']
        }
    };

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
    }

    initCanvas();

    class ParticleSystem {
        constructor() {
            this.particles = [];
            this.mouseX = null;
            this.mouseY = null;
            this.initParticles();
            this.setupEventListeners();
        }

        initParticles() {
            for (let i = 0; i < config.particleCount; i++) {
                this.particles.push(this.createParticle(true));
            }
        }

        createParticle(randomZ = false) {
            const layer = Math.floor(Math.random() * config.layers);
            const z = randomZ ? Math.random() * canvas.width : 0;

            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: z,
                baseZ: layer * (canvas.width / config.layers),
                radius: Math.random() * (1 + layer * 0.5) + 0.5,
                color: config.colors.stars[Math.floor(Math.random() * config.colors.stars.length)],
                speed: {
                    x: (Math.random() * 2 - 1) * config.baseSpeed * (layer + 1),
                    y: (Math.random() * 2 - 1) * config.baseSpeed * (layer + 1),
                    z: (Math.random() * 2 - 1) * config.baseSpeed
                },
                layer: layer,
                twinkle: Math.random() * 5,
                twinkleSpeed: Math.random() * 0.05 + 0.01
            };
        }

        updateParticles() {
            this.particles.forEach(particle => {
                particle.x += particle.speed.x;
                particle.y += particle.speed.y;
                particle.z += particle.speed.z;

                particle.twinkle += particle.twinkleSpeed;
                const alpha = 0.7 + Math.sin(particle.twinkle) * 0.3;

                if (this.mouseX !== null && this.mouseY !== null) {
                    const dx = this.mouseX - particle.x;
                    const dy = this.mouseY - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.mouseRadius) {
                        const force = (config.mouseRadius - distance) / config.mouseRadius;
                        particle.x += dx * force * config.mouseStrength;
                        particle.y += dy * force * config.mouseStrength;
                    }
                }

                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                if (particle.z < 0) particle.z = canvas.width;
                if (particle.z > canvas.width) particle.z = 0;

                particle.currentColor = particle.color.replace(')', `,${alpha})`).replace('rgb', 'rgba');
            });
        }

        drawParticles() {
            const sortedParticles = [...this.particles].sort((a, b) => a.z - b.z);

            sortedParticles.forEach(particle => {
                const perspective = canvas.width / (canvas.width + particle.z + particle.baseZ);
                const x = particle.x * perspective;
                const y = particle.y * perspective;
                const radius = particle.radius * perspective;

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.currentColor || particle.color;
                ctx.fill();
            });
        }

        setupEventListeners() {
            canvas.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });

            canvas.addEventListener('mouseleave', () => {
                this.mouseX = null;
                this.mouseY = null;
            });

            canvas.addEventListener('click', (e) => {
                for (let i = 0; i < 20; i++) {
                    const particle = this.createParticle();
                    particle.x = e.clientX + (Math.random() * 100 - 50);
                    particle.y = e.clientY + (Math.random() * 100 - 50);
                    this.particles.push(particle);
                }
            });
        }
    }

    class MeteorSystem {
        constructor() {
            this.meteors = [];
            this.lastMeteorTime = 0;
            this.meteorInterval = 800;
        }

        createMeteor() {
            const angle = Math.random() * Math.PI / 4 + Math.PI / 8;
            const speed = Math.random() * 3 + 2;
            const length = Math.random() * 150 + 100;

            return {
                x: Math.random() * canvas.width,
                y: -50,
                angle: angle,
                speed: speed,
                length: 0,
                maxLength: length,
                segments: [],
                color: config.colors.meteors[Math.floor(Math.random() * config.colors.meteors.length)],
                opacity: 1,
                decayRate: Math.random() * 0.008 + 0.005
            };
        }

        updateMeteors() {
            const now = Date.now();

            if (now - this.lastMeteorTime > this.meteorInterval && this.meteors.length < config.meteorCount) {
                this.meteors.push(this.createMeteor());
                this.lastMeteorTime = now;
                this.meteorInterval = Math.random() * 1500 + 500;
            }

            this.meteors.forEach((meteor, index) => {
                meteor.x += Math.cos(meteor.angle) * meteor.speed;
                meteor.y += Math.sin(meteor.angle) * meteor.speed;
                meteor.length += meteor.speed;

                meteor.segments.push({
                    x: meteor.x,
                    y: meteor.y,
                    opacity: meteor.opacity
                });

                if (meteor.segments.length > 20) {
                    meteor.segments.shift();
                }

                meteor.segments.forEach(segment => {
                    segment.opacity *= 0.95;
                });

                meteor.opacity -= meteor.decayRate;

                if (meteor.opacity <= 0.1 || meteor.y > canvas.height + 50) {
                    this.meteors.splice(index, 1);
                }
            });
        }

        drawMeteors() {
            this.meteors.forEach(meteor => {
                ctx.save();
                for (let i = 0; i < meteor.segments.length - 1; i++) {
                    const segment = meteor.segments[i];
                    const nextSegment = meteor.segments[i + 1];

                    const gradient = ctx.createLinearGradient(
                        segment.x, segment.y,
                        nextSegment.x, nextSegment.y
                    );

                    gradient.addColorStop(0, `${meteor.color.replace(')', `,${segment.opacity})`)}`);
                    gradient.addColorStop(1, `${meteor.color.replace(')', `,${nextSegment.opacity * 0.8})`)}`);

                    ctx.beginPath();
                    ctx.moveTo(segment.x, segment.y);
                    ctx.lineTo(nextSegment.x, nextSegment.y);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 2 * (i / meteor.segments.length) + 1;
                    ctx.stroke();
                }
                ctx.restore();

                ctx.beginPath();
                ctx.arc(meteor.x, meteor.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `${meteor.color.replace(')', `,${meteor.opacity})`)}`;
                ctx.fill();
            });
        }
    }

    const particleSystem = new ParticleSystem();
    const meteorSystem = new MeteorSystem();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, '#0a0a2a');
        bgGradient.addColorStop(1, '#000000');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particleSystem.updateParticles();
        meteorSystem.updateMeteors();

        particleSystem.drawParticles();
        meteorSystem.drawMeteors();

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    animate();
}

document.addEventListener('DOMContentLoaded', initParticleEffect);