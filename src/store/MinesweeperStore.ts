import { writable } from "svelte/store";
import { tweened } from "svelte/motion";
import type Game from "@/game";

export const timer = tweened(0);

export const level = writable(1);

export const gameInstance = writable(null as Game);
