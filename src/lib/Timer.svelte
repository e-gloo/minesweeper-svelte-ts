<script lang="ts">
  import { timer, start } from "#store/MinesweeperStore";

  function displayTime(time: number) {
    return time < 10 ? `0${time}` : `${time}`;
  }

  let displayedTimer = "00:00:00";
  let timeInterval = undefined;

  start.subscribe((value: boolean) => {
    console.log(`starting with ${displayedTimer}`);
    if (value === true) {
      timeInterval = setInterval(() => {
        $timer++;
      }, 1000);
    } else if (timeInterval !== undefined) {
      clearInterval(timeInterval);
    }
  });

  $: {
    const h = Math.floor($timer / 3600);
    const m = Math.floor(($timer % 3600) / 60);
    const s = Math.floor(($timer % 3600) % 60);
    displayedTimer = `${displayTime(h)}:${displayTime(m)}:${displayTime(s)}`;
  }
</script>

<div>
  Timer {displayedTimer}
</div>
