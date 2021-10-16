import curry from 'lodash/fp/curry'
import WebFont from 'webfontloader'
import {
  handle,
  handleLeftRight,
  handleUp,
  Input,
  randomGetPiece,
  State,
  tick,
} from './game'
import { renderState } from './render'

const canvas = document.querySelector('canvas')!
const context = canvas.getContext('2d')!

const scale = window.devicePixelRatio ?? 1
context.scale(scale, scale)

const rect = canvas.getBoundingClientRect()
canvas.height = rect.height * scale
canvas.width = rect.width * scale

let buffer: TouchEvent[] = []

window.onresize = () => {
  const rect = canvas.getBoundingClientRect()
  canvas.height = rect.height
  canvas.width = rect.width
}

const DEFAULT_STATE: State = {
  rows: 20,
  cols: 10,
  piece: [],
  nextPiece: [],
  floor: [],
  isGameOver: false,
  score: 0,
}

let state: State = DEFAULT_STATE
state = {
  ...state,
  nextPiece: randomGetPiece(state),
}

let isTap = true
window.addEventListener('touchstart', (ev) => {
  isTap = true
  buffer.push(ev)
})

window.addEventListener(
  'touchmove',
  (ev) => {
    const dx = ev.touches[0].clientX - buffer[0].touches[0].clientX
    const dy = ev.touches[0].clientY - buffer[0].touches[0].clientY
    console.log(canvas.width, dx)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > canvas.width / 50) {
      isTap = false
      state = handleLeftRight(state, dx < 0 ? Input.Left : Input.Right)
      buffer = []
    } else if (
      dy > 0 &&
      Math.abs(dy) > Math.abs(dx) &&
      Math.abs(dy) > canvas.height / 50
    ) {
      isTap = false
      state = tick(state)
      buffer = []

      // kinda hacky. set the last ticke to now so we don't "double" tick on input & frame
      lastTick = ev.timeStamp
    }
    buffer.push(ev)

    ev.preventDefault()
  },
  { passive: false },
)

window.addEventListener('touchend', (ev) => {
  buffer = []
  if (isTap) {
    state = handleUp(state)
  }
})

try {
  if (<boolean>JSON.parse(window.localStorage.getItem('debug')!) === true) {
    state = JSON.parse(window.localStorage.getItem('state')!)
  }
} catch (e) {}

const TICK_INTERVAL = 1000
let lastTick: null | number = null

const INPUT_INTERVAL = 100

const inputMap: Record<Input, { active: boolean; lastApplied?: number }> = {
  [Input.Left]: { active: false },
  [Input.Right]: { active: false },
  [Input.Down]: { active: false },
  [Input.Up]: { active: false },
}

const onkey = curry((active: boolean, ev: KeyboardEvent) => {
  const input = {
    ArrowLeft: Input.Left,
    ArrowRight: Input.Right,
    ArrowDown: Input.Down,
    ArrowUp: Input.Up,
  }[ev.key]
  if (input) {
    inputMap[input] = { active }
  }
})

window.onkeydown = onkey(true)
window.onkeyup = onkey(false)

function onFrame(timestamp: number) {
  if (lastTick === null) {
    lastTick = timestamp
    state = tick(state)
  }
  if (timestamp - lastTick > TICK_INTERVAL) {
    lastTick = timestamp
    state = tick(state)
  }

  for (const [input, value] of Object.entries(inputMap)) {
    if (!value.active) {
      continue
    }

    if (!value.lastApplied) {
    }

    if (!value.lastApplied || timestamp - value.lastApplied > INPUT_INTERVAL) {
      state = handle(state, <Input>input)
      // TODO not exact interval

      if (!value.lastApplied) {
        // hacky, but on the first input, wait 2x the interval until the next input.
        // mitigates accidental bouncing when trying to move/rotate only once
        value.lastApplied = timestamp + INPUT_INTERVAL
      } else {
        value.lastApplied = timestamp
      }

      if (<Input>input === Input.Down) {
        lastTick = value.lastApplied
      }
    }
  }

  context.clearRect(0, 0, canvas.width, canvas.height)

  renderState({
    canvas,
    context,
    state,
  })

  window.requestAnimationFrame(onFrame)
}

WebFont.load({
  google: {
    families: ['Space Mono'],
  },
  active: () => {
    console.log('loaded fonts')
    window.requestAnimationFrame(onFrame)
  },
  inactive: () => {
    alert('Failed to load fonts')
  },
})

window.setInterval(() => {
  window.localStorage.setItem('state', JSON.stringify(state))
}, 1000)
