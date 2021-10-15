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
