// === Настройка холста ===
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;
});

// === Загрузка картинок ===
const coinImg = new Image(); coinImg.src = 'coin.png';
const heartImg = new Image(); heartImg.src = 'heart.png';
const spriteSheet = new Image(); spriteSheet.src = 'spritesheet.png';
const enemyImages = {
  croc: { right: new Image(), left: new Image() },
  dino: { right: new Image(), left: new Image() }
};
enemyImages.croc.right.src = 'enred_right.png';
enemyImages.croc.left.src = 'enred_left.png';
enemyImages.dino.right.src = 'enfio_right.png';
enemyImages.dino.left.src = 'enfio_left.png';

// === Константы ===
const PHYSICS_GRAVITY = 0.4;       
const PHYSICS_MOVE_SPEED = 3.5;     
const PHYSICS_JUMP_FORCE = -11;     

const hero = {
  x: 100, y: 300, width: 60, height: 60, vx: 0, vy: 0, 
  isGrounded: false, isFacingRight: true, animTimer: 0, breathTimer: 0
};

const gameLevels = [
  // УРОВЕНЬ 1
  {
    platforms: [
      { x: 0, y: 600, w: 600, h: 100 }, { x: 700, y: 600, w: 400, h: 100 },
      { x: 1200, y: 600, w: 600, h: 100 }, { x: 300, y: 480, w: 150, h: 20 },
      { x: 550, y: 380, w: 150, h: 20 }, { x: 850, y: 480, w: 150, h: 20 },
      { x: 1100, y: 450, w: 150, h: 20 }, { x: 1400, y: 500, w: 150, h: 20 }
    ],
    coins: [ 
      { x: 350, y: 430 }, { x: 600, y: 330 }, { x: 900, y: 430 }, { x: 1150, y: 400 }, { x: 1450, y: 450 }, { x: 1300, y: 550 },
      { x: 150, y: 520 }, { x: 450, y: 550 }, { x: 750, y: 450 }, { x: 1000, y: 320 }, { x: 1250, y: 400 }, { x: 1550, y: 550 }
    ],
    enemies: [ 
      { x: 800, y: 545, w: 90, h: 65, vx: 1.5, startX: 700, endX: 1100, type: 'croc' },
      { x: 1300, y: 550, w: 90, h: 65, vx: 2, startX: 1200, endX: 1500, type: 'dino' }
    ],
    goal: { x: 1600, y: 480, w: 40, h: 120, color: '#F4A261' }
  },
  // УРОВЕНЬ 2
  {
    platforms: [
      { x: 0, y: 600, w: 300, h: 100 }, { x: 400, y: 550, w: 100, h: 20 },
      { x: 600, y: 500, w: 100, h: 20 }, { x: 800, y: 550, w: 100, h: 20 },
      { x: 1000, y: 450, w: 100, h: 20 }, { x: 1200, y: 500, w: 100, h: 20 },
      { x: 1400, y: 600, w: 400, h: 100 }, { x: 1300, y: 400, w: 100, h: 20 }
    ],
    coins: [ { x: 450, y: 500 }, { x: 650, y: 450 }, { x: 850, y: 500 }, { x: 1050, y: 400 }, { x: 1250, y: 450 }, { x: 1350, y: 350 } ],
    enemies: [ 
      { x: 1500, y: 545, w: 90, h: 65, vx: 2, startX: 1400, endX: 1700, type: 'croc' },
      { x: 620, y: 440, w: 90, h: 65, vx: 1, startX: 600, endX: 700, type: 'dino' }
    ],
    goal: { x: 1700, y: 480, w: 40, h: 120, color: '#F4A261' }
  },
  // УРОВЕНЬ 3
  {
    platforms: [
      { x: 0, y: 600, w: 300, h: 100 }, { x: 400, y: 550, w: 80, h: 20 },
      { x: 580, y: 450, w: 80, h: 20 }, { x: 760, y: 550, w: 80, h: 20 },
      { x: 940, y: 600, w: 250, h: 100 }, { x: 1250, y: 550, w: 80, h: 20 },
      { x: 1400, y: 480, w: 80, h: 20 }, { x: 1550, y: 600, w: 200, h: 100 }
    ],
    coins: [ { x: 440, y: 500 }, { x: 620, y: 400 }, { x: 800, y: 500 }, { x: 1050, y: 550 }, { x: 1290, y: 500 }, { x: 1440, y: 430 } ],
    enemies: [ 
      { x: 100, y: 545, w: 90, h: 65, vx: 1.5, startX: 0, endX: 250, type: 'croc' },
      { x: 1000, y: 545, w: 90, h: 65, vx: 1.5, startX: 940, endX: 1190, type: 'dino' },
      { x: 1600, y: 545, w: 90, h: 65, vx: 2, startX: 1550, endX: 1750, type: 'croc' }
    ],
    goal: { x: 1680, y: 480, w: 40, h: 120, color: '#F4A261' }
  },
  // УРОВЕНЬ 4
  {
    platforms: [
      { x: 0, y: 600, w: 300, h: 100 }, { x: 380, y: 520, w: 70, h: 20 },
      { x: 550, y: 450, w: 60, h: 20 }, { x: 710, y: 370, w: 70, h: 20 },
      { x: 860, y: 300, w: 60, h: 20 }, { x: 1100, y: 400, w: 60, h: 20 },
      { x: 1260, y: 500, w: 70, h: 20 }, { x: 1420, y: 450, w: 90, h: 20 },
      { x: 1600, y: 600, w: 300, h: 100 }
    ],
    coins: [ { x: 415, y: 470 }, { x: 580, y: 400 }, { x: 745, y: 320 }, { x: 935, y: 250 }, { x: 1130, y: 350 }, { x: 1295, y: 450 }, { x: 1480, y: 400 }, { x: 1700, y: 550 } ],
    enemies: [ 
      { x: 880, y: 245, w: 90, h: 65, vx: 1.5, startX: 860, endX: 970, type: 'croc' },
      { x: 1440, y: 385, w: 90, h: 65, vx: 1, startX: 1420, endX: 1560, type: 'dino' },
      { x: 1650, y: 545, w: 90, h: 65, vx: 2.5, startX: 1600, endX: 1850, type: 'croc' }
    ],
    goal: { x: 1800, y: 480, w: 40, h: 120, color: '#F4A261' }
  },
  // УРОВЕНЬ 5
  {
    platforms: [
      { x: 0, y: 600, w: 300, h: 100 }, { x: 380, y: 550, w: 70, h: 20 },
      { x: 530, y: 480, w: 70, h: 20 }, { x: 680, y: 550, w: 70, h: 20 },
      { x: 830, y: 480, w: 80, h: 20 }, { x: 1050, y: 400, w: 60, h: 20 },
      { x: 1200, y: 500, w: 60, h: 20 }, { x: 1350, y: 600, w: 350, h: 100 },
      { x: 1750, y: 500, w: 80, h: 20 }, { x: 1900, y: 400, w: 80, h: 20 },
      { x: 2050, y: 450, w: 100, h: 20 }, { x: 2200, y: 600, w: 200, h: 100 }
    ],
    coins: [ { x: 415, y: 500 }, { x: 565, y: 430 }, { x: 715, y: 500 }, { x: 890, y: 430 }, { x: 1080, y: 350 }, { x: 1230, y: 450 }, { x: 1500, y: 550 }, { x: 1790, y: 450 }, { x: 1940, y: 350 }, { x: 2100, y: 400 }, { x: 2300, y: 550 } ],
    enemies: [ 
      { x: 100, y: 545, w: 90, h: 65, vx: 1.5, startX: 0, endX: 250, type: 'croc' },
      { x: 850, y: 420, w: 90, h: 65, vx: 1, startX: 810, endX: 930, type: 'dino' },
      { x: 1450, y: 545, w: 90, h: 65, vx: 2.5, startX: 1350, endX: 1650, type: 'croc' },
      { x: 1600, y: 545, w: 90, h: 65, vx: -2, startX: 1350, endX: 1650, type: 'dino' },
      { x: 2080, y: 400, w: 90, h: 65, vx: 1, startX: 2030, endX: 2190, type: 'croc' }
    ],
    goal: { x: 2280, y: 480, w: 40, h: 120, color: '#F4A261' }
  }
];

let currentLvlIndex = 0; 
let activeLvlData = null;
let totalScore = 0;
let lives = 3;
let isVictory = false;
let gameState = 'menu'; 
let selectedCharacter = 0; 
const characterNames = ["КОШКА", "МЕДВЕДЬ", "ЗАЙЧИК", "ЛЯГУШКА", "МЫШКА"];
const worldCamera = { x: 0, y: 0 };
const userKeys = { left: false, right: false };
let particles = [];

// === Пиксленьный шрифт ===
const fontMatrix = {
  '0': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]], '1': [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
  '2': [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]], '3': [[1,1,1],[0,0,1],[0,1,1],[0,0,1],[1,1,1]],
  '4': [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]], '5': [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
  '6': [[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]], '7': [[1,1,1],[0,0,1],[0,1,0],[0,1,0],[0,1,0]],
  '8': [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]], '9': [[1,1,1],[1,0,1],[1,1,1],[0,0,1],[1,1,1]],
  ':': [[0,0,0],[0,1,0],[0,0,0],[0,1,0],[0,0,0]], ',': [[0,0,0],[0,0,0],[0,0,0],[0,1,0],[1,0,0]],
  'A': [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]], 'B': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
  'C': [[1,1,1],[1,0,0],[1,0,0],[1,0,0],[1,1,1]], 'D': [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
  'E': [[1,1,1],[1,0,0],[1,1,1],[1,0,0],[1,1,1]], 'F': [[1,1,1],[1,0,0],[1,1,1],[1,0,0],[1,0,0]],
  'G': [[1,1,1],[1,0,0],[1,0,1],[1,0,1],[1,1,1]], 'H': [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  'I': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]], 'J': [[0,0,1],[0,0,1],[0,0,1],[1,0,1],[1,1,0]],
  'K': [[1,0,1],[1,0,1],[1,1,0],[1,0,1],[1,0,1]], 'L': [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  'M': [[1,1,1,1,1],[1,0,1,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]], 'N': [[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
  'O': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]], 'P': [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
  'Q': [[1,1,1],[1,0,1],[1,1,1],[0,1,0],[0,0,1]], 'R': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  'S': [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]], 'T': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  'U': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]], 'V': [[1,0,1],[1,0,1],[1,0,1],[0,1,0],[0,1,0]],
  'W': [[1,0,1],[1,0,1],[1,0,1],[1,1,1],[1,1,1]], 'X': [[1,0,1],[1,0,1],[0,1,0],[1,0,1],[1,0,1]],
  'Y': [[1,0,1],[1,0,1],[1,1,1],[0,1,0],[0,1,0]], 'Z': [[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
  ' ': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
  
  // Русские буквы
  'Д': [[0,1,1,0],[1,0,1,0],[1,0,1,0],[1,1,1,1],[1,0,0,1]], 'В': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
  'И': [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]], 'Г': [[1,1,1],[1,0,0],[1,0,0],[1,0,0],[1,0,0]],
  'А': [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]], 'Т': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  'Ь': [[1,0,0],[1,0,0],[1,1,0],[1,0,1],[1,1,0]], 'С': [[1,1,1],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  'Я': [[0,1,1],[1,0,1],[0,1,1],[0,1,0],[1,0,1]], 'П': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,0,1]],
  'Р': [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]], 'Ы': [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],
  'Ж': [[1,0,1,0,1],[1,0,1,0,1],[0,1,1,1,0],[1,0,1,0,1],[1,0,1,0,1]], 'О': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  'К': [[1,0,1],[1,0,1],[1,1,0],[1,0,1],[1,0,1]], 'Н': [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  'Е': [[1,1,1],[1,0,0],[1,1,1],[1,0,0],[1,1,1]], 'М': [[1,1,1,1,1],[1,0,1,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  'У': [[1,0,1],[1,0,1],[0,1,1],[0,0,1],[1,1,0]], 'Ч': [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  'Б': [[1,1,1],[1,0,0],[1,1,0],[1,0,1],[1,1,0]], 'Л': [[0,1,1],[1,0,1],[1,0,1],[1,0,1],[1,0,1]],
  'З': [[1,1,1],[0,0,1],[0,1,1],[0,0,1],[1,1,1]], 'Й': [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]]
};

function drawPixelText(text, x, y, scale, color) {
  let currentX = x;
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();
    if (fontMatrix[char]) {
      const matrix = fontMatrix[char];
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c]) {
            drawPixel(currentX + c * scale, y + r * scale, scale, scale, color);
          }
        }
      }
      currentX += (matrix[0].length * scale) + scale; 
    } else {
      currentX += 4 * scale; 
    }
  }
}

function getPixelTextWidth(text, scale) {
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();
    const matrix = fontMatrix[char];
    width += (matrix ? matrix[0].length : 3) * scale + scale;
  }
  return width;
}

// === Функции ===
function drawPixel(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function checkOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.width > b.x && a.y < b.y + b.h && a.y + a.height > b.y;
}

function checkCoinOverlap(c) {
  let closestX = Math.max(hero.x, Math.min(c.x, hero.x + hero.width));
  let closestY = Math.max(hero.y, Math.min(c.y, hero.y + hero.height));
  let distX = c.x - closestX;
  let distY = c.y - closestY;
  return (distX * distX) + (distY * distY) < (c.r * c.r);
}

function createExplosion(x, y) {
  let screenX = x - worldCamera.x;
  for (let i = 0; i < 15; i++) {
    particles.push({ x: screenX, y: y, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, life: 1.0, color: Math.random() > 0.5 ? '#FFD700' : '#FFA500' });
  }
}

function updateAndDrawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life -= 0.03;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    ctx.fillStyle = p.color; ctx.globalAlpha = p.life; ctx.fillRect(p.x - 3, p.y - 3, 6, 6); ctx.globalAlpha = 1.0;
  }
}

function drawCharacter(x, y, isWalking, charType) {
  if (!spriteSheet.complete || spriteSheet.naturalWidth === 0) {
    drawPixel(x, y, 40, 60, '#E53935'); return; 
  }
  const centerFrames = [
    { x: 670, y: 10, w: 200, h: 190 }, { x: 670, y: 210, w: 200, h: 190 },
    { x: 670, y: 415, w: 200, h: 190 }, { x: 670, y: 615, w: 200, h: 220 },
    { x: 670, y: 840, w: 200, h: 175 }
  ];
  let currentFrame = centerFrames[charType];
  const drawSize = 80; const drawX = x - 10; const drawY = y - 15;
  let offsetY = isWalking ? Math.sin(Date.now() / 100) * 3 : Math.sin(Date.now() / 300) * 2;

  ctx.save();
  if (typeof hero !== 'undefined' && !hero.isFacingRight) {
    ctx.translate(drawX + drawSize, drawY + offsetY); ctx.scale(-1, 1);
    ctx.drawImage(spriteSheet, currentFrame.x, currentFrame.y, currentFrame.w, currentFrame.h, 0, 0, drawSize, drawSize);
  } else {
    ctx.drawImage(spriteSheet, currentFrame.x, currentFrame.y, currentFrame.w, currentFrame.h, drawX, drawY + offsetY, drawSize, drawSize);
  }
  ctx.restore();
}

function drawEnemy(x, y, w, h, facingRight, type) {
  const img = facingRight ? enemyImages[type].right : enemyImages[type].left;
  if (!img.complete || img.naturalWidth === 0) {
    drawPixel(x, y, w, h, '#E53935'); return;
  }
  let offsetY = Math.sin(Date.now() / 150) * 2;
  ctx.drawImage(img, x, y + offsetY, w, h);
}

function drawCollectibles(coins) {
  for (const c of coins) {
    if (!c.collected) {
      let floatY = Math.sin(Date.now() / 300 + c.x) * 8; 
      let cx = c.x; let cy = c.y + floatY;
      
      const coinW = 60; 
      const coinH = 80; 
      
      if (coinImg.complete) { ctx.drawImage(coinImg, cx - coinW/2, cy - coinH/2, coinW, coinH); }
      else { ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill(); }
    }
  }
}

function initializeLevel(index) {
  currentLvlIndex = index;
  activeLvlData = gameLevels[index];
  hero.x = 100; hero.y = 300; hero.vx = 0; hero.vy = 0;
  activeLvlData.currentCoins = activeLvlData.coins.map(c => ({ x: c.x, y: c.y, r: 15, collected: false }));
  activeLvlData.currentEnemies = activeLvlData.enemies.map(e => ({
    x: e.x, y: e.y, w: e.w, h: e.h, vx: e.vx, startX: e.startX, endX: e.endX,
    alive: true, currentVx: e.vx, type: e.type, isDying: false, dieTimer: 0
  }));
}

function startGame() { lives = 3; totalScore = 0; isVictory = false; initializeLevel(0); gameState = 'playing'; }
function die() { lives -= 1; if (lives > 0) initializeLevel(currentLvlIndex); else gameState = 'menu'; }

// === Управление ===
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left; const my = e.clientY - rect.top;
  const cx = canvas.width / 2; const cy = canvas.height / 2;
  
  if (gameState === 'menu') {
    if (mx > cx - 240 && mx < cx - 160 && my > cy + 10 && my < cy + 90) selectedCharacter = (selectedCharacter - 1 + 5) % 5; 
    if (mx > cx + 160 && mx < cx + 240 && my > cy + 10 && my < cy + 90) selectedCharacter = (selectedCharacter + 1) % 5; 
    
    const groundY = cy + 80; 
    if (mx > cx - 40 && mx < cx + 40 && my > groundY + 30 && my < groundY + 100) startGame();
  } else if (gameState === 'playing') {
    if (mx > canvas.width - 70 && mx < canvas.width - 20 && my > 10 && my < 60) gameState = 'menu';
  }
});

window.addEventListener('keydown', (e) => {
  if (gameState === 'playing') {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') userKeys.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') userKeys.right = true;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      if (hero.isGrounded && !isVictory) { hero.vy = PHYSICS_JUMP_FORCE; hero.isGrounded = false; }
    }
    if (e.code === 'Escape' || e.code === 'KeyP') gameState = 'paused';
  } else if (gameState === 'paused') {
    if (e.code === 'Escape' || e.code === 'KeyP' || e.code === 'Space') gameState = 'playing';
  }
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') userKeys.left = false;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') userKeys.right = false;
});

function gameUpdate() {
  if (isVictory || gameState !== 'playing') return;
  const level = activeLvlData;

  if (userKeys.left) { hero.vx -= 0.4; hero.isFacingRight = false; }
  else if (userKeys.right) { hero.vx += 0.4; hero.isFacingRight = true; }
  else { hero.vx *= 0.85; }

  if (Math.abs(hero.vx) > 0.1 && hero.isGrounded) { hero.animTimer += 0.2; hero.breathTimer = 0; }
  else if (hero.isGrounded) { hero.animTimer = 0; hero.breathTimer += 0.005; }
  else { hero.animTimer = 0; hero.breathTimer = 0; }

  if (hero.vx > PHYSICS_MOVE_SPEED) hero.vx = PHYSICS_MOVE_SPEED;
  if (hero.vx < -PHYSICS_MOVE_SPEED) hero.vx = -PHYSICS_MOVE_SPEED;

  hero.vy += PHYSICS_GRAVITY;
  hero.x += hero.vx;

  for (const p of level.platforms) {
    if (checkOverlap(hero, p)) {
      if (hero.vx > 0) hero.x = p.x - hero.width;
      if (hero.vx < 0) hero.x = p.x + p.w;
    }
  }

  hero.y += hero.vy;
  if (hero.vy > 12) hero.vy = 12;
  hero.isGrounded = false;
  for (const p of level.platforms) {
    if (checkOverlap(hero, p)) {
      if (hero.vy > 0) { hero.y = p.y - hero.height; hero.vy = 0; hero.isGrounded = true; }
      else if (hero.vy < 0) { hero.y = p.y + p.h; hero.vy = 0; }
    }
  }
  if (hero.x < 0) hero.x = 0;

  for (const c of level.currentCoins) {
    if (!c.collected && checkCoinOverlap(c)) {
      c.collected = true; totalScore += 1; createExplosion(c.x, c.y);
    }
  }

  for (const enemy of level.currentEnemies) {
    if (enemy.isDying) {
      enemy.dieTimer += 0.015;
      if (enemy.dieTimer >= 1) enemy.alive = false;
      continue;
    }
    if (!enemy.alive) continue;
    enemy.x += enemy.currentVx;
        if (enemy.x <= enemy.startX) {
      enemy.x = enemy.startX + 1; // Выталкиваем вправо
      enemy.currentVx = Math.abs(enemy.currentVx); // Едем вправо
    } else if (enemy.x + enemy.w >= enemy.endX) {
      enemy.x = enemy.endX - enemy.w - 1; // Выталкиваем влево
      enemy.currentVx = -Math.abs(enemy.currentVx); // Едем влево
    }
    if (checkOverlap(hero, enemy)) {
      if (hero.vy > 0 && hero.y + hero.height < enemy.y + enemy.h / 2) {
        enemy.isDying = true; enemy.dieTimer = 0; hero.vy = -10;
      } else { die(); return; }
    }
  }

  if (checkOverlap(hero, level.goal)) {
    if (currentLvlIndex < gameLevels.length - 1) initializeLevel(currentLvlIndex + 1);
    else isVictory = true;
    return;
  }
  if (hero.y > canvas.height) die();
}

// === Кнопки ===
function drawSquareButton(x, y, size, icon) {
  drawPixel(x + 8, y + 8, size, size, '#000');
  drawPixel(x, y, size, size, '#000');
  drawPixel(x + 5, y + 5, size - 10, size - 10, '#FFF');

  ctx.fillStyle = '#000';
  const cx = x + size / 2;
  const cy = y + size / 2;
  const s = size / 5;

  if (icon === 'play') {
    ctx.beginPath(); ctx.moveTo(cx - s, cy - s*1.5); ctx.lineTo(cx + s*1.5, cy); ctx.lineTo(cx - s, cy + s*1.5); ctx.fill();
  } else if (icon === 'left') {
    ctx.beginPath(); ctx.moveTo(cx + s, cy - s*1.5); ctx.lineTo(cx - s*1.5, cy); ctx.lineTo(cx + s, cy + s*1.5); ctx.fill();
  } else if (icon === 'right') {
    ctx.beginPath(); ctx.moveTo(cx - s, cy - s*1.5); ctx.lineTo(cx + s*1.5, cy); ctx.lineTo(cx - s, cy + s*1.5); ctx.fill();
  } else if (icon === 'home') {
    ctx.beginPath(); ctx.moveTo(cx, cy - s*1.5); ctx.lineTo(cx + s*1.5, cy); ctx.lineTo(cx + s, cy); ctx.lineTo(cx + s, cy + s*1.5); ctx.lineTo(cx - s, cy + s*1.5); ctx.lineTo(cx - s, cy); ctx.lineTo(cx - s*1.5, cy); ctx.fill();
  }
}

function drawArrowHint(x, y, size, direction) {
  drawPixel(x + 6, y + 6, size, size, '#000');
  drawPixel(x, y, size, size, '#000');
  drawPixel(x + 4, y + 4, size - 8, size - 8, '#FFF');

  ctx.fillStyle = '#000';
  const cx = x + size / 2;
  const cy = y + size / 2;
  const s = size / 5;

  if (direction === 'left') {
    ctx.beginPath(); ctx.moveTo(cx + s, cy - s*1.5); ctx.lineTo(cx - s*1.5, cy); ctx.lineTo(cx + s, cy + s*1.5); ctx.fill();
  } else if (direction === 'right') {
    ctx.beginPath(); ctx.moveTo(cx - s, cy - s*1.5); ctx.lineTo(cx + s*1.5, cy); ctx.lineTo(cx - s, cy + s*1.5); ctx.fill();
  } else if (direction === 'up') {
    ctx.beginPath(); ctx.moveTo(cx - s*1.5, cy + s); ctx.lineTo(cx, cy - s*1.5); ctx.lineTo(cx + s*1.5, cy + s); ctx.fill();
  }
}

function drawBackgroundMenu() {
  ctx.fillStyle = '#FFE8D6'; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameRender() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2; const cy = canvas.height / 2;

  if (gameState === 'menu') {
    drawBackgroundMenu();

    for (let i = 0; i < lives; i++) {
      if (heartImg.complete) { ctx.drawImage(heartImg, 30 + i * 70, 20, 70, 70); }
      else { ctx.fillStyle = '#E74C3C'; ctx.fillRect(30 + i * 70, 20, 70, 70); }
    }

    let balanceText = `BALANCE: ${totalScore}`;
    drawPixelText(balanceText, cx - getPixelTextWidth(balanceText, 6) / 2, 30, 6, '#000');

    const groundY = cy + 80; const groundH = canvas.height - groundY;
    drawPixel(0, groundY, canvas.width, groundH, '#A16A4E');
    for (let py = groundY + 15; py < canvas.height; py += 10) for (let px = 0; px < canvas.width; px += 20) { drawPixel(px + 5, py, 10, 2, '#8C553B'); drawPixel(px + 15, py, 5, 2, '#8C553B'); }
    drawPixel(0, canvas.height - 5, canvas.width, 5, '#6B3E26'); drawPixel(0, groundY, canvas.width, 12, '#5EA828'); drawPixel(0, groundY, canvas.width, 3, '#81C784'); drawPixel(0, groundY + 12, canvas.width, 3, '#3A6B16');
    for (let px = 0; px < canvas.width; px += 12) {
      drawPixel(px, groundY + 12, 4, 4, '#5EA828'); drawPixel(px + 4, groundY + 12, 4, 6, '#5EA828'); drawPixel(px + 8, groundY + 12, 4, 4, '#5EA828');
      drawPixel(px, groundY + 16, 4, 2, '#3A6B16'); drawPixel(px + 4, groundY + 18, 4, 2, '#3A6B16'); drawPixel(px + 8, groundY + 16, 4, 2, '#3A6B16');
    }
    for (let px = 5; px < canvas.width; px += 25) drawPixel(px, groundY + 5, 3, 3, '#81C784');

    drawCharacter(cx - 30, groundY - 65, true, selectedCharacter);
    
    drawSquareButton(cx - 240, cy + 10, 60, 'left');
    drawSquareButton(cx + 170, cy + 10, 60, 'right');
    drawSquareButton(cx - 30, groundY + 40, 60, 'play');

    let lvlText = `LEVEL: 1`;
    drawPixelText(lvlText, cx - getPixelTextWidth(lvlText, 6) / 2, cy + 210, 6, '#000');

    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  } else {
    // --- Игра ---
    ctx.fillStyle = '#FFE8D6'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    worldCamera.x = hero.x - canvas.width / 3;
    if (worldCamera.x < 0) worldCamera.x = 0;

    ctx.save(); ctx.translate(-worldCamera.x, 0);
    const level = activeLvlData;

    for (const p of level.platforms) {
      drawPixel(p.x, p.y, p.w, p.h, '#A16A4E');
      for (let py = p.y + 15; py < p.y + p.h; py += 10) for (let px = p.x; px < p.x + p.w; px += 20) { drawPixel(px + 5, py, 10, 2, '#8C553B'); drawPixel(px + 15, py, 5, 2, '#8C553B'); }
      drawPixel(p.x, p.y + p.h - 4, p.w, 4, '#6B3E26'); drawPixel(p.x, p.y, p.w, 12, '#5EA828'); drawPixel(p.x, p.y, p.w, 3, '#81C784'); drawPixel(p.x, p.y + 12, p.w, 3, '#3A6B16');
      for (let px = p.x; px < p.x + p.w; px += 12) {
        drawPixel(px, p.y + 12, 4, 4, '#5EA828'); drawPixel(px + 4, p.y + 12, 4, 6, '#5EA828'); drawPixel(px + 8, p.y + 12, 4, 4, '#5EA828');
        drawPixel(px, p.y + 16, 4, 2, '#3A6B16'); drawPixel(px + 4, p.y + 18, 4, 2, '#3A6B16'); drawPixel(px + 8, p.y + 16, 4, 2, '#3A6B16');
      }
      for (let px = p.x + 5; px < p.x + p.w; px += 25) drawPixel(px, p.y + 5, 3, 3, '#81C784');
    }
    if (currentLvlIndex === 0) {
      drawArrowHint(100, 250, 60, 'left'); 
      drawArrowHint(180, 250, 60, 'right');
      drawArrowHint(260, 250, 60, 'up');

      drawPixelText("ДВИГАТЬСЯ", 100, 320, 4, '#FFF'); 
      drawPixelText("ПРЫЖОК", 260, 320, 4, '#FFF'); 
      let tipText = "ПРЫГАЙ НА ВРАГА, ЧТОБЫ НАНЕСТИ ЕМУ УРОН";
      drawPixelText(tipText, 600, 250, 4, '#FFF'); 
    }

    drawPixel(level.goal.x, level.goal.y, level.goal.w, level.goal.h, '#37474F'); drawPixel(level.goal.x + 5, level.goal.y + 5, level.goal.w - 10, level.goal.h - 10, '#FF5252'); drawPixel(level.goal.x + 5, level.goal.y + 5, level.goal.w - 10, 10, '#FF1744');
    drawCollectibles(level.currentCoins);

    for (const enemy of level.currentEnemies) {
      if (enemy.alive) {
        const isMovingRight = enemy.currentVx > 0; const enemyType = enemy.type || 'croc';
        if (enemy.isDying) {
          ctx.save(); const floatUp = enemy.dieTimer * 60; const opacity = 1 - enemy.dieTimer;
          ctx.globalAlpha = opacity; drawEnemy(enemy.x, enemy.y - floatUp, enemy.w, enemy.h, isMovingRight, enemyType); ctx.restore();
        } else drawEnemy(enemy.x, enemy.y, enemy.w, enemy.h, isMovingRight, enemyType);
      }
    }

    let hx = hero.x; let hy = hero.y; let breathScale = 1;
    if (hero.breathTimer > 0) breathScale = 1 + Math.sin(hero.breathTimer * 5) * 0.04;

    ctx.save();
    if (!hero.isFacingRight) { ctx.translate(hx + hero.width, hy); ctx.scale(-1, 1); hx = 0; hy = 0; }
    if (hero.isGrounded && hero.breathTimer > 0) { ctx.translate(hx + hero.width/2, hy + hero.height); ctx.scale(breathScale, 2 - breathScale); ctx.translate(-(hx + hero.width/2), -(hy + hero.height)); }
    drawCharacter(hx, hy, Math.abs(hero.vx) > 0.1, selectedCharacter);
    ctx.restore(); 
    
    ctx.restore();

    updateAndDrawParticles();

    // UI ИГРЫ
    for (let i = 0; i < lives; i++) {
      if (heartImg.complete) { ctx.drawImage(heartImg, 20 + i * 70, 25, 70, 70); }
      else { ctx.fillStyle = '#E74C3C'; ctx.fillRect(20 + i * 70, 25, 70, 70); }
    }

    let balText = `BALANCE: ${totalScore}`;
    drawPixelText(balText, cx - getPixelTextWidth(balText, 6) / 2, 40, 6, '#000');

    let lvlTxt = `LEVEL: ${currentLvlIndex + 1}`;
    drawPixelText(lvlTxt, 20, 100, 6, '#000');
    
    drawSquareButton(canvas.width - 80, 20, 60, 'home');

    if (gameState === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      let pauseText = "ПАУЗА";
      drawPixelText(pauseText, cx - getPixelTextWidth(pauseText, 10) / 2, 200, 10, '#FFF');
      drawSquareButton(cx - 35, 300, 70, 'play');
    }

    if (isVictory) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      let winText = "ПОБЕДА!";
      drawPixelText(winText, cx - getPixelTextWidth(winText, 10) / 2, cy - 100, 10, '#E74C3C');
      
      let scoreText = `СОБРАНО: ${totalScore}`;
      drawPixelText(scoreText, cx - getPixelTextWidth(scoreText, 6) / 2, cy + 50, 6, '#1A252F');
    }
  }
}
function mainLoop() {
  gameUpdate();
  gameRender();
  requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);