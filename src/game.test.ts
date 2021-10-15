import { merge, move, State, tick, validate } from './game'

const DEFAULT_STATE: State = {
  rows: 2,
  cols: 2,
  pieces: [],
  floor: [],
}

describe('game/tick', () => {
  it('returns state', () => {
    const state = DEFAULT_STATE
    expect(tick(state)).toEqual(state)
  })
})

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
})
