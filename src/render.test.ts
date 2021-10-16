import { State } from './game'
import { renderFloor, renderGameOver, renderGrid, renderPieces } from './render'

const DEFAULT_STATE: State = {
  rows: 3,
  cols: 3,
  pieces: [],
  floor: [],
  isGameOver: false,
  score: 0,
}

describe('render/renderGrid', () => {
  it('renders a small grid', () => {
    const canvas = <HTMLCanvasElement>{
      width: 5,
      height: 5,
    }

    const context = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
    }

    const state = DEFAULT_STATE

    renderGrid({ canvas, context: context as any, state })

    expect(context.beginPath.mock.calls).toEqual([[]])

    expect(context.moveTo.mock.calls).toEqual([
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
    ])

    expect(context.lineTo.mock.calls).toEqual([
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 4],
    ])

    expect(context.stroke.mock.calls).toEqual([[]])
  })
})

describe('render/renderPieces', () => {
  it('renders pieces', () => {
    const canvas = <HTMLCanvasElement>{
      width: 5,
      height: 5,
    }

    const context = {
      fillRect: jest.fn(),
    }

    const state: State = {
      ...DEFAULT_STATE,
      pieces: [{ row: 0, col: 1 }],
    }

    renderPieces({ canvas, context: context as any, state })

    expect(context.fillRect.mock.calls).toEqual([[2, 1, 1, 1]])
  })
})

describe('render/renderFloor', () => {
  it('renders floor', () => {
    const canvas = <HTMLCanvasElement>{
      width: 5,
      height: 5,
    }

    const context = {
      fillRect: jest.fn(),
    }

    const state: State = {
      ...DEFAULT_STATE,
      floor: [{ row: 1, col: 0 }],
    }

    renderFloor({ canvas, context: context as any, state })

    expect(context.fillRect.mock.calls).toEqual([[1, 2, 1, 1]])
  })
})

describe('render/renderGameOver', () => {
  it('renders game over', () => {
    const canvas = <HTMLCanvasElement>{
      width: 10,
      height: 10,
    }

    const context = {
      fillText: jest.fn(),
    }

    const state: State = {
      ...DEFAULT_STATE,
      isGameOver: true,
    }

    renderGameOver({ canvas, context: context as any, state })

    expect(context.fillText.mock.calls).toEqual([['Game Over', 5, 5]])
  })

  it('renders not game over', () => {
    const canvas = <HTMLCanvasElement>{
      width: 10,
      height: 10,
    }

    const context = {
      fillText: jest.fn(),
    }

    const state = DEFAULT_STATE
    renderGameOver({ canvas, context: context as any, state })

    expect(context.fillText.mock.calls).toEqual([])
  })
})
