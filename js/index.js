class Game {
  constructor () {
    // Model
    this.fps = 100
    this.sizeX = 60
    this.sizeY = 40
    this.generations = 0
    this.matrix = this._createMatrix(this.sizeX, this.sizeY)
    this.nextMatrix = this._createMatrix(this.sizeX, this.sizeY)

    // View
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.tileWidth = 10

    this._frame = this._frame.bind(this)
  }

  // Initialize the game
  init () {
    this._resizeCanvas()
    setInterval(this._frame, this.fps)
  }

  // Fills generation matrix with random cells (empty or full)
  randomizeCells () {
    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix[x].length; y++) {
        this.matrix[x][y] = Math.round(Math.random())
      }
    }
  }

  // Calculate and draw one game frame (one generation)
  _frame () {
    this._drawFrame()
    this._updateGeneration()
    this.matrix = this.nextMatrix
    this.nextMatrix = this._createMatrix(this.sizeX, this.sizeY)
  }

  // Draw generation matrixes on canvas
  _drawFrame () {
    this._drawBackground('#aaa')
    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix[x].length; y++) {
        if (this.matrix[x][y] === 1) {
          this._drawSquare(x, y, this.tileWidth, 'black')
        }
      }
    }
  }

  _drawSquare (x, y, a, color) {
    this.ctx.beginPath()
    this.ctx.rect(x * a, y * a, a, a)
    this.ctx.fillStyle = color
    this.ctx.fill()
  }

  _drawBackground (color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  _resizeCanvas () {
    this.canvas.width = this.sizeX * this.tileWidth
    this.canvas.height = this.sizeY * this.tileWidth
  }

  /**
   * Calculate the next generation of living cells
   *  and put them in the nextMatrix array
   */
  _updateGeneration () {
    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix[x].length; y++) {
        let neighbours = this._countNeighbours(x, y)
        if (this.matrix[x][y] === 1 && (neighbours > 3 || neighbours < 2)) {
          this.nextMatrix[x][y] = 0
        } else if (this.matrix[x][y] === 0 && neighbours === 3) {
          this.nextMatrix[x][y] = 1
        } else {
          this.nextMatrix[x][y] = this.matrix[x][y]
        }
      }
    }
  }

  // Count all neighbours of cell located on specified coords
  _countNeighbours (cellX, cellY) {
    let neighbours = 0
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        neighbours += this.matrix[(cellX + x + this.sizeX) % this.sizeX][(cellY + y + this.sizeY) % this.sizeY]
      }
    }
    neighbours -= this.matrix[cellX][cellY]
    return neighbours
  }

  // Create matrix with specified width and height and fill it with 0s
  _createMatrix (sizeX, sizeY) {
    let matrix = Array(...Array(sizeX)).map(() => Array(sizeY).fill(0))
    return matrix
  }
}

var game = new Game()
game.init()
game.randomizeCells()
