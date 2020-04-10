//TODO: Implement the algorithm mentioned in
// https://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node17.html
// Next TODO:
// You keep on clicking and we start getting lines that connect the points.
// [X] Click on a point and generate a 'dot' for it.
// [X] Draw a line between the penultimate and ultimate point.
// [X] As long as we are in draw mode... have a line floating from one point to the next, wh
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
var lastClickedPoint = null;
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
  constructor(controlPoints, leftRightIndices, clampIndices) {
    this.controlPoints = controlPoints;
    this.leftRightIndices = lefRightIndices;
    this.clampIndices = clampIndices;
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
  else if (e.key == "Escape") {
    if (slateMode == SlateModes.DRAW) {
      // do not listen to mouse clicks any more.
      slateDiv.removeEventListener("click", drawClickHandler);
      slateDiv.removeEventListener("mousemove", drawMouseMoveHandler);

      // get rid of the last point
      lastClickedPoint = null;
      floatingPoint.remove();
      floatingPoint = null;
      floatingPath.remove();
      floatingPath = null;
    }

    slateMode = SlateModes.VISUAL;
    userMsg = "";

  }
  updateStatus();
}


function drawMouseMoveHandler(e) {
  if (floatingPoint != null) {
    floatingPoint.translate(e.movementX, e.movementY);
  }
  else {
    const clickX = e.clientX - slateDiv.getBoundingClientRect().left;
    const clickY = e.clientY - slateDiv.getBoundingClientRect().top;

    floatingPoint = paper.circle(clickX, clickY, pointRadius);
    floatingPoint.attr("fill", "#f00");
  }

  if (lastClickedPoint != null) {
    const lastClickedPointX = lastClickedPoint.getPointAtLength().x;
    const lastClickedPointY = lastClickedPoint.getPointAtLength().y + pointRadius;

    const clickX = e.clientX - slateDiv.getBoundingClientRect().left;
    const clickY = e.clientY - slateDiv.getBoundingClientRect().top;

    const pathString = `M ${ lastClickedPointX } ${ lastClickedPointY } L ${ clickX } ${ clickY }`;

    if (floatingPath != null) {
      floatingPath.attr("path", pathString);
    }
    else {
      floatingPath = paper.path(pathString);
    }
  }
}

function drawClickHandler(e) {
  //@TODO: Scope for better object management.
  // Instead of creating 'var cirlce' maybe next time, just 
  floatingPoint.remove();
  floatingPoint = null;
  if (floatingPath != null) {
    floatingPath.remove();
    floatingPath = null;
  }

  const clickX = e.clientX - slateDiv.getBoundingClientRect().left;
  const clickY = e.clientY - slateDiv.getBoundingClientRect().top;

  console.log(`(${clickX}, ${clickY})`);

  var circle = paper.circle(clickX, clickY, pointRadius);
  circle.attr("fill", "#00f");
  if (lastClickedPoint != null) {
    const lastClickedPointX = lastClickedPoint.getPointAtLength().x;
    //@TODO: Understand why do we need the '+ pointRadius'.
    const lastClickedPointY = lastClickedPoint.getPointAtLength().y + pointRadius;

    var pathString = `M ${ lastClickedPointX } ${ lastClickedPointY } L ${ clickX } ${ clickY }`;
    paper.path(pathString);
  }

  lastClickedPoint = circle;
}


function generateTikz() {
  alert("Not Implemented");
}


function generatePython() {
  alert("Not Implemented");
}
