//TODO: Implement the algorithm mentioned in
// https://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node17.html
// Next TODO:
// You keep on clicking and we start getting lines that connect the points.

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

// Create the paper
const paper = Raphael("slatepaper", slateWidth, slateHeight);

// Read keyboard events
document.addEventListener('keypress', logKey);

// Top level function which triggers which event to execute based on user behavior.
function logKey(e) {
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
  else if (e.key == 'v') {
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
  const clickX = e.offsetX;
  const clickY = e.offsetY;
  var circle = paper.circle(clickX, clickY, 2);
  circle.attr("fill", "#00f");
}


function generateTikz() {
  alert("Not Implemented");
}


function generatePython() {
  alert("Not Implemented");
}
