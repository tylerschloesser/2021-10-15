import { Cell } from './game'

export function getBoundingBox(piece: Cell[]) {
  const tl: { row: number; col: number } = {
    row: Number.MAX_VALUE,
    col: Number.MAX_VALUE,
  }
  const br: { row: number; col: number } = {
    row: Number.MIN_VALUE,
    col: Number.MIN_VALUE,
  }
  for (const cell of piece) {
    tl.row = Math.min(cell.row, tl.row)
    tl.col = Math.min(cell.col, tl.col)

    br.row = Math.max(cell.row, br.row)
    br.col = Math.max(cell.col, br.col)
  }

  return { tl, br }
}
