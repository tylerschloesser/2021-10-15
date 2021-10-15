import { State } from './game'

interface RenderPropsBase {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
}

export function renderState({
  canvas,
  context,
  state,
}: RenderPropsBase & {
  state: State
}) {
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
