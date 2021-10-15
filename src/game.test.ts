import { move, State, tick, validate } from './game'

describe('game/tick', () => {
  it('returns state', () => {
    const state: State = {
      rows: 2,
      cols: 2,
      pieces: [],
    }
    expect(tick(state)).toEqual(state)
  })
})

describe('game/validate', () => {
  it('is valid', () => {
    const state: State = {
      rows: 2,
      cols: 2,
      pieces: [],
    }
    expect(validate(state)).toBe(state)
  })

  it('throws if piece is invalid', () => {
    const state: State = {
      rows: 2,
      cols: 2,
      pieces: [{ row: 100, col: 0 }],
    }
    expect(() => validate(state)).toThrow()
  })
})

describe('game/move', () => {
  it('moves a piece', () => {
    const state: State = {
      rows: 2,
      cols: 2,
      pieces: [{ row: 0, col: 0 }],
    }
    expect(move(state)).toEqual({
      ...state,
      pieces: [{ row: 1, col: 0 }],
    })
  })

  it("does't move a piece on the bottom", () => {
    const state: State = {
      rows: 2,
      cols: 2,
      pieces: [{ row: 1, col: 0 }],
    }
    expect(move(state)).toEqual({
      ...state,
      pieces: [{ row: 1, col: 0 }],
    })
  })
})
