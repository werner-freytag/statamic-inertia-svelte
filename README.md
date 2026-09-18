# Statamic + Inertia + Svelte

This project combines [Statamic](https://statamic.dev/) as a flat-file CMS with Laravel, [Inertia.js](https://inertiajs.com/), and [Svelte 5](https://svelte.dev/). Statamic manages content and blueprints, while Svelte handles the frontend rendering. Tailwind CSS is integrated through Vite.

## Architecture

- Statamic stores content in `content/` and blueprints in `resources/blueprints/`.
- Laravel resolves the requested Statamic entry in `routes/web.php`.
- The Statamic entry provides the template name used as the Inertia component name.
- Inertia resolves components from `resources/components/`.
- `resources/views/app.blade.php` is the HTML shell containing `@inertia` and `@inertiaHead`.
- Svelte renders the page in the browser and hydrates server-rendered markup when SSR is enabled.

## Components and templates

Template names are used exactly as stored. No automatic PascalCase conversion is performed.

An entry with:

```yaml
template: Pages/Home
```

resolves to:

```text
resources/components/Pages/Home.svelte
```

The same resolution is used by both entry points:

- `resources/js/app.js` for the browser
- `resources/js/ssr.js` for SSR

When adding a template, the template value in the entry and the corresponding `.svelte` file must use the same path and casing.

## Requirements

- PHP 8.3 or later
- Composer
- Node.js and npm
- a configured Statamic installation

## Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
npm install
npm run build
```

Start the application with:

```bash
php artisan serve
```

## Development

For Vite HMR and regular frontend development:

```bash
npm run dev
```

Server-side rendering requires the Inertia SSR process as well. Build the SSR bundle first:

```bash
npm run build
php artisan inertia:start-ssr
```

The SSR server must be running during development and production whenever server-rendered HTML is required. With the current setup, run `npm run build` and restart the SSR process after changing Svelte components.

Check the SSR server status with:

```bash
php artisan inertia:check-ssr
```

## Production

```bash
npm run build
php artisan inertia:start-ssr
```

A PHP web server is also required, such as Nginx or Apache. For local testing:

```bash
php artisan serve
```

In production, keep both the PHP application and the Inertia SSR process running with Supervisor, systemd, or a similar process manager.

## Tailwind CSS

Tailwind is imported in `resources/css/site.css`:

```css
@import "tailwindcss";
```

The stylesheet is imported from `resources/js/app.js`. Tailwind classes can be used directly in Svelte components.

## Statamic Live Preview

The frontend route uses the `statamic.web` middleware. This allows Statamic Live Preview tokens to be processed and preview values to be applied before the entry is resolved.

The Live Preview debounce can be configured in `.env`:

```env
STATAMIC_LIVE_PREVIEW_DEBOUNCE_MS=150
```

Set the value to `0` for immediate updates, then clear the configuration cache:

```bash
php artisan config:clear
```

## Augmented Statamic data

The route passes augmented entry data to Svelte. Statamic therefore prepares field types such as Markdown, Bard, assets, and relationships:

```php
'entry' => $entry->toAugmentedArray(),
```

Individual values can also be augmented:

```php
'content' => $entry->augmentedValue('content'),
```

Rendered HTML content is output in Svelte with `{@html ...}`. Only use this for trusted, Statamic-rendered HTML content.

## Statamic Control Panel

The template selector in the Control Panel scans the Laravel view paths from `config/view.php`. This project includes `resources/components` as a view path. Therefore `resources/components/Pages/Home.svelte` is offered as `Pages/Home`.

After changing view paths, clear and rebuild the Statamic cache:

```bash
php artisan config:clear
php artisan stache:clear
php artisan stache:warm
```

## Important files

```text
content/                         Statamic content
resources/blueprints/             Statamic blueprints
resources/components/             Svelte components
resources/js/app.js               Browser entry point and hydration
resources/js/ssr.js               Inertia SSR entry point
resources/css/site.css            Tailwind entry point
resources/views/app.blade.php     Inertia HTML shell
routes/web.php                    Statamic entry to Inertia component mapping
vite.config.js                    Vite, Svelte, Tailwind, and SSR configuration
```

## Further documentation

- [Statamic documentation](https://statamic.dev/)
- [Inertia.js documentation](https://inertiajs.com/)
- [Inertia Svelte adapter](https://inertiajs.com/client-side-setup)
- [Svelte documentation](https://svelte.dev/docs)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
