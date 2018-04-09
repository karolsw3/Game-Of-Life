class Game {
  constructor () {
    // Model
    this.fps = 10
    this.sizeX = 0
    this.sizeY = 0
    this.generations = 0
    this.matrix = this._createMatrix(this.sizeX, this.sizeY)
    this.nextMatrix = this._createMatrix(this.sizeX, this.sizeY)

    // View
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  // Initialize the game
  init () {
    setInterval(this.frame, this.fps)
  }

  // Draw one game frame (one generation)
  _frame () {
    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix[x].length; y++) {
        let neighbours = this._countNeighbours(x, y)
        if (this.matrix[x][y] === 1) {
          if (neighbours > 3) {
            this.nextMatrix[x][y] = 0
          } else if (neighbours < 2) {
            this.nextMatrix[x][y] = 0
          } else {
            this.nextMatrix[x][y] = 1
          }
        } else {
          if (neighbours === 3) {
            this.nextMatrix[x][y] = 1
          } else {
            this.nextMatrix[x][y] = 0
          }
        }
      }
    }
  }

  // Count all neighbours of cell located on specified coords
  _countNeighbours (cellX, cellY) {
    let neighbours = 0
    for (let x = -1; x < cellX + 1; x++) {
      for (let y = -1; y < cellY + 1; y++) {
        if (this.matrix[(x + this.sizeX) % this.sizeX][(y + this.sizeY) % this.sizeY] === 1) neighbours++
      }
    }
    return neighbours - 1
  }

  // Create matrix with specified width and height and fill it with zeros
  _createMatrix (sizeX, sizeY) {
    let matrix = Array(...Array(sizeX)).map(() => Array(sizeY).fill(0))
    return matrix
  }
}

var game = new Game()
game.init()
