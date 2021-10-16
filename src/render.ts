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

  const size = Math.min(canvas.width, canvas.height)
  context.fillStyle = 'black'
  context.font = `${size / 10}px Arial`
  context.textAlign = 'center'
  context.fillText('Game Over', canvas.width / 2, canvas.height / 2)
}

export function renderScore({ canvas, context, state }: RenderPropsBase) {
  const size = Math.min(canvas.width, canvas.height)
  context.fillStyle = 'black'
  const fontSize = `${size / 20}px`
  context.font = `bold ${fontSize} Space Mono`
  context.textAlign = 'left'
  context.fillText(`score: ${state.score}`, 0, size / 20)
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
