import { get } from "svelte/store";
import {
  board as boardStore,
  level as levelStore,
  nbMines as nbMinesStore,
  nbCellRevealed as nbCellRevealedStore,
  gameState as gameStateStore,
} from "#store/MinesweeperStore";
import type TCell from "#types/TCell";
import { LEVEL_CONFIGS, CellState, GameState } from "#utils/constants";
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
  const neigboorCells = [
    { y: -1, x: -1 },
    { y: -1, x: 0 },
    { y: -1, x: 1 },
    { y: 0, x: -1 },
    { y: 0, x: 1 },
    { y: 1, x: -1 },
    { y: 1, x: 0 },
    { y: 1, x: 1 },
  ];
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      for (const neigboor of neigboorCells) {
        const tempCell = (y + neigboor.y) * width + x + neigboor.x;
        if (
          y + neigboor.y >= 0 &&
          y + neigboor.y < height &&
          x + neigboor.x >= 0 &&
          x + neigboor.x < width &&
          board[tempCell].isMine === true
        ) {
          ++board[y * width + x].value;
        }
      }
    }
  }

  // for (let cell = 0; cell < board.length; ++cell) {
  //   let nbMinesNeighbour = 0;
  //   const x = cell % width;
  //   const y = cell / height;
  //   for (let ty = -1; ty <= 1; ++ty) {
  //     for (let tx = -1; tx <= 1; ++tx) {
  //       const tmpX = (cell + tx) % width;
  //       const tmpY = (cell + ty) / width;
  //       if (x === tmpX && y === tmpY) {
  //         continue;
  //       }
  //     }
  //   }
  //   }
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
    const randomIndex = randomNumber(0, possibleCells.length);
    board[randomIndex].isMine = true;
    possibleCells.splice(randomIndex, 1);
    --nbMines;
  }

  boardStore.set([...board]);
}

function checkWin() {
  const board = get(boardStore);
  const nbCellRevealed = get(nbCellRevealedStore);
  if (nbCellRevealed === board.length - get(nbMinesStore)) {
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
  const board = get(boardStore);
  const width = LEVEL_CONFIGS[get(levelStore)].x;
  const cell = board[y * width + x];
  let newState = cell.state;
  if (cell.isMine === true && cell.state === CellState.HIDDEN) {
    newState = CellState.CLICKED_MINE;
    gameStateStore.set(GameState.LOST);
  } else if (cell.state === CellState.HIDDEN) {
    newState = CellState.VISIBLE;
    nbCellRevealedStore.set(get(nbCellRevealedStore) + 1);
    checkWin();
  }
  board[y * width + x] = { ...board[y * width + x], state: newState };
  boardStore.set([...board]);
  if (get(gameStateStore) === GameState.WAITING) {
    gameStateStore.set(GameState.PLAYING);
    placeMines(y, x);
    setValues();
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
