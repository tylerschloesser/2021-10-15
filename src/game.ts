import pipe from 'lodash/fp/pipe'

export interface Piece {
  row: number
  col: number
}

export interface Cell {
  row: number
  col: number
}

export interface State {
  rows: number
  cols: number
  pieces: Piece[]
  floor: Cell[]
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
  return state
}

export const tick: (state: State) => State = pipe(validate, move)

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
