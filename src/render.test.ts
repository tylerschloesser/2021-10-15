import { State } from './game'
import { renderGrid } from './render'

describe('render/renderGrid', () => {
  it('renders a small grid', () => {})

  const canvas = <HTMLCanvasElement>{
    width: 10,
    height: 10,
  }

  const context = {
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  }

  const state: State = {
    rows: 2,
    cols: 2,
    pieces: [],
  }

  renderGrid({ canvas, context: context as any, state })

  expect(context.moveTo.mock.calls).toEqual([
    [1, 1],
    [1, 5],
    [1, 9],
    [1, 1],
    [5, 1],
    [9, 1],
  ])

  expect(context.lineTo.mock.calls).toEqual([
    [9, 1],
    [9, 5],
    [9, 9],
    [1, 9],
    [5, 9],
    [9, 9],
  ])

  expect(context.stroke.mock.calls).toEqual([[]])
})
