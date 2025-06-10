const app = document.getElementById('app');
let cameraInstance = null;
let landmarkHistory = [];
const HISTORY_SIZE = 20;
let smoothedLandmarks = [];

const SIGN_DEFINITIONS = [
    // Dynamic signs with specific movements
    { name: 'Hola', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'extended' }, palm: 'forward', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'Adiós', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'extended' }, palm: 'forward', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'Nosotros', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'folded' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'Cómo estás', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'Hasta luego', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'Buenos días', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'extended' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Buenas noches', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'extended' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},

    // Alphabet (A-Z, Ñ) with movements
    { name: 'A', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'B', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'folded' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'C', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'extended' }, palm: 'side', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'D', conditions: { fingers: { index: 'extended', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'E', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'folded' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'F', conditions: { fingers: { index: 'folded', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'extended' }, palm: 'side', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'G', conditions: { fingers: { index: 'extended', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'towardUser', movement: 'arc', wristY: null, extra: null }},
    { name: 'H', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'towardUser', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'I', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'extended', thumb: 'folded' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'J', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'extended', thumb: 'folded' }, palm: 'towardUser', movement: 'arc', wristY: null, extra: null }},
    { name: 'K', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'L', conditions: { fingers: { index: 'extended', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'M', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'N', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'Ñ', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'side', movement: 'vertical', wristY: null, extra: null }},
    { name: 'O', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'side', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'P', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'notForward', movement: 'arc', wristY: null, extra: null }},
    { name: 'Q', conditions: { fingers: { index: 'extended', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'notForward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'R', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'folded' }, palm: 'forward', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'S', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'folded' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'T', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'U', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'folded' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'V', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'folded' }, palm: 'forward', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'W', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'folded', thumb: 'folded' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'X', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'folded' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Y', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'extended', thumb: 'extended' }, palm: 'side', movement: 'arc', wristY: null, extra: null }},
    { name: 'Z', conditions: { fingers: { index: 'extended', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'side', movement: 'horizontal', wristY: null, extra: null }},

    // Colors with movements
    { name: 'Rojo', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'folded' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Azul', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'side', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'Verde', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'Amarillo', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'extended', thumb: 'extended' }, palm: 'side', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Blanco', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'extended' }, palm: 'forward', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'Negro', conditions: { fingers: { index: 'extended', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'Morado', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'folded', thumb: 'folded' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Rosa', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'extended', thumb: 'extended' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},

    // Household Items with movements
    { name: 'Casa', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'extended' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Puerta', conditions: { fingers: { index: 'extended', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'side', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'Ventana', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'folded' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'Mesa', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Silla', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'extended', thumb: 'extended' }, palm: 'side', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'Cama', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'folded' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'Cocina', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},

    // School-Related Terms with movements
    { name: 'Escuela', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'folded' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Libro', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'Lápiz', conditions: { fingers: { index: 'extended', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'side', movement: 'arc', wristY: null, extra: null }},
    { name: 'Maestro', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Alumno', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'folded', thumb: 'folded' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'Pizarrón', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'extended' }, palm: 'forward', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'Cuaderno', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'folded' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Tarea', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'extended', thumb: 'extended' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},

    // People and Pronouns with movements
    { name: 'Yo', conditions: { fingers: { index: 'extended', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'Tú', conditions: { fingers: { index: 'extended', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Él/Ella', conditions: { fingers: { index: 'extended', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'Familia', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'extended' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Amigo', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'horizontal', wristY: null, extra: null }},
    { name: 'Mamá', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'folded' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }},
    { name: 'Papá', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'folded' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},

    // Greetings and Farewells with movements
    { name: 'Gracias', conditions: { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended', thumb: 'folded' }, palm: 'forward', movement: 'vertical', wristY: null, extra: null }},
    { name: 'Por favor', conditions: { fingers: { index: 'folded', middle: 'folded', ring: 'folded', pinky: 'folded', thumb: 'extended' }, palm: 'forward', movement: 'arc', wristY: null, extra: null }}
];

function normalizeLandmarks(landmarks) {
    const wrist = landmarks[0];
    const indexMCP = landmarks[5];
    const handSize = Math.sqrt(
        Math.pow(indexMCP.x - wrist.x, 2) +
        Math.pow(indexMCP.y - wrist.y, 2) +
        Math.pow(indexMCP.z - wrist.z, 2)
    );

    return landmarks.map(lm => ({
        x: (lm.x - wrist.x) / handSize,
        y: (lm.y - wrist.y) / handSize,
        z: (lm.z - wrist.z) / handSize
    }));
}

function smoothLandmarks(landmarks) {
    if (smoothedLandmarks.length === 0) {
        smoothedLandmarks = landmarks.map(lm => ({ x: lm.x, y: lm.y, z: lm.z }));
        return landmarks;
    }

    const SMOOTH_FACTOR = 0.3;
    const smoothed = landmarks.map((lm, i) => {
        const prev = smoothedLandmarks[i] || { x: lm.x, y: lm.y, z: lm.z };
        return {
            x: prev.x + SMOOTH_FACTOR * (lm.x - prev.x),
            y: prev.y + SMOOTH_FACTOR * (lm.y - prev.y),
            z: prev.z + SMOOTH_FACTOR * (lm.z - prev.z)
        };
    });

    smoothedLandmarks = smoothed;
    return smoothed;
}

function detectLSMSign(landmarks, history, handedness) {
    landmarks = smoothLandmarks(landmarks);
    const normalizedLandmarks = normalizeLandmarks(landmarks.map(lm => ({
        x: 1 - lm.x,
        y: lm.y,
        z: -lm.z
    })));

    const thumbTip = normalizedLandmarks[4];
    const indexTip = normalizedLandmarks[8];
    const middleTip = normalizedLandmarks[12];
    const ringTip = normalizedLandmarks[16];
    const pinkyTip = normalizedLandmarks[20];
    const indexMCP = normalizedLandmarks[5];
    const wrist = normalizedLandmarks[0];

    const palmForward = thumbTip.z < 0 && indexTip.z < 0;
    const palmSide = Math.abs(thumbTip.z) < 0.35 && Math.abs(indexTip.z) < 0.35;
    const palmTowardUser = thumbTip.z > 0 && indexTip.z > 0;

    const isIndexFolded = indexTip.y > indexMCP.y + 0.02;
    const isMiddleFolded = middleTip.y > indexMCP.y + 0.02;
    const isRingFolded = ringTip.y > indexMCP.y + 0.02;
    const isPinkyFolded = pinkyTip.y > indexMCP.y + 0.02;
    const isIndexExtended = indexTip.y < indexMCP.y - 0.02;
    const isMiddleExtended = middleTip.y < indexMCP.y - 0.02;
    const isRingExtended = ringTip.y < indexMCP.y - 0.02;
    const isPinkyExtended = pinkyTip.y < indexMCP.y - 0.02;
    const isThumbExtended = Math.abs(thumbTip.x - indexMCP.x) > 0.05;
    const isThumbFolded = Math.abs(thumbTip.x - indexMCP.x) < 0.05;

    let isMovingHorizontally = false, isMovingVertically = false, isMovingInArc = false;
    if (history.length >= HISTORY_SIZE) {
        const recentTips = history.slice(-HISTORY_SIZE).map(h => ({
            x: 1 - h[0].x, // Use wrist for movement detection
            y: h[0].y,
            z: -h[0].z
        }));
        const dx = recentTips[recentTips.length - 1].x - recentTips[0].x;
        const dy = recentTips[recentTips.length - 1].y - recentTips[0].y;
        isMovingHorizontally = Math.abs(dx) > 0.005 && Math.abs(dy) < 0.02;
        isMovingVertically = Math.abs(dy) > 0.005 && Math.abs(dx) < 0.02;
        const midPoint = recentTips[Math.floor(recentTips.length / 2)];
        isMovingInArc = Math.abs(dx) > 0.005 && Math.abs(dy) > 0.005 && 
                        Math.abs(midPoint.y - (recentTips[0].y + recentTips[recentTips.length - 1].y) / 2) > 0.002;
    }

    console.log(`[${new Date().toISOString()}] Hand: ${handedness}`);
    console.log('Normalized Landmarks:', JSON.stringify(normalizedLandmarks.map(lm => ({ x: lm.x.toFixed(3), y: lm.y.toFixed(3), z: lm.z.toFixed(3) }))));
    console.log(`Palm: forward=${palmForward}, side=${palmSide}, towardUser=${palmTowardUser}`);
    console.log(`Fingers: index=${isIndexExtended ? 'extended' : 'folded'}, middle=${isMiddleExtended ? 'extended' : 'folded'}, ring=${isRingExtended ? 'extended' : 'folded'}, pinky=${isPinkyExtended ? 'extended' : 'folded'}, thumb=${isThumbExtended ? 'extended' : 'folded'}`);
    console.log(`Movement: horizontal=${isMovingHorizontally}, vertical=${isMovingVertically}, arc=${isMovingInArc}`);
    console.log(`Wrist Y: ${wrist.y.toFixed(3)}`);

    // Detect signs based on movement
    for (const sign of SIGN_DEFINITIONS) {
        const { fingers, palm, movement, wristY, extra } = sign.conditions;

        let fingersMatch = true;
        if (fingers) {
            if (fingers.index && ((fingers.index === 'extended' && !isIndexExtended) || (fingers.index === 'folded' && !isIndexFolded))) fingersMatch = false;
            if (fingers.middle && ((fingers.middle === 'extended' && !isMiddleExtended) || (fingers.middle === 'folded' && !isMiddleFolded))) fingersMatch = false;
            if (fingers.ring && ((fingers.ring === 'extended' && !isRingExtended) || (fingers.ring === 'folded' && !isRingFolded))) fingersMatch = false;
            if (fingers.pinky && ((fingers.pinky === 'extended' && !isPinkyExtended) || (fingers.pinky === 'folded' && !isPinkyFolded))) fingersMatch = false;
            if (fingers.thumb && ((fingers.thumb === 'extended' && !isThumbExtended) || (fingers.thumb === 'folded' && !isThumbFolded))) fingersMatch = false;
        }

        let palmMatch = true;
        if (palm) {
            if (palm === 'forward' && !palmForward) palmMatch = false;
            if (palm === 'side' && !palmSide) palmMatch = false;
            if (palm === 'towardUser' && !palmTowardUser) palmMatch = false;
            if (palm === 'notForward' && palmForward) palmMatch = false;
        }

        let movementMatch = true;
        if (movement) {
            if (movement === 'horizontal' && !isMovingHorizontally) movementMatch = false;
            if (movement === 'vertical' && !isMovingVertically) movementMatch = false;
            if (movement === 'arc' && !isMovingInArc) movementMatch = false;
        }

        let wristMatch = true;
        if (wristY) {
            if (wristY.startsWith('<') && wrist.y >= parseFloat(wristY.slice(1))) wristMatch = false;
            if (wristY.startsWith('>') && wrist.y <= parseFloat(wristY.slice(1))) wristMatch = false;
        }

        let extraMatch = true;
        if (extra) {
            extraMatch = extra(normalizedLandmarks);
        }

        if (!fingersMatch) console.log(`${sign.name} failed: fingers mismatch`);
        if (!palmMatch) console.log(`${sign.name} failed: palm mismatch`);
        if (!movementMatch) console.log(`${sign.name} failed: movement mismatch`);
        if (!wristMatch) console.log(`${sign.name} failed: wristY mismatch`);
        if (!extraMatch) console.log(`${sign.name} failed: extra condition mismatch`);

        if (fingersMatch && palmMatch && movementMatch && wristMatch && extraMatch) {
            console.log(`Detected sign: ${sign.name}`);
            return sign.name;
        }
    }

    console.log('No sign detected');
    return null;
}

function clearScreen() {
    app.innerHTML = '';
    stopCamera();
}

function renderMainScreen() {
    clearScreen();
    app.innerHTML = `
        <button id="btnTraduccion" class="main-button">Traducción</button>
        <button id="btnAprendizaje" class="main-button mt-10">Aprendizaje</button>
    `;
    document.getElementById('btnTraduccion').addEventListener('click', renderTraduccionScreen);
    document.getElementById('btnAprendizaje').addEventListener('click', renderAprendizajeScreen);
}

function renderTraduccionScreen() {
    clearScreen();
    app.innerHTML = `
        <button class="back-button" id="backToMenu">← Volver</button>
        <h2>Traducción</h2>
        <div id="videoContainer">
            <video id="video" autoplay playsinline style="transform: scaleX(-1);"></video>
            <canvas id="canvas"></canvas>
        </div>
        <p id="status" class="status-text">Iniciando cámara...</p>
        <p id="gesture" class="status-text">Seña detectada: Ninguna</p>
    `;
    document.getElementById('backToMenu').addEventListener('click', renderMainScreen);
    startCamera();
}

function renderAprendizajeScreen() {
    clearScreen();
    app.innerHTML = `
        <button class="back-button" id="backToMenu2">← Volver</button>
        <h2>Aprendizaje</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="card">
                <h3 class="text-xl font-semibold">Abecedario</h3>
                <a href="https://www.youtube.com/watch?v=example1" target="_blank" class="mt-2 block">Ver Video</a>
            </div>
            <div class="card">
                <h3 class="text-xl font-semibold">Colores</h3>
                <a href="https://www.youtube.com/watch?v=example2" target="_blank" class="mt-2 block">Ver Video</a>
            </div>
            <div class="card">
                <h3 class="text-xl font-semibold">Escuela</h3>
                <a href="https://www.youtube.com/watch?v=example3" target="_blank" class="mt-2 block">Ver Video</a>
            </div>
            <div class="card">
                <h3 class="text-xl font-semibold">Personas y Pronombres</h3>
                <a href="https://www.youtube.com/watch?v=example4" target="_blank" class="mt-2 block">Ver Video</a>
            </div>
            <div class="card">
                <h3 class="text-xl font-semibold">Saludos y Despedidas</h3>
                <a href="https://www.youtube.com/watch?v=example5" target="_blank" class="mt-2 block">Ver Video</a>
            </div>
        </div>
    `;
    document.getElementById('backToMenu2').addEventListener('click', renderMainScreen);
}

function startCamera() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const status = document.getElementById('status');
    const gestureText = document.getElementById('gesture');
    const ctx = canvas.getContext('2d');

    if (!video || !canvas || !status || !gestureText) {
        console.error('Missing HTML elements');
        status.textContent = 'Error: Missing HTML elements';
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } })
        .then(stream => {
            console.log('Camera stream acquired');
            status.textContent = 'Camera active, loading video...';
            video.srcObject = stream;
            video.oncanplay = () => {
                video.play().catch(err => {
                    console.error('Video play error:', err);
                    status.textContent = `Error: Cannot play video - ${err.message}`;
                });
                canvas.width = 640;
                canvas.height = 480;
                status.textContent = 'Detecting hands...';
            };
        })
        .catch(err => {
            console.error('Error accessing camera:', err);
            status.textContent = `Error: Cannot access camera - ${err.message}. Please check permissions and ensure you're using HTTPS or localhost.`;
        });

    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`
    });
    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.4,
        minTrackingConfidence: 0.4
    });

    let lastSpokenSign = null;
    let lastSpokenTime = 0;
    const VOICE_COOLDOWN = 2000;

    hands.onResults(results => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        status.textContent = 'Detecting hands...';
        gestureText.textContent = 'Seña detectada: Ninguna';

        console.log(`[${new Date().toISOString()}] MediaPipe results:`, {
            numHands: results.multiHandLandmarks ? results.multiHandLandmarks.length : 0,
            handedness: results.multiHandedness ? results.multiHandedness.map(h => h.label) : []
        });

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            status.textContent = `Hands detected: ${results.multiHandLandmarks.length}`;
            let detectedSign = null;

            if (results.multiHandLandmarks.length === 2) {
                const leftHand = results.multiHandedness.find(h => h.label === 'Left');
                const rightHand = results.multiHandedness.find(h => h.label === 'Right');
                if (leftHand && rightHand) {
                    const leftLandmarks = results.multiHandLandmarks[leftHand.index];
                    const rightLandmarks = results.multiHandLandmarks[rightHand.index];
                    if (detectLSMSign(leftLandmarks, landmarkHistory, 'Left') === 'Hola' &&
                        detectLSMSign(rightLandmarks, landmarkHistory, 'Right') === 'Hola') {
                        detectedSign = 'Adiós';
                    }
                    if (detectLSMSign(leftLandmarks, landmarkHistory, 'Left') === 'Familia' &&
                        detectLSMSign(rightLandmarks, landmarkHistory, 'Right') === 'Familia') {
                        detectedSign = 'Familia';
                    }
                }
            }

            for (let i = 0; i < results.multiHandLandmarks.length; i++) {
                const landmarks = results.multiHandLandmarks[i];
                const handedness = results.multiHandedness[i].label;

                const color = handedness === 'Left' ? '#ec4899' : '#a855f7';

                landmarkHistory.push(landmarks);
                if (landmarkHistory.length > HISTORY_SIZE) landmarkHistory.shift();

                try {
                    if (typeof drawConnectors === 'function' && typeof drawLandmarks === 'function') {
                        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color, lineWidth: 5 });
                        drawLandmarks(ctx, landmarks, { color, lineWidth: 2 });
                    } else {
                        console.error('Drawing utilities not available. Check @mediapipe/drawing_utils import.');
                        ctx.fillStyle = color;
                        landmarks.forEach(lm => {
                            ctx.beginPath();
                            ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 5, 0, 2 * Math.PI);
                            ctx.fill();
                        });
                    }
                } catch (e) {
                    console.error('Error drawing landmarks:', e);
                }

                if (!detectedSign) {
                    const sign = detectLSMSign(landmarks, landmarkHistory, handedness);
                    if (sign) detectedSign = sign;
                }
            }

            if (detectedSign) {
                gestureText.textContent = `Seña detectada: ${detectedSign}`;
                const currentTime = Date.now();
                if (detectedSign !== lastSpokenSign || (currentTime - lastSpokenTime) > VOICE_COOLDOWN) {
                    const utterance = new SpeechSynthesisUtterance(detectedSign);
                    utterance.lang = 'es-MX';
                    utterance.volume = 1;
                    utterance.rate = 0.8;
                    window.speechSynthesis.speak(utterance);
                    lastSpokenSign = detectedSign;
                    lastSpokenTime = currentTime;
                }
            }
        } else {
            landmarkHistory = [];
            smoothedLandmarks = [];
            lastSpokenSign = null;
            console.log('No hands detected');
        }
        ctx.restore();
    });

    cameraInstance = new Camera(video, {
        onFrame: async () => {
            try {
                await hands.send({ image: video });
            } catch (err) {
                console.error('Error processing frame:', err);
                status.textContent = `Error processing frame: ${err.message}`;
            }
        },
        width: 640,
        height: 480
    });
    cameraInstance.start();
}

function stopCamera() {
    if (cameraInstance) {
        cameraInstance.stop();
        const video = document.getElementById('video');
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
        cameraInstance = null;
    }
    landmarkHistory = [];
    smoothedLandmarks = [];
}

renderMainScreen();