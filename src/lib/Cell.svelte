<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let type;
    export let w = 16;
    export let h = 16;

    const dispatch = createEventDispatcher();

    function leftClick(e: Event) {
        dispatch('leftclick', e);
    }

    function rightClick(e: Event) {
        e.preventDefault();
        dispatch('rightclick', e)
    }
</script>

<div
    class="flex relative"
    style:width={`${w/4}rem`}
    style:height={`${h/4}rem`}
    on:click={leftClick}
    on:contextmenu={rightClick}
>
    <div class="absolute inset-0 flex self-center items-center justify-center text-black text-xl">
        <slot></slot>
    </div>
    <img
        src={`assets/icons/${type}.svg`}
        class="w-full h-full"
        alt={type}
    />
</div>