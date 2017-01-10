var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

const bounds = [170, 100];
const colors = [
  [0, 0, 70],
  [0, 0, 60],
  [0, 0, 70],
];

const sectionSize = [(canvas.width / bounds[0]), (canvas.height / bounds[1])];

go();

window.addEventListener('keypress', go);

function go() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let k = 0; k < 10; ++k) {
    generateTowerLayer(k);
    ctx.fillStyle = 'hsla(245, 0%, 3%, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function generateTowerLayer(heightLimiter) {
  const pieces = new Map();
  const groups = 15;

  for(let i = 0; i < 5; ++i) {
    generateTower(
      pieces,
      ~~(Math.random() * (bounds[0] - 10)) + 10,
      ~~(Math.random() * (bounds[1] - 40)) + 10 + (3/1+heightLimiter) * heightLimiter,
      ~~(Math.random() * 7) + 3,
      ~~(colors.length * Math.random()));
  }

  performance.mark('start_fill');
  floodFill(pieces);

  performance.mark('end_fill');
  performance.measure('fill', 'start_fill', 'end_fill');
  drawPieces(pieces);
}

function generateTower(pieces, x, y, maxWidth, groupId) {
  pieces.set(pieceKey(x, y), {
    groupId: groupId,
    startY: y,
    startX: x,
    maxWidth: maxWidth,
    spread: function(x, y) {
      if (Math.abs(x - this.startX) > this.maxWidth) {
        return false;
      }

      if (Math.random() * (3 - 2/(1 + Math.abs(y - this.startY))) > 0.5) {
        return true;
      }

      return false;
    }
  });
}

/**
 * @return {boolean} True if there are more spots open.
 */
function floodFill(pieces) {
  let addedPieces = 0;
  for (let [piece, meta] of pieces) {
    let pieceLocation = locationFromKey(piece);


    // left
    let leftLocation = [pieceLocation[0] - 1, pieceLocation[1]];
    if (locationInBounds(...leftLocation)) {
      if (!pieces.has(pieceKey(...leftLocation)) && meta.spread(pieceLocation[0] - 1, pieceLocation[1])) {
        pieces.set(pieceKey(...leftLocation), meta);
        ++addedPieces;
      }
    }

    // right
    let rightLocation = [pieceLocation[0] + 1, pieceLocation[1]];
    if (locationInBounds(...rightLocation)) {
      if (!pieces.has(pieceKey(...rightLocation)) && meta.spread(pieceLocation[0] + 1, pieceLocation[1])) {
        pieces.set(pieceKey(...rightLocation), meta);
        ++addedPieces;
      }
    }

    // down
    let downLocation = [pieceLocation[0], pieceLocation[1] + 1];
    if (locationInBounds(...downLocation)) {
      if (!pieces.has(pieceKey(...downLocation))) {
        pieces.set(pieceKey(...downLocation), meta);
        ++addedPieces;
      }
    }
  }

  if (addedPieces !== 0) {
    return true;
  }

  return false;
}

function locationInBounds(x, y) {
    // X in bounds
    if (x >= 0 && x < bounds[0]) {
      // Y in bounds
      if (y >= 0 && y < bounds[1]) {
        return true;
      }
    }
    return false;
}

function pieceKey(x, y) {
  return `${x}-${y}`;
}

function locationFromKey(key) {
  return key.split('-').map(v => parseInt(v, 10));
}

function generatePiece(groupId) {
  let x = ~~(Math.random() * bounds[0]);
  let y = ~~(Math.random() * bounds[1]);

  let piece = pieces.has(pieceKey(x, y));

  if (piece === false) {
    return [x, y, groupId];
  }

  return generatePiece(groupId);
}

function drawPieces(pieces) {
  const pieceSize = 20;

  for (let [piece, meta] of pieces) {
    let pieceXy = locationFromKey(piece);

    ctx.fillStyle = `hsl(${colors[meta.groupId % colors.length][0]}, ${colors[meta.groupId % colors.length][1]}%, ${~~(colors[meta.groupId % colors.length][2] + meta.groupId / 5)}%`;
    ctx.fillRect(
      ~~(pieceXy[0] * sectionSize[0]),
      ~~(pieceXy[1] * sectionSize[1]),
      Math.ceil(sectionSize[0]),
      Math.ceil(sectionSize[1]));
    }
}
