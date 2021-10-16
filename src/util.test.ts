import { Cell } from './game'
import { getBoundingBox, normalize } from './util'

describe('util/getBoundingBox', () => {
  it('returns corrent tl and br', () => {
    const piece: Cell[] = [
      { row: 0, col: 0 },
      { row: 1, col: 1 },
    ]
    expect(getBoundingBox(piece)).toEqual({
      tl: { row: 0, col: 0 },
      br: { row: 1, col: 1 },
      width: 2,
      height: 2,
    })
  })

  it('returns corrent tl and br but more complicated', () => {
    const piece: Cell[] = [
      { row: 1, col: 1 },
      { row: 2, col: 0 },
      { row: 1, col: 2 },
    ]
    expect(getBoundingBox(piece)).toEqual({
      tl: { row: 1, col: 0 },
      br: { row: 2, col: 2 },
      width: 3,
      height: 2,
    })
  })

  it('returns corrent tl and br for a single cell', () => {
    const piece: Cell[] = [{ row: 0, col: 0 }]
    expect(getBoundingBox(piece)).toEqual({
      tl: { row: 0, col: 0 },
      br: { row: 0, col: 0 },
      width: 1,
      height: 1,
    })
  })
})

describe('util/normalize', () => {
  it('moves a piece to 0,0', () => {
    const piece: Cell[] = [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
    ]
    expect(normalize(piece)).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
    ])
  })
})
