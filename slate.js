//TODO: Implement the algorithm mentioned in
// https://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node17.html
// Next TODO:
// You keep on clicking and we start getting lines that connect the points.
// [X] Click on a point and generate a 'dot' for it.
// [X] Draw a line between the penultimate and ultimate point.
// [ ] As long as we are in draw mode... have a line floating from one point to the next, wh
// We've something which generates a point for every click. Now just ma

const SlateModes = {
  VISUAL: 'visual',
  DRAW: 'draw',
  EDIT: 'edit',
}

// Global variables
var slateMode = SlateModes.VISUAL;
var userMsg = "";
var lastPoint = null;

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
    }

    slateMode = SlateModes.VISUAL;
    userMsg = "";

  }
  updateStatus();
}


function drawClickHandler(e) {
  // FIXME: offset is not a good choice, as once we have a different
  // 'div' the offset would change and abandon it.  A better metric is
  // always clientX, clientY.
  const clickX = e.clientX - slateDiv.getBoundingClientRect().left;
  const clickY = e.clientY - slateDiv.getBoundingClientRect().top;

  console.log(`( ${ clickX },  ${clickY}`);

  //@TODO: '10' is no good, set the radius in a relative sense.
  var circle = paper.circle(clickX, clickY, pointRadius);
  circle.attr("fill", "#00f");
  if (lastPoint != null) {
    lastPointX = lastPoint.getPointAtLength().x;
    lastPointY = lastPoint.getPointAtLength().y + pointRadius;

    // FIXME: There appears to be some offset in the path creation.
    var pathString = `M ${ lastPointX } ${ lastPointY } L ${ clickX } ${ clickY }`;
    paper.path(pathString);
  }
  else {
    console.log("Fail bhai!");
  }

  lastPoint = circle;
}


function generateTikz() {
  alert("Not Implemented");
}


function generatePython() {
  alert("Not Implemented");
}
