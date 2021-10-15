export interface Piece {
  row: number
  col: number
}

export interface State {
  rows: number
  cols: number
  pieces: Piece[]
}

export function tick(state: State): State {
  return state
}

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
}
