class Game {
  constructor () {
    // Model
    this.frameCount = 0
    this.sizeX = 0
    this.sizeY = 0
    this.generations = 0
    this.paused = false
    this.matrix = this._createMatrix(this.sizeX, this.sizeY)
    this.nextMatrix = this._createMatrix(this.sizeX, this.sizeY)

    // View
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.tileWidth = 11
    this.tileColor = '#5f8'
    this.backgroundColor = '#093a3e'
    this.mouseX = 0
    this.mouseY = 0

    // Buttons
    this.buttons = {
      pause: document.getElementById('pause'),
      randomize: document.getElementById('randomize'),
      clear: document.getElementById('clear')
    }

    this._frame = this._frame.bind(this)
  }

  // Initialize the game
  init () {
    this._resizeCanvas()
    document.addEventListener('resize', this._resizeCanvas)

    // Mouse events
    this.canvas.addEventListener('mousemove', e => {
      this.mouseX = Math.floor((e.x - this.canvas.offsetLeft) / this.tileWidth)
      this.mouseY = Math.floor((e.y - this.canvas.offsetTop + window.pageYOffset) / this.tileWidth)
    })

    this.canvas.addEventListener('mousedown', e => {
      this.matrix[this.mouseX][this.mouseY] = 1
      this._drawSquare(this.mouseX, this.mouseY, this.tileWidth, this.tileColor)
    })

    // Init buttons
    this.buttons.pause.onclick = () => {
      this.paused = !this.paused
      this.buttons.pause.innerText = (this.paused ? 'Resume' : 'Pause')
    }

    this.buttons.randomize.onclick = () => {
      this.randomizeCells()
    }

    this.buttons.clear.onclick = () => {
      this.matrix = this._createMatrix(this.sizeX, this.sizeY)
    }

    requestAnimationFrame(this._frame)
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
    if (!this.paused) {
      if (this.frameCount % 4 === 0) {
        this._updateGeneration()
        this.matrix = this.nextMatrix
        this.nextMatrix = this._createMatrix(this.sizeX, this.sizeY)
      }
    }
    this.frameCount++
    requestAnimationFrame(this._frame)
  }

  // Draw generation matrixes on canvas
  _drawFrame () {
    this._drawBackground(this.backgroundColor)
    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix[x].length; y++) {
        if (this.matrix[x][y] === 1) {
          this._drawSquare(x, y, this.tileWidth, this.tileColor)
        }
      }
    }
    this._drawMouse()
  }

  _drawMouse () {
    this._drawSquare(this.mouseX, this.mouseY, this.tileWidth, '#fff')
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
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight - 60
    this.sizeX = Math.round(this.canvas.width / this.tileWidth)
    this.sizeY = Math.round(this.canvas.height / this.tileWidth)
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
