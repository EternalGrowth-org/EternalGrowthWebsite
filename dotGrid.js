// Interactive Dot Grid Implementation
class DotGrid {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dots = [];
        this.pointer = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            speed: 0,
            lastTime: 0,
            lastX: 0,
            lastY: 0
        };

        // Configuration
        this.config = {
            dotSize: options.dotSize || 4,
            gap: options.gap || 25,
            baseColor: options.baseColor || '#6B8E23',
            activeColor: options.activeColor || '#9ACD32',
            proximity: options.proximity || 80,
            speedTrigger: options.speedTrigger || 50,
            shockRadius: options.shockRadius || 150,
            shockStrength: options.shockStrength || 3,
            maxSpeed: options.maxSpeed || 2000,
            resistance: options.resistance || 500,
            returnDuration: options.returnDuration || 1.2,
            ...options
        };

        this.baseRgb = this.hexToRgb(this.config.baseColor);
        this.activeRgb = this.hexToRgb(this.config.activeColor);

        this.init();
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    init() {
        this.buildGrid();
        this.bindEvents();
        this.animate();

        // Handle resize
        window.addEventListener('resize', () => this.buildGrid());
    }

    buildGrid() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        this.ctx.scale(dpr, dpr);

        const cols = Math.floor((rect.width + this.config.gap) / (this.config.dotSize + this.config.gap));
        const rows = Math.floor((rect.height + this.config.gap) / (this.config.dotSize + this.config.gap));
        const cell = this.config.dotSize + this.config.gap;

        const gridW = cell * cols - this.config.gap;
        const gridH = cell * rows - this.config.gap;

        const startX = (rect.width - gridW) / 2 + this.config.dotSize / 2;
        const startY = (rect.height - gridH) / 2 + this.config.dotSize / 2;

        this.dots = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = startX + x * cell;
                const cy = startY + y * cell;
                this.dots.push({
                    cx,
                    cy,
                    xOffset: 0,
                    yOffset: 0,
                    targetX: 0,
                    targetY: 0,
                    vx: 0,
                    vy: 0,
                    isAnimating: false
                });
            }
        }
    }

    bindEvents() {
        const throttle = (func, limit) => {
            let lastCall = 0;
            return (...args) => {
                const now = performance.now();
                if (now - lastCall >= limit) {
                    lastCall = now;
                    func(...args);
                }
            };
        };

        const handleMouseMove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const now = performance.now();
            const pr = this.pointer;
            
            const dt = pr.lastTime ? now - pr.lastTime : 16;
            const dx = e.clientX - pr.lastX;
            const dy = e.clientY - pr.lastY;
            
            let vx = (dx / dt) * 1000;
            let vy = (dy / dt) * 1000;
            let speed = Math.hypot(vx, vy);
            
            if (speed > this.config.maxSpeed) {
                const scale = this.config.maxSpeed / speed;
                vx *= scale;
                vy *= scale;
                speed = this.config.maxSpeed;
            }

            pr.lastTime = now;
            pr.lastX = e.clientX;
            pr.lastY = e.clientY;
            pr.vx = vx;
            pr.vy = vy;
            pr.speed = speed;
            pr.x = e.clientX - rect.left;
            pr.y = e.clientY - rect.top;

            // Apply movement effects
            this.applyMovementEffect();
        };

        const handleClick = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            this.applyShockWave(clickX, clickY);
        };

        window.addEventListener('mousemove', throttle(handleMouseMove, 16));
        window.addEventListener('click', handleClick);
    }

    applyMovementEffect() {
        const pr = this.pointer;
        
        this.dots.forEach(dot => {
            const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
            
            if (pr.speed > this.config.speedTrigger && dist < this.config.proximity && !dot.isAnimating) {
                dot.isAnimating = true;
                
                const pushX = (dot.cx - pr.x) + pr.vx * 0.002;
                const pushY = (dot.cy - pr.y) + pr.vy * 0.002;
                
                dot.vx = pushX * 0.1;
                dot.vy = pushY * 0.1;
                
                // Return to original position
                setTimeout(() => {
                    this.animateReturn(dot);
                }, 100);
            }
        });
    }

    applyShockWave(centerX, centerY) {
        this.dots.forEach(dot => {
            const dist = Math.hypot(dot.cx - centerX, dot.cy - centerY);
            
            if (dist < this.config.shockRadius && !dot.isAnimating) {
                dot.isAnimating = true;
                
                const falloff = Math.max(0, 1 - dist / this.config.shockRadius);
                const pushX = (dot.cx - centerX) * this.config.shockStrength * falloff;
                const pushY = (dot.cy - centerY) * this.config.shockStrength * falloff;
                
                dot.vx = pushX * 0.2;
                dot.vy = pushY * 0.2;
                
                setTimeout(() => {
                    this.animateReturn(dot);
                }, 150);
            }
        });
    }

    animateReturn(dot) {
        const startTime = performance.now();
        const startX = dot.xOffset;
        const startY = dot.yOffset;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / (this.config.returnDuration * 1000), 1);
            
            // Elastic ease out
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            dot.xOffset = startX * (1 - easeOut);
            dot.yOffset = startY * (1 - easeOut);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                dot.isAnimating = false;
                dot.vx = 0;
                dot.vy = 0;
            }
        };
        
        requestAnimationFrame(animate);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const proxSq = this.config.proximity * this.config.proximity;
        const pr = this.pointer;

        this.dots.forEach(dot => {
            // Update physics
            dot.xOffset += dot.vx;
            dot.yOffset += dot.vy;
            dot.vx *= 0.95; // Damping
            dot.vy *= 0.95;

            const ox = dot.cx + dot.xOffset;
            const oy = dot.cy + dot.yOffset;
            
            const dx = dot.cx - pr.x;
            const dy = dot.cy - pr.y;
            const dsq = dx * dx + dy * dy;

            let fillStyle = this.config.baseColor;
            
            if (dsq <= proxSq) {
                const dist = Math.sqrt(dsq);
                const t = 1 - dist / this.config.proximity;
                const r = Math.round(this.baseRgb.r + (this.activeRgb.r - this.baseRgb.r) * t);
                const g = Math.round(this.baseRgb.g + (this.activeRgb.g - this.baseRgb.g) * t);
                const b = Math.round(this.baseRgb.b + (this.baseRgb.b - this.baseRgb.b) * t);
                fillStyle = `rgb(${r},${g},${b})`;
            }

            this.ctx.beginPath();
            this.ctx.arc(ox, oy, this.config.dotSize / 2, 0, Math.PI * 2);
            this.ctx.fillStyle = fillStyle;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize dot grid when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('dotGridCanvas');
    if (canvas) {
        new DotGrid(canvas, {
            dotSize: 3,
            gap: 30,
            baseColor: '#6B8E23',
            activeColor: '#9ACD32',
            proximity: 100,
            speedTrigger: 80,
            shockRadius: 200,
            shockStrength: 4
        });
    }
});