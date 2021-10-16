import Color from 'color'
import { Cell, State } from './game'

interface RenderPropsBase {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  state: State
}

function getGridLayout({ canvas, context, state }: RenderPropsBase) {
  const { rows, cols } = state
  const cellSize = Math.min(
    canvas.width / (cols + 2),
    canvas.height / (rows + 2),
  )
  return {
    cellSize,
    x: Math.max(canvas.width / 2 - (cellSize * cols) / 2, cellSize),
    y: Math.max(canvas.height / 2 - (cellSize * rows) / 2, cellSize),
  }
}

function translateToGrid({ canvas, context, state }: RenderPropsBase) {
  const { x, y, cellSize } = getGridLayout({ canvas, context, state })
  context.translate(x, y)
  return { cellSize }
}

export function renderGrid({ canvas, context, state }: RenderPropsBase) {
  const { rows, cols } = state
  const { cellSize } = translateToGrid({ canvas, context, state })

  const lineWidth = 2
  // so that the grid border doesn't overlap the cell borders
  context.translate(-lineWidth / 2, -lineWidth / 2)

  const w = cellSize * cols + lineWidth
  const h = cellSize * rows + lineWidth

  context.strokeStyle = 'black'
  context.lineWidth = lineWidth
  context.fillStyle = '#aaa'
  context.fillRect(0, 0, w, h)
  context.strokeRect(0, 0, w, h)

  context.resetTransform()
}

function renderCell(
  context: CanvasRenderingContext2D,
  cell: Cell,
  size: number,
) {
  context.save()
  context.translate(cell.col * size, cell.row * size)

  const color = Color(cell.color!)

  context.fillStyle = color.desaturate(0.5).hex()
  context.fillRect(0, 0, size, size)

  context.lineWidth = 2
  context.strokeStyle = 'black'
  context.strokeRect(0, 0, size, size)

  context.fillStyle = color.hex()
  context.fillRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8)

  context.restore()
}

export function renderCells({ canvas, context, state }: RenderPropsBase) {
  const cells = [...state.piece, ...state.floor]
  const { cellSize } = translateToGrid({ canvas, context, state })
  for (const cell of cells) {
    renderCell(context, cell, cellSize)
  }
  context.resetTransform()
}

export function renderGameOver({ canvas, context, state }: RenderPropsBase) {
  if (!state.isGameOver) {
    return
  }

  context.translate(canvas.width / 2, canvas.height / 2)
  const size = Math.min(canvas.width, canvas.height)
  const fontSize = size / 10

  context.fillStyle = Color('white').fade(0.1).rgb().string()
  context.strokeStyle = Color('black').hex()
  context.fillRect(-canvas.width, -fontSize, canvas.width * 2, fontSize * 2)
  context.lineWidth = 2
  context.strokeRect(-canvas.width, -fontSize, canvas.width * 2, fontSize * 2)

  context.textBaseline = 'middle'
  context.fillStyle = 'black'
  context.font = `bold ${fontSize} Space Mono`
  context.textAlign = 'center'
  context.fillText('GAME OVER', 0, 0)

  // restore default TODO have others set their own so we don't have to do this here
  context.textBaseline = 'alphabetic'
  context.resetTransform()
}

export function renderScore({ canvas, context, state }: RenderPropsBase) {
  let { score } = state
  const { x, y, cellSize } = getGridLayout({ canvas, context, state })

  context.font = `bold ${cellSize}px Space Mono`
  context.textAlign = 'center'

  const labelWidth = context.measureText('score').width

  context.font = `bold ${cellSize * 2}px Space Mono`

  const scoreWidth = context.measureText(`${score}`).width

  const width = Math.max(labelWidth, scoreWidth)

  context.translate(x, y)
  context.translate(cellSize * 10 + cellSize, 0)

  context.fillStyle = '#aaa'
  context.save()
  context.lineWidth = 2
  context.translate(-1, -1)
  context.fillRect(
    0,
    0,
    width + cellSize + context.lineWidth,
    cellSize * 2 + cellSize + context.lineWidth + cellSize / 2,
  )
  context.strokeRect(
    0,
    0,
    width + cellSize + context.lineWidth,
    cellSize * 2 + cellSize + context.lineWidth + cellSize / 2,
  )
  context.restore()

  context.translate(width / 2, cellSize / 2)
  // padding
  context.translate(cellSize / 2, cellSize / 2)
  context.fillStyle = 'black'

  context.font = `bold ${cellSize}px Space Mono`
  context.fillText('score', 0, 0)

  context.translate(0, cellSize * 2)

  context.font = `bold ${cellSize * 2}px Space Mono`
  context.fillText(`${score}`, 0, 0)

  context.resetTransform()
}

export function renderTitle({ canvas, context, state }: RenderPropsBase) {
  const { x, y, cellSize } = getGridLayout({ canvas, context, state })

  context.translate(
    x + 1, // hacky, compensate for grid border
    y,
  )
  context.rotate(Math.PI / 2)

  context.fillStyle = Color('white').darken(0.5).hex()
  const fontSize = `${cellSize * 2}px`
  context.font = `bold ${fontSize} Space Mono`
  context.textAlign = 'left'
  context.fillText('TETRIS', 0, 0)

  context.resetTransform()
}

export function renderState({ canvas, context, state }: RenderPropsBase) {
  renderGrid({ canvas, context, state })
  renderTitle({ canvas, context, state })
  renderCells({ canvas, context, state })
  renderScore({ canvas, context, state })
  renderGameOver({ canvas, context, state })
}
