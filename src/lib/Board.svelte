<script lang="ts">
  import type Game from "@/game";

  import Cell from "@/lib/Cell.svelte";
  import { gameInstance } from "@/store/MinesweeperStore";
  import { CellState, LEVEL_CONFIGS } from "@/utils/constants";

  let height = LEVEL_CONFIGS[1].y;
  let width = LEVEL_CONFIGS[1].x;

  gameInstance.subscribe((newGame: Game) => {
    height = newGame.height;
    width = newGame.width;
  });

  function handleLeftClick(_: Event, y: number, x: number) {
    $gameInstance = $gameInstance.leftClick(y, x);
  }

  function handleRightClick(_: Event, y: number, x: number) {
    $gameInstance = $gameInstance.rightClick(y, x);
  }
</script>

<div class="flex justify-center select-none">
  <div class="">
    {#if $gameInstance.board.length}
      {#each new Array(height).fill(0) as _, y}
        <div class="flex">
          {#each new Array(width).fill(0) as _, x}
            {@const cell = $gameInstance.board[y * width + x]}
            <Cell
              type={cell.state === CellState.VISIBLE
                ? cell.value
                : CellState[cell.state]}
              on:leftclick={(event) => handleLeftClick(event, y, x)}
              on:rightclick={(event) => handleRightClick(event, y, x)}
            />
          {/each}
        </div>
      {/each}
    {/if}
  </div>
</div>
