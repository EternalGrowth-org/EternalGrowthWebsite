// Motion layer: hero entrance, cursor depth for the shapes, counting stats.
(function () {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function splitWords(el, counter) {
        Array.from(el.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const parts = node.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                parts.forEach(part => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) {
                        frag.appendChild(document.createTextNode(' '));
                        return;
                    }
                    const word = document.createElement('span');
                    word.className = 'word';
                    const inner = document.createElement('span');
                    inner.textContent = part;
                    inner.style.setProperty('--i', counter.n++);
                    word.appendChild(inner);
                    frag.appendChild(word);
                });
                node.replaceWith(frag);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                splitWords(node, counter);
            }
        });
    }

    function setupHeadline() {
        const title = document.querySelector('.hero-title');
        if (!title) return;
        title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
        splitWords(title, { n: 0 });
        title.querySelectorAll('.word').forEach(w => w.setAttribute('aria-hidden', 'true'));
    }

    function setupShapes() {
        const stage = document.querySelector('.geometric-shapes');
        if (!stage) return;
        const shapes = Array.from(stage.querySelectorAll('.shape'));
        const depth = [28, -18, 40];
        const scrollSpeed = [0.18, 0.32, 0.12];

        shapes.forEach(shape => {
            shape.addEventListener('pointerdown', () => {
                shape.classList.add('boop');
                setTimeout(() => shape.classList.remove('boop'), 140);
            });
        });

        if (reduceMotion) return;

        let mx = 0, my = 0, queued = false;
        function render() {
            const scroll = Math.min(window.scrollY, window.innerHeight);
            shapes.forEach((shape, i) => {
                shape.style.setProperty('--dx', (mx * depth[i]).toFixed(1) + 'px');
                shape.style.setProperty('--dy', (my * depth[i] - scroll * scrollSpeed[i]).toFixed(1) + 'px');
            });
            queued = false;
        }
        function queue() {
            if (!queued) {
                queued = true;
                requestAnimationFrame(render);
            }
        }

        if (window.matchMedia('(pointer: fine)').matches) {
            window.addEventListener('pointermove', e => {
                mx = e.clientX / window.innerWidth - 0.5;
                my = e.clientY / window.innerHeight - 0.5;
                queue();
            }, { passive: true });
        }
        window.addEventListener('scroll', queue, { passive: true });
    }

    function setupStats() {
        const stats = document.querySelectorAll('.hero-stats .stat');
        if (!stats.length) return;

        const easeOutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

        function countUp(el) {
            const match = el.textContent.trim().match(/^(\d+)(.*)$/);
            if (!match || reduceMotion) return;
            const target = parseInt(match[1], 10);
            const suffix = match[2];
            const duration = 1600;
            const start = performance.now();
            function tick(now) {
                const t = Math.min((now - start) / duration, 1);
                el.textContent = Math.round(target * easeOutExpo(t)) + suffix;
                if (t < 1) requestAnimationFrame(tick);
            }
            el.textContent = '0' + suffix;
            requestAnimationFrame(tick);
        }

        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const stat = entry.target;
                stat.classList.add('is-visible');
                const num = stat.querySelector('.stat-number');
                if (num) setTimeout(() => countUp(num), parseFloat(stat.style.getPropertyValue('--i') || 0) * 120);
                io.unobserve(stat);
            });
        }, { threshold: 0.4 });

        stats.forEach((stat, i) => {
            stat.style.setProperty('--i', i);
            io.observe(stat);
        });
    }

    function init() {
        setupHeadline();
        setupShapes();
        setupStats();
        requestAnimationFrame(() => root.classList.add('motion-ready'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
