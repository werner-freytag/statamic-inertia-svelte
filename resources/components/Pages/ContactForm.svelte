<script>
  import { useForm } from '@inertiajs/svelte';

  let { title, content } = $props();

  const form = useForm({
    name: '',
    email: '',
    message: '',
  });

  function handleSubmit(event) {
    event.preventDefault();

    form.post('/!/forms/kontakt', {
      preserveScroll: true,
      onSuccess: () => {
        alert('Formular erfolgreich gesendet!');
        form.reset();
      },
    });
  }
</script>

<main class="mx-auto my-8 max-w-2xl px-6 font-sans">
  <h1 class="text-3xl font-bold text-zinc-900">{title}</h1>

  {#if content}
    <div class="prose mt-4 max-w-none text-zinc-700">
      {@html content}
    </div>
  {/if}

  <hr class="my-8 border-zinc-200" />

  <h2 class="text-2xl font-semibold text-zinc-900">Kontaktformular</h2>

  <form class="mt-6 space-y-6" onsubmit={handleSubmit}>
    <div>
      <label class="mb-2 block text-sm font-medium text-zinc-700" for="name">Name:</label>
      <input
        id="name"
        type="text"
        bind:value={form.name}
        disabled={form.processing}
        class="block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-zinc-100"
      />
      {#if form.errors.name}
        <p class="mt-2 text-sm text-red-600">{form.errors.name}</p>
      {/if}
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium text-zinc-700" for="email">E-Mail:</label>
      <input
        id="email"
        type="email"
        bind:value={form.email}
        disabled={form.processing}
        class="block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-zinc-100"
      />
      {#if form.errors.email}
        <p class="mt-2 text-sm text-red-600">{form.errors.email}</p>
      {/if}
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium text-zinc-700" for="message">Nachricht:</label>
      <textarea
        id="message"
        bind:value={form.message}
        disabled={form.processing}
        class="block min-h-32 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-zinc-100"
      ></textarea>
    </div>

    <button
      type="submit"
      disabled={form.processing}
      class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      {#if form.processing}Sendet...{:else}Abschicken{/if}
    </button>
  </form>
</main>
