<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { CELL_SIZE } from "@/utils/constants";

  export let type;

  const dispatch = createEventDispatcher();

  function leftClick(e: Event) {
    dispatch("leftclick", e);
  }

  function rightClick(e: Event) {
    e.preventDefault();
    dispatch("rightclick", e);
  }
</script>

<div
  class="flex relative"
  style:width={`${CELL_SIZE / 4}rem`}
  style:height={`${CELL_SIZE / 4}rem`}
  on:click={leftClick}
  on:contextmenu={rightClick}
>
  <img src={`assets/icons/${type}.svg`} class="w-full h-full" alt={type} />
</div>
