<script lang="ts">
  import {level} from '@/store/MinesweeperStore'
</script>

<div class="flex justify-center">
  <button on:click={()=> $level = 1} class="p-3 hover:border-solid hover:border-2 hover:border-neutral-600">Easy</button>
  <button on:click={()=> $level = 2} class="p-3 hover:border-solid hover:border-2 hover:border-neutral-600">Medium</button>
  <button on:click={()=> $level = 3} class="p-3 hover:border-solid hover:border-2 hover:border-neutral-600">Hard</button>
</div>
