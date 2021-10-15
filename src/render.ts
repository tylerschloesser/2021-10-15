interface RenderPropsBase {
  context: CanvasRenderingContext2D
}

export function renderGrid({
  context,
  x,
  y,
  w,
  h,
  rows,
  cols,
}: RenderPropsBase & {
  x: number
  y: number
  w: number
  h: number
  rows: number
  cols: number
}) {
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
