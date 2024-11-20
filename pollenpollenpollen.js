let flowers = [];
let insects = [];
let pollen = [];
const pollenCount = 100;
const interactionDistance = 50;
const maxPollenOnInsect = 5;

function setup() {
  createCanvas(800, 600);
  createNewFlowerAndInsect();
}

function draw() {
  background(240);
  
  // Update active insect position to follow the mouse
  if (insects.length > 0 && !insects[insects.length - 1].full) {
    insects[insects.length - 1].pos.set(mouseX, mouseY);
  }
  
  // Draw flowers and check for interactions
  flowers.forEach((flower, index) => {
    drawFlower(flower);
    checkInteraction(flower, insects[index]);
  });
  
  // Draw insects
  insects.forEach(insect => drawInsect(insect));
  
  // Draw pollen
  drawPollen();
  
  // Display pollen counts
  displayPollenCounts();
}

function createNewFlowerAndInsect() {
  let newFlower = {
    pos: createVector(random(width), random(height)),
    pollen: []
  };
  
  // Initialize pollen on the new flower
  for (let i = 0; i < pollenCount; i++) {
    let angle = random(TWO_PI);
    let radius = random(30, 40);
    let x = newFlower.pos.x + cos(angle) * radius;
    let y = newFlower.pos.y + sin(angle) * radius;
    newFlower.pollen.push({
      pos: createVector(x, y),
      onInsect: false
    });
  }
  
  flowers.push(newFlower);
  
  let newInsect = {
    pos: createVector(mouseX, mouseY),
    pollen: [],
    full: false
  };
  
  insects.push(newInsect);
}

function checkInteraction(flower, insect) {
  if (!insect || insect.full) return;
  
  let distance = p5.Vector.dist(flower.pos, insect.pos);
  if (distance < interactionDistance) {
    transferPollen(flower, insect);
  }
}

function transferPollen(flower, insect) {
  if (insect.pollen.length < maxPollenOnInsect) {
    for (let p of flower.pollen) {
      if (!p.onInsect && random() < 0.1) {  // 10% chance of transfer
        p.onInsect = true;
        insect.pollen.push(p);
        break;  // Transfer only one pollen at a time
      }
    }
    
    // Check if insect is full
    if (insect.pollen.length >= maxPollenOnInsect) {
      insect.full = true;
      createNewFlowerAndInsect();
    }
  }
}

function drawFlower(flower) {
  fill(0, 0, 255);
  circle(flower.pos.x, flower.pos.y, 80);
}

function drawInsect(insect) {
  fill(255, 0, 0);
  circle(insect.pos.x, insect.pos.y, 40);
}

function drawPollen() {
  flowers.forEach(flower => {
    flower.pollen.forEach(p => {
      if (!p.onInsect) {
        fill(255, 200, 0);  // Orange for pollen on flower
        circle(p.pos.x, p.pos.y, 5);
      }
    });
  });
  
  insects.forEach(insect => {
    insect.pollen.forEach(p => {
      let angle = random(TWO_PI);
      let radius = random(10, 15);
      p.pos.x = insect.pos.x + cos(angle) * radius;
      p.pos.y = insect.pos.y + sin(angle) * radius;
      fill(255, 255, 0);  // Yellow for pollen on insect
      circle(p.pos.x, p.pos.y, 5);
    });
  });
}

function displayPollenCounts() {
  fill(0);
  textSize(16);
  flowers.forEach((flower, index) => {
    text(`Flower ${index + 1} pollen: ${flower.pollen.filter(p => !p.onInsect).length}`, 10, 30 + index * 60);
  });
  insects.forEach((insect, index) => {
    text(`Insect ${index + 1} pollen: ${insect.pollen.length}`, 10, 60 + index * 60);
  });
}