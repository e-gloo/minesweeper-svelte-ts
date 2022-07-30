import { get } from "svelte/store";
import {
  board as boardStore,
  level as levelStore,
  nbMines as nbMinesStore,
  nbCellRevealed as nbCellRevealedStore,
  gameState as gameStateStore,
} from "#store/MinesweeperStore";
import type TCell from "#types/TCell";
import {
  LEVEL_CONFIGS,
  NEIGHBORS,
  CellState,
  GameState,
} from "#utils/constants";
import { randomNumber } from "#utils/helpers";

function initBoard(level: number) {
  const board = [] as TCell[];
  const height = LEVEL_CONFIGS[level].y;
  const width = LEVEL_CONFIGS[level].x;
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      board.push({ isMine: false, value: 0, state: CellState.HIDDEN });
    }
  }
  boardStore.set([...board]);
  nbMinesStore.set(LEVEL_CONFIGS[level].nbMines);
  nbCellRevealedStore.set(0);
}

levelStore.subscribe((value: number) => {
  initBoard(value);
});

function setValues() {
  const board = get(boardStore);
  const width = LEVEL_CONFIGS[get(levelStore)].x;
  const height = LEVEL_CONFIGS[get(levelStore)].y;
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      for (const neighbor of NEIGHBORS) {
        const tempCell = (y + neighbor.y) * width + x + neighbor.x;
        if (
          y + neighbor.y >= 0 &&
          y + neighbor.y < height &&
          x + neighbor.x >= 0 &&
          x + neighbor.x < width &&
          board[tempCell].isMine === true
        ) {
          ++board[y * width + x].value;
        }
      }
    }
  }

  boardStore.set([...board]);
}

function placeMines(y: number, x: number) {
  const board = get(boardStore);
  const width = LEVEL_CONFIGS[get(levelStore)].x;
  const possibleCells = board.filter(
    (_: TCell, idx: number) => y * width + x !== idx
  );
  let nbMines = get(nbMinesStore);
  while (nbMines > 0) {
    const randomIndex = randomNumber(0, possibleCells.length - 1);
    console.log({ len: possibleCells.length, randomIndex });
    possibleCells[randomIndex].isMine = true;
    possibleCells.splice(randomIndex, 1);
    --nbMines;
  }

  boardStore.set([...board]);
}

function checkWin() {
  const board = get(boardStore);
  const level = get(levelStore);
  const nbCellRevealed = get(nbCellRevealedStore);
  if (nbCellRevealed === board.length - LEVEL_CONFIGS[level].nbMines) {
    gameStateStore.set(GameState.WIN);
  }
}

function canClick() {
  return [GameState.PLAYING, GameState.WAITING].includes(get(gameStateStore));
}

export function leftClick(y: number, x: number) {
  if (!canClick()) {
    return;
  }

  if (get(gameStateStore) === GameState.WAITING) {
    gameStateStore.set(GameState.PLAYING);
    placeMines(y, x);
    setValues();
  }

  let board = get(boardStore);
  const width = LEVEL_CONFIGS[get(levelStore)].x;
  const height = LEVEL_CONFIGS[get(levelStore)].y;
  const cell = board[y * width + x];
  let newState = cell.state;

  if (cell.isMine === true && cell.state === CellState.HIDDEN) {
    newState = CellState.CLICKED_MINE;
    gameStateStore.set(GameState.LOST);
    board[y * width + x] = { ...board[y * width + x], state: newState };
    boardStore.set([...board]);
  } else if (cell.state === CellState.HIDDEN) {
    newState = CellState.VISIBLE;
    nbCellRevealedStore.set(get(nbCellRevealedStore) + 1);
    board[y * width + x] = { ...board[y * width + x], state: newState };
    boardStore.set([...board]);
    if (cell.value === 0) {
      for (const neighbor of NEIGHBORS) {
        const tempCell = (y + neighbor.y) * width + x + neighbor.x;
        if (
          y + neighbor.y >= 0 &&
          y + neighbor.y < height &&
          x + neighbor.x >= 0 &&
          x + neighbor.x < width &&
          board[tempCell].state === CellState.HIDDEN
        ) {
          leftClick(y + neighbor.y, x + neighbor.x);
          board = get(boardStore);
        }
      }
    }
    checkWin();
  }
}

export function rightClick(y: number, x: number) {
  if (!canClick()) {
    return;
  }
  const board = get(boardStore);
  const width = LEVEL_CONFIGS[get(levelStore)].x;
  const cell = board[y * width + x];
  let nbMinesTmp = get(nbMinesStore);
  let newState = CellState.HIDDEN;
  if (cell.state === CellState.HIDDEN) {
    newState = CellState.FLAG;
    --nbMinesTmp;
    nbMinesStore.set(nbMinesTmp);
  } else if (cell.state === CellState.FLAG) {
    newState = CellState.QUESTION;
    ++nbMinesTmp;
    nbMinesStore.set(nbMinesTmp);
  } else if (cell.state === CellState.VISIBLE) {
    newState = CellState.VISIBLE;
  }
  board[y * width + x] = { ...cell, state: newState };
  boardStore.set([...board]);
}
