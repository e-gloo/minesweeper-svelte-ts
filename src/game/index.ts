import type TCell from "@/types/TCell";
import {
  LEVEL_CONFIGS,
  NEIGHBORS,
  CellState,
  GameState,
} from "@/utils/constants";
import { randomNumber } from "@/utils/helpers";

export default class Game {
  level: number;
  board: TCell[];
  width: number;
  height: number;
  nbMines: number;
  nbCellToRevealed: number;
  gameState: GameState;

  constructor(level: number) {
    this.level = level;
    this.board = [];
    this.width = LEVEL_CONFIGS[this.level].x;
    this.height = LEVEL_CONFIGS[this.level].y;
    this.nbMines = LEVEL_CONFIGS[this.level].nbMines;
    this.nbCellToRevealed = this.width * this.height - this.nbMines;
    this.gameState = GameState.WAITING;

    this.initBoard();
  }

  private initBoard() {
    this.board = [];
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        this.board.push({ isMine: false, value: 0, state: CellState.HIDDEN });
      }
    }
  }

  private setValues() {
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        for (const neighbor of NEIGHBORS) {
          const tempCell = (y + neighbor.y) * this.width + x + neighbor.x;
          if (
            y + neighbor.y >= 0 &&
            y + neighbor.y < this.height &&
            x + neighbor.x >= 0 &&
            x + neighbor.x < this.width &&
            this.board[tempCell].isMine === true
          ) {
            ++this.board[y * this.width + x].value;
          }
        }
      }
    }
  }

  private placeMines(y: number, x: number) {
    const possibleCells = this.board.filter(
      (_: TCell, idx: number) => y * this.width + x !== idx
    );
    let nbMines = this.nbMines;
    while (nbMines > 0) {
      const randomIndex = randomNumber(0, possibleCells.length - 1);
      possibleCells[randomIndex].isMine = true;
      possibleCells.splice(randomIndex, 1);
      --nbMines;
    }
  }

  private checkWin() {
    if (this.nbCellToRevealed === 0) {
      this.gameState = GameState.WIN;
    }
  }

  private canClick() {
    return [GameState.PLAYING, GameState.WAITING].includes(this.gameState);
  }

  private revealCell(y: number, x: number) {
    let newState = CellState.VISIBLE;
    const cell = this.board[y * this.width + x];

    --this.nbCellToRevealed;
    this.board[y * this.width + x].state = newState;
    if (cell.value === 0) {
      for (const neighbor of NEIGHBORS) {
        const tempCell = (y + neighbor.y) * this.width + x + neighbor.x;
        if (
          y + neighbor.y >= 0 &&
          y + neighbor.y < this.height &&
          x + neighbor.x >= 0 &&
          x + neighbor.x < this.width &&
          this.board[tempCell].state === CellState.HIDDEN
        ) {
          this.revealCell(y + neighbor.y, x + neighbor.x);
        }
      }
    }
  }

  leftClick(y: number, x: number): Game {
    if (!this.canClick()) {
      return this;
    }

    if (this.gameState === GameState.WAITING) {
      this.gameState = GameState.PLAYING;
      this.placeMines(y, x);
      this.setValues();
    }

    const cell = this.board[y * this.width + x];
    let newState = cell.state;

    if (cell.isMine === true && cell.state === CellState.HIDDEN) {
      newState = CellState.CLICKED_MINE;
      this.gameState = GameState.LOST;
      this.board[y * this.width + x].state = newState;
    } else if (cell.state === CellState.HIDDEN) {
      this.revealCell(y, x);
      this.checkWin();
    }
    return this;
  }

  rightClick(y: number, x: number): Game {
    if (!this.canClick()) {
      return this;
    }
    const cell = this.board[y * this.width + x];
    let newState = CellState.HIDDEN;
    if (cell.state === CellState.HIDDEN) {
      newState = CellState.FLAG;
      --this.nbMines;
    } else if (cell.state === CellState.FLAG) {
      newState = CellState.QUESTION;
      ++this.nbMines;
    } else if (cell.state === CellState.VISIBLE) {
      newState = CellState.VISIBLE;
    }
    this.board[y * this.width + x].state = newState;
    return this;
  }
}
