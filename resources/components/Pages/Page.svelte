<script>
    let { title, content } = $props();

    let counter = $state(0);
</script>

<main class="max-w-200 m-0 mx-auto p-8 font-sans">
    <h1 class="text-2xl">{title}</h1>

    <div class="my-8">
        <button class="bg-blue-400 text-white p-2 py-1 rounded" onclick={() => counter++}>Counter: {counter}</button>
    </div>

    {#if content}
        <div class="prose">
            {content}
        </div>
    {/if}
</main>
