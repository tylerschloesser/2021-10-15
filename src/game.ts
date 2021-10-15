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
  let nextPieces: Piece[] = []
  let nextFloor: Cell[] = [ ...state.floor ]
  for (const piece of state.pieces) {

    let isOnFloor = piece.row === (state.rows - 1)
    if (!isOnFloor) {
      for (const cell of nextFloor) {
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

export const tick: (state: State) => State = pipe(validate, merge, move)

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
