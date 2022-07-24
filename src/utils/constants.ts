export const LEVEL_CONFIGS = {
  1: { y: 9, x: 9, nbMines: 10, size: 16 },
  2: { y: 16, x: 16, nbMines: 40, size: 14 },
  3: { y: 16, x: 30, nbMines: 99, size: 8 },
};

export enum CellState {
  HIDDEN,
  FLAG,
  QUESTION,
  VISIBLE,
}
