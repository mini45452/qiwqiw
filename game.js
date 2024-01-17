const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

let clickedIndices = [];

// Function to initialize a random matrix with coordinates
function initializeRandomMatrix(rows, cols, minValue, maxValue) {
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const value = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      row.push(value);
    }
    matrix.push(row);
  }
  return matrix;
}

function renderMatrix(matrix, x, y) {
  const textStyle = { font: '18px Arial', fill: '#fff' };
  const elements = [];
  const clickedIndices = []; // Store clicked indices

  function drawText(value, indexI, indexJ) {

    // Define the rectangle dimensions
    const rectWidth = 60;
    const rectHeight = 60;
    const lineSize = 2;

    const screenCoords = mapIndicesToScreen(indexI, indexJ, rectWidth);

    // Clear the previous text by drawing a black rectangle
    const clearRect = this.add.rectangle(
        screenCoords.x + lineSize / 2,
        screenCoords.y + lineSize / 2,
        rectWidth - lineSize,
        rectHeight - lineSize,
        0x000000
    ).setOrigin(0);

    // Draw a transparent rectangle to cover the area
    const hitArea = new Phaser.Geom.Rectangle(screenCoords.x, screenCoords.y, rectWidth, rectHeight);
    const hitAreaGraphics = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0 } });

    // Draw the border around the hit area
    hitAreaGraphics.lineStyle(lineSize, 0xffffff); // Adjust line style as needed
    hitAreaGraphics.strokeRectShape(hitArea);
    hitAreaGraphics.fillRectShape(hitArea);

    hitAreaGraphics.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    // Draw the new text at the specified position
    const text = this.add.text(screenCoords.x + rectWidth / 2, screenCoords.y + rectHeight / 2, value, textStyle).setOrigin(0.5);

    // Add a click event to the transparent rectangle
    hitAreaGraphics.on('pointerdown', () => {
      // Display the (i, j) index at the bottom when clicked
      displayIndex.call(this, indexI, indexJ);

      // Track clicked indices, limit to two elements
      clickedIndices.push({ i: indexI, j: indexJ });

      // If two elements are present, perform the operation
      if (clickedIndices.length === 2) {
        const firstIndex = clickedIndices[0];
        const secondIndex = clickedIndices[1];

        addColumnsAndClearFirst(matrix, firstIndex.i, firstIndex.j, secondIndex.i, secondIndex.j);

        // Draw text only at the first and second index
        drawText.call(this, matrix[firstIndex.i][firstIndex.j], firstIndex.i, firstIndex.j);
        drawText.call(this, matrix[secondIndex.i][secondIndex.j], secondIndex.i, secondIndex.j);

        // Clear the screen
        this.cameras.main.setBackgroundColor('#000');

        clickedIndices.pop();
        clickedIndices.pop();
      }
    });

    elements.push(clearRect, hitAreaGraphics); // Add the clearRect and hitAreaGraphics to elements instead of text
  }

  function mapIndicesToScreen(i, j, siz) {
    // Implement your logic to map (i, j) to screen coordinates (x, y)
    const posX = x + j * siz;
    const posY = y + i * siz;
    return { x: posX, y: posY };
  }

  // Iterate through the matrix and draw text at each position
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      drawText.call(this, matrix[i][j], i, j);
    }
  }
}


// Function to display the (x, y) index at the bottoj
function displayIndex(x, y) {
  console.log("alamakk", x, y);

  if (this.indexText) {
    this.indexText.destroy(); // Remove the previous index text
  }

  const textStyle = { font: '18px Arial', fill: '#fff' };
  this.indexText = this.add.text(400, 550, `(x: ${x}, y: ${y}) ${clickedIndices.length}`, textStyle).setOrigin(0.5);
}

// Function to add two columns and clear the first column
function addColumnsAndClearFirst(matrix, x1, y1, x2, y2) {
  console.log(x1, y1, matrix[x1][y1]);
  console.log(x2, y2, matrix[x2][y2]);
  if (x1 < matrix.length && x2 < matrix.length && y1 < matrix[0].length && y2 < matrix[0].length) {
    matrix[x2][y2] += matrix[x1][y1];
    matrix[x1][y1] = 0;
  } else {
    console.error("Invalid coordinates");
  }
}

// Preload assets
function preload() {
  // No additional assets to preload in this example
}

// Create the game scene
function create() {
  // Add text for the matrix
  // const matrixText = this.add.text(400, 100, 'Matrix', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

  // Initialize and render the matrix
  const matrix = initializeRandomMatrix(5, 5, 1, 10);
  const matrixElements = renderMatrix.call(this, matrix, (1280 - 300) / 2, (720 - 300) / 2);

  // // Add click event to matrix elements to display coordinates
  // this.input.on('gameobjectdown', (pointer, gameObject) => {
  //   const { x, y } = gameObject;
  //   const { value, x: elementX, y: elementY } = matrix[y / 40][x / 40];
  //   displayIndex.call(this, elementX, elementY);
  // });
}
