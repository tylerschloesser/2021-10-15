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
  rows: 20,
  cols: 10,
  pieces: [],
  floor: [],
  isGameOver: false,
}

const TICK_INTERVAL = 1000
let lastTick: null | number = null

const INPUT_INTERVAL = 100

const inputMap: Record<Input, { active: boolean, lastApplied?: number }> = {
  [Input.Left]: { active: false },
  [Input.Right]: { active: false },
  [Input.Down]: { active: false },
  [Input.Up]: { active: false },
}

window.onkeydown = (ev) => {
  if (ev.key === 'ArrowLeft') {
    inputMap[Input.Left] = { active: true }
  }
  if (ev.key === 'ArrowRight') {
    inputMap[Input.Right] = { active: true }
  }
  if (ev.key === 'ArrowDown') {
    inputMap[Input.Down] = { active: true }
  }
  if (ev.key === 'ArrowDown') {
    inputMap[Input.Up] = { active: true }
  }
}

window.onkeyup = (ev) => {
  if (ev.key === 'ArrowLeft') {
    inputMap[Input.Left] = { active: false }
  }
  if (ev.key === 'ArrowRight') {
    inputMap[Input.Right] = { active: false }
  }
  if (ev.key === 'ArrowDown') {
    inputMap[Input.Down] = { active: false }
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

  for (const [ input, value ] of Object.entries(inputMap)) {
    if (!value.active) {
      continue
    }
    if (!value.lastApplied || timestamp - value.lastApplied > INPUT_INTERVAL) {
      state = handle(state, <Input>input)
      // TODO not exact interval
      value.lastApplied = timestamp

      if (<Input>input === Input.Down) {
        lastTick = value.lastApplied
      }
    }
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
