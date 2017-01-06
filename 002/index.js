var canvas = document.createElement('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext('2d');
var mainPoints = [];
var maxJumpDistance = 40;
var minJumpDistance = 20;
var frameBorder = 20;

document.body.appendChild(canvas);

function nextPointFrom(x, y) {

  var nextX = x + (Math.floor(Math.random() * 2) ? -1 : 1) * ((Math.random() * maxJumpDistance - minJumpDistance) + minJumpDistance);
  var nextY = y + (Math.floor(Math.random() * 2) ? -1 : 1) * ((Math.random() * maxJumpDistance - minJumpDistance) + minJumpDistance);

  var distance = Math.abs(nextX - x + nextY - y);

  if (distance > maxJumpDistance || distance < minJumpDistance) {
    return nextPointFrom(x, y);
  }

  if (nextX > canvas.width - frameBorder || nextX < frameBorder || nextY > canvas.height || nextY < frameBorder) {
    return nextPointFrom(x, y);
  }

  return [nextX, nextY];
}


mainPoints.push([canvas.width / 2, canvas.height/ 2]);

for (let i = 0; i < 3 * 200; ++i) {
  mainPoints.push(
      nextPointFrom.apply(null, mainPoints.slice(-1)[0]));
}


for(let i = 3; i < mainPoints.length; ++i) {
  setTimeout(function() {
    ctx.beginPath();
    if (i % 3 === 0) {
      var offset = 0;
      if (i !== 3) {
        offset = -3;
      }

      var controlPoints = getControlPoints(
        mainPoints[i + offset][0],
        mainPoints[i + offset][1],
        mainPoints[i - 2 + offset][0],
        mainPoints[i - 2 + offset][1],
        mainPoints[i - 3 + offset][0],
        mainPoints[i - 3 + offset][1],
        1);

      ctx.moveTo(mainPoints[i + offset][0], mainPoints[i + offset][1]);
      ctx.bezierCurveTo(
        controlPoints[0], controlPoints[1],
        controlPoints[2], controlPoints[3],
        mainPoints[i - 3 + offset][0], mainPoints[i - 3+ offset][1]
      );

      ctx.stroke();
    }
    ctx.closePath();
  }, i * 5 + 2000 )
}

function getControlPoints(x0,y0,x1,y1,x2,y2,t){
    var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
    var d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
    var fa=t*d01/(d01+d12);   // scaling factor for triangle Ta
    var fb=t*d12/(d01+d12);   // ditto for Tb, simplifies to fb=t-fa
    var p1x=x1-fa*(x2-x0);    // x2-x0 is the width of triangle T
    var p1y=y1-fa*(y2-y0);    // y2-y0 is the height of T
    var p2x=x1+fb*(x2-x0);
    var p2y=y1+fb*(y2-y0);
    return [p1x,p1y,p2x,p2y];
}
