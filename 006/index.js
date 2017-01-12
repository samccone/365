var canvas = document.createElement('canvas');
var last;
var drawQueue = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

ctx.fillStyle = '#fff';

const blocks = 100;
const size = 100;
let endX = canvas.width;
let endY = canvas.height;

function tick(startOffsetDeg) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  startOffsetDeg = startOffsetDeg || 0;


  for(let i = 0; i <= blocks; ++i) {
    ctx.strokeStyle = 'red';
    let rotationDeg = (startOffsetDeg + (i / blocks) * 360);
    let rotationRad = rotationDeg * Math.PI / 180;

    ctx.beginPath();
    let x = size / 2 + i * (endX - size * 2) / blocks + startOffsetDeg / 360;
    let y = size / 2 + i * (endY - size * 2) / blocks;

    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate(rotationRad);

    ctx.rect(-size / 2, -size / 2, size, size);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.strokeStyle = 'blue';

    rotationRad = (startOffsetDeg + (i / blocks) * 360) * Math.PI / 180;

    ctx.beginPath();
    x = (endX - size) - (size / 2 + i * (endX - size * 2) / blocks);
    y = size / 2 + i * (endY - size * 2) / blocks;

    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate(rotationRad);

    ctx.rect(-size / 2, -size / 2, size, size);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  requestAnimationFrame(function() {
    tick(++startOffsetDeg % 360);
  });
}

requestAnimationFrame(function() {
  tick(0);
});
