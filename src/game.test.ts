import {State, tick} from "./game"


describe('game/tick', () => {
  it('returns state', () => {
    const state: State = {}
    expect(tick(state)).toBe(state)
  })
})

