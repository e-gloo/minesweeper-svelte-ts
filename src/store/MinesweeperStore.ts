import { writable } from "svelte/store";
import { tweened } from "svelte/motion";
import type TCell from "#types/TCell";
import { GameState } from "#utils/constants";

export const board = writable([] as TCell[]);

export const nbMines = writable(10);

export const nbCellRevealed = writable(0);

export const timer = tweened(0);

export const level = writable(1);

export const gameState = writable(GameState.WAITING);
