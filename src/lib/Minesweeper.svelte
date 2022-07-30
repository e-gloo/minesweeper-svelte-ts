<script lang="ts">
  import { level, gameInstance } from "@/store/MinesweeperStore";
  import Game from "@/game";
  import Level from "@/lib/Level.svelte";
  import Board from "@/lib/Board.svelte";
  import Stats from "@/lib/Stats.svelte";

  level.subscribe((vewLevel: number) => {
    $gameInstance = new Game(vewLevel);
  })
</script>

<Level />
<div>
  <Stats />
  <Board />
</div>
