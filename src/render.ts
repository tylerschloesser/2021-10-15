import Color from 'color'
import { Cell, State } from './game'
import { getBoundingBox, normalize } from './util'

interface RenderPropsBase {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  state: State
}

const SIDE_COLS = 5

function getGridLayout({ canvas, context, state }: RenderPropsBase) {
  const { rows, cols } = state

  const totalCols = 1 + cols + 1 + SIDE_COLS + 1
  const totalRows = 1 + rows + 1

  const cellSize = Math.min(canvas.width / totalCols, canvas.height / totalRows)

  const totalWidth = totalCols * cellSize
  const totalHeight = totalRows * cellSize

  return {
    cellSize,
    x: Math.max(canvas.width / 2 - totalWidth / 2, cellSize),
    y: Math.max(canvas.height / 2 - totalHeight / 2, cellSize),
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

  context.fillStyle = 'black'
  context.font = `bold ${fontSize}px Space Mono`
  context.textAlign = 'center'
  context.fillText('GAME OVER', 0, 0)

  context.font = `bold ${fontSize / 2}px Space Mono`
  context.fillText('refresh to play again', 0, fontSize / 1.5)

  // restore default TODO have others set their own so we don't have to do this here
  context.resetTransform()
}

function renderScore({ canvas, context, state }: RenderPropsBase) {
  let { score } = state
  const { x, y, cellSize } = getGridLayout({ canvas, context, state })

  context.textAlign = 'center'

  context.translate(x, y)
  context.translate(cellSize * 10 + cellSize, 0)

  const boxWidth = SIDE_COLS * cellSize
  const boxHeight = cellSize * 2 + cellSize + cellSize / 2

  context.fillStyle = '#aaa'
  context.save()
  context.lineWidth = 2
  context.fillRect(0, 0, boxWidth, boxHeight)

  context.strokeRect(
    -context.lineWidth / 2,
    -context.lineWidth / 2,
    boxWidth + context.lineWidth,
    boxHeight + context.lineWidth,
  )

  context.restore()

  context.translate(boxWidth / 2, cellSize)
  context.fillStyle = 'black'

  context.font = `bold ${cellSize}px Space Mono`
  context.fillText('score', 0, 0)

  context.translate(0, cellSize * 2)

  context.font = `bold ${cellSize * 2}px Space Mono`
  context.fillText(`${score}`, 0, 0)

  context.resetTransform()

  return { width: boxWidth, height: boxHeight }
}

export function renderSide({ canvas, context, state }: RenderPropsBase) {
  const scoreBox = renderScore({ canvas, context, state })

  const { x, y, cellSize } = getGridLayout({ canvas, context, state })

  context.translate(x + cellSize * 11, cellSize * 2 + scoreBox.height)

  const thisHeight = cellSize * (0.5 + 1 + 0.5 + 2 + 0.5)

  context.fillStyle = '#aaa'
  context.fillRect(0, 0, scoreBox.width, thisHeight)

  context.strokeRect(
    -context.lineWidth / 2,
    -context.lineWidth / 2,
    scoreBox.width + context.lineWidth,
    thisHeight + context.lineWidth,
  )

  context.save()
  context.translate(scoreBox.width / 2, cellSize / 2)
  context.textBaseline = 'top'
  context.fillStyle = 'black'
  context.font = `bold ${cellSize}px Space Mono`
  context.fillText('next', 0, 0)
  context.restore()

  if (state.nextPiece.length) {
    const piece = normalize(state.nextPiece)
    const bb = getBoundingBox(piece)

    context.translate(
      scoreBox.width / 2 - (bb.width * cellSize) / 2,
      cellSize * 2,
    )

    for (const cell of piece) {
      renderCell(context, cell, cellSize)
    }
  }

  context.textBaseline = 'alphabetic'
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
  renderSide({ canvas, context, state })
  renderGameOver({ canvas, context, state })
}
