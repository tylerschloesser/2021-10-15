import curry from 'lodash/fp/curry'
import pipe from 'lodash/fp/pipe'
import random from 'lodash/random'
import randomColor from 'randomcolor'

export interface Piece {
  row: number
  col: number
  color?: string
}

export interface Cell {
  row: number
  col: number
  color?: string
}

export interface State {
  rows: number
  cols: number
  pieces: Piece[]
  floor: Cell[]
  isGameOver: boolean
}

export function move(state: State): State {
  return {
    ...state,
    pieces: state.pieces.map((piece) => ({
      ...piece,
      row: Math.min(piece.row + 1, state.rows - 1),
    })),
  }
}

export function merge(state: State): State {
  let isOnFloor = false
  for (const piece of state.pieces) {
    isOnFloor = piece.row === state.rows - 1
    if (!isOnFloor) {
      for (const cell of state.floor) {
        if (piece.col !== cell.col) {
          continue
        }
        if (piece.row === cell.row - 1) {
          isOnFloor = true
          break
        }
      }
    }

    if (isOnFloor) {
      break
    }
  }

  if (isOnFloor) {
    return {
      ...state,
      floor: [...state.floor, ...state.pieces],
      pieces: [],
    }
  }
  return state
}

export function clear(state: State): State {
  const check: number[] = []

  for (const cell of state.floor) {
    check[cell.row] = (check[cell.row] ?? 0) + 1
  }

  let currentFloor = [...state.floor]
  for (let row = 0; row < state.rows; row++) {
    if (check[row] === state.cols) {
      const nextFloor: Cell[] = []
      for (const cell of currentFloor) {
        if (cell.row === row) {
          continue
        } else if (cell.row < row) {
          nextFloor.push({ ...cell, row: cell.row + 1 })
        } else {
          nextFloor.push(cell)
        }
      }
      currentFloor = nextFloor
    }
  }

  return { ...state, floor: currentFloor }
}

export const generate = curry(
  (getPieces: (state: State) => Piece[], state: State) => {
    if (state.isGameOver) {
      return state
    }
    if (!state.pieces.length) {
      const newPieces = getPieces(state)
      for (const newPiece of newPieces) {
        for (const cell of state.floor) {
          if (newPiece.row === cell.row && newPiece.col === cell.col) {
            // new piece would overlap floor
            return {
              ...state,
              isGameOver: true,
            }
          }
        }
      }
      return {
        ...state,
        pieces: newPieces,
      }
    }
    return state
  },
)

// assign color after generation so that color can be optional, simplifying testing.
// ya it's hacky fight me
export const colorize = curry((getColor: () => string, state: State) => {
  const newColor = getColor()
  return {
    ...state,
    pieces: state.pieces.map((piece) => ({
      ...piece,
      color: piece.color ?? newColor,
    })),
  }
})

export enum Input {
  Left = 'left',
  Right = 'right',
  Down = 'down',
  Up = 'up',
}

export enum Collision {
  RightWall = 'right-wall',
  LeftWall = 'left-wall',
  Floor = 'floor',
}

function getCollision(pieces: Piece[], state: State) {
  for (const piece of pieces) {
    if (piece.col < 0) {
      return Collision.LeftWall
    }
    if (piece.col > state.cols - 1) {
      return Collision.RightWall
    }
    if (piece.row < 0 || piece.row > state.rows - 1) {
      return Collision.Floor
    }
    for (const cell of state.floor) {
      if (piece.row === cell.row && piece.col === cell.col) {
        return Collision.Floor
      }
    }
  }
  return null
}

export function handleLeftRight(
  state: State,
  input: Input.Left | Input.Right,
): State {
  const dir = input === Input.Left ? -1 : 1

  const nextPieces = state.pieces.map((piece) => ({
    ...piece,
    col: piece.col + dir,
  }))

  if (getCollision(nextPieces, state)) {
    return state
  }

  return {
    ...state,
    pieces: nextPieces,
  }
}

export function handleUp(state: State): State {
  const tl: { row: number; col: number } = {
    row: Number.MAX_VALUE,
    col: Number.MAX_VALUE,
  }
  const br: { row: number; col: number } = {
    row: Number.MIN_VALUE,
    col: Number.MIN_VALUE,
  }

  for (const piece of state.pieces) {
    tl.row = Math.min(piece.row, tl.row)
    tl.col = Math.min(piece.col, tl.col)

    br.row = Math.max(piece.row, br.row)
    br.col = Math.max(piece.col, br.col)
  }

  const bbw = br.col - tl.col
  //const bbh = br.row - tl.row

  // transpose and reverse column for CW rotation
  const nextPieces = state.pieces.map((piece) => ({
    ...piece,
    row: tl.row + (piece.col - tl.col),
    col: tl.col + (bbw - (piece.row - tl.row)),
  }))

  if (getCollision(nextPieces, state)) {
    return state
  }

  return {
    ...state,
    pieces: nextPieces,
  }
}

export function handle(state: State, input: Input): State {
  if (input === Input.Left || input === Input.Right) {
    return handleLeftRight(state, input)
  }
  if (input === Input.Down) {
    return tick(state)
  }
  if (input === Input.Up) {
    return handleUp(state)
  }
  return state
}

const STANDARD_PIECES: Piece[][] = [
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
    color: 'purple',
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
    color: 'green',
    cells: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
  },
].map(({ color, cells }) => cells.map(([row, col]) => ({ row, col, color })))

const randomGetPieces = (state: State) => {
  const index = random(STANDARD_PIECES.length - 1)
  const pieces = STANDARD_PIECES[index]
  return pieces.map((piece) => ({
    ...piece,
    col: piece.col + Math.floor(state.cols / 2),
  }))
}

export const tick: (state: State) => State = pipe(
  validate,
  merge,
  clear,
  move,
  generate(randomGetPieces),
  colorize(randomColor),
)

export function validate(state: State) {
  for (const piece of state.pieces) {
    if (
      piece.col < 0 ||
      piece.col >= state.cols ||
      piece.row < 0 ||
      piece.row >= state.rows
    ) {
      throw Error(`piece ${JSON.stringify(piece)} is invalid`)
    }
  }
  return state
}
