import curry from 'lodash/fp/curry'
import pipe from 'lodash/fp/pipe'
import random from 'lodash/random'
import randomColor from 'randomcolor'
import { STANDARD_PIECES } from './constants'

export interface Cell {
  row: number
  col: number
  color?: string
}

export interface State {
  rows: number
  cols: number
  piece: Cell[]
  nextPiece: Cell[]
  floor: Cell[]
  isGameOver: boolean
  score: number
}

export function move(state: State): State {
  return {
    ...state,
    piece: state.piece.map((piece) => ({
      ...piece,
      row: Math.min(piece.row + 1, state.rows - 1),
    })),
  }
}

export function merge(state: State): State {
  let isOnFloor = false
  for (const piece of state.piece) {
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
      floor: [...state.floor, ...state.piece],
      piece: [],
    }
  }
  return state
}

export function clear(state: State): State {
  const check: number[] = []

  for (const cell of state.floor) {
    check[cell.row] = (check[cell.row] ?? 0) + 1
  }

  let { score } = state

  let currentFloor = [...state.floor]
  for (let row = 0; row < state.rows; row++) {
    if (check[row] === state.cols) {
      score++
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

  return { ...state, floor: currentFloor, score }
}

export const generateNextPiece = curry(
  (getPiece: (state: State) => Cell[], state: State) => {
    if (state.isGameOver) {
      return state
    }
    if (!state.nextPiece.length) {
      const nextPiece = getPiece(state)
      if (getCollision(nextPiece, state)) {
        return {
          ...state,
          isGameOver: true,
        }
      }
      return {
        ...state,
        nextPiece,
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
    piece: state.piece.map((piece) => ({
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

function getCollision(piece: Cell[], state: State) {
  for (const pcell of piece) {
    if (pcell.col < 0) {
      return Collision.LeftWall
    }
    if (pcell.col > state.cols - 1) {
      return Collision.RightWall
    }
    if (pcell.row < 0 || pcell.row > state.rows - 1) {
      return Collision.Floor
    }
    for (const fcell of state.floor) {
      if (pcell.row === fcell.row && pcell.col === fcell.col) {
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

  const nextPiece = state.piece.map((piece) => ({
    ...piece,
    col: piece.col + dir,
  }))

  if (getCollision(nextPiece, state)) {
    return state
  }

  return {
    ...state,
    piece: nextPiece,
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

  for (const piece of state.piece) {
    tl.row = Math.min(piece.row, tl.row)
    tl.col = Math.min(piece.col, tl.col)

    br.row = Math.max(piece.row, br.row)
    br.col = Math.max(piece.col, br.col)
  }

  const bbw = br.col - tl.col
  //const bbh = br.row - tl.row

  // transpose and reverse column for CW rotation
  const nextPiece = state.piece.map((piece) => ({
    ...piece,
    row: tl.row + (piece.col - tl.col),
    col: tl.col + (bbw - (piece.row - tl.row)),
  }))

  if (getCollision(nextPiece, state)) {
    return state
  }

  return {
    ...state,
    piece: nextPiece,
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

const randomGetPiece = (state: State) => {
  const index = random(STANDARD_PIECES.length - 1)
  const piece = STANDARD_PIECES[index]
  return piece.map((piece) => ({
    ...piece,
    col: piece.col + Math.floor(state.cols / 2),
  }))
}

export function moveNextPiece(state: State) {
  if (state.piece.length) {
    return state
  }
  if (!state.nextPiece.length) {
    throw Error('no current or next piece')
  }
  return {
    ...state,
    piece: state.nextPiece,
    nextPiece: [],
  }
}

export const tick: (state: State) => State = pipe(
  validate,
  merge,
  clear,
  move,
  generateNextPiece(randomGetPiece),
  moveNextPiece,
  colorize(randomColor),
)

export function validate(state: State) {
  for (const piece of state.piece) {
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
