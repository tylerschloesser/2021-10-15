import { renderGrid } from './render'

const canvas = document.querySelector('canvas')!
const context = canvas.getContext('2d')!

const rect = canvas.getBoundingClientRect()
canvas.height = rect.height
canvas.width = rect.width

window.onresize = () => {
  const rect = canvas.getBoundingClientRect()
  canvas.height = rect.height
  canvas.width = rect.width
}

function onFrame(timestamp: number) {
  context.fillStyle = 'grey'
  context.fillRect(0, 0, canvas.width, canvas.height)

  const diff = canvas.width - canvas.height
  const size = Math.min(canvas.width, canvas.height)
  const padding = size / 10

  let px = diff > 0 ? padding + diff / 2 : padding
  let py = diff < 0 ? padding + -diff / 2 : padding

  renderGrid({
    context,
    x: px,
    y: py,
    w: padding * 8,
    h: padding * 8,
    rows: 10,
    cols: 10,
  })

  window.requestAnimationFrame(onFrame)
}
window.requestAnimationFrame(onFrame)
