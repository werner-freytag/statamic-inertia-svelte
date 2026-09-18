import { createInertiaApp } from '@inertiajs/svelte'
import { hydrate } from 'svelte'
import '../css/site.css'

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('../components/**/*.svelte', { eager: true })
    return pages[`../components/${name}.svelte`]
  },
  setup({ el, App, props }) {
    hydrate(App, { target: el, props })
  },
})
