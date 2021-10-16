import { Cell } from './game'

export function getBoundingBox(piece: Cell[]) {
  const first = piece[0]
  const tl = {
    row: first.row,
    col: first.col,
  }
  const br = { ...tl }
  for (const cell of piece.slice(1)) {
    tl.row = Math.min(cell.row, tl.row)
    tl.col = Math.min(cell.col, tl.col)

    br.row = Math.max(cell.row, br.row)
    br.col = Math.max(cell.col, br.col)
  }

  return { tl, br, width: br.col - tl.col + 1, height: br.row - tl.row + 1 }
}
