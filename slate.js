//TODO: Implement the algorithm mentioned in
// https://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node17.html
// Next TODO:
// You keep on clicking and we start getting lines that connect the points.
// [X] Click on a point and generate a 'dot' for it.
// [X] Draw a line between the penultimate and ultimate point.
// [X] As long as we are in draw mode... have a line floating from one point to the next, wh
// [ ] store the knots possibly into our drawing context..
// [ ] Display the points in the stackframe.
// [ ] Instead of lines make them bsplines.
// We've something which generates a point for every click. Now just ma

const SlateModes = {
  VISUAL: 'visual',
  DRAW: 'draw',
  EDIT: 'edit',
}

// Global variables
var slateMode = SlateModes.VISUAL;
var userMsg = "";
var currentKnot = null;
var floatingPoint = null;
var floatingPath = null;

function updateStatus() {
  var statusMsg = "STATUS: '<b>"+slateMode+"</b>'.";
  if (userMsg != "") {
    statusMsg += "<br>[PROMPT]: <i>"+userMsg+"</i>";
  }
  document.getElementById("status").innerHTML = statusMsg;
}


updateStatus();


class Knot {
  constructor(controlPoints, isClosed) {
    this.controlPoints = controlPoints;
    this.isClosed = isClosed;
    this.pathStringTillNow = `M${this.controlPoints[0].attrs.cx}, ${this.controlPoints[0].attrs.cy}  `;
    controlPoints.slice(1).forEach(
      el => (this.pathStringTillNow += ` ${el.attrs.cx}, ${el.attrs.cy} `));
  }

  addPoint(point) {
    this.pathStringTillNow += `${point.attrs.cx}, ${point.attrs.cy} `;
    this.controlPoints.push(point);
  }

  closeKnot() {
    this.isClosed = true;
  }

  updatePathWith(path, anotherPoint) {
    var pathString = this.pathStringTillNow + ` ${anotherPoint.attrs.cx}, ${anotherPoint.attrs.cy} `;
    if (this.isClosed) {
      pathString += 'Z';
    }
    path.attr('path', pathString);
  }

  finishPath(path) {
    var pathString = this.pathStringTillNow;
    if (this.isClosed) {
      pathString += 'Z';
    }
    path.attr('path', pathString);
  }
}


class TKnot {
  constructor(controlPoints, isClosed) {
    this.controlPoints = controlPoints;
    this.isClosed = isClosed;
    this.pathStringTillNow = `M${this.controlPoints[0].attrs.cx}, ${this.controlPoints[0].attrs.cy} T `;
    controlPoints.slice(1).forEach(
      el => (this.pathStringTillNow += ` ${el.attrs.cx}, ${el.attrs.cy} `));
  }

  addPoint(point) {
    this.pathStringTillNow += `${point.attrs.cx}, ${point.attrs.cy} `;
    this.controlPoints.push(point);
  }

  closeKnot() {
    this.isClosed = true;
  }

  updatePathWith(path, anotherPoint) {
    var pathString = this.pathStringTillNow + ` ${anotherPoint.attrs.cx}, ${anotherPoint.attrs.cy} `;
    if (this.isClosed) {
      pathString += 'Z';
    }
    path.attr('path', pathString);
  }

  finishPath(path) {
    var pathString = this.pathStringTillNow;
    if (this.isClosed) {
      pathString += 'Z';
    }
    path.attr('path', pathString);
  }
}

class DrawingContext {
  constructor(knot) {
    this.knot = knot;
  }
}


// Get dimensions
const slateDiv = document.getElementById("slatepaper");
const slateWidth = slateDiv.clientWidth;
const slateHeight = slateDiv.clientHeight;
const pointRadius = 6;

// Create the paper
const paper = Raphael("slatepaper", slateWidth, slateHeight);

// Read keyboard events
document.addEventListener('keydown', keydownHandler);

// Top level function which triggers which event to execute based on user behavior.
function keydownHandler(e) {
  if (e.key == 'd') {
    if (slateMode == SlateModes.VISUAL) {
      slateMode = SlateModes.DRAW;
      userMsg = "Draw the spline";

      // Initializing the floating path
      floatingPath = paper.path();

      // Triggering the listening events
      slateDiv.addEventListener("click", drawClickHandler);
      slateDiv.addEventListener("mousemove", drawMouseMoveHandler);
    }
  }
  else if (e.key == 'e') {
    if (slateMode == SlateModes.VISUAL) {
      slateMode = SlateModes.EDIT;
      userMsg = "Click on a pt. to start editing it.";
    }
  }
  else if (e.key == 'z') {
    if (slateMode == SlateModes.DRAW) {
      // do not listen to mouse clicks any more.
      slateDiv.removeEventListener("click", drawClickHandler);
      slateDiv.removeEventListener("mousemove", drawMouseMoveHandler);

      // get rid of the last point
      currentKnot.closeKnot();

      // copied from escape.


      currentKnot.finishPath(floatingPath);
      currentKnot = null;
      floatingPoint.remove();
      floatingPoint = null;
      floatingPath = null;

      slateMode = SlateModes.VISUAL;
      userMsg = "";
    }
  }
  else if (e.key == "Escape") {
    if (slateMode == SlateModes.DRAW) {
      // do not listen to mouse clicks any more.
      slateDiv.removeEventListener("click", drawClickHandler);
      slateDiv.removeEventListener("mousemove", drawMouseMoveHandler);

      // get rid of the last point
      currentKnot.finishPath(floatingPath);
      currentKnot = null;
      floatingPoint.remove();
      floatingPoint = null;
      floatingPath = null;
    }

    slateMode = SlateModes.VISUAL;
    userMsg = "";

  }
  updateStatus();
}


function drawMouseMoveHandler(e) {
  const clickX = e.clientX - slateDiv.getBoundingClientRect().left;
  const clickY = e.clientY - slateDiv.getBoundingClientRect().top;

  if (floatingPoint != null) {
    floatingPoint.attr('cx', clickX);
    floatingPoint.attr('cy', clickY);
  }
  else {
    floatingPoint = paper.circle(clickX, clickY, pointRadius);
    floatingPoint.attr("fill", "#f00");
  }

  if (currentKnot != null) {
    currentKnot.updatePathWith(floatingPath, floatingPoint);
  }

  /*
  if (lastClickedPoint != null) {
    const pathString = `M ${ lastClickedPoint.attrs.cx } ${ lastClickedPoint.attrs.cy } L ${ clickX } ${ clickY }`;

    if (floatingPath != null) {
      floatingPath.attr("path", pathString);
    }
    else {
      floatingPath = paper.path(pathString);
    }
  }
  */
}

function drawClickHandler(e) {
  floatingPoint.attr("fill", "#00f");

  if (currentKnot != null) {
    currentKnot.addPoint(floatingPoint);
  }
  else {
    currentKnot = new Knot([floatingPoint], false);
  }

  floatingPoint = null;
}


function generateTikz() {
  alert("Not Implemented");
}


function generatePython() {
  alert("Not Implemented");
}
