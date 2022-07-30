export const LEVEL_CONFIGS = {
  1: { y: 9, x: 9, nbMines: 10, size: 12 },
  2: { y: 16, x: 16, nbMines: 40, size: 12 },
  3: { y: 16, x: 30, nbMines: 99, size: 12 },
};

export const NEIGHBORS = [
  { y: -1, x: -1 },
  { y: -1, x: 0 },
  { y: -1, x: 1 },
  { y: 0, x: -1 },
  { y: 0, x: 1 },
  { y: 1, x: -1 },
  { y: 1, x: 0 },
  { y: 1, x: 1 },
];

export enum CellState {
  HIDDEN,
  FLAG,
  FLAG_WRONG,
  CLICKED_MINE,
  QUESTION,
  VISIBLE,
}

export enum GameState {
  WAITING,
  PLAYING,
  WIN,
  LOST,
}
