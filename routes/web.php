<?php

use Illuminate\Support\Facades\Route;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Support\Str;

// Als Middleware, damit Statamic initialisiert ist
Route::middleware(['statamic.web'])->group(function () {

    Route::any('{url?}', function ($url = '') {
        // Bereinige die URI: Leere URLs werden zu '/', ansonsten wird ein führender Slash erzwungen
        $uri = empty($url) ? '/' : '/' . ltrim($url, '/');

        // Ermittle die aktuelle Seite (Sprachbaum)
        $currentSite = Site::current() ? Site::current()->handle() : 'default';

        /** @var \Statamic\Structures\Page|\Statamic\Entries\Entry $page */
        $page = Entry::findByUri($uri, $currentSite);

        // 1. Absicherung: Wenn kein Eintrag existiert, wirf einen 404-Fehler
        if (!$page) {
            abort(404);
        }

        /** @var \Statamic\Entries\Entry $entry */
        $entry = method_exists($page, 'entry')
            ? ($page->entry() ?? $page)
            : $page;

        // Das Template bestimmt die Darstellung: z. B. "home" -> Home.svelte.
        $component = $entry->template() ?: 'Page';

        return inertia($component, [
            'title' => $entry->augmentedValue('title'),
            'content' => $entry->augmentedValue('content'),
            'entry' => $entry->toAugmentedArray(),
        ]);
    })->where('url', '^(?!(cp|api|\!|oauth)).*$');

});
