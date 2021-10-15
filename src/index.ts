import { renderGrid } from './render'

const canvas = document.querySelector('canvas')!
const context = canvas.getContext('2d')!

const rect = canvas.getBoundingClientRect()
canvas.height = rect.height
canvas.width = rect.width

function onFrame(timestamp: number) {
  context.fillStyle = 'grey'
  context.fillRect(0, 0, canvas.width, canvas.height)

  renderGrid({ context, x: 0, y: 0 })

  window.requestAnimationFrame(onFrame)
}
window.requestAnimationFrame(onFrame)
