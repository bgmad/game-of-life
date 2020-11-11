const canvasWidth = 720;
const canvasHeight = 720;
const gridWidth = 50;
const gridHeight = 50;
const scaleWidth = canvasWidth / gridWidth;
const scaleHeight = canvasHeight / gridHeight;
let gen1, gen2;

const createStateEnvironment = (width, height) => {
    let rows = []; //this is an array that holds the rows. ex: rows[2][4] would be 3rd row down and 5th item to the right. if you think about it like the cartesian coordinate system, the x and y values are switched.
    for(let y = 0; y < height; y++) {
        let row = [];
        for(let x = 0; x < width; x++)
            row.push(Math.random() < 0.08 ? true : false);
        rows.push(row);
    }
    return rows;
};

const createCells = (env) => { //this function takes 2D array of booleans (alive or dead) and returns 2D array of JSX componets 
  const neighbors = getNeighbors(env);
  return env.map((row, y) => 
    row.map((state, x) => {
      return new Cell(
        state, 
        createVector(x, y), 
        createVector(canvasWidth / gridWidth, canvasHeight / gridHeight),
        neighbors[y][x]);
    })
  );
};

const getNeighbors = (environment) => { //the enviroment is the 2D array of booleans and returns 2D array of integer 0 - 8 representing the amonut of live (true) cells around the current cell (diagonal included)
    return environment.map((row, y, arr) =>
        row.map((state, x) => {
            let count = 0;
            if((x > 0 && x < row.length - 1) && (y > 0 && y < arr.length - 1)) { //checking everything not the border
                count += arr[y - 1][x - 1] ? 1 : 0; //top left
                count += arr[y - 1][x] ? 1 : 0; //top
                count += arr[y - 1][x + 1] ? 1 : 0; //top right
                count += arr[y][x + 1] ? 1 : 0; //right
                count += arr[y + 1][x + 1] ? 1 : 0; //bottom right
                count += arr[y + 1][x] ? 1 : 0; //bottom
                count += arr[y + 1][x - 1] ? 1 : 0; //bottom left
                count += arr[y][x - 1] ? 1 : 0; //left
            } else if(x === 0 && y === 0) { //checking top left corner
                count += arr[y][x + 1] ? 1 : 0;
                count += arr[y + 1][x + 1] ? 1 : 0;
                count += arr[y + 1][x] ? 1 : 0;
            } else if(x === row.length - 1 && y === 0) { //top right corner
                count += arr[y][x - 1] ? 1 : 0;
                count += arr[y + 1][x - 1] ? 1 : 0;
                count += arr[y + 1][x] ? 1 : 0;
            } else if(x === 0 && y === arr.length - 1) { //bottom left corner
                count += arr[y - 1][x] ? 1 : 0; //top
                count += arr[y - 1][x + 1] ? 1 : 0; //top right
                count += arr[y][x + 1] ? 1 : 0; //right
            } else if(x === row.length - 1 && y === arr.length - 1) { //bottom right corner
                count += arr[y][x - 1] ? 1 : 0; //left
                count += arr[y - 1][x - 1] ? 1 : 0; //top left
                count += arr[y - 1][x] ? 1 : 0; //top
            } else if((x > 0 && x < row.length - 1) && (y === 0)) { //checking top row
                count += arr[y][x + 1] ? 1 : 0; //right
                count += arr[y + 1][x + 1] ? 1 : 0; //bottom right
                count += arr[y + 1][x] ? 1 : 0; //bottom
                count += arr[y + 1][x - 1] ? 1 : 0; //bottom left
                count += arr[y][x - 1] ? 1 : 0; //left
            } else if((x > 0 && x < row.length - 1) && (y === arr.length - 1)) { //checking bottom row
                count += arr[y][x + 1] ? 1 : 0; //right
                count += arr[y - 1][x - 1] ? 1 : 0; //top left
                count += arr[y - 1][x] ? 1 : 0; //top
                count += arr[y - 1][x + 1] ? 1 : 0; //top right
                count += arr[y][x - 1] ? 1 : 0; //left
            } else if(x === 0 && (y > 0 && y < arr.length - 1)) { //left-most collumn
                count += arr[y - 1][x] ? 1 : 0; //top
                count += arr[y - 1][x + 1] ? 1 : 0; //top right
                count += arr[y][x + 1] ? 1 : 0; //right
                count += arr[y + 1][x + 1] ? 1 : 0; //bottom right
                count += arr[y + 1][x] ? 1 : 0; //bottom
            } else if(x === row.length - 1 && (y > 0 && y < arr.length - 1)) { //right-most collumn
                count += arr[y - 1][x - 1] ? 1 : 0; //top left
                count += arr[y - 1][x] ? 1 : 0; //top
                count += arr[y][x - 1] ? 1 : 0; //left
                count += arr[y + 1][x - 1] ? 1 : 0; //bottom left
                count += arr[y + 1][x] ? 1 : 0; //bottom
            } else {
                count = null;
            }
            return count;
        })
    );
};

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(8);
  
  
  // 1. create environment states
  const statesArray = createStateEnvironment(gridWidth, gridHeight);
  // 2. get neighbors from environment states --> getNeighbors is created from the environment in createCells
  // 3. create cells with state and neighbors initiated
  gen1 = createCells(statesArray);
}

function draw() {
  background(220);
  
  
  // 4. render each cell
  gen1.map(row => row.map(cell => cell.render()));
  
  // 5. use cell.checkPulse to get environment state for next generation
  const gen2EnvironmentStates = gen1.map(row => row.map(cell => cell.checkPulse()));
  // 6. get the neighborts of this new environment state
  gen2 = createCells(gen2EnvironmentStates);
  // 7. change state and neighbors for each cell
  gen1 = gen2;
}

function mousePressed() {
  gen1.forEach(row => 
    row.map(cell => {
      if((mouseX > cell.pos.x * cell.scale.x && mouseX < cell.pos.x * cell.scale.x + cell.scale.x) && (mouseY > cell.pos.y * cell.scale.y && mouseY < cell.pos.y * cell.scale.y + cell.scale.y)) {
      cell.state = true;
      }
    })
  );
}