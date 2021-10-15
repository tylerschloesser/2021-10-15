interface RenderPropsBase {
  context: CanvasRenderingContext2D
}

export function renderGrid({
  context,
  x,
  y,
}: RenderPropsBase & {
  x: number
  y: number
}) {
  const n = 10
  const size = 20

  for (let i = 0; i < n + 1; i++) {
    context.moveTo(x, y + i * size)
    context.lineTo(x + size * n, y + i * size)
  }

  for (let i = 0; i < n + 1; i++) {
    context.moveTo(x + i * size, y)
    context.lineTo(x + i * size, y + size * n)
  }

  context.strokeStyle = 'black'
  context.stroke()
}
