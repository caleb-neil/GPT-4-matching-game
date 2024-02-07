var container = document.getElementById("container");
var boxes;

// takes the data from the JSON object and turns it into data I can read
window.onload = function () {
  fetch('boxes.json')
    .then(response => response.json())
    .then(data => {
      boxes = data;
      makeBoxes();
    })
    .catch(error => console.error('Error loading boxes:', error));
}

// Takes the data sent from the above function and turns it into a series of HTML dividers that have certain attributes
function makeBoxes() {
  for (var i = 0; i < 4; i++) {
      var term = document.createElement("div");
      var output = document.createElement("div");
      container.appendChild(term);
      container.appendChild(output);
      term.classList.add("box");
      output.classList.add("box");
      term.classList.add(i);
      output.classList.add(i);
      term.innerHTML = boxes[i]["term"];
      output.innerHTML = boxes[i]["output"];
  }

  if (boxes[0]["type"] === "math") {
    makeGraphs(boxes);
  }
  
  boxes = container.childNodes;
  setBoxLocation();
}

// Randomly sets the x and y coordinates of the boxes inside of a container so they don't appear in the same spot every time.
function setBoxLocation() {
  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    var randY = Math.floor(Math.random() * (800 - box.clientHeight));
    var randX = Math.floor(Math.random() * (800 - box.clientWidth));
    box.style.left = randX + "px";
    box.style.top = randY + "px";
    dragElement(box);
  }
}

// function that allows boxes to be dragged accross the screen
function dragElement(el) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  el.onmousedown = dragStart;

  // starts the three drag functions
  function dragStart(e) {
    e = e || window.event;
    e.preventDefault;

    pos3 = e.clientX;
    pos4 = e.clientY;
    el.classList.add("top-layer");

    document.onmouseup = dragEnd;
    document.onmousemove = drag;
  }

  // determines when a box should stop being dragged
  function dragEnd() {
    checkOverlap(el);
    el.classList.remove("top-layer");
    document.onmouseup = null;
    document.onmousemove = null;
  }

  // allows boxes to be dragged by keeping track of their x and y values with the mouses.
  function drag(e) {
    e = e || window.event;
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    isTouchingBorder(el, container);
    if(el.classList.contains("Top") || el.classList.contains("Bottom")) pos2 = 0;
    if(el.classList.contains("Left") || el.classList.contains("Right")) pos1 = 0;
    
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
  }

  // determines if boxes are overlapping and if they match. If they do then they need to dissappear, else they stay on the screen.
  function checkOverlap(el) {
    var currentBox = el
    var currentBoxRect = currentBox.getBoundingClientRect();
    for (var i = 0; i < boxes.length; i++) {

      var otherBox = boxes[i];

      if (otherBox == currentBox) {
        continue;
      }

      var otherBoxRect = otherBox.getBoundingClientRect();

      if (
        !currentBox.classList.contains("disappear") &&
        !otherBox.classList.contains("disappear") &&
        currentBox.classList[1] === otherBox.classList[1] &&
        doBoxesOverlap(currentBoxRect, otherBoxRect)
      ) {
        currentBox.classList.add("disappear");
        otherBox.classList.add("disappear");
      }
    }
  }

  // determines if a box is touching another box's border
  function isTouchingBorder(element1, element2) {
    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();

    var touchingLeft = rect1.right >= rect2.left + 5 && rect1.left <= rect2.left + 5;
    var touchingRight = rect1.left <= rect2.right - 5 && rect1.right >= rect2.right - 5;
    var touchingTop = rect1.bottom >= rect2.top + 5 && rect1.top <= rect2.top + 5;
    var touchingBottom = rect1.top <= rect2.bottom - 5 && rect1.bottom >= rect2.bottom - 5;

    if (touchingLeft && !el.classList.contains("Left") && pos1 > 0) el.classList.add("Left");
    else if (pos1 < 0 && el.classList.contains("Left")) el.classList.remove("Left");
    if (touchingRight && !el.classList.contains("Right") && pos1 < 0) el.classList.add("Right");
    else if (pos1 > 0 && el.classList.contains("Right")) el.classList.remove("Right");
    if (touchingTop && !el.classList.contains("Top") && pos2 > 0) el.classList.add("Top");
    else if (pos2 < 0 && el.classList.contains("Top")) el.classList.remove("Top");
    if (touchingBottom && !el.classList.contains("Bottom") && pos2 < 0) el.classList.add("Bottom");
    else if (pos2 > 0 && el.classList.contains("Bottom")) el.classList.remove("Bottom");
  }

  // checks if boxes are overlapping
  function doBoxesOverlap(box1, box2) {
    return (
      box1.left < box2.right &&
      box1.right > box2.left &&
      box1.top < box2.bottom &&
      box1.bottom > box2.top
    );
  }
}