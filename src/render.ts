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
}) {}
