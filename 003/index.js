var canvas = document.createElement('canvas');
var colors = ['#111111', 'rgb(244,0, 30)'];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

nodes = [];

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.connections = 0;
  }
}

//setup initial shape
var midX = canvas.width / 2;
var midY = canvas.height / 2;
var one = new Node(midX, midY);
var two = new Node(midX + 40, midY);
var three = new Node(midX + 40, midY + 40);
var four = new Node(midX, midY + 40);

connectNode(one, two);
connectNode(two, three);
connectNode(three, four);
connectNode(four, one);

nodes.push(one, two, three, four);


var loops = 100;

while(loops--) {
  var toConnect = nodes.filter(n => n.connections <= 3);

  var nodeA = toConnect[~~(Math.random() * (toConnect.length / 2))];
  var nodeB = toConnect[~~(Math.random() * (toConnect.length / 2)) + Math.floor(toConnect.length / 2)];

  addConnectedShape(nodeA, nodeB);
}

function connectNode(to, from) {
  to.connections++;
  from.connections++;

  ctx.lineTo(from.x, from.y);
}

function randLength() {
  return (~~(Math.random() * 2) ? -1 : 1) * (~~(Math.random() * 80) + 10)
}

function addConnectedShape(anchor, tailAnchor) {
  var two = new Node(anchor.x + randLength(), anchor.y + randLength());

  ctx.beginPath()
  ctx.moveTo(anchor.x, anchor.y);
  connectNode(anchor, two);
  connectNode(two, tailAnchor);
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = colors[~~(colors.length * Math.random())]
  ctx.fill();
  ctx.closePath();

  nodes.push(two);
}

