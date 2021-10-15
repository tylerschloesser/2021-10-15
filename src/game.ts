import pipe from 'lodash/fp/pipe'
import curry from 'lodash/fp/curry'
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
  let nextPieces: Piece[] = []
  let nextFloor: Cell[] = [...state.floor]
  for (const piece of state.pieces) {
    let isOnFloor = piece.row === state.rows - 1
    if (!isOnFloor) {
      for (const cell of nextFloor) {
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
      nextFloor.push(piece)
    } else {
      nextPieces.push(piece)
    }
  }
  return {
    ...state,
    pieces: nextPieces,
    floor: nextFloor,
  }
}

export function clear(state: State): State {
  const check: number[] = []

  for (const cell of state.floor) {
    check[cell.row] = (check[cell.row] ?? 0) + 1
  }

  for (let row = state.rows - 1; row >= 0; row--) {
    if (check[row] === state.cols) {
      const nextFloor: Cell[] = []
      for (const cell of state.floor) {
        if (cell.row === row) {
          continue
        } else if (cell.row < row) {
          nextFloor.push({ ...cell, row: cell.row + 1 })
        } else {
          nextFloor.push(cell)
        }
      }
      // TODO assumes only 1 row intersection
      return { ...state, floor: nextFloor }
    }
  }

  return state
}

export function generate(state: State): State {
  if (!state.pieces.length) {
    const newPiece = { col: Math.floor(state.cols / 2), row: 0 }
    for (const cell of state.floor) {
      if (newPiece.row === cell.row && newPiece.col === cell.col) {
        // new piece would overlap floor
        return {
          ...state,
          isGameOver: true,
        }
      }
    }
    return {
      ...state,
      pieces: [newPiece],
    }
  }
  return state
}

// assign color after generation so that color can be optional, simplifying testing.
// ya it's hacky fight me
export const colorize = curry((getColor: () => string, state: State) => ({
  ...state,
  pieces: state.pieces.map((piece) => ({
    ...piece,
    color: piece.color ?? getColor(),
  })),
}))

export enum Input {
  Left,
  Right,
}

export function handle(state: State, input: Input): State {
  if (input === Input.Left || input === Input.Right) {
    const dir = input === Input.Left ? -1 : 1
    return {
      ...state,
      pieces: state.pieces.map((piece) => {
        const nextCol = Math.max(Math.min(piece.col + dir, state.cols - 1), 0)
        for (const cell of state.floor) {
          if (cell.col === nextCol && cell.row === piece.row) {
            return piece
          }
        }
        return {
          ...piece,
          col: nextCol,
        }
      }),
    }
  }
  return state
}

export const tick: (state: State) => State = pipe(
  validate,
  merge,
  clear,
  move,
  generate,
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
