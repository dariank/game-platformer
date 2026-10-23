
const particles = [];

// Отрисовка больших светящихся сфер
function drawCollectibles(coins) {
  for (const c of coins) {
    if (!c.collected) {
      // Легкое парение вверх-вниз
      let floatY = Math.sin(Date.now() / 300 + c.x) * 5; 
      let cx = c.x;
      let cy = c.y + floatY;

      // Если картинка загрузилась — рисуем её
      if (coinImg.complete) {
        // Рисуем монетку размером 30x30
        ctx.drawImage(coinImg, cx - 15, cy - 15, 30, 30);
      } else {
        // Если картинки нет — рисуем желтый круг (заглушку)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// Создание взрыва при сборе (с учетом камеры)
function createExplosion(x, y) {
  // Переводим мировые координаты в экранные (вычитаем позицию камеры)
  let screenX = x - worldCamera.x;
  let screenY = y;

  for (let i = 0; i < 15; i++) {
    particles.push({
      x: screenX, 
      y: screenY,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1.0,
      color: Math.random() > 0.5 ? '#FFD700' : '#FFA500'
    });
  }
}

// Обновление и отрисовка частиц
function updateAndDrawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2; 
    p.life -= 0.03;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    // Рисуем искры пикселями
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fillRect(p.x - 3, p.y - 3, 6, 6); 
    ctx.globalAlpha = 1.0;
  }
}