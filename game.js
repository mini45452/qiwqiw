const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
    const screenCoords = mapIndicesToScreen(indexI, indexJ);
  
    // Clear the previous text by drawing a rectangle with the background color
    const rectWidth = 40; // Adjust based on your grid cell size
    const rectHeight = 40;
    this.add.rectangle(screenCoords.x, screenCoords.y, rectWidth, rectHeight, '#000').setOrigin(0);
  
    // Draw the new text at the specified position
    const text = this.add.text(screenCoords.x + rectWidth / 2, screenCoords.y + rectHeight / 2, value, textStyle).setOrigin(0.5);
  
    // Add a click event to the text element
    text.setInteractive().on('pointerdown', () => {
      console.log("waduh", indexI, indexJ);

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
  
    elements.push(text);
  }
  
  function mapIndicesToScreen(i, j) {
    // Implement your logic to map (i, j) to screen coordinates (x, y)
    const posX = x + j * 40;
    const posY = y + i * 40;
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
  const matrixText = this.add.text(400, 100, 'Matrix', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

  // Initialize and render the matrix
  const matrix = initializeRandomMatrix(5, 5, 1, 10);
  const matrixElements = renderMatrix.call(this, matrix, 300, 200);

  // Add click event to matrix elements to display coordinates
  this.input.on('gameobjectdown', (pointer, gameObject) => {
    const { x, y } = gameObject;
    const { value, x: elementX, y: elementY } = matrix[y / 40][x / 40];
    displayIndex.call(this, elementX, elementY);
  });
}
