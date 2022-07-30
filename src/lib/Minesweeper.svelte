<script lang="ts">
  import Board from "@/lib/Board.svelte";
  import Level from "@/lib/Level.svelte";
  import Stats from "@/lib/Stats.svelte";
</script>

<div class="w-full">
  <Level />
  <div>
    <Stats />
    <Board />
  </div>
</div>
