<script lang="ts">
  import MineReminding from "@/lib/MineReminding.svelte";
  import Timer from "@/lib/Timer.svelte";
  
  let d = false;
</script>

<div class="flex justify-center">
  <MineReminding />
  <Timer />
</div>
