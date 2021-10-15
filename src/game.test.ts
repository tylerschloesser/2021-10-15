import {
  colorize,
  generate,
  handle,
  Input,
  merge,
  move,
  State,
  tick,
  validate,
} from './game'

const DEFAULT_STATE: State = {
  rows: 2,
  cols: 2,
  pieces: [],
  floor: [],
}

describe('game/validate', () => {
  it('is valid', () => {
    const state = DEFAULT_STATE
    expect(validate(state)).toBe(state)
  })

  it('throws if piece is invalid', () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ row: 100, col: 0 }],
    }
    expect(() => validate(state)).toThrow()
  })
})

describe('game/move', () => {
  it('moves a piece', () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ row: 0, col: 0 }],
    }
    expect(move(state)).toEqual({
      ...state,
      pieces: [{ row: 1, col: 0 }],
    })
  })

  it("does't move a piece on the bottom", () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ row: 1, col: 0 }],
    }
    expect(move(state)).toEqual({
      ...state,
      pieces: [{ row: 1, col: 0 }],
    })
  })
})

describe('game/merge', () => {
  it('does nothing if a piece not on the bottom', () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ row: 0, col: 0 }],
    }
    expect(merge(state)).toEqual(state)
  })

  it('merges a piece on the bottom', () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ row: 1, col: 0 }],
    }
    expect(merge(state)).toEqual({
      ...state,
      pieces: [],
      floor: [{ row: 1, col: 0 }],
    })
  })

  it('merges a piece on another piece', () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ row: 0, col: 0 }],
      floor: [{ row: 1, col: 0 }],
    }
    expect(merge(state)).toEqual({
      ...state,
      pieces: [],
      floor: [
        { row: 1, col: 0 },
        { row: 0, col: 0 },
      ],
    })
  })

  it('does not merge a piece that is in a different column', () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ row: 0, col: 0 }],
      floor: [{ row: 1, col: 1 }],
    }
    expect(merge(state)).toEqual({
      ...state,
      pieces: [{ row: 0, col: 0 }],
      floor: [{ row: 1, col: 1 }],
    })
  })
})

describe('game/generate', () => {
  it('does nothing if a piece is moving', () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ col: 0, row: 0 }],
    }
    expect(generate(state)).toEqual(state)
  })

  it('generates a new piece of there are no existing pieces', () => {
    const state = DEFAULT_STATE
    expect(generate(state)).toEqual({
      ...state,
      pieces: [{ col: 1, row: 0 }],
    })
  })

  it("Doesn't generate a new piece if it would overlap the floor", () => {
    const state = {
      ...DEFAULT_STATE,
      floor: [{ col: 1, row: 0 }],
    }
    expect(generate(state)).toEqual(state)
  })
})

describe('game/handle', () => {
  it('moves left', () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ row: 0, col: 1 }],
    }
    expect(handle(state, Input.Left)).toEqual({
      ...state,
      pieces: [{ row: 0, col: 0 }],
    })
  })

  it("Doesn't move off grid to the left", () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ row: 0, col: 0 }],
    }
    expect(handle(state, Input.Left)).toEqual({
      ...state,
      pieces: [{ row: 0, col: 0 }],
    })
  })

  it('moves right', () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ row: 0, col: 0 }],
    }
    expect(handle(state, Input.Right)).toEqual({
      ...state,
      pieces: [{ row: 0, col: 1 }],
    })
  })

  it("Doesn't move off grid to the right", () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ row: 0, col: 1 }],
    }
    expect(handle(state, Input.Right)).toEqual({
      ...state,
      pieces: [{ row: 0, col: 1 }],
    })
  })
})

describe('game/colorize', () => {
  const getColor = () => 'color'

  describe('assigns color to new piece', () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ col: 0, row: 0 }],
    }
    expect(colorize(getColor, state)).toEqual({
      ...state,
      pieces: [{ col: 0, row: 0, color: 'color' }],
    })
  })

  describe("Doesn't assign color to piece that already has color", () => {
    const state = {
      ...DEFAULT_STATE,
      pieces: [{ col: 0, row: 0, color: 'pink' }],
    }
    expect(colorize(getColor, state)).toEqual({
      ...state,
      pieces: [{ col: 0, row: 0, color: 'pink' }],
    })
  })
})
