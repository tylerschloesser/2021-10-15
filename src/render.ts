import { Cell, State } from './game'

interface RenderPropsBase {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  state: State
}

interface GridLayout {
  x: number
  y: number
  w: number
  h: number
  colw: number
  rowh: number
}

function getGridLayout({
  canvas,
  context,
  state,
}: RenderPropsBase): GridLayout {
  const { cols, rows } = state
  const size = Math.min(canvas.width / (cols + 2), canvas.height / (rows + 2))

  return {
    x: Math.max(canvas.width / 2 - (size * cols) / 2, size),
    y: Math.max(canvas.height / 2 - (size * rows) / 2, size),
    w: size * cols,
    h: size * rows,
    colw: size,
    rowh: size,
  }
}

export function renderGrid({ canvas, context, state }: RenderPropsBase) {
  const { rows, cols } = state

  const size = Math.min(canvas.width / (cols + 2), canvas.height / (rows + 2))

  const lineWidth = 2

  context.translate(
    Math.max(canvas.width / 2 - (size * cols) / 2, size),
    Math.max(canvas.height / 2 - (size * rows) / 2, size),
  )

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

//function renderCell()

export function renderCells({ canvas, context, state }: RenderPropsBase) {
  const gridLayout = getGridLayout({ canvas, context, state })
  const { x, y, w, h, colw, rowh } = gridLayout
  const cells = [...state.piece, ...state.floor]
  for (const cell of cells) {
    context.fillStyle = cell.color ?? 'green'
    context.globalAlpha = 0.7
    context.fillRect(x + cell.col * colw, y + cell.row * rowh, colw, rowh)
    context.lineWidth = 2
    context.strokeStyle = '2px black'
    context.strokeRect(x + cell.col * colw, y + cell.row * rowh, colw, rowh)
    context.globalAlpha = 1
    context.fillRect(
      x + cell.col * colw + colw * 0.1,
      y + cell.row * rowh + rowh * 0.1,
      colw * 0.8,
      rowh * 0.8,
    )
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
