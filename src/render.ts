import { Piece, State } from './game'

interface RenderPropsBase {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  state: State
}

function getGridLayout({ canvas, context, state }: RenderPropsBase) {
  const { cols, rows } = state
  const diff = canvas.width - canvas.height
  const size = Math.min(canvas.width, canvas.height)
  const padding = size / 10

  let px = diff > 0 ? padding + diff / 2 : padding
  let py = diff < 0 ? padding + -diff / 2 : padding

  const x = px,
    y = py,
    w = padding * 8,
    h = padding * 8

  const colw = w / cols
  const rowh = h / rows

  return {
    x,
    y,
    w,
    h,
    colw,
    rowh,
  }
}

export function renderGrid({ canvas, context, state }: RenderPropsBase) {
  const { rows, cols } = state
  const { x, y, w, h, colw, rowh } = getGridLayout({ context, canvas, state })

  for (let i = 0; i < rows + 1; i++) {
    context.moveTo(x, y + i * rowh)
    context.lineTo(x + colw * rows, y + i * rowh)
  }

  for (let i = 0; i < cols + 1; i++) {
    context.moveTo(x + i * colw, y)
    context.lineTo(x + i * colw, y + rowh * cols)
  }

  context.strokeStyle = 'black'
  context.stroke()
}

export function renderPieces({ canvas, context, state }: RenderPropsBase) {
  const { x, y, w, h, colw, rowh } = getGridLayout({ context, canvas, state })
  for (const piece of state.pieces) {
    context.fillStyle = piece.color ?? 'green'
    context.fillRect(x + piece.col * colw, y + piece.row * rowh, colw, rowh)
  }
}

export function renderFloor({ canvas, context, state }: RenderPropsBase) {
  const { x, y, w, h, colw, rowh } = getGridLayout({ context, canvas, state })
  for (const cell of state.floor) {
    context.fillStyle = cell.color ?? 'blue'
    context.fillRect(x + cell.col * colw, y + cell.row * rowh, colw, rowh)
  }
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

export function renderState({ canvas, context, state }: RenderPropsBase) {
  renderGrid({ canvas, context, state })
  renderPieces({ canvas, context, state })
  renderFloor({ canvas, context, state })
  renderGameOver({ canvas, context, state })
}
