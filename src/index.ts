import { State, tick } from './game'
import { renderState } from './render'

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

let state: State = {
  rows: 10,
  cols: 10,
  pieces: [{ row: 0, col: 4 }],
}

const TICK_INTERVAL = 1000
let lastTick: null | number = null

function onFrame(timestamp: number) {
  if (lastTick === null) {
    lastTick = timestamp
  }
  if (timestamp - lastTick > TICK_INTERVAL) {
    lastTick = lastTick + TICK_INTERVAL
    state = tick(state)
  }

  context.fillStyle = 'grey'
  context.fillRect(0, 0, canvas.width, canvas.height)

  renderState({
    canvas,
    context,
    rows: 10,
    cols: 10,
  })

  window.requestAnimationFrame(onFrame)
}
window.requestAnimationFrame(onFrame)
