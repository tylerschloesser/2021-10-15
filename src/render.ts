import { Cell, State } from './game'

interface RenderPropsBase {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  state: State
}

function translateToGrid({ canvas, context, state }: RenderPropsBase) {
  const { rows, cols } = state
  const size = Math.min(canvas.width / (cols + 2), canvas.height / (rows + 2))
  context.translate(
    Math.max(canvas.width / 2 - (size * cols) / 2, size),
    Math.max(canvas.height / 2 - (size * rows) / 2, size),
  )
  return { size }
}

export function renderGrid({ canvas, context, state }: RenderPropsBase) {
  const { rows, cols } = state
  const { size } = translateToGrid({ canvas, context, state })

  const lineWidth = 2
  // so that the grid border doesn't overlap the cell borders
  context.translate(-lineWidth / 2, -lineWidth / 2)

  const w = size * cols + lineWidth
  const h = size * rows + lineWidth

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

  context.fillStyle = cell.color!
  context.globalAlpha = 0.7
  context.fillRect(0, 0, size, size)
  context.lineWidth = 2
  context.strokeStyle = 'black'
  context.strokeRect(0, 0, size, size)
  context.globalAlpha = 1
  context.fillRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8)

  context.restore()
}

export function renderCells({ canvas, context, state }: RenderPropsBase) {
  const cells = [...state.piece, ...state.floor]
  const { size } = translateToGrid({ canvas, context, state })
  for (const cell of cells) {
    renderCell(context, cell, size)
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
  context.font = `${size / 20}px Arial`
  context.textAlign = 'left'
  context.fillText(`Score: ${state.score}`, 0, size / 20)
}

export function renderState({ canvas, context, state }: RenderPropsBase) {
  renderGrid({ canvas, context, state })
  renderCells({ canvas, context, state })
  renderScore({ canvas, context, state })
  renderGameOver({ canvas, context, state })
}
