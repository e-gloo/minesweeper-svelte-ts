import { writable } from "svelte/store";
import { tweened } from "svelte/motion";

export const nbMines = writable(100);

export const timer = tweened(0);

export const start = writable(false);

export const level = writable(1);
