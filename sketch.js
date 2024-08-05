let palettes = [
  ['#564787', '#DBCBD8', '#F2FDFF', '#9AD4D6', '#101935'],
  ['#E55934', '#5BC0EB', '#404E4D', '#C3BF6D', '#B7B868'],
  ['#26547C', '#FFF8E8', '#FCD581', '#D52941', '#990D35'],
  ['#0E131F', '#38405F', '#59546C', '#8B939C', '#FF0035'],
  ['#080708', '#3772FF', '#DF2935', '#FDCA40', '#E6E8E6'],
  ['#0C0F0A', '#FF206E', '#FBFF12', '#41EAD4', '#FFFFFF'],
  ['#E8AEB7', '#B8E1FF', '#A9FFF7', '#94FBAB', '#82ABA1'],
  ['#ACBEA3', '#40476D', '#826754', '#AD5D4E', '#EB6534'],
  ['#313628', '#595358', '#857F74', '#A4AC96', '#CADF9E'],
  ['#EDD4B2', '#D0A98F', '#4D243D', '#CAC2B5', '#E0C9C9'],
  ['#FABC3C', '#463F3A', '#F19143', '#37505C', '#F55536'],
  ['#1A1F16', '#1E3F20', '#75B8C8', '#53FF45', '#CDD3D5'],
  ['#000000', '#3D2645', '#832161', '#DA4167', '#F0EFF4'],
  ['#161032', '#FAFF81', '#FFC53A', '#E06D06', '#B26700'],
  ['#3A4F41', '#B9314F', '#D5A18E', '#DEC3BE', '#E1DEE3'],
  ['#2B303A', '#92DCE5', '#EEEE59', '#7C7C7C', '#D64933']
];

let chosenPalette;
let margin = 50;
let cols, rows, cellSize;
let canvas;
let num1, num2, num3, num4;
let textures = [];
let chosenTexture;

//some images by kues1 on Freepik
function preload() {
  for (let i = 1; i <= 8; i++) {
    textures[i - 1] = loadImage(`textures/Texture${i}-8K.jpg`);
  }
}

function setup() {
  let canvasWidth = windowWidth - 2 * margin;
  let canvasHeight = windowHeight - 2 * margin;
  canvas = createCanvas(canvasWidth, canvasHeight);
  noLoop();

  let x = (windowWidth - canvasWidth) / 2;
  let y = (windowHeight - canvasHeight) / 2;
  canvas.position(x, y);

  // 4 main variables
  num1 = int(random(1, 17)); // grid density variable
  num2 = int(random(1, 17)); // shape size
  num3 = int(random(1, 17)); // perlin noise multiplier
  num4 = int(random(1, 17)); // grid type

  //color palette randomizer
  let combinedValue = (num1 * 1.1 + num2 * 1.2 + num3 * 0.9 + num4 * 1.3) % palettes.length;
  chosenPalette = palettes[Math.floor(combinedValue)];

  combinedValue = (num1 * 0.8 + num2 * 1.1 + num3 * 1.0 + num4 * 0.9) % textures.length;
  chosenTexture = textures[Math.floor(combinedValue)];

  calculateGridParameters();
}

function draw() {
  background(chosenPalette[0]);

  if (num4 >= 1 && num4 <= 4) {
    drawRegularGrid();
  } else if (num4 >= 5 && num4 <= 8) {
    drawRadialPattern();
  } else if (num4 >= 9 && num4 <= 12) {
    drawCheckerboardPattern();
  } else if (num4 >= 13 && num4 <= 17) {
    drawMultipleRadialGrid(); 
  }

  //draw the textures
  blendMode(OVERLAY); // Use a blending mode that blends well with dark textures
  let aspectRatio = chosenTexture.width / chosenTexture.height;
  let drawWidth, drawHeight;

  if (width / height > aspectRatio) {
    drawWidth = width;
    drawHeight = width / aspectRatio;
  } else {
    drawHeight = height;
    drawWidth = height * aspectRatio;
  }

  image(chosenTexture, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);

  // Optionally, apply opacity by drawing a semi-transparent overlay
  blendMode(BLEND);
  fill(0, 0, 0, 50); //alpha value for opacity
  rect(0, 0, width, height);
}

function drawRegularGrid() {
  let noiseScale = 0.6;

  for (let y = 0; y < rows + 1; y++) {
    for (let x = 0; x < cols + 1; x++) {
      let xPos = x * cellSize;
      let yPos = y * cellSize;
      let shapeIndex = int(random(0, 4));
      let shapeSize = cellSize * (num2 / 16);
      let colorIndex = int(random(0, 5));
      let c = color(chosenPalette[colorIndex]);

      let noiseValue = noise(x * noiseScale, y * noiseScale);
      let offsetX = (noiseValue - 0.5) * cellSize * (num3 / 10);
      let offsetY = (noiseValue - 0.5) * cellSize * (num3 / 10);

      if (random() < 0.5) {
        fill(c);
      } else {
        noFill();
      }

      stroke(c);
      strokeWeight(2);

      push();
      translate(xPos + cellSize / 2 + offsetX, yPos + cellSize / 2 + offsetY);
      drawShape(shapeIndex, shapeSize);
      pop();
    }
  }
}

function drawRadialPattern() {
  let noiseScale = 0.2;
  let centerX = width / 2;
  let centerY = height / 2;
  let maxRadius = min(centerX, centerY);

  for (let r = 0; r < maxRadius; r += cellSize) {
    let circumference = TWO_PI * r;
    let numShapes = floor(circumference / cellSize);
    for (let i = 0; i < numShapes; i++) {
      let angle = i * TWO_PI / numShapes;
      let xPos = centerX + cos(angle) * r;
      let yPos = centerY + sin(angle) * r;
      let shapeIndex = int(random(0, 4));
      let shapeSize = cellSize * (num2 / 16);
      let colorIndex = int(random(0, 5));
      let c = color(chosenPalette[colorIndex]);

      let noiseValue = noise(r * noiseScale, i * noiseScale);
      let offsetX = (noiseValue - 0.5) * shapeSize * (num3 / 10);
      let offsetY = (noiseValue - 0.5) * shapeSize * (num3 / 10);

      if (random() < 0.5) {
        fill(c);
      } else {
        noFill();
      }

      stroke(c);
      strokeWeight(2);

      push();
      translate(xPos + offsetX, yPos + offsetY);
      drawShape(shapeIndex, shapeSize);
      pop();
    }
  }
}

function drawCheckerboardPattern() {
  let noiseScale = 0.1;
  let checkerSize = floor(map(num4, 9, 12, 10, 50));

  for (let y = 0; y < height; y += checkerSize) {
    for (let x = 0; x < width; x += checkerSize) {
      //calc shapes that are blank and filled
      let isShapeCell = (x / checkerSize + y / checkerSize) % 2 === 0;

      if (isShapeCell) {
        let shapeIndex = int(random(0, 4));
        let shapeSize = checkerSize * (num2 / 16);
        let colorIndex = int(random(0, 5));
        let c = color(chosenPalette[colorIndex]);

        let noiseValue = noise(x * noiseScale, y * noiseScale);
        let offsetX = (noiseValue - 0.5) * shapeSize * (num3 / 10);
        let offsetY = (noiseValue - 0.5) * shapeSize * (num3 / 10);

        fill(c);
        noStroke();

        push();
        translate(x + checkerSize / 2 + offsetX, y + checkerSize / 2 + offsetY);
        drawShape(shapeIndex, shapeSize);
        pop();
      } else {
      //space left intentionally blank :3
      }
    }
  }
}


function drawMultipleRadialGrid() {
  let noiseScale = 0.7;
  let numCenters = map(num4, 13, 17, 2, 8); // number of radial centers
  let centerRadius = min(width, height) / (2 * sqrt(numCenters));

  for (let n = 0; n < numCenters; n++) {
    let angle = n * TWO_PI / numCenters;
    let centerX = width / 2 + cos(angle) * centerRadius;
    let centerY = height / 2 + sin(angle) * centerRadius;
    let maxRadius = min(centerX, centerY, width - centerX, height - centerY);

    for (let r = 0; r < maxRadius; r += cellSize) {
      let circumference = TWO_PI * r;
      let numShapes = floor(circumference / cellSize);
      for (let i = 0; i < numShapes; i++) {
        let angle = i * TWO_PI / numShapes;
        let xPos = centerX + cos(angle) * r;
        let yPos = centerY + sin(angle) * r;
        let shapeIndex = int(random(0, 4));
        let shapeSize = cellSize * (num2 / 16);
        let colorIndex = int(random(0, 5));
        let c = color(chosenPalette[colorIndex]);

        let noiseValue = noise(r * noiseScale, i * noiseScale);
        let offsetX = (noiseValue - 0.5) * shapeSize * (num3 / 10);
        let offsetY = (noiseValue - 0.5) * shapeSize * (num3 / 10);

        if (random(0,1) < 1) {
          fill(c);
        } else {
          noFill();
        }

        stroke(c);
        strokeWeight(2);

        push();
        translate(xPos + offsetX, yPos + offsetY);
        drawShape(shapeIndex, shapeSize);
        pop();
      }
    }
  }
}

function calculateGridParameters() {
  let availableWidth = width;
  let availableHeight = height;

  let maxCells = num1 * 10; // Total number of cells in one dimension
  cellSize = min(availableWidth / maxCells, availableHeight / maxCells);

  cols = floor(availableWidth / cellSize);
  rows = floor(availableHeight / cellSize);
}

function drawShape(index, size) {
  switch(index) {
    case 0:
      rectMode(CENTER);
      rect(0, 0, size, size);
      break;
    case 1:
      ellipse(0, 0, size, size);
      break;
    case 2:
      triangle(-size / 2, size / 2, 0, -size / 2, size / 2, size / 2);
      break;
    case 3:
      drawStar(0, 0, size / 3, size / 2, 5);
      break;
  }
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function windowResized() {
  let canvasWidth = windowWidth - 2 * margin;
  let canvasHeight = windowHeight - 2 * margin;
  resizeCanvas(canvasWidth, canvasHeight);
  let x = (windowWidth - canvasWidth) / 2;
  let y = (windowHeight - canvasHeight) / 2;
  canvas.position(x, y);
  calculateGridParameters();
  redraw();
}
