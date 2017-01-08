var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

const bounds = [400, 400];
const colors = [
  [86, 28, 33],
  [103, 24, 57],
  [184, 78, 39],
  [183, 81, 70],
  [3, 83, 49],
  [39, 80, 70],
  [191, 63, 7]
];

const sectionSize = [(canvas.width / bounds[0]), (canvas.height / bounds[1])];
const pieces = new Map();
const groups = 120;

for(let i = 0; i < groups; ++i) {
  let piece = generatePiece(i);
  pieces.set(pieceKey(piece[0], piece[1]), piece[2]);
}

performance.mark('start_fill');
floodFill(pieces);

performance.mark('end_fill');
performance.measure('fill', 'start_fill', 'end_fill');
drawPieces(pieces);


/**
 * @return {boolean} True if there are more spots open.
 */
function floodFill(pieces) {
  let addedPieces = 0;
  for (let [piece, groupId] of pieces) {
    let pieceLocation = locationFromKey(piece);

    // left
    let leftLocation = [pieceLocation[0] - 1, pieceLocation[1]];
    if (locationInBounds(...leftLocation)) {
      if (!pieces.has(pieceKey(...leftLocation))) {
        pieces.set(pieceKey(...leftLocation), groupId);
        ++addedPieces;
      }
    }

    // right
    let rightLocation = [pieceLocation[0] + 1, pieceLocation[1]];
    if (locationInBounds(...rightLocation)) {
      if (!pieces.has(pieceKey(...rightLocation))) {
        pieces.set(pieceKey(...rightLocation), groupId);
        ++addedPieces;
      }
    }

    // up
    let upLocation = [pieceLocation[0], pieceLocation[1] - 1];
    if (locationInBounds(...upLocation)) {
      if (!pieces.has(pieceKey(...upLocation))) {
        pieces.set(pieceKey(...upLocation), groupId);
        ++addedPieces;
      }
    }

    // down
    let downLocation = [pieceLocation[0], pieceLocation[1] + 1];
    if (locationInBounds(...downLocation)) {
      if (!pieces.has(pieceKey(...downLocation))) {
        pieces.set(pieceKey(...downLocation), groupId);
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let [piece, groupId] of pieces) {
    let pieceXy = locationFromKey(piece);

    ctx.fillStyle = `hsl(${colors[groupId % colors.length][0]}, ${colors[groupId % colors.length][1]}%, ${~~(colors[groupId % colors.length][2] + groupId / 5)}%`;
    ctx.fillRect(
      ~~(pieceXy[0] * sectionSize[0]),
      ~~(pieceXy[1] * sectionSize[1]),
      Math.ceil(sectionSize[0]),
      Math.ceil(sectionSize[1]));
  }
}
