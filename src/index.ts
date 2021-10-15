console.log('hi')
const canvas = document.querySelector('canvas')!
const context = canvas.getContext('2d')!

const rect = canvas.getBoundingClientRect()
canvas.height = rect.height
canvas.width = rect.width

function onFrame(timestamp: number) {
  context.fillStyle = 'grey'
  context.fillRect(0, 0, canvas.width, canvas.height)

  window.requestAnimationFrame(onFrame)
}
window.requestAnimationFrame(onFrame)
