document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SETUP ELEMENTI HTML ---
    const canvas = document.getElementById('glitchCanvas');
    const ctx = canvas.getContext('2d');
    const profileImage = document.getElementById('profileImage');
    const glitchAudio = document.getElementById('glitchAudio');

    // Imposta le dimensioni del canvas per coprire l'intera viewport
    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // --- 2. LOGICA AUDIO E VISIVA AL CLICK/TOUCH (CON CONTROLLO NULL) ---
    // Questo blocco viene eseguito SOLO se l'immagine profilo (e di conseguenza l'audio) esiste.
    if (profileImage) { // <--- NUOVO CONTROLLO AGGIUNTO QUI
        // Funzione per avviare l'audio
        function playAudio(e) {
            // Impedisce il comportamento di default come lo scroll (soprattutto su touch)
            if (e.type === 'touchstart' || e.type === 'touchmove') {
                e.preventDefault();
            }

            // Riporta l'audio all'inizio per un effetto "loop breve"
            glitchAudio.currentTime = 0; 
            // Play() deve essere gestito con catch() a causa delle restrizioni browser
            glitchAudio.play().catch(error => {
                console.warn("Impossibile avviare la riproduzione audio (richiede interazione utente).", error);
            });
            
            // Feedback visivo: l'immagine si rimpicciolisce leggermente
            profileImage.style.transform = 'scale(0.95)'; 
        }

        // Funzione per stoppare l'audio
        function stopAudio() {
            glitchAudio.pause();
            // Feedback visivo: l'immagine ritorna normale
            profileImage.style.transform = 'scale(1)'; 
        }

        // Event Listeners per l'immagine del profilo
        
        // MOBILE (touchstart/touchend)
        profileImage.addEventListener('touchstart', playAudio);
        profileImage.addEventListener('touchend', stopAudio);
        profileImage.addEventListener('touchcancel', stopAudio); 

        // DESKTOP (mousedown/mouseup)
        profileImage.addEventListener('mousedown', playAudio);
        profileImage.addEventListener('mouseup', stopAudio);
        profileImage.addEventListener('mouseleave', stopAudio); // Se si tiene premuto e si esce
    }
    // --- FINE BLOCCO CONTROLLO NULL ---

    // --- 3. LOGICA ANIMAZIONE GLITCH FIELD ---
    
    // Parametri per l'animazione glitch (Aggiornati ai nuovi colori)
    const GRID_SIZE = 25;       // Dimensione delle celle della griglia per i puntini
    const POINT_RADIUS = 1.5;   // Raggio dei puntini
    const IDLE_COLOR = '#552222';  // Marrone scuro (Inattivo)
    const ACTIVE_COLOR = '#FF3366';// Rosso-Rosa Acido (Attivo)
    const GLITCH_DURATION = 15; // Quanti frame rimane "glitchato" un punto

    let points = []; 
    let mouseX = -100, mouseY = -100; // Posizione iniziale del mouse fuori schermo
    let touchX = -100, touchY = -100; // Posizione iniziale del touch fuori schermo

    // Inizializza i puntini sulla griglia
    function initPoints() {
        points = [];
        for (let y = 0; y < HEIGHT / GRID_SIZE; y++) {
            for (let x = 0; x < WIDTH / GRID_SIZE; x++) {
                points.push({
                    x: x * GRID_SIZE + GRID_SIZE / 2,
                    y: y * GRID_SIZE + GRID_SIZE / 2,
                    active: 0, 
                    glitchCounter: 0 
                });
            }
        }
    }

    // Disegna un singolo puntino
    function drawPoint(point) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, POINT_RADIUS, 0, Math.PI * 2);
        // Usa il colore attivo solo se glitchCounter è > 0
        ctx.fillStyle = point.glitchCounter > 0 ? ACTIVE_COLOR : IDLE_COLOR;
        ctx.globalAlpha = 1;
        ctx.fill();
    }

    // Aggiorna lo stato dei puntini
    function updatePoints() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        const activationRadius = 50; 

        points.forEach(point => {
            // Calcola la distanza dal mouse/touch
            const distMouse = Math.hypot(point.x - mouseX, point.y - mouseY);
            const distTouch = Math.hypot(point.x - touchX, point.y - touchY);
            
            // Attiva il punto se è vicino al mouse o al touch
            if (distMouse < activationRadius || distTouch < activationRadius) {
                point.glitchCounter = GLITCH_DURATION; // Resetta il contatore glitch
            }

            // Decrementa il contatore glitch
            if (point.glitchCounter > 0) {
                point.glitchCounter--;
            }

            drawPoint(point);
        });
    }

    // Loop principale dell'animazione
    function animate() {
        updatePoints();
        requestAnimationFrame(animate);
    }

    // Eventi del mouse per attivare i puntini
    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    canvas.addEventListener('mouseleave', () => {
        mouseX = -100; 
        mouseY = -100;
    });

    // Eventi touch per mobile per attivare i puntini
    canvas.addEventListener('touchmove', (e) => {
        // Non usiamo preventDefault qui, lo facciamo solo sul touchstart dell'immagine
        if (e.touches.length > 0) {
            touchX = e.touches[0].clientX;
            touchY = e.touches[0].clientY;
        }
    });

    canvas.addEventListener('touchend', () => {
        touchX = -100; 
        touchY = -100;
    });

    canvas.addEventListener('touchcancel', () => {
        touchX = -100; 
        touchY = -100;
    });


    // Aggiorna le dimensioni del canvas e reinizializza i punti al ridimensionamento della finestra
    window.addEventListener('resize', () => {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        initPoints();
    });

    // Inizializza e avvia l'animazione
    initPoints();
    animate();
});