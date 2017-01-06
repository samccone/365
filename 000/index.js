var canvas = document.createElement('canvas');
var last;
var drawQueue = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

canvas.addEventListener('mousemove', onMove);


function onMove(e) {
  if (last) {
    ctx.strokeStyle = 'rgba(238,58,79,0.8)';
    ctx.beginPath();
    ctx.moveTo(e.x, e.y);
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
    ctx.closePath();
  }
  drawQueue.push({x: e.x, y: e.y});
}

function draw(e) {
  if (!e) {
    return;
  }

  if (last) {
    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
    var distance = Math.abs(last.x - e.x) + Math.abs(last.y - e.y);
    ctx.lineWidth = 50 * (distance / (canvas.width + canvas.height));

    ctx.moveTo(last.x, last.y);
    ctx.lineTo(e.x, e.y);
    ctx.stroke();
    ctx.closePath();
  }

  last = {x: e.x, y: e.y};
}


function processQueue() {
  if (drawQueue.length === 0) {
    return;
  }

  requestAnimationFrame(function() {
    var idx = Math.floor(Math.random() * drawQueue.length);

    draw(drawQueue[idx]);
    drawQueue.splice(idx, 1);
  });
}

setInterval(processQueue, 16.66);
