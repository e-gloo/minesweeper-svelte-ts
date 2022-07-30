<script lang="ts">
  import { gameInstance } from "@/store/MinesweeperStore";
</script>

<div class="flex">
  {$gameInstance.nbMines}
  <img
    src="https://static.thenounproject.com/png/965385-200.png"
    alt="Mine reminding"
    width="30"
    height="30"
  />
</div>
