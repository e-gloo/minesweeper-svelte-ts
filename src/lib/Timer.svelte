<script lang="ts">
  import { timer, gameState, level } from "#store/MinesweeperStore";
  import { GameState } from "#utils/constants";

  function displayTime(time: number) {
    return time < 10 ? `0${time}` : `${time}`;
  }

  let displayedTimer = "00:00:00";
  let timeInterval = undefined;

  gameState.subscribe((value: GameState) => {
    console.log(`starting with ${displayedTimer}`);
    if (value === GameState.PLAYING) {
      timeInterval = setInterval(() => {
        ++$timer;
      }, 1000);
    } else if (timeInterval !== undefined) {
      clearInterval(timeInterval);
      timeInterval = undefined;
    }
  });

  level.subscribe((_: number) => {
    $timer = 0;
    $gameState = GameState.WAITING;
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
