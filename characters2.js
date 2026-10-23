// === ЗАГРУЗКА СПРАЙТ-ЛИСТА ===
const spriteSheet = new Image();
spriteSheet.src = 'spritesheet.png'; 

function drawCharacter(x, y, isWalking, charType) {
  if (!spriteSheet.complete || spriteSheet.naturalWidth === 0) {
    drawPixel(x, y, 40, 60, '#E53935');
    return;
  }

  const frames = [
    [ {x: 470, y: 10, w: 200, h: 190}, {x: 670, y: 10, w: 200, h: 190}, {x: 870, y: 10, w: 200, h: 190} ],
    [ {x: 470, y: 210, w: 200, h: 190}, {x: 670, y: 210, w: 200, h: 190}, {x: 870, y: 210, w: 200, h: 190} ],
    [ {x: 470, y: 415, w: 200, h: 190}, {x: 670, y: 415, w: 200, h: 190}, {x: 870, y: 415, w: 200, h: 190} ],
    [ {x: 470, y: 615, w: 200, h: 220}, {x: 670, y: 615, w: 200, h: 220}, {x: 870, y: 615, w: 200, h: 220} ],
    [ {x: 470, y: 840, w: 200, h: 175}, {x: 670, y: 840, w: 200, h: 175}, {x: 870, y: 840, w: 200, h: 175} ]
  ];

let frameIndex = 1; // По умолчанию стоим на 1 кадре
if (isWalking) {
  // Если идем, переключаем кадры 1 и 2 каждые 0.2 секунды (в зависимости от animTimer)
  // Math.floor(hero.animTimer) % 2 будет давать 0 или 1.
  // Прибавляем 1, чтобы получить индексы 1 и 2.
  frameIndex = 1 + (Math.floor(hero.animTimer) % 2); 
}

let currentFrame = frames[charType][frameIndex];
  
  const drawSize = 80;
  const drawX = x - 10;
  const drawY = y - 15;

  let offsetY = 0;
  if (isWalking) {
    offsetY = Math.sin(Date.now() / 100) * 3;
  }

  let flip = false;
  if (typeof hero !== 'undefined' && !hero.isFacingRight) {
    flip = true;
  }

  ctx.save();
  
  if (flip) {
    // Отражаем картинку (смотрит влево)
    ctx.translate(drawX + drawSize, drawY + offsetY);
    ctx.scale(-1, 1);
    ctx.drawImage(
      spriteSheet, 
      currentFrame.x, currentFrame.y, currentFrame.w, currentFrame.h, 
      0, 0, drawSize, drawSize 
    );
  } else {
    // Рисуем как есть (смотрит вправо)
    ctx.drawImage(
      spriteSheet, 
      currentFrame.x, currentFrame.y, currentFrame.w, currentFrame.h, 
      drawX, drawY + offsetY, drawSize, drawSize 
    );
  }

  ctx.restore();
}