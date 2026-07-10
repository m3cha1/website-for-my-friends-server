class Star {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = (Math.random() - 0.5) * 0.15;
    this.size = Math.random() * 2 + 2;
    this.opacity = 0.3 + Math.random() * 0.4;
    this.rotation = Math.random() * Math.PI * 2;
    this.vr = (Math.random() - 0.5) * 0.003;
    this.fading = false;
    this.fadeSpeed = 0.002 + Math.random() * 0.003;
    this.dead = false;
  }

  update(width, height) {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.vr;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    if (Math.random() < 0.002) {
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = (Math.random() - 0.5) * 0.15;
    }

    if (!this.fading && Math.random() < 0.003) {
      this.fading = true;
    }

    if (this.fading) {
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0) {
        this.opacity = 0;
        this.dead = true;
      }
    }
  }

  draw(ctx) {
    if (this.dead) return;

    const s = this.size * 2;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.1, -s * 0.1, s * 0.9, -s * 0.1, s, 0);
    ctx.bezierCurveTo(s * 0.1, s * 0.1, s * 0.1, s * 0.9, 0, s);
    ctx.bezierCurveTo(-s * 0.1, s * 0.1, -s * 0.9, s * 0.1, -s, 0);
    ctx.bezierCurveTo(-s * 0.1, -s * 0.1, -s * 0.1, -s * 0.9, 0, -s);
    ctx.closePath();

    ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
    ctx.fill();

    ctx.restore();
  }
}

const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
const STAR_COUNT = 60;
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star(canvas.width, canvas.height));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const star of stars) {
    star.update(canvas.width, canvas.height);
    star.draw(ctx);
  }

  stars = stars.filter(star => !star.dead);
  while (stars.length < STAR_COUNT) {
    stars.push(new Star(canvas.width, canvas.height));
  }

  requestAnimationFrame(animate);
}

resizeCanvas();
initStars();
animate();

window.addEventListener('resize', () => {
  resizeCanvas();
  initStars();
});
