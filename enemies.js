
const enemyImages = {
  croc: {
    right: new Image(),
    left: new Image()
  },
  dino: {
    right: new Image(),
    left: new Image()
  }
};

enemyImages.croc.right.src = 'enred_right.png';
enemyImages.croc.left.src = 'enred_left.png';
enemyImages.dino.right.src = 'enfio_right.png';
enemyImages.dino.left.src = 'enfio_left.png';

function drawEnemy(x, y, w, h, facingRight, type) {
  const img = facingRight ? enemyImages[type].right : enemyImages[type].left;

  if (!img.complete || img.naturalWidth === 0) {
    drawPixel(x, y, w, h, '#E53935');
    return;
  }

  let offsetY = Math.sin(Date.now() / 150) * 2;

  ctx.save();
  
  if (!facingRight) {
    ctx.drawImage(img, x, y + offsetY, w, h);
  } else {
    ctx.drawImage(img, x, y + offsetY, w, h);
  }

  ctx.restore();
}