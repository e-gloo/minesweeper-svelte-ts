<script lang="ts">
  import type TCell from "#types/TCell";
  import Cell from "#lib/Cell.svelte";
  import { start, level, nbMines } from "#store/MinesweeperStore";
  import { CellState, LEVEL_CONFIGS } from "#utils/constants";

  let height = LEVEL_CONFIGS[1].y;
  let width = LEVEL_CONFIGS[1].x;
  let size = LEVEL_CONFIGS[1].size;
  let board: TCell[] = [];

  level.subscribe((value: number) => {
    board = [];
    height = LEVEL_CONFIGS[value].y;
    width = LEVEL_CONFIGS[value].x;
    size = LEVEL_CONFIGS[value].size;
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        board.push({ isMine: false, value: 0, state: CellState.HIDDEN });
      }
    }
  });

  function handleLeftClick(_: Event, y: number, x: number) {
    if (!$start) {
      $start = true;
    }
    board[y * width + x] = {
      ...board[y * width + x],
      state: CellState.VISIBLE,
    };
    board = [...board];
  }

  function handleRightClick(_: Event, y: number, x: number) {
    const cell = board[y * width + x];
    let newState = CellState.HIDDEN;
    if (cell.state === CellState.HIDDEN) {
      newState = CellState.FLAG;
      $nbMines--;
    } else if (cell.state === CellState.FLAG) {
      newState = CellState.QUESTION;
      $nbMines++;
    }
    board[y * width + x] = {
      ...cell,
      state: newState,
    };
    board = [...board];
  }
</script>

<div class="flex justify-center select-none">
  <div class="">
    {#if board.length}
      {#each new Array(height).fill(0) as _, y}
        <div class="flex">
          {#each new Array(width).fill(0) as _, x}
            {@const cell = board[y * width + x]}
            <Cell
              type={CellState[cell.state]}
              w={size}
              h={size}
              on:leftclick={(event) => handleLeftClick(event, y, x)}
              on:rightclick={(event) => handleRightClick(event, y, x)}
            >
              {cell.state === CellState.VISIBLE ? cell.value : ""}
            </Cell>
          {/each}
        </div>
      {/each}
    {/if}
  </div>
</div>
