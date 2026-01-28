document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('glitchCanvas');
    const ctx = canvas.getContext('2d');
    const profileContainer = document.querySelector('.profile-pic-container');
    const glitchAudio = document.getElementById('glitchAudio');

    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    if (profileContainer && glitchAudio) {
        let isPlaying = false;

        function playAudio(e) {
            e.preventDefault();
            if (isPlaying) return;
            isPlaying = true;
            glitchAudio.currentTime = 0;
            glitchAudio.play();
            profileContainer.style.transform = 'scale(0.95)';
        }

        function stopAudio() {
            if (!isPlaying) return;
            isPlaying = false;
            glitchAudio.pause();
            profileContainer.style.transform = 'scale(1)';
        }

        profileContainer.addEventListener('mousedown', playAudio);
        profileContainer.addEventListener('mouseup', stopAudio);
        profileContainer.addEventListener('mouseleave', stopAudio);
    }

    let particles = [];
    let time = 0;

    function initParticles() {
        particles = [];
        const count = Math.floor((WIDTH * HEIGHT) / 15000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * WIDTH,
                y: Math.random() * HEIGHT,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5
            });
        }
    }

    function animate() {
        time++;
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = WIDTH;
            if (p.x > WIDTH) p.x = 0;
            if (p.y < 0) p.y = HEIGHT;
            if (p.y > HEIGHT) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = '#552222';
            ctx.globalAlpha = 0.4;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        initParticles();
    });

    initParticles();
    animate();
});