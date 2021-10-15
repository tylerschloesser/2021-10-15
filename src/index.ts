import { handle, Input, State, tick } from './game'
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
  pieces: [],
  floor: [],
  isGameOver: false,
}

const TICK_INTERVAL = 1000
let lastTick: null | number = null

window.onkeydown = (ev) => {
  if (ev.key === 'ArrowLeft') {
    state = handle(state, Input.Left)
  }
  if (ev.key === 'ArrowRight') {
    state = handle(state, Input.Right)
  }
  if (ev.key === 'ArrowDown') {
    lastTick = performance.now()
    state = tick(state)
  }
}

function onFrame(timestamp: number) {
  if (lastTick === null) {
    lastTick = timestamp
    state = tick(state)
  }
  if (timestamp - lastTick > TICK_INTERVAL) {
    lastTick = lastTick + TICK_INTERVAL
    state = tick(state)
  }

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = 'grey'
  context.fillRect(0, 0, canvas.width, canvas.height)

  renderState({
    canvas,
    context,
    state,
  })

  window.requestAnimationFrame(onFrame)
}
window.requestAnimationFrame(onFrame)
