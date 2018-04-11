class Game {
  constructor () {
    // Model
    this.frameCount = 0
    this.sizeX = 0
    this.sizeY = 0
    this.generations = 0
    this.paused = false
    this.matrix = this._createMatrix()
    this.nextMatrix = this._createMatrix()

    // View
    this.backgroundCanvas = document.getElementById('backgroundCanvas')
    this.canvas = document.getElementById('canvas')
    this.backgroundCtx = this.backgroundCanvas.getContext('2d')
    this.ctx = this.canvas.getContext('2d')
    this.tileWidth = 13
    this.tileColor = '#5f8'
    this.deathTileColor = '#0b2313'
    this.backgroundColor = '#001011'
    this.mouseX = 0
    this.mouseY = 0

    // Buttons
    this.buttons = {
      pause: document.getElementById('pause'),
      randomize: document.getElementById('randomize'),
      clear: document.getElementById('clear')
    }

    this._frame = this._frame.bind(this)
    this._resizeCanvas = this._resizeCanvas.bind(this)
  }

  // Initialize the game
  init () {
    this.frameCount = 0
    this._resizeCanvas()
    this._drawBackground(this.backgroundColor)
    window.addEventListener('resize', this._resizeCanvas)

    // Mouse events
    this.canvas.addEventListener('mousemove', e => {
      this.mouseX = Math.floor((e.x - this.canvas.offsetLeft) / this.tileWidth)
      this.mouseY = Math.floor((e.y - this.canvas.offsetTop + window.pageYOffset) / this.tileWidth)
    })

    this.canvas.addEventListener('mousedown', e => {
      this.matrix[this.mouseX][this.mouseY] = this.matrix[this.mouseX][this.mouseY] === 0 ? 1 : 0
      this._drawSquare(this.mouseX, this.mouseY, this.tileWidth, this.tileColor)
    })

    // Init buttons
    this.buttons.pause.onclick = () => {
      this.paused = !this.paused
      this.buttons.pause.innerText = (this.paused ? 'Resume 🔥' : 'Pause ⛔')
    }

    this.buttons.randomize.onclick = () => {
      this.randomizeCells()
      this._drawBackground(this.backgroundColor)
    }

    this.buttons.clear.onclick = () => {
      this.matrix = this._createMatrix()
      this._drawBackground(this.backgroundColor)
    }

    requestAnimationFrame(this._frame)
  }

  // Fills generation matrix with random cells (empty or full)
  randomizeCells () {
    for (let x = 0; x < this.sizeX; x++) {
      for (let y = 0; y < this.sizeY; y++) {
        this.matrix[x][y] = Math.round(Math.random() / 1.5)
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
        this.nextMatrix = this._createMatrix()
      }
    }
    this.frameCount++
    requestAnimationFrame(this._frame)
  }

  // Draw generation matrixes on canvas
  _drawFrame () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let x = 0; x < this.sizeX; x++) {
      for (let y = 0; y < this.sizeY; y++) {
        if (this.matrix[x][y] === -1) {
          this._drawBackgroundSquare(x, y, this.tileWidth, this.deathTileColor)
          this.matrix[x][y] = 0
        } else if (this.matrix[x][y] === 1) {
          this._drawSquare(x, y, this.tileWidth, this.tileColor)
        }
      }
    }
    this._drawMouse()
  }

  _drawMouse () {
    this._drawSquare(this.mouseX, this.mouseY, this.tileWidth, '#fff')
  }

  _drawBackgroundSquare (x, y, a, color) {
    this.backgroundCtx.beginPath()
    this.backgroundCtx.rect(x * a, y * a, a, a)
    this.backgroundCtx.fillStyle = color
    this.backgroundCtx.fill()
  }

  _drawSquare (x, y, a, color) {
    this.ctx.beginPath()
    this.ctx.rect(x * a, y * a, a, a)
    this.ctx.fillStyle = color
    this.ctx.fill()   
  }

  _drawBackground (color) {
    this.backgroundCtx.fillStyle = color
    this.backgroundCtx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  _resizeCanvas () {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight - 55
    this.backgroundCanvas.width = window.innerWidth
    this.backgroundCanvas.height = window.innerHeight - 55
    this.sizeX = Math.floor(this.canvas.width / this.tileWidth)
    this.sizeY = Math.floor(this.canvas.height / this.tileWidth) + 1
  }

  /**
   * Calculate the next generation of living cells
   *  and put them in the nextMatrix array
   */
  _updateGeneration () {
    for (let x = 0; x < this.sizeX; x++) {
      for (let y = 0; y < this.sizeY; y++) {
        let neighbours = this._countNeighbours(x, y)
        if (this.matrix[x][y] === 1 && (neighbours > 3 || neighbours < 2)) {
          this.nextMatrix[x][y] = -1
        } else if (this.matrix[x][y] !== 1 && neighbours === 3) {
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
        if (this.matrix[(cellX + x + this.sizeX) % this.sizeX][(cellY + y + this.sizeY) % this.sizeY] === 1) {
          neighbours++
        }
      }
    }
    neighbours -= (this.matrix[cellX][cellY] === 1 ? 1 : 0)
    return neighbours
  }

  // Create matrix with specified width and height and fill it with 0s
  _createMatrix () {
    let matrix = Array(...Array(200)).map(() => Array(200).fill(0))
    return matrix
  }
}

var game = new Game()
game.init()
