//TODO: Implement the algorithm mentioned in
// https://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node17.html

const SlateModes = {
  VISUAL: 'visual',
  DRAW: 'draw',
  EDIT: 'edit',
}

// Global variables
var slateMode = SlateModes.VISUAL;
var userMsg = "";


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
const slateWidth = document.getElementById("slatepaper").clientWidth;
const slateHeight = document.getElementById("slatepaper").clientHeight;

var paper = Raphael("slatepaper", slateWidth, slateHeight);
var rect1 = paper.rect(0, 0, slateWidth, slateHeight).attr({fill: "orange"});

function updateStatus() {
  var statusMsg = "STATUS: '<b>"+slateMode+"</b>'.";
  if (userMsg != "") {
    statusMsg += "<br>[PROMPT]: <i>"+userMsg+"</i>";
  }
  document.getElementById("status").innerHTML = statusMsg;
}

function addSegment() {
  slateMode = SlateModes.ADDSGMNT;
  userMsg = "Please select first point";
  updateStatus();

  // Creates circle at x = 50, y = 40, with radius 10
  var circle1 = paper.circle(400, 500, 10);
  // Sets the fill attribute of the circle to red (#f00)
  circle1.attr("fill", "#0f0");
  
  // Sets the stroke attribute of the circle to white
  circle1.attr("stroke", "#fff");

  // Creates circle at x = 50, y = 40, with radius 10
  var circle2 = paper.circle(100, 200, 10);
  // Sets the fill attribute of the circle to red (#f00)
  circle2.attr("fill", "#f00");
  
  // Sets the stroke attribute of the circle to white
  circle2.attr("stroke", "#fff");

  var sgmnt = new Segment([circle1, circle2], []);
  segments.push(sgmnt);

  userMsg = "Added a new segment.";
  updateStatus();
}


function generateTikz() {
  alert("Not Implemented");
}


function generatePython() {
  alert("Not Implemented");
}
