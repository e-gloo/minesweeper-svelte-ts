<script lang="ts">
  import Cell from "@/lib/Cell.svelte";
  import { board, level } from "@/store/MinesweeperStore";
  import { CellState, LEVEL_CONFIGS } from "@/utils/constants";
  import { leftClick, rightClick } from "@/game";

  let height = LEVEL_CONFIGS[1].y;
  let width = LEVEL_CONFIGS[1].x;
  let size = LEVEL_CONFIGS[1].size;

  level.subscribe((value: number) => {
    height = LEVEL_CONFIGS[value].y;
    width = LEVEL_CONFIGS[value].x;
    size = LEVEL_CONFIGS[value].size;
  });

  function handleLeftClick(_: Event, y: number, x: number) {
    leftClick(y, x);
  }

  function handleRightClick(_: Event, y: number, x: number) {
    rightClick(y, x);
  }
</script>

<div class="flex justify-center select-none">
  <div class="">
    {#if $board.length}
      {#each new Array(height).fill(0) as _, y}
        <div class="flex">
          {#each new Array(width).fill(0) as _, x}
            {@const cell = $board[y * width + x]}
            <Cell
              type={cell.state === CellState.VISIBLE
                ? cell.value
                : CellState[cell.state]}
              w={size}
              h={size}
              on:leftclick={(event) => handleLeftClick(event, y, x)}
              on:rightclick={(event) => handleRightClick(event, y, x)}
            />
          {/each}
        </div>
      {/each}
    {/if}
  </div>
</div>
