import { State, tick, validate } from './game'

describe('game/tick', () => {
  it('returns state', () => {
    const state: State = {
      rows: 2,
      cols: 2,
      pieces: [],
    }
    expect(tick(state)).toBe(state)
  })
})

describe('game/validate', () => {
  it('is valid', () => {
    const state: State = {
      rows: 2,
      cols: 2,
      pieces: [],
    }
    validate(state)
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
