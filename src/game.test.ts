import {State, tick} from "./game"


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

