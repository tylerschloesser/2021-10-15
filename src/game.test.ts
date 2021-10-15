import {
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
})
