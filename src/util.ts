import { Cell } from './game'

export interface BoundingBox {
  tl: { row: number; col: number }
  br: { row: number; col: number }
  width: number
  height: number
}

export function getBoundingBox(piece: Cell[]): BoundingBox {
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

export function normalize(piece: Cell[]): Cell[] {
  const { tl } = getBoundingBox(piece)
  return piece.map((cell) => ({
    ...cell,
    row: cell.row - tl.row,
    col: cell.col - tl.col,
  }))
}
