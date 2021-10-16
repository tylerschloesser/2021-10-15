import { Cell } from './game'

export const STANDARD_PIECES: Cell[][] = [
  {
    color: 'orange',
    cells: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
  },
  {
    color: 'red',
    cells: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  },
  {
    color: 'blue',
    cells: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
    ],
  },
  {
    color: 'magenta',
    cells: [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
  },
  {
    color: 'cyan',
    cells: [
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
    ],
  },
  {
    color: 'yellow',
    cells: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 1],
    ],
  },
  {
    color: 'lime',
    cells: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
  },
].map(({ color, cells }) => cells.map(([row, col]) => ({ row, col, color })))
