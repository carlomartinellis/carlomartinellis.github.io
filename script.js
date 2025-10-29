document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SETUP ELEMENTI HTML ---
    const canvas = document.getElementById('glitchCanvas');
    const ctx = canvas.getContext('2d');
    const profileContainer = document.querySelector('.profile-pic-container');
    const profileImage = document.getElementById('profileImage');
    const glitchAudio = document.getElementById('glitchAudio');

    // Imposta le dimensioni del canvas per coprire l'intera viewport
    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // --- 2. LOGICA AUDIO E VISIVA AL CLICK/TOUCH (MIGLIORATO PER MOBILE) ---
    if (profileContainer && glitchAudio) {
        let isPlaying = false;

        // Funzione per avviare l'audio
        function playAudio(e) {
            e.preventDefault();
            e.stopPropagation();

            if (isPlaying) return;
            isPlaying = true;

            glitchAudio.currentTime = 0; 
            glitchAudio.play().catch(error => {
                console.warn("Impossibile avviare la riproduzione audio.", error);
                isPlaying = false;
            });
            
            profileContainer.style.transform = 'scale(0.95)'; 
        }

        // Funzione per stoppare l'audio
        function stopAudio(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (!isPlaying) return;
            isPlaying = false;

            glitchAudio.pause();
            profileContainer.style.transform = 'scale(1)'; 
        }

        // MOBILE - usa il container invece dell'immagine per evitare il context menu
        profileContainer.addEventListener('touchstart', playAudio, { passive: false });
        profileContainer.addEventListener('touchend', stopAudio, { passive: false });
        profileContainer.addEventListener('touchcancel', stopAudio, { passive: false });

        // DESKTOP
        profileContainer.addEventListener('mousedown', playAudio);
        profileContainer.addEventListener('mouseup', stopAudio);
        profileContainer.addEventListener('mouseleave', stopAudio);

        // Previeni il context menu (long press su mobile)
        profileContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    // --- 3. LOGICA ANIMAZIONE GLITCH FIELD (MIGLIORATA) ---
    
    const IDLE_COLOR = '#552222';
    const ACTIVE_COLOR = '#FF3366';
    
    let particles = [];
    let scanlines = [];
    let mouseX = -100, mouseY = -100;
    let touchX = -100, touchY = -100;
    let time = 0;

    // Crea particelle sparse che si muovono lentamente
    function initParticles() {
        particles = [];
        const particleCount = Math.floor((WIDTH * HEIGHT) / 15000); // Densità adattiva
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * WIDTH,
                y: Math.random() * HEIGHT,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                glitchCounter: 0,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    // Inizializza scanlines orizzontali che appaiono/scompaiono
    function initScanlines() {
        scanlines = [];
        const scanlineCount = 8;
        
        for (let i = 0; i < scanlineCount; i++) {
            scanlines.push({
                y: Math.random() * HEIGHT,
                speed: Math.random() * 0.5 + 0.2,
                opacity: 0,
                targetOpacity: 0,
                width: Math.random() * 3 + 1
            });
        }
    }

    // Disegna una particella con effetto pulsante
    function drawParticle(p) {
        const pulse = Math.sin(time * 0.05 + p.phase) * 0.3 + 0.7;
        const size = p.size * pulse;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.glitchCounter > 0 ? ACTIVE_COLOR : IDLE_COLOR;
        ctx.globalAlpha = p.glitchCounter > 0 ? 0.9 : 0.4;
        ctx.fill();

        // Aggiungi alone luminoso se attivo
        if (p.glitchCounter > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
            ctx.fillStyle = ACTIVE_COLOR;
            ctx.globalAlpha = 0.1;
            ctx.fill();
        }
    }

    // Disegna scanline
    function drawScanline(s) {
        if (s.opacity > 0.01) {
            ctx.strokeStyle = IDLE_COLOR;
            ctx.globalAlpha = s.opacity * 0.3;
            ctx.lineWidth = s.width;
            ctx.beginPath();
            ctx.moveTo(0, s.y);
            ctx.lineTo(WIDTH, s.y);
            ctx.stroke();

            // Glitch casuale sulla scanline
            if (Math.random() > 0.97) {
                ctx.strokeStyle = ACTIVE_COLOR;
                ctx.globalAlpha = 0.5;
                ctx.lineWidth = s.width * 2;
                const segmentStart = Math.random() * WIDTH;
                const segmentEnd = segmentStart + Math.random() * 200 + 50;
                ctx.beginPath();
                ctx.moveTo(segmentStart, s.y);
                ctx.lineTo(segmentEnd, s.y);
                ctx.stroke();
            }
        }
    }

    // Aggiorna e disegna tutto
    function animate() {
        time++;
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.globalAlpha = 1;

        const activationRadius = 80;

        // Aggiorna e disegna particelle
        particles.forEach(p => {
            // Movimento
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around ai bordi
            if (p.x < -10) p.x = WIDTH + 10;
            if (p.x > WIDTH + 10) p.x = -10;
            if (p.y < -10) p.y = HEIGHT + 10;
            if (p.y > HEIGHT + 10) p.y = -10;

            // Check distanza da mouse/touch
            const distMouse = Math.hypot(p.x - mouseX, p.y - mouseY);
            const distTouch = Math.hypot(p.x - touchX, p.y - touchY);
            
            if (distMouse < activationRadius || distTouch < activationRadius) {
                p.glitchCounter = 30;
                // Respingi particella
                const angle = Math.atan2(p.y - (distMouse < distTouch ? mouseY : touchY), 
                                        p.x - (distMouse < distTouch ? mouseX : touchX));
                p.vx += Math.cos(angle) * 0.5;
                p.vy += Math.sin(angle) * 0.5;
            }

            // Damping della velocità
            p.vx *= 0.98;
            p.vy *= 0.98;

            if (p.glitchCounter > 0) p.glitchCounter--;

            drawParticle(p);
        });

        // Aggiorna e disegna scanlines
        scanlines.forEach(s => {
            // Movimento lento verso il basso
            s.y += s.speed;
            if (s.y > HEIGHT + 50) {
                s.y = -50;
                s.targetOpacity = Math.random() > 0.7 ? 1 : 0;
            }

            // Fade in/out smooth
            s.opacity += (s.targetOpacity - s.opacity) * 0.02;

            // Cambio casuale di visibilità
            if (Math.random() > 0.995) {
                s.targetOpacity = s.targetOpacity > 0.5 ? 0 : 1;
            }

            drawScanline(s);
        });

        // Glitch casuale su tutto lo schermo (raro)
        if (Math.random() > 0.99) {
            ctx.fillStyle = ACTIVE_COLOR;
            ctx.globalAlpha = 0.05;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
        }

        requestAnimationFrame(animate);
    }

    // Eventi mouse
    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    canvas.addEventListener('mouseleave', () => {
        mouseX = -100; 
        mouseY = -100;
    });

    // Eventi touch
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            touchX = e.touches[0].clientX;
            touchY = e.touches[0].clientY;
        }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
        touchX = -100; 
        touchY = -100;
    });

    canvas.addEventListener('touchcancel', () => {
        touchX = -100; 
        touchY = -100;
    });

    // Ridimensionamento finestra
    window.addEventListener('resize', () => {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        initParticles();
        initScanlines();
    });

    // Inizializza e avvia
    initParticles();
    initScanlines();
    animate();
});