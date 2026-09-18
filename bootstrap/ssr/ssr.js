import { clsx } from "clsx";
import * as devalue from "devalue";
import { UseFormUtils, buildSSRBody, config, createHeadManager, createLayoutPropsStore, exposeInterceptors, getInitialPageFromDOM, http, isPropsObject, isPropsObjectOrCallback, normalizeLayouts, resolveServerHead, router, setupProgress } from "@inertiajs/core";
import { cloneDeep } from "es-toolkit";
import { get, has, set } from "es-toolkit/compat";
import { createValidator, resolveName, toSimpleValidationErrors } from "laravel-precognition";
import server_default from "@inertiajs/core/server";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/svelte/src/constants.js
var UNINITIALIZED = Symbol("uninitialized");
//#endregion
//#region node_modules/svelte/src/escaping.js
var ATTR_REGEX = /[&"<]/g;
var CONTENT_REGEX = /[&<]/g;
/**
* @template V
* @param {V} value
* @param {boolean} [is_attr]
*/
function escape_html(value, is_attr) {
	const str = String(value ?? "");
	const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
	pattern.lastIndex = 0;
	let escaped = "";
	let last = 0;
	while (pattern.test(str)) {
		const i = pattern.lastIndex - 1;
		const ch = str[i];
		escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === "\"" ? "&quot;" : "&lt;");
		last = i + 1;
	}
	return escaped + str.substring(last);
}
//#endregion
//#region node_modules/svelte/src/internal/shared/utils.js
var is_array = Array.isArray;
Array.prototype.indexOf;
Array.prototype.includes;
Array.from;
var object_prototype = Object.prototype;
Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
var has_own_property = Object.prototype.hasOwnProperty;
var noop = () => {};
/**
* TODO replace with Promise.withResolvers once supported widely enough
* @template [T=void]
*/
function deferred() {
	/** @type {(value: T) => void} */
	var resolve;
	/** @type {(reason: any) => void} */
	var reject;
	return {
		promise: new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		}),
		resolve,
		reject
	};
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
/**
* `<div translate={false}>` should be rendered as `<div translate="no">` and _not_
* `<div translate="false">`, which is equivalent to `<div translate="yes">`. There
* may be other odd cases that need to be added to this list in future
* @type {Record<string, Map<any, string>>}
*/
var replacements = { translate: /* @__PURE__ */ new Map([[true, "yes"], [false, "no"]]) };
/**
* @template V
* @param {string} name
* @param {V} value
* @param {boolean} [is_boolean]
* @returns {string}
*/
function attr(name, value, is_boolean = false) {
	if (name === "hidden" && value !== "until-found") is_boolean = true;
	if (value == null || is_boolean && !value && value !== "") return "";
	const normalized = has_own_property.call(replacements, name) && replacements[name].get(value) || value;
	return ` ${name}${is_boolean ? `=""` : `="${escape_html(normalized, true)}"`}`;
}
/**
* Small wrapper around clsx to preserve Svelte's (weird) handling of falsy values.
* TODO Svelte 6 revisit this, and likely turn all falsy values into the empty string (what clsx also does)
* @param  {any} value
*/
function clsx$1(value) {
	if (typeof value === "object") return clsx(value);
	else return value ?? "";
}
var whitespace = [..." 	\n\r\f\xA0\v﻿"];
/**
* @param {any} value
* @param {string | null} [hash]
* @param {Record<string, boolean>} [directives]
* @returns {string | null}
*/
function to_class(value, hash, directives) {
	var classname = value == null ? "" : "" + value;
	if (hash) classname = classname ? classname + " " + hash : hash;
	if (directives) {
		for (var key of Object.keys(directives)) if (directives[key]) classname = classname ? classname + " " + key : key;
		else if (classname.length) {
			var len = key.length;
			var a = 0;
			while ((a = classname.indexOf(key, a)) >= 0) {
				var b = a + len;
				if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
				else a = b;
			}
		}
	}
	return classname === "" ? null : classname;
}
/**
*
* @param {Record<string,any>} styles
* @param {boolean} important
*/
function append_styles(styles, important = false) {
	var separator = important ? " !important;" : ";";
	var css = "";
	for (var key of Object.keys(styles)) {
		var value = styles[key];
		if (value != null && value !== "") css += " " + key + ": " + value + separator;
	}
	return css;
}
/**
* @param {string} name
* @returns {string}
*/
function to_css_name(name) {
	if (name[0] !== "-" || name[1] !== "-") return name.toLowerCase();
	return name;
}
/**
* @param {any} value
* @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [styles]
* @returns {string | null}
*/
function to_style(value, styles) {
	if (styles) {
		var new_style = "";
		/** @type {Record<string,any> | undefined} */
		var normal_styles;
		/** @type {Record<string,any> | undefined} */
		var important_styles;
		if (Array.isArray(styles)) {
			normal_styles = styles[0];
			important_styles = styles[1];
		} else normal_styles = styles;
		if (value) {
			value = String(value).replaceAll(/\/\*.*?\*\//g, "").trim();
			/** @type {boolean | '"' | "'"} */
			var in_str = false;
			var in_apo = 0;
			var in_comment = false;
			var reserved_names = [];
			if (normal_styles) reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
			if (important_styles) reserved_names.push(...Object.keys(important_styles).map(to_css_name));
			var start_index = 0;
			var name_index = -1;
			const len = value.length;
			for (var i = 0; i < len; i++) {
				var c = value[i];
				if (in_comment) {
					if (c === "/" && value[i - 1] === "*") in_comment = false;
				} else if (in_str) {
					if (in_str === c) in_str = false;
				} else if (c === "/" && value[i + 1] === "*") in_comment = true;
				else if (c === "\"" || c === "'") in_str = c;
				else if (c === "(") in_apo++;
				else if (c === ")") in_apo--;
				if (!in_comment && in_str === false && in_apo === 0) {
					if (c === ":" && name_index === -1) name_index = i;
					else if (c === ";" || i === len - 1) {
						if (name_index !== -1) {
							var name = to_css_name(value.substring(start_index, name_index).trim());
							if (!reserved_names.includes(name)) {
								if (c !== ";") i++;
								var property = value.substring(start_index, i).trim();
								new_style += " " + property + ";";
							}
						}
						start_index = i + 1;
						name_index = -1;
					}
				}
			}
		}
		if (normal_styles) new_style += append_styles(normal_styles);
		if (important_styles) new_style += append_styles(important_styles, true);
		new_style = new_style.trim();
		return new_style === "" ? null : new_style;
	}
	return value == null ? null : String(value);
}
//#endregion
//#region node_modules/svelte/src/internal/client/constants.js
var CLEAN = 1024;
var DIRTY = 2048;
var MAYBE_DIRTY = 4096;
/** allow users to ignore aborted signal errors if `reason.name === 'StaleReactionError` */
var STALE_REACTION = new class StaleReactionError extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
//#endregion
//#region node_modules/svelte/src/internal/shared/errors.js
/**
* `%name%(...)` can only be used during component initialisation
* @param {string} name
* @returns {never}
*/
function lifecycle_outside_component(name) {
	throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
}
/**
* Context was not set in the current component or any of its ancestors
* @returns {never}
*/
function missing_context() {
	throw new Error(`https://svelte.dev/e/missing_context`);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
/** True if experimental.async=true */
var async_mode_flag = false;
//#endregion
//#region node_modules/svelte/src/internal/shared/clone.js
/** @import { Snapshot } from './types' */
/**
* In dev, we keep track of which properties could not be cloned. In prod
* we don't bother, but we keep a dummy array around so that the
* signature stays the same
* @type {string[]}
*/
var empty = [];
/**
* @template T
* @param {T} value
* @param {boolean} [skip_warning]
* @param {boolean} [no_tojson]
* @returns {Snapshot<T>}
*/
function snapshot(value, skip_warning = false, no_tojson = false) {
	return clone(value, /* @__PURE__ */ new Map(), "", empty, null, no_tojson);
}
/**
* @template T
* @param {T} value
* @param {Map<T, Snapshot<T>>} cloned
* @param {string} path
* @param {string[]} paths
* @param {null | T} [original] The original value, if `value` was produced from a `toJSON` call
* @param {boolean} [no_tojson]
* @returns {Snapshot<T>}
*/
function clone(value, cloned, path, paths, original = null, no_tojson = false) {
	if (typeof value === "object" && value !== null) {
		var unwrapped = cloned.get(value);
		if (unwrapped !== void 0) return unwrapped;
		if (value instanceof Map) return new Map(value);
		if (value instanceof Set) return new Set(value);
		if (is_array(value)) {
			var copy = Array(value.length);
			cloned.set(value, copy);
			if (original !== null) cloned.set(original, copy);
			for (var i = 0; i < value.length; i += 1) {
				var element = value[i];
				if (i in value) copy[i] = clone(element, cloned, path, paths, null, no_tojson);
			}
			return copy;
		}
		if (get_prototype_of(value) === object_prototype) {
			/** @type {Snapshot<any>} */
			copy = {};
			cloned.set(value, copy);
			if (original !== null) cloned.set(original, copy);
			for (var key of Object.keys(value)) copy[key] = clone(value[key], cloned, path, paths, null, no_tojson);
			return copy;
		}
		if (value instanceof Date) {
			value.getTime();
			return structuredClone(value);
		}
		if (typeof value.toJSON === "function" && !no_tojson) return clone(
			/** @type {T & { toJSON(): any } } */
			value.toJSON(),
			cloned,
			path,
			paths,
			value
		);
	}
	if (value instanceof EventTarget) return value;
	try {
		return structuredClone(value);
	} catch (e) {
		return value;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/shared/context.js
/**
* @template T
* @param {(key: object) => T} get_context
* @param {(key: object, context: T) => T} set_context
* @param {(key: object) => boolean} has_context
* @returns {[() => T, (context: T) => T, () => boolean]}
*/
function create_context(get_context, set_context, has_context) {
	const key = {};
	return [
		() => {
			if (!has_context(key)) missing_context();
			return get_context(key);
		},
		(context) => set_context(key, context),
		() => has_context(key)
	];
}
/**
* @typedef {{ p: Context | null, c: Map<unknown, unknown> | null }} Context
*/
/**
* @param {Context} context
* @returns {Map<unknown, unknown> | null}
*/
function get_parent_context(context) {
	let parent = context.p;
	while (parent !== null && parent.c === null) parent = parent.p;
	return parent?.c ?? null;
}
/**
* @param {Context | null} context
* @param {string} name
* @returns {Map<unknown, unknown>}
*/
function get_or_init_context_map(context, name) {
	if (context === null) lifecycle_outside_component(name);
	return context.c ??= new Map(get_parent_context(context) || void 0);
}
~(DIRTY | MAYBE_DIRTY | CLEAN);
//#endregion
//#region node_modules/svelte/src/internal/server/hydration.js
var BLOCK_OPEN = `<!--[-->`;
var BLOCK_CLOSE = `<!--]-->`;
var EMPTY_COMMENT = `<!---->`;
/**
* Attributes that are boolean, i.e. they are present or not present.
*/
var DOM_BOOLEAN_ATTRIBUTES = [
	"allowfullscreen",
	"async",
	"autofocus",
	"autoplay",
	"checked",
	"controls",
	"default",
	"disabled",
	"formnovalidate",
	"indeterminate",
	"inert",
	"ismap",
	"loop",
	"multiple",
	"muted",
	"nomodule",
	"novalidate",
	"open",
	"playsinline",
	"readonly",
	"required",
	"reversed",
	"seamless",
	"selected",
	"webkitdirectory",
	"defer",
	"disablepictureinpicture",
	"disableremoteplayback"
];
/**
* Returns `true` if `name` is a boolean attribute
* @param {string} name
*/
function is_boolean_attribute(name) {
	return DOM_BOOLEAN_ATTRIBUTES.includes(name);
}
[...DOM_BOOLEAN_ATTRIBUTES];
//#endregion
//#region node_modules/svelte/src/internal/server/context.js
/** @import { SSRContext } from '#server' */
/** @type {SSRContext | null} */
var ssr_context = null;
/** @param {SSRContext | null} v */
function set_ssr_context(v) {
	ssr_context = v;
}
/**
* @template T
* @returns {[() => T, (context: T) => T, () => boolean]}
* @since 5.40.0
*/
function createContext() {
	return create_context(getContext, setContext, hasContext);
}
/**
* @template T
* @param {any} key
* @returns {T}
*/
function getContext(key) {
	return get_or_init_context_map(ssr_context, "getContext").get(key);
}
/**
* @template T
* @param {any} key
* @param {T} context
* @returns {T}
*/
function setContext(key, context) {
	get_or_init_context_map(ssr_context, "setContext").set(key, context);
	return context;
}
/**
* @param {any} key
* @returns {boolean}
*/
function hasContext(key) {
	return get_or_init_context_map(ssr_context, "hasContext").has(key);
}
/**
* @param {Function} [fn]
*/
function push(fn) {
	ssr_context = {
		p: ssr_context,
		c: null,
		r: null
	};
}
function pop() {
	ssr_context = ssr_context.p;
}
//#endregion
//#region node_modules/svelte/src/internal/server/errors.js
/**
* The node API `AsyncLocalStorage` is not available, but is required to use async server rendering.
* @returns {never}
*/
function async_local_storage_unavailable() {
	const error = /* @__PURE__ */ new Error(`async_local_storage_unavailable\nThe node API \`AsyncLocalStorage\` is not available, but is required to use async server rendering.\nhttps://svelte.dev/e/async_local_storage_unavailable`);
	error.name = "Svelte error";
	throw error;
}
/**
* Encountered asynchronous work while rendering synchronously.
* @returns {never}
*/
function await_invalid() {
	const error = /* @__PURE__ */ new Error(`await_invalid\nEncountered asynchronous work while rendering synchronously.\nhttps://svelte.dev/e/await_invalid`);
	error.name = "Svelte error";
	throw error;
}
/**
* The `html` property of server render results has been deprecated. Use `body` instead.
* @returns {never}
*/
function html_deprecated() {
	const error = /* @__PURE__ */ new Error(`html_deprecated\nThe \`html\` property of server render results has been deprecated. Use \`body\` instead.\nhttps://svelte.dev/e/html_deprecated`);
	error.name = "Svelte error";
	throw error;
}
/**
* `csp.nonce` was set while `csp.hash` was `true`. These options cannot be used simultaneously.
* @returns {never}
*/
function invalid_csp() {
	const error = /* @__PURE__ */ new Error(`invalid_csp\n\`csp.nonce\` was set while \`csp.hash\` was \`true\`. These options cannot be used simultaneously.\nhttps://svelte.dev/e/invalid_csp`);
	error.name = "Svelte error";
	throw error;
}
/**
* The `idPrefix` option cannot include `--`.
* @returns {never}
*/
function invalid_id_prefix() {
	const error = /* @__PURE__ */ new Error(`invalid_id_prefix\nThe \`idPrefix\` option cannot include \`--\`.\nhttps://svelte.dev/e/invalid_id_prefix`);
	error.name = "Svelte error";
	throw error;
}
/**
* `%name%(...)` is not available on the server
* @param {string} name
* @returns {never}
*/
function lifecycle_function_unavailable(name) {
	const error = /* @__PURE__ */ new Error(`lifecycle_function_unavailable\n\`${name}(...)\` is not available on the server\nhttps://svelte.dev/e/lifecycle_function_unavailable`);
	error.name = "Svelte error";
	throw error;
}
/**
* Could not resolve `render` context.
* @returns {never}
*/
function server_context_required() {
	const error = /* @__PURE__ */ new Error(`server_context_required\nCould not resolve \`render\` context.\nhttps://svelte.dev/e/server_context_required`);
	error.name = "Svelte error";
	throw error;
}
/**
* A `hydratable` value with key `%key%` was created, but at least part of it was not used during the render.
* 
* The `hydratable` was initialized in:
* %stack%
* @param {string} key
* @param {string} stack
*/
function unresolved_hydratable(key, stack) {
	console.warn(`https://svelte.dev/e/unresolved_hydratable`);
}
//#endregion
//#region node_modules/svelte/src/internal/server/render-context.js
/** @import { AsyncLocalStorage } from 'node:async_hooks' */
/** @import { RenderContext } from '#server' */
/** @type {Promise<void> | null} */
var current_render = null;
/** @type {RenderContext | null} */
var context = null;
/** @returns {RenderContext} */
function get_render_context() {
	const store = context ?? als?.getStore();
	if (!store) server_context_required();
	return store;
}
/**
* @template T
* @param {() => Promise<T>} fn
* @returns {Promise<T>}
*/
async function with_render_context(fn) {
	context = { hydratable: {
		lookup: /* @__PURE__ */ new Map(),
		comparisons: [],
		unresolved_promises: /* @__PURE__ */ new Map()
	} };
	if (in_webcontainer()) {
		const { promise, resolve } = deferred();
		const previous_render = current_render;
		current_render = promise;
		await previous_render;
		return fn().finally(resolve);
	}
	try {
		if (als === null) async_local_storage_unavailable();
		return als.run(context, fn);
	} finally {
		context = null;
	}
}
/** @type {AsyncLocalStorage<RenderContext | null> | null} */
var als = null;
/** @type {Promise<void> | null} */
var als_import = null;
/**
*
* @returns {Promise<void>}
*/
function init_render_context() {
	als_import ??= import("node:async_hooks").then((hooks) => {
		als = new hooks.AsyncLocalStorage();
	}).then(noop, noop);
	return als_import;
}
function in_webcontainer() {
	return !!globalThis.process?.versions?.webcontainer;
}
//#endregion
//#region node_modules/svelte/src/internal/server/crypto.js
var text_encoder;
var crypto;
/** @param {string} module_name */
var obfuscated_import = (module_name) => import(
	/* @vite-ignore */
	module_name
);
/** @param {string} data */
async function sha256(data) {
	text_encoder ??= new TextEncoder();
	crypto ??= globalThis.crypto?.subtle?.digest ? globalThis.crypto : (await obfuscated_import("node:crypto")).webcrypto;
	return base64_encode(await crypto.subtle.digest("SHA-256", text_encoder.encode(data)));
}
/**
* @param {Uint8Array} bytes
* @returns {string}
*/
function base64_encode(bytes) {
	if (globalThis.Buffer) return globalThis.Buffer.from(bytes).toString("base64");
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return btoa(binary);
}
//#endregion
//#region node_modules/svelte/src/internal/server/renderer.js
/** @import { Component } from 'svelte' */
/** @import { HydratableContext, SSRContext } from './types.js' */
/** @import { Csp, RenderOutput, SyncRenderOutput, Sha256Source } from '../../server/public.js' */
/** @import { MaybePromise } from '#shared' */
/** @typedef {'head' | 'body'} RendererType */
/** @typedef {{ [key in RendererType]: string }} AccumulatedContent */
/**
* @typedef {string | Renderer} RendererItem
*/
/**
* Renderers are basically a tree of `string | Renderer`s, where each `Renderer` in the tree represents
* work that may or may not have completed. A renderer can be {@link collect}ed to aggregate the
* content from itself and all of its children, but this will throw if any of the children are
* performing asynchronous work. To asynchronously collect a renderer, just `await` it.
*
* The `string` values within a renderer are always associated with the {@link type} of that renderer. To switch types,
* call {@link child} with a different `type` argument.
*/
var Renderer = class Renderer {
	/**
	* The contents of the renderer.
	* @type {RendererItem[]}
	*/
	#out = [];
	/**
	* Any `onDestroy` callbacks registered during execution of this renderer.
	* @type {(() => void)[] | undefined}
	*/
	#on_destroy = void 0;
	/**
	* Whether this renderer is a component body.
	* @type {boolean}
	*/
	#is_component_body = false;
	/**
	* If set, this renderer is an error boundary. When async collection
	* of the children fails, the failed snippet is rendered instead.
	* @type {{
	* 	failed: (renderer: Renderer, error: unknown, reset: () => void) => void;
	* 	transformError: (error: unknown) => unknown;
	* 	context: SSRContext | null;
	* } | null}
	*/
	#boundary = null;
	/**
	* The type of string content that this renderer is accumulating.
	* @type {RendererType}
	*/
	type;
	/** @type {Renderer | undefined} */
	#parent;
	/**
	* Asynchronous work associated with this renderer
	* @type {Promise<void> | undefined}
	*/
	promise = void 0;
	/**
	* State which is associated with the content tree as a whole.
	* It will be re-exposed, uncopied, on all children.
	* @type {SSRState}
	* @readonly
	*/
	global;
	/**
	* State that is local to the branch it is declared in.
	* It will be shallow-copied to all children.
	*
	* @type {{ select_value: any, multiple: boolean }}
	*/
	local;
	/**
	* @param {SSRState} global
	* @param {Renderer | undefined} [parent]
	*/
	constructor(global, parent) {
		this.#parent = parent;
		this.global = global;
		this.local = parent ? { ...parent.local } : {
			select_value: void 0,
			multiple: false
		};
		this.type = parent ? parent.type : "body";
	}
	/**
	* @param {(renderer: Renderer) => void} fn
	*/
	head(fn) {
		const head = new Renderer(this.global, this);
		head.type = "head";
		this.#out.push(head);
		head.child(fn);
	}
	/**
	* @param {Array<Promise<void>>} blockers
	* @param {(renderer: Renderer) => void} fn
	*/
	async_block(blockers, fn) {
		this.#out.push(BLOCK_OPEN);
		this.async(blockers, fn);
		this.#out.push(BLOCK_CLOSE);
	}
	/**
	* @param {Array<Promise<void>>} blockers
	* @param {(renderer: Renderer) => void} fn
	*/
	async(blockers, fn) {
		let callback = fn;
		if (blockers.length > 0) {
			const context = ssr_context;
			callback = (renderer) => {
				return Promise.all(blockers).then(() => {
					const previous_context = ssr_context;
					try {
						set_ssr_context(context);
						return fn(renderer);
					} finally {
						set_ssr_context(previous_context);
					}
				});
			};
		}
		this.child(callback);
	}
	/**
	* @param {Array<() => void>} thunks
	*/
	run(thunks) {
		const context = ssr_context;
		let promise = Promise.resolve(thunks[0]());
		const promises = [promise];
		for (const fn of thunks.slice(1)) {
			promise = promise.then(() => {
				const previous_context = ssr_context;
				set_ssr_context(context);
				try {
					return fn();
				} finally {
					set_ssr_context(previous_context);
				}
			});
			promises.push(promise);
		}
		promise.catch(noop);
		this.promise = this.global.track(promise);
		return promises;
	}
	/**
	* @param {(renderer: Renderer) => MaybePromise<void>} fn
	*/
	child_block(fn) {
		this.#out.push(BLOCK_OPEN);
		this.child(fn);
		this.#out.push(BLOCK_CLOSE);
	}
	/**
	* Create a child renderer. The child renderer inherits the state from the parent,
	* but has its own content.
	* @param {(renderer: Renderer) => MaybePromise<void>} fn
	*/
	child(fn) {
		const child = new Renderer(this.global, this);
		this.#out.push(child);
		const parent = ssr_context;
		set_ssr_context({
			...ssr_context,
			p: parent,
			c: null,
			r: child
		});
		const result = fn(child);
		set_ssr_context(parent);
		if (result instanceof Promise) {
			result.catch(noop);
			result.finally(() => set_ssr_context(null)).catch(noop);
			if (child.global.mode === "sync") await_invalid();
			child.promise = child.global.track(result);
		}
		return child;
	}
	/**
	* Render children inside an error boundary. If the children throw and the API-level
	* `transformError` transform handles the error (doesn't re-throw), the `failed` snippet is
	* rendered instead. Otherwise the error propagates.
	*
	* @param {{ failed?: (renderer: Renderer, error: unknown, reset: () => void) => void }} props
	* @param {(renderer: Renderer) => MaybePromise<void>} children_fn
	*/
	boundary(props, children_fn) {
		const child = new Renderer(this.global, this);
		this.#out.push(child);
		const parent_context = ssr_context;
		if (props.failed) child.#boundary = {
			failed: props.failed,
			transformError: this.global.transformError,
			context: parent_context
		};
		set_ssr_context({
			...ssr_context,
			p: parent_context,
			c: null,
			r: child
		});
		try {
			const result = children_fn(child);
			set_ssr_context(parent_context);
			if (result instanceof Promise) {
				if (child.global.mode === "sync") await_invalid();
				result.catch(noop);
				child.promise = child.global.track(result);
			}
		} catch (error) {
			set_ssr_context(parent_context);
			const failed_snippet = props.failed;
			if (!failed_snippet) throw error;
			const result = this.global.transformError(error);
			child.#out.length = 0;
			child.#boundary = null;
			if (result instanceof Promise) {
				if (this.global.mode === "sync") await_invalid();
				child.promise = child.global.track(
					/** @type {Promise<unknown>} */
					result.then((transformed) => {
						set_ssr_context(parent_context);
						child.#out.push(Renderer.#serialize_failed_boundary(transformed));
						failed_snippet(child, transformed, noop);
						child.#out.push(BLOCK_CLOSE);
					})
				);
				child.promise.catch(noop);
			} else {
				child.#out.push(Renderer.#serialize_failed_boundary(result));
				failed_snippet(child, result, noop);
				child.#out.push(BLOCK_CLOSE);
			}
		}
	}
	/**
	* Create a component renderer. The component renderer inherits the state from the parent,
	* but has its own content. It is treated as an ordering boundary for ondestroy callbacks.
	* @param {(renderer: Renderer) => MaybePromise<void>} fn
	* @param {Function} [component_fn]
	* @returns {void}
	*/
	component(fn, component_fn) {
		push(component_fn);
		this.child((renderer) => {
			renderer.#is_component_body = true;
			return fn(renderer);
		});
		pop();
	}
	/**
	* @param {Record<string, any>} attrs
	* @param {(renderer: Renderer) => void} fn
	* @param {string | undefined} [css_hash]
	* @param {Record<string, boolean> | undefined} [classes]
	* @param {Record<string, string> | undefined} [styles]
	* @param {number | undefined} [flags]
	* @param {boolean | undefined} [is_rich]
	* @returns {void}
	*/
	select(attrs, fn, css_hash, classes, styles, flags, is_rich) {
		const { value, defaultValue, ...select_attrs } = attrs;
		if (select_attrs.multiple === "") select_attrs.multiple = true;
		this.push(`<select${attributes(select_attrs, css_hash, classes, styles, flags)}>`);
		this.child((renderer) => {
			renderer.local.select_value = value === void 0 ? defaultValue : value;
			renderer.local.multiple = !!select_attrs.multiple;
			fn(renderer);
		});
		this.push(`${is_rich ? "<!>" : ""}</select>`);
	}
	/**
	* @param {Record<string, any>} attrs
	* @param {string | number | boolean | ((renderer: Renderer) => void)} body
	* @param {string | undefined} [css_hash]
	* @param {Record<string, boolean> | undefined} [classes]
	* @param {Record<string, string> | undefined} [styles]
	* @param {number | undefined} [flags]
	* @param {boolean | undefined} [is_rich]
	*/
	option(attrs, body, css_hash, classes, styles, flags, is_rich) {
		this.#out.push(`<option${attributes(attrs, css_hash, classes, styles, flags)}`);
		/**
		* @param {Renderer} renderer
		* @param {any} value
		* @param {{ head?: string, body: any }} content
		*/
		const close = (renderer, value, { head, body }) => {
			if (has_own_property.call(attrs, "value")) value = attrs.value;
			var select_value = this.local.select_value;
			if (this.local.multiple && is_array(select_value) ? select_value.includes(value) : value === select_value) renderer.#out.push(" selected=\"\"");
			renderer.#out.push(`>${body}${is_rich ? "<!>" : ""}</option>`);
			if (head) renderer.head((child) => child.push(head));
		};
		if (typeof body === "function") this.child((renderer) => {
			const r = new Renderer(this.global, this);
			body(r);
			if (this.global.mode === "async") return r.#collect_content_async().then((content) => {
				close(renderer, content.body.replaceAll("<!---->", ""), content);
			});
			else {
				const content = r.#collect_content();
				close(renderer, content.body.replaceAll("<!---->", ""), content);
			}
		});
		else close(this, body, { body: escape_html(body) });
	}
	/**
	* @param {(renderer: Renderer) => void} fn
	*/
	title(fn) {
		const path = this.get_path();
		/** @param {string} head */
		const close = (head) => {
			this.global.set_title(head, path);
		};
		this.child((renderer) => {
			const r = new Renderer(renderer.global, renderer);
			fn(r);
			if (renderer.global.mode === "async") return r.#collect_content_async().then((content) => {
				close(content.head);
			});
			else {
				const content = r.#collect_content();
				close(content.head);
			}
		});
	}
	/**
	* @param {string | (() => Promise<string>)} content
	*/
	push(content) {
		if (typeof content === "function") this.child(async (renderer) => renderer.push(await content()));
		else this.#out.push(content);
	}
	/**
	* @param {() => void} fn
	*/
	on_destroy(fn) {
		(this.#on_destroy ??= []).push(fn);
	}
	/**
	* @returns {number[]}
	*/
	get_path() {
		return this.#parent ? [...this.#parent.get_path(), this.#parent.#out.indexOf(this)] : [];
	}
	/**
	* @deprecated this is needed for legacy component bindings
	*/
	copy() {
		const copy = new Renderer(this.global, this.#parent);
		copy.type = this.type;
		copy.#out = this.#out.map((item) => item instanceof Renderer ? item.copy() : item);
		copy.promise = this.promise;
		return copy;
	}
	/**
	* @param {Renderer} other
	* @deprecated this is needed for legacy component bindings
	*/
	subsume(other) {
		if (this.global.mode !== other.global.mode) throw new Error("invariant: A renderer cannot switch modes. If you're seeing this, there's a compiler bug. File an issue!");
		this.local = other.local;
		this.#out = other.#out.map((item, i) => {
			const current = this.#out[i];
			if (current instanceof Renderer && item instanceof Renderer) {
				current.subsume(item);
				return current;
			}
			return item;
		});
		this.promise = other.promise;
		this.type = other.type;
	}
	get length() {
		return this.#out.length;
	}
	/**
	* Creates the hydration comment that marks the start of a failed boundary.
	* The error is JSON-serialized and embedded inside an HTML comment for the client
	* to parse during hydration. The JSON is escaped to prevent `-->` or `<!--` sequences
	* from breaking out of the comment (XSS). Uses unicode escapes which `JSON.parse()`
	* handles transparently.
	* @param {unknown} error
	* @returns {string}
	*/
	static #serialize_failed_boundary(error) {
		return `<!--[?${JSON.stringify(error).replace(/>/g, "\\u003e").replace(/</g, "\\u003c")}-->`;
	}
	/**
	* Only available on the server and when compiling with the `server` option.
	* Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
	* @template {Record<string, any>} Props
	* @param {Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} [options]
	* @returns {RenderOutput}
	*/
	static render(component, options = {}) {
		/** @type {AccumulatedContent | undefined} */
		let sync;
		/** @type {Promise<AccumulatedContent & { hashes: { script: Sha256Source[] } }> | undefined} */
		let async;
		const result = {};
		Object.defineProperties(result, {
			html: { get: () => {
				return (sync ??= Renderer.#render(component, options)).body;
			} },
			head: { get: () => {
				return (sync ??= Renderer.#render(component, options)).head;
			} },
			body: { get: () => {
				return (sync ??= Renderer.#render(component, options)).body;
			} },
			hashes: { value: { script: "" } },
			then: { value: 
			/**
			* this is not type-safe, but honestly it's the best I can do right now, and it's a straightforward function.
			*
			* @template TResult1
			* @template [TResult2=never]
			* @param { (value: SyncRenderOutput) => TResult1 } onfulfilled
			* @param { (reason: unknown) => TResult2 } onrejected
			*/
			(onfulfilled, onrejected) => {
				if (!async_mode_flag) {
					const result = sync ??= Renderer.#render(component, options);
					const user_result = onfulfilled({
						head: result.head,
						body: result.body,
						html: result.body,
						hashes: { script: [] }
					});
					return Promise.resolve(user_result);
				}
				async ??= init_render_context().then(() => with_render_context(() => Renderer.#render_async(component, options)));
				return async.then((result) => {
					Object.defineProperty(result, "html", { get: () => {
						html_deprecated();
					} });
					return onfulfilled(result);
				}, onrejected);
			} }
		});
		return result;
	}
	/**
	* Collect all of the `onDestroy` callbacks registered during rendering. In an async context, this is only safe to call
	* after awaiting `collect_async`.
	*
	* Child renderers are "porous" and don't affect execution order, but component body renderers
	* create ordering boundaries. Within a renderer, callbacks run in order until hitting a component boundary.
	* @returns {Iterable<() => void>}
	*/
	*#collect_on_destroy() {
		for (const component of this.#traverse_components()) yield* component.#collect_ondestroy();
	}
	/**
	* Performs a depth-first search of renderers, yielding the deepest components first, then additional components as we backtrack up the tree.
	* @returns {Iterable<Renderer>}
	*/
	*#traverse_components() {
		for (const child of this.#out) if (typeof child !== "string") yield* child.#traverse_components();
		if (this.#is_component_body) yield this;
	}
	/**
	* @returns {Iterable<() => void>}
	*/
	*#collect_ondestroy() {
		if (this.#on_destroy) for (const fn of this.#on_destroy) yield fn;
		for (const child of this.#out) if (child instanceof Renderer && !child.#is_component_body) yield* child.#collect_ondestroy();
	}
	/**
	* Runs every `onDestroy` callback in this renderer tree. On a failed render,
	* cleanup errors are suppressed so they do not mask the render error.
	* @param {boolean} suppress_errors
	*/
	#run_on_destroy(suppress_errors) {
		let first_error;
		let has_error = false;
		for (const cleanup of this.#collect_on_destroy()) try {
			cleanup();
		} catch (error) {
			if (!suppress_errors && !has_error) {
				first_error = error;
				has_error = true;
			}
		}
		if (has_error) throw first_error;
	}
	/**
	* @param {'sync' | 'async'} mode
	* @param {{ idPrefix?: string; csp?: Csp; transformError?: (error: unknown) => unknown }} options
	* @returns {Renderer}
	*/
	static #create(mode, options) {
		if (options.idPrefix?.includes("--")) invalid_id_prefix();
		return new Renderer(new SSRState(mode, options.idPrefix ? options.idPrefix + "-" : "", options.csp, options.transformError));
	}
	/**
	* Render a component. Throws if any of the children are performing asynchronous work.
	*
	* @template {Record<string, any>} Props
	* @param {Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string }} options
	* @returns {AccumulatedContent}
	*/
	static #render(component, options) {
		var previous_context = ssr_context;
		const renderer = Renderer.#create("sync", options);
		/** @type {AccumulatedContent | undefined} */
		let result;
		let render_error;
		let failed = false;
		try {
			try {
				Renderer.#open_render(renderer, component, options);
				result = Renderer.#close_render(renderer.#collect_content(), renderer);
			} catch (error) {
				render_error = error;
				failed = true;
			}
			renderer.#run_on_destroy(failed);
			if (failed) throw render_error;
			return result;
		} finally {
			renderer.global.abort();
			set_ssr_context(previous_context);
		}
	}
	/**
	* Render a component.
	*
	* @template {Record<string, any>} Props
	* @param {Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} options
	* @returns {Promise<AccumulatedContent & { hashes: { script: Sha256Source[] } }>}
	*/
	static async #render_async(component, options) {
		const previous_context = ssr_context;
		const renderer = Renderer.#create("async", options);
		/** @type {(AccumulatedContent & { hashes: { script: Sha256Source[] } }) | undefined} */
		let result;
		let render_error;
		let failed = false;
		try {
			try {
				Renderer.#open_render(renderer, component, options);
				const content = await renderer.#collect_content_async();
				const hydratables = await renderer.#collect_hydratables();
				if (hydratables !== null) content.head = hydratables + content.head;
				result = Renderer.#close_render(content, renderer);
			} catch (error) {
				render_error = error;
				failed = true;
				renderer.global.abort();
				await renderer.global.settle();
			}
			renderer.#run_on_destroy(failed);
			if (failed) throw render_error;
			return result;
		} finally {
			set_ssr_context(previous_context);
			renderer.global.abort();
		}
	}
	/**
	* Collect all of the code from the `out` array and return it as a string, or a promise resolving to a string.
	* @param {AccumulatedContent} content
	* @returns {AccumulatedContent}
	*/
	#collect_content(content = {
		head: "",
		body: ""
	}) {
		for (const item of this.#out) if (typeof item === "string") content[this.type] += item;
		else if (item instanceof Renderer) item.#collect_content(content);
		return content;
	}
	/**
	* Collect all of the code from the `out` array and return it as a string.
	* @param {AccumulatedContent} content
	* @returns {Promise<AccumulatedContent>}
	*/
	async #collect_content_async(content = {
		head: "",
		body: ""
	}) {
		await this.promise;
		for (const item of this.#out) if (typeof item === "string") content[this.type] += item;
		else if (item instanceof Renderer) {
			if (item.#boundary) {
				/** @type {AccumulatedContent} */
				const boundary_content = {
					head: "",
					body: ""
				};
				try {
					await item.#collect_content_async(boundary_content);
					content.head += boundary_content.head;
					content.body += boundary_content.body;
				} catch (error) {
					const { context, failed, transformError } = item.#boundary;
					set_ssr_context(context);
					let promise = transformError(error);
					set_ssr_context(null);
					let transformed = await promise;
					set_ssr_context(context);
					const failed_renderer = new Renderer(item.global, item);
					failed_renderer.type = item.type;
					failed_renderer.#out.push(Renderer.#serialize_failed_boundary(transformed));
					failed(failed_renderer, transformed, noop);
					failed_renderer.#out.push(BLOCK_CLOSE);
					await failed_renderer.#collect_content_async(content);
				}
			} else await item.#collect_content_async(content);
		}
		return content;
	}
	async #collect_hydratables() {
		const ctx = get_render_context().hydratable;
		for (const [_, key] of ctx.unresolved_promises) unresolved_hydratable(key, ctx.lookup.get(key)?.stack ?? "<missing stack trace>");
		for (const comparison of ctx.comparisons) await comparison;
		return await this.#hydratable_block(ctx);
	}
	/**
	* @template {Record<string, any>} Props
	* @param {Renderer} renderer
	* @param {import('svelte').Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp; transformError?: (error: unknown) => unknown }} options
	* @returns {void}
	*/
	static #open_render(renderer, component, options) {
		var previous_context = ssr_context;
		try {
			set_ssr_context({
				p: null,
				c: options.context ?? null,
				r: renderer
			});
			renderer.push(BLOCK_OPEN);
			component(renderer, options.props ?? {});
			renderer.push(BLOCK_CLOSE);
		} finally {
			set_ssr_context(previous_context);
		}
	}
	/**
	* @param {AccumulatedContent} content
	* @param {Renderer} renderer
	* @returns {AccumulatedContent & { hashes: { script: Sha256Source[] } }}
	*/
	static #close_render(content, renderer) {
		let head = content.head + renderer.global.get_title();
		let body = content.body;
		for (const { hash, code } of renderer.global.css) head += `<style id="${hash}">${code}</style>`;
		return {
			head,
			body,
			hashes: { script: renderer.global.csp.script_hashes }
		};
	}
	/**
	* @param {HydratableContext} ctx
	*/
	async #hydratable_block(ctx) {
		if (ctx.lookup.size === 0) return null;
		let entries = [];
		let has_promises = false;
		for (const [k, v] of ctx.lookup) {
			if (v.promises) {
				has_promises = true;
				for (const p of v.promises) await p;
			}
			entries.push(`[${devalue.uneval(k)},${v.serialized}]`);
		}
		let prelude = `const h = (window.__svelte ??= {}).h ??= new Map();`;
		if (has_promises) prelude = `const r = (v) => Promise.resolve(v);
				${prelude}`;
		const body = `
			{
				${prelude}

				for (const [k, v] of [
					${entries.join(",\n					")}
				]) {
					h.set(k, v);
				}
			}
		`;
		let csp_attr = "";
		if (this.global.csp.nonce) csp_attr = ` nonce="${this.global.csp.nonce}"`;
		else if (this.global.csp.hash) {
			const hash = await sha256(body);
			this.global.csp.script_hashes.push(`sha256-${hash}`);
		}
		return `\n\t\t<script${csp_attr}>${body}<\/script>`;
	}
};
var SSRState = class {
	/** @readonly @type {Csp & { script_hashes: Sha256Source[] }} */
	csp;
	/** @readonly @type {'sync' | 'async'} */
	mode;
	/** @readonly @type {() => string} */
	uid;
	/** @readonly @type {Set<{ hash: string; code: string }>} */
	css = /* @__PURE__ */ new Set();
	/** @type {Set<Promise<unknown>>} */
	#pending = /* @__PURE__ */ new Set();
	/** @type {AbortController | null} */
	#controller = null;
	#aborted = false;
	/**
	* `transformError` passed to `render`. Called when an error boundary catches an error.
	* Throws by default if unset in `render`.
	* @type {(error: unknown) => unknown}
	*/
	transformError;
	/** @type {{ path: number[], value: string }} */
	#title = {
		path: [],
		value: ""
	};
	/**
	* @param {'sync' | 'async'} mode
	* @param {string} id_prefix
	* @param {Csp} csp
	* @param {((error: unknown) => unknown) | undefined} [transformError]
	*/
	constructor(mode, id_prefix = "", csp = { hash: false }, transformError) {
		this.mode = mode;
		this.csp = {
			...csp,
			script_hashes: []
		};
		this.transformError = transformError ?? ((error) => {
			throw error;
		});
		let uid = 1;
		this.uid = () => `${id_prefix}s${uid++}`;
	}
	/**
	* @template T
	* @param {Promise<T>} promise
	* @returns {Promise<T>}
	*/
	track(promise) {
		this.#pending.add(promise);
		promise.then(() => this.#pending.delete(promise), () => this.#pending.delete(promise));
		return promise;
	}
	async settle() {
		while (this.#pending.size > 0) await Promise.allSettled([...this.#pending]);
	}
	abort() {
		if (this.#aborted) return;
		this.#aborted = true;
		this.#controller?.abort(STALE_REACTION);
	}
	get_abort_signal() {
		const controller = this.#controller ??= new AbortController();
		if (this.#aborted) controller.abort(STALE_REACTION);
		return controller.signal;
	}
	get_title() {
		return this.#title.value;
	}
	/**
	* Performs a depth-first (lexicographic) comparison using the path. Rejects sets
	* from earlier than or equal to the current value.
	* @param {string} value
	* @param {number[]} path
	*/
	set_title(value, path) {
		const current = this.#title.path;
		let i = 0;
		let l = Math.min(path.length, current.length);
		while (i < l && path[i] === current[i]) i += 1;
		if (path[i] === void 0) return;
		if (current[i] === void 0 || path[i] > current[i]) {
			this.#title.path = path;
			this.#title.value = value;
		}
	}
};
//#endregion
//#region node_modules/svelte/src/internal/server/blocks/html.js
/**
* @param {string} value
*/
function html(value) {
	return "<!---->" + String(value ?? "") + "<!---->";
}
//#endregion
//#region node_modules/svelte/src/internal/server/index.js
var INVALID_ATTR_NAME_CHAR_REGEX = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
/**
* Only available on the server and when compiling with the `server` option.
* Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
* @template {Record<string, any>} Props
* @param {Component<Props> | ComponentType<SvelteComponent<Props>>} component
* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp; transformError?: (error: unknown) => unknown }} [options]
* @returns {RenderOutput}
*/
function render(component, options = {}) {
	if (options.csp?.hash && options.csp.nonce) invalid_csp();
	return Renderer.render(component, options);
}
/**
* @param {string} hash
* @param {Renderer} renderer
* @param {(renderer: Renderer) => Promise<void> | void} fn
* @returns {void}
*/
function head(hash, renderer, fn) {
	renderer.head((renderer) => {
		renderer.push(`<!--${hash}-->`);
		renderer.child(fn);
		renderer.push(EMPTY_COMMENT);
	});
}
/**
* @param {Record<string, unknown>} attrs
* @param {string} [css_hash]
* @param {Record<string, boolean>} [classes]
* @param {Record<string, string>} [styles]
* @param {number} [flags]
* @returns {string}
*/
function attributes(attrs, css_hash, classes, styles, flags = 0) {
	if (styles) attrs.style = to_style(attrs.style, styles);
	if (attrs.class) attrs.class = clsx$1(attrs.class);
	if (css_hash || classes) attrs.class = to_class(attrs.class, css_hash, classes);
	let attr_str = "";
	let name;
	const is_html = (flags & 1) === 0;
	const lowercase = (flags & 2) === 0;
	const is_input = (flags & 4) !== 0;
	for (name of Object.keys(attrs)) {
		if (typeof attrs[name] === "function") continue;
		if (name[0] === "$" && name[1] === "$") continue;
		if (name === "" || INVALID_ATTR_NAME_CHAR_REGEX.test(name)) continue;
		var value = attrs[name];
		var lower = name.toLowerCase();
		if (lowercase) name = lower;
		if (lower.length > 2 && lower.startsWith("on")) continue;
		if (is_input) {
			if (name === "defaultvalue" || name === "defaultchecked") {
				name = name === "defaultvalue" ? "value" : "checked";
				if (attrs[name]) continue;
			}
		}
		attr_str += attr(name, value, is_html && is_boolean_attribute(name));
	}
	return attr_str;
}
/**
* @param {Record<string, unknown>[]} props
* @returns {Record<string, unknown>}
*/
function spread_props(props) {
	/** @type {Record<string, unknown>} */
	const merged_props = {};
	let key;
	for (let i = 0; i < props.length; i++) {
		const obj = props[i];
		if (obj == null) continue;
		for (key of Object.keys(obj)) {
			const desc = Object.getOwnPropertyDescriptor(obj, key);
			if (desc) Object.defineProperty(merged_props, key, desc);
			else merged_props[key] = obj[key];
		}
	}
	return merged_props;
}
/** @param {any} array_like_or_iterator */
function ensure_array_like(array_like_or_iterator) {
	if (array_like_or_iterator) return array_like_or_iterator.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
	return [];
}
/**
* @template V
* @param {() => V} get_value
*/
function once(get_value) {
	let value = UNINITIALIZED;
	return () => {
		if (value === UNINITIALIZED) value = get_value();
		return value;
	};
}
/**
* @template T
* @param {()=>T} fn
* @returns {(new_value?: T) => (T | void)}
*/
function derived(fn) {
	const get_value = ssr_context === null ? fn : once(fn);
	/** @type {T | undefined} */
	let updated_value;
	return function(new_value) {
		if (arguments.length === 0) return updated_value ?? get_value();
		updated_value = new_value;
		return updated_value;
	};
}
//#endregion
//#region node_modules/@inertiajs/svelte/dist/layoutProps.svelte.js
var store = createLayoutPropsStore();
var storeState = {
	shared: {},
	named: {}
};
store.subscribe(() => {
	const snapshot = store.get();
	storeState.shared = snapshot.shared;
	storeState.named = snapshot.named;
});
function resetLayoutProps() {
	store.reset();
	const snapshot = store.get();
	storeState.shared = snapshot.shared;
	storeState.named = snapshot.named;
}
//#endregion
//#region node_modules/@inertiajs/svelte/dist/page.svelte.js
var page = {
	component: "",
	props: {},
	url: "",
	version: null
};
function setPage(newPage) {
	Object.assign(page, newPage);
}
//#endregion
//#region node_modules/@inertiajs/svelte/dist/components/Render.svelte
var h = (component, propsOrChildren, childrenOrKey, key = null) => {
	const hasProps = typeof propsOrChildren === "object" && propsOrChildren !== null && !Array.isArray(propsOrChildren);
	return {
		component,
		key: hasProps ? key : typeof childrenOrKey === "number" ? childrenOrKey : null,
		props: hasProps ? propsOrChildren : {},
		children: hasProps ? Array.isArray(childrenOrKey) ? childrenOrKey : childrenOrKey !== null ? [childrenOrKey] : [] : Array.isArray(propsOrChildren) ? propsOrChildren : propsOrChildren !== null ? [propsOrChildren] : []
	};
};
function Render_1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { component, props = {}, children = [], key = null } = $$props;
		if (component) {
			$$renderer.push(`<!--[0--><!---->`);
			if (children.length > 0) {
				$$renderer.push("<!--[0-->");
				const SvelteComponent = component;
				if (SvelteComponent) {
					$$renderer.push("<!--[-->");
					SvelteComponent($$renderer, spread_props([props, {
						children: ($$renderer) => {
							$$renderer.push(`<!--[-->`);
							const each_array = ensure_array_like(children);
							for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
								let child = each_array[$$index];
								Render_1($$renderer, spread_props([child]));
							}
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					}]));
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			} else {
				$$renderer.push("<!--[-1-->");
				const SvelteComponent_1 = component;
				if (SvelteComponent_1) {
					$$renderer.push("<!--[-->");
					SvelteComponent_1($$renderer, spread_props([props]));
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			}
			$$renderer.push(`<!--]-->`);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region node_modules/@inertiajs/svelte/dist/components/App.svelte
function App($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { initialComponent, initialPage, resolveComponent, defaultLayout } = $$props;
		let component = initialComponent;
		let key = null;
		let page = {
			...initialPage,
			flash: initialPage.flash ?? {}
		};
		let renderProps = derived(() => resolveRenderProps(component, page, key));
		setPage(page);
		const isServer = typeof window === "undefined";
		if (!isServer) router.init({
			initialPage,
			resolveComponent,
			swapComponent: async (args) => {
				setPage(args.page);
				component = args.component;
				page = args.page;
				key = args.preserveState ? key : Date.now();
				if (!args.preserveState) resetLayoutProps();
			},
			onFlash: (flash) => {
				page = {
					...page,
					flash
				};
			}
		});
		function isComponent(value) {
			if (!value) return false;
			if (typeof value === "function") return value.name !== "";
			if (typeof value === "object" && "$$" in value) return true;
			return false;
		}
		function isRenderFunction(value) {
			return typeof value === "function" && value.length === 2 && typeof value.prototype === "undefined";
		}
		function resolveRenderProps(component, page, key = null) {
			const child = h(component.default, page.props, [], key);
			if (component.layout && isRenderFunction(component.layout)) return component.layout(h, child);
			let effectiveLayout;
			let callbackProps = null;
			const layoutValue = component.layout;
			if (typeof layoutValue === "function" && layoutValue.length <= 1 && typeof layoutValue.prototype === "undefined") {
				const result = layoutValue(page.props);
				if (isPropsObjectOrCallback(result, isComponent)) {
					effectiveLayout = defaultLayout?.(page.component, page);
					callbackProps = result;
				} else effectiveLayout = result;
			} else if (isPropsObject(layoutValue, isComponent)) {
				effectiveLayout = defaultLayout?.(page.component, page);
				callbackProps = layoutValue;
			} else effectiveLayout = layoutValue ?? defaultLayout?.(page.component, page);
			return effectiveLayout ? resolveLayout(effectiveLayout, child, page.props, key, !!component.layout && !callbackProps, callbackProps) : child;
		}
		function resolveLayout(layout, child, pageProps, key, isFromPage = true, callbackProps = null) {
			if (isFromPage && isRenderFunction(layout)) return layout(h, child);
			let layouts = normalizeLayouts(layout, isComponent, isFromPage ? isRenderFunction : void 0);
			if (callbackProps) layouts = layouts.map((l) => ({
				...l,
				props: {
					...l.props,
					...callbackProps
				}
			}));
			if (layouts.length > 0) {
				const dynamicProps = isServer ? {
					shared: {},
					named: {}
				} : {
					shared: storeState.shared,
					named: storeState.named
				};
				return layouts.reduceRight((child, layout) => {
					return {
						...h(layout.component, {
							...pageProps,
							...layout.props,
							...dynamicProps.shared,
							...layout.name ? dynamicProps.named[layout.name] || {} : {}
						}, [child], key),
						name: layout.name
					};
				}, child);
			}
			return child;
		}
		Render_1($$renderer, spread_props([renderProps()]));
	});
}
//#endregion
//#region node_modules/svelte/src/index-server.js
function mount() {
	lifecycle_function_unavailable("mount");
}
function hydrate() {
	lifecycle_function_unavailable("hydrate");
}
//#endregion
//#region node_modules/@inertiajs/svelte/dist/useFormState.svelte.js
function useFormState(options) {
	const { data: dataOption, rememberKey, precognitionEndpoint: initialPrecognitionEndpoint } = options;
	const isDataFunction = typeof dataOption === "function";
	const resolveData = () => isDataFunction ? dataOption() : dataOption;
	const restored = rememberKey ? router.restore(rememberKey) : null;
	const initialData = restored?.data ?? cloneDeep(resolveData());
	let defaults = cloneDeep(initialData);
	let transform = (data) => data;
	let validatorRef = null;
	let withAllErrors = null;
	const withAllErrorsEnabled = () => withAllErrors ?? config$1.get("form.withAllErrors");
	let precognitionEndpoint = initialPrecognitionEndpoint ?? null;
	let recentlySuccessfulTimeoutId = null;
	let defaultsCalledInOnSuccess = false;
	let rememberExcludeKeys = [];
	let setFormStateInternal;
	const tap = (value, callback) => {
		callback(value);
		return value;
	};
	const withPrecognition = (...args) => {
		precognitionEndpoint = UseFormUtils.createWayfinderCallback(...args);
		const formWithPrecognition = () => form;
		if (!validatorRef) {
			const validator = createValidator((client) => {
				const { method, url } = precognitionEndpoint();
				const f = formWithPrecognition();
				const transformedData = cloneDeep(transform(f.data()));
				return client[method](url, transformedData);
			}, cloneDeep(defaults));
			validatorRef = validator;
			validator.on("validatingChanged", () => {
				setFormStateInternal("validating", validator.validating());
			}).on("validatedChanged", () => {
				setFormStateInternal("__valid", validator.valid());
			}).on("touchedChanged", () => {
				setFormStateInternal("__touched", validator.touched());
			}).on("errorsChanged", () => {
				const validationErrors = withAllErrorsEnabled() ? validator.errors() : toSimpleValidationErrors(validator.errors());
				setFormStateInternal("errors", {});
				formWithPrecognition().setError(validationErrors);
				setFormStateInternal("__valid", validator.valid());
			});
		}
		Object.assign(form, {
			...form,
			__touched: [],
			__valid: [],
			validating: false,
			validator: () => validatorRef,
			validate: (field, config) => {
				const f = formWithPrecognition();
				if (typeof field === "object" && !("target" in field)) {
					config = field;
					field = void 0;
				}
				if (field === void 0) validatorRef.validate(config);
				else {
					field = resolveName(field);
					const transformedData = transform(f.data());
					validatorRef.validate(field, get(transformedData, field), config);
				}
				return f;
			},
			touch: (field, ...fields) => {
				const f = formWithPrecognition();
				if (Array.isArray(field)) validatorRef?.touch(field);
				else if (typeof field === "string") validatorRef?.touch([field, ...fields]);
				else validatorRef?.touch(field);
				return f;
			},
			validateFiles: () => tap(formWithPrecognition(), () => validatorRef?.validateFiles()),
			setValidationTimeout: (duration) => tap(formWithPrecognition(), () => validatorRef.setTimeout(duration)),
			withAllErrors: () => tap(formWithPrecognition(), () => withAllErrors = true),
			withoutFileValidation: () => tap(formWithPrecognition(), () => validatorRef?.withoutFileValidation()),
			valid: (field) => formWithPrecognition().__valid.includes(field),
			invalid: (field) => field in formWithPrecognition().errors,
			touched: (field) => {
				const touched = formWithPrecognition().__touched;
				return typeof field === "string" ? touched.includes(field) : touched.length > 0;
			},
			setErrors: (errors) => tap(formWithPrecognition(), () => {
				formWithPrecognition().setError(errors);
			}),
			forgetError: (field) => tap(formWithPrecognition(), () => {
				formWithPrecognition().clearErrors(resolveName(field));
			})
		});
		return form;
	};
	let form = {
		...initialData,
		isDirty: false,
		errors: restored?.errors ?? {},
		hasErrors: false,
		progress: null,
		wasSuccessful: false,
		recentlySuccessful: false,
		processing: false,
		setStore(keyOrData, maybeValue = void 0) {
			if (typeof keyOrData === "string") set(form, keyOrData, maybeValue);
			else Object.assign(form, keyOrData);
		},
		data() {
			return Object.keys(defaults).reduce((carry, key) => {
				return set(carry, key, get(this, key));
			}, {});
		},
		transform(callback) {
			transform = callback;
			return this;
		},
		defaults(fieldOrFields, maybeValue) {
			if (isDataFunction) throw new Error("You cannot call `defaults()` when using a function to define your form data.");
			defaultsCalledInOnSuccess = true;
			if (typeof fieldOrFields === "undefined") {
				defaults = cloneDeep(this.data());
				this.isDirty = false;
			} else defaults = typeof fieldOrFields === "string" ? set(cloneDeep(defaults), fieldOrFields, maybeValue) : Object.assign(cloneDeep(defaults), fieldOrFields);
			validatorRef?.defaults(defaults);
			return this;
		},
		reset(...fields) {
			const resolvedData = isDataFunction ? cloneDeep(resolveData()) : defaults;
			const clonedData = cloneDeep(resolvedData);
			if (fields.length === 0) {
				if (isDataFunction) defaults = clonedData;
				this.setStore(clonedData);
			} else fields.filter((key) => has(clonedData, key)).forEach((key) => {
				if (isDataFunction) set(defaults, key, get(clonedData, key));
				set(this, key, get(clonedData, key));
			});
			validatorRef?.reset(...fields);
			return this;
		},
		setError(fieldOrFields, maybeValue) {
			const errors = typeof fieldOrFields === "string" ? { [fieldOrFields]: maybeValue } : fieldOrFields;
			setFormStateInternal("errors", {
				...this.errors,
				...errors
			});
			validatorRef?.setErrors(errors);
			return this;
		},
		clearErrors(...fields) {
			setFormStateInternal("errors", Object.keys(this.errors).reduce((carry, field) => ({
				...carry,
				...fields.length > 0 && !fields.includes(field) ? { [field]: this.errors[field] } : {}
			}), {}));
			if (validatorRef) {
				if (fields.length === 0) validatorRef.setErrors({});
				else fields.forEach(validatorRef.forgetError);
			}
			return this;
		},
		resetAndClearErrors(...fields) {
			this.reset(...fields);
			this.clearErrors(...fields);
			return this;
		},
		withPrecognition,
		__rememberable: rememberKey === null,
		__remember() {
			const formData = this.data();
			if (rememberExcludeKeys.length > 0) {
				const filtered = { ...formData };
				rememberExcludeKeys.forEach((k) => delete filtered[k]);
				return {
					data: filtered,
					errors: snapshot(this.errors)
				};
			}
			return {
				data: formData,
				errors: snapshot(this.errors)
			};
		},
		__restore(restored) {
			Object.assign(this, restored.data);
			this.setError(restored.errors);
		}
	};
	setFormStateInternal = (key, value) => {
		form[key] = value;
	};
	if (precognitionEndpoint) form.withPrecognition(precognitionEndpoint);
	return {
		form,
		setDefaults: (newDefaults) => {
			defaults = newDefaults;
		},
		getTransform: () => transform,
		getPrecognitionEndpoint: () => precognitionEndpoint,
		setFormState: setFormStateInternal,
		markAsSuccessful: () => {
			form.clearErrors();
			setFormStateInternal("wasSuccessful", true);
			setFormStateInternal("recentlySuccessful", true);
			recentlySuccessfulTimeoutId = setTimeout(() => setFormStateInternal("recentlySuccessful", false), config$1.get("form.recentlySuccessfulDuration"));
		},
		wasDefaultsCalledInOnSuccess: () => defaultsCalledInOnSuccess,
		resetDefaultsCalledInOnSuccess: () => {
			defaultsCalledInOnSuccess = false;
		},
		setRememberExcludeKeys: (keys) => {
			rememberExcludeKeys = keys;
		},
		resetBeforeSubmit: () => {
			setFormStateInternal("wasSuccessful", false);
			setFormStateInternal("recentlySuccessful", false);
			if (recentlySuccessfulTimeoutId) clearTimeout(recentlySuccessfulTimeoutId);
		},
		finishProcessing: () => {
			setFormStateInternal("processing", false);
			setFormStateInternal("progress", null);
		},
		withAllErrors: {
			enabled: withAllErrorsEnabled,
			enable: () => {
				withAllErrors = true;
			}
		}
	};
}
//#endregion
//#region node_modules/@inertiajs/svelte/dist/useForm.svelte.js
var reservedFormKeys = null;
var bootstrapping = false;
function validateFormDataKeys(data) {
	if (bootstrapping) return;
	if (reservedFormKeys === null) {
		bootstrapping = true;
		const store = useForm({});
		reservedFormKeys = new Set(Object.keys(store));
		bootstrapping = false;
	}
	const conflicts = Object.keys(data).filter((key) => reservedFormKeys.has(key));
	if (conflicts.length > 0) console.error(`[Inertia] useForm() data contains field(s) that conflict with form properties: ${conflicts.map((k) => `"${k}"`).join(", ")}. These fields will be overwritten by form methods/properties. Please rename these fields.`);
}
function useForm(...args) {
	const { rememberKey, data, precognitionEndpoint } = UseFormUtils.parseUseFormArguments(...args);
	validateFormDataKeys(typeof data === "function" ? data() : data);
	let cancelToken = null;
	let pendingOptimisticCallback = null;
	const { form: baseForm, setDefaults, getTransform, getPrecognitionEndpoint, setFormState, markAsSuccessful, wasDefaultsCalledInOnSuccess, resetDefaultsCalledInOnSuccess, setRememberExcludeKeys, resetBeforeSubmit, finishProcessing } = useFormState({
		data,
		rememberKey,
		precognitionEndpoint
	});
	const formWithPrecognition = () => baseForm;
	const submit = (...args) => {
		const { method, url, options } = UseFormUtils.parseSubmitArguments(args, getPrecognitionEndpoint());
		resetDefaultsCalledInOnSuccess();
		const transformedData = getTransform()(form.data());
		const _options = {
			...options,
			onCancelToken: (token) => {
				cancelToken = token;
				return options.onCancelToken?.(token);
			},
			onBefore: (visit) => {
				resetBeforeSubmit();
				return options.onBefore?.(visit);
			},
			onStart: (visit) => {
				setFormState("processing", true);
				return options.onStart?.(visit);
			},
			onProgress: (event) => {
				setFormState("progress", event || null);
				return options.onProgress?.(event);
			},
			onSuccess: async (page) => {
				markAsSuccessful();
				const onSuccess = options.onSuccess ? await options.onSuccess(page) : null;
				if (!wasDefaultsCalledInOnSuccess()) setDefaults(cloneDeep(form.data()));
				return onSuccess;
			},
			onError: (errors) => {
				form.clearErrors().setError(errors);
				return options.onError?.(errors);
			},
			onCancel: () => {
				return options.onCancel?.();
			},
			onFinish: (visit) => {
				finishProcessing();
				cancelToken = null;
				return options.onFinish?.(visit);
			}
		};
		_options.optimistic = _options.optimistic ?? pendingOptimisticCallback ?? void 0;
		pendingOptimisticCallback = null;
		if (method === "delete") router.delete(url, {
			..._options,
			data: transformedData
		});
		else router[method](url, transformedData, _options);
	};
	const cancel = () => {
		cancelToken?.cancel();
	};
	const createSubmitMethod = (method) => (url, options = {}) => {
		submit(method, url, options);
	};
	Object.assign(baseForm, {
		submit,
		get: createSubmitMethod("get"),
		post: createSubmitMethod("post"),
		put: createSubmitMethod("put"),
		patch: createSubmitMethod("patch"),
		delete: createSubmitMethod("delete"),
		cancel,
		dontRemember(...keys) {
			setRememberExcludeKeys(keys);
			return form;
		},
		optimistic(callback) {
			pendingOptimisticCallback = callback;
			return form;
		}
	});
	const form = baseForm;
	const originalWithPrecognition = formWithPrecognition().withPrecognition;
	form.withPrecognition = (...args) => {
		originalWithPrecognition(...args);
		return form;
	};
	return getPrecognitionEndpoint() ? form : form;
}
//#endregion
//#region node_modules/@inertiajs/svelte/dist/components/formContext.js
var [getFormContext, setFormContext] = createContext();
//#endregion
//#region node_modules/@inertiajs/svelte/dist/createInertiaApp.js
async function createInertiaApp({ id = "app", resolve, setup, progress = {}, page, defaults = {}, nonce, http: http$1, layout, serverHead, withApp, dev = false } = {}) {
	config$1.replace(defaults);
	if (nonce) config$1.set("nonce", nonce);
	if (http$1) http.setClient(http$1);
	if (dev) exposeInterceptors();
	const isServer = typeof window === "undefined";
	const resolveComponent = (name, page) => Promise.resolve(resolve(name, page));
	if (isServer && !page) return async (page, render) => {
		const props = {
			initialPage: page,
			initialComponent: await resolveComponent(page.component, page),
			resolveComponent,
			defaultLayout: layout
		};
		let svelteApp;
		if (setup) {
			const result = await setup({
				el: null,
				App,
				props
			});
			if (!result) throw new Error("Inertia SSR setup function must return a render result ({ body, head })");
			svelteApp = result;
		} else {
			const context = /* @__PURE__ */ new Map();
			if (withApp) withApp(context, {
				ssr: true,
				page
			});
			svelteApp = await render(App, {
				props,
				context
			});
		}
		return {
			body: buildSSRBody(id, page, svelteApp.body),
			head: [...resolveServerHead(page, serverHead), svelteApp.head]
		};
	};
	const initialPage = page || getInitialPageFromDOM(id);
	const serverHeadManager = !isServer && serverHead ? createHeadManager(false, (title) => title, () => {}, resolveServerHead(initialPage, serverHead)) : null;
	const [initialComponent] = await Promise.all([resolveComponent(initialPage.component, initialPage), router.decryptHistory().catch(() => {})]);
	const props = {
		initialPage,
		initialComponent,
		resolveComponent,
		defaultLayout: layout
	};
	if (isServer) {
		if (!setup) throw new Error("Inertia SSR requires a setup function that returns a render result ({ body, head })");
		const svelteApp = await setup({
			el: null,
			App,
			props
		});
		if (svelteApp) return {
			body: buildSSRBody(id, initialPage, svelteApp.body),
			head: [...resolveServerHead(initialPage, serverHead), svelteApp.head]
		};
		return;
	}
	const target = document.getElementById(id);
	if (setup) await setup({
		el: target,
		App,
		props
	});
	else {
		const context = /* @__PURE__ */ new Map();
		if (withApp) withApp(context, {
			ssr: false,
			page: initialPage
		});
		if (target.hasAttribute("data-server-rendered")) hydrate(App, {
			target,
			props,
			context
		});
		else mount(App, {
			target,
			props,
			context
		});
	}
	if (serverHeadManager) {
		const syncServerHead = (event) => {
			serverHeadManager.updateServerHead(resolveServerHead(event.detail.page, serverHead));
		};
		router.on("navigate", syncServerHead);
		router.on("clientVisit", syncServerHead);
	}
	if (progress) setupProgress(progress);
}
//#endregion
//#region node_modules/@inertiajs/svelte/dist/index.js
var config$1 = config.extend({});
//#endregion
//#region resources/components/Pages/ContactForm.svelte
var ContactForm_exports = /* @__PURE__ */ __exportAll({ default: () => ContactForm });
function ContactForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { title, content } = $$props;
		const form = useForm({
			name: "",
			email: "",
			message: ""
		});
		$$renderer.push(`<main class="mx-auto my-8 max-w-2xl px-6 font-sans"><h1 class="text-3xl font-bold text-zinc-900">${escape_html(title)}</h1> `);
		if (content) $$renderer.push(`<!--[0--><div class="prose mt-4 max-w-none text-zinc-700">${html(content)}</div>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <hr class="my-8 border-zinc-200"/> <h2 class="text-2xl font-semibold text-zinc-900">Kontaktformular</h2> <form class="mt-6 space-y-6"><div><label class="mb-2 block text-sm font-medium text-zinc-700" for="name">Name:</label> <input id="name" type="text"${attr("value", form.name)}${attr("disabled", form.processing, true)} class="block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-zinc-100"/> `);
		if (form.errors.name) $$renderer.push(`<!--[0--><p class="mt-2 text-sm text-red-600">${escape_html(form.errors.name)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div><label class="mb-2 block text-sm font-medium text-zinc-700" for="email">E-Mail:</label> <input id="email" type="email"${attr("value", form.email)}${attr("disabled", form.processing, true)} class="block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-zinc-100"/> `);
		if (form.errors.email) $$renderer.push(`<!--[0--><p class="mt-2 text-sm text-red-600">${escape_html(form.errors.email)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div><label class="mb-2 block text-sm font-medium text-zinc-700" for="message">Nachricht:</label> <textarea id="message"${attr("disabled", form.processing, true)} class="block min-h-32 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-zinc-100">`);
		const $$body = escape_html(form.message);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></div> <button type="submit"${attr("disabled", form.processing, true)} class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">`);
		if (form.processing) $$renderer.push(`<!--[0-->Sendet...`);
		else $$renderer.push(`<!--[-1-->Abschicken`);
		$$renderer.push(`<!--]--></button></form></main>`);
	});
}
//#endregion
//#region resources/components/Pages/Home.svelte
var Home_exports = /* @__PURE__ */ __exportAll({ default: () => Home });
function Home($$renderer, $$props) {
	let { title, content } = $$props;
	head("1tzg85f", $$renderer, ($$renderer) => {
		$$renderer.push(`<link rel="preconnect" href="https://rsms.me"/> <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>`);
	});
	$$renderer.push(`<div class="relative flex min-h-dvh flex-col overflow-hidden bg-zinc-50 font-[InterVariable,Inter,sans-serif] text-zinc-800 antialiased [font-feature-settings:'cv02','cv03','cv04','cv11','ss01'] dark:bg-zinc-950 dark:text-zinc-300"><div class="pointer-events-none absolute inset-0" aria-hidden="true"><div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,255,76,0.18),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,38,158,0.16),transparent)]"></div> <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(24,24,27,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.04)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]"></div> <div class="absolute top-1/4 left-1/2 size-96 -translate-x-1/2 rounded-full bg-[#d4ff4c]/20 blur-3xl dark:bg-[#FF269E]/25"></div></div> <main class="relative mx-auto flex w-full max-w-3xl grow flex-col justify-center px-6 py-16 sm:px-8 sm:py-20"><a href="https://statamic.com" class="inline-flex w-fit origin-left animate-[fade-up_0.7s_ease-out_both] transition-transform hover:-translate-y-0.5"><span class="sr-only">Statamic</span> <svg class="h-8 w-auto text-zinc-950 dark:hidden sm:h-9" viewBox="0 0 614.9 112.01" fill="none" aria-hidden="true"><path class="fill-current" d="M112.46 110.67c9.62-.6 13.78-5.17 14.72-15.49.73-8.04 1-12.06 1.36-20.11.43-9.6 5.28-15.13 9.96-17.7 1.41-.8 1.4-2.65 0-3.54-4.88-2.94-9.61-9.19-9.98-17.45-.36-7.9-.63-11.85-1.35-19.75-1.02-11.13-4.55-14.67-14.18-15.28a799 799 0 0 0-86.42.02c-9.62.61-13.16 4.15-14.18 15.28-.72 7.9-.99 11.85-1.35 19.75-.38 8.26-5.1 14.51-9.98 17.45a2.01 2.01 0 0 0 0 3.54c4.69 2.49 9.53 8.01 9.96 17.7.36 8.04.63 12.06 1.36 20.11.94 10.32 5.1 14.89 14.72 15.49 28.52 1.53 56.85 1.53 85.36 0ZM69.55 92.82c-8.77.49-19.7-3.8-25.95-9.95-1.23-1.13-1.73-2.53-1.76-3.92-.03-1.11.23-2.31 1.04-3.23.87-1.14 1.31-1.71 2.18-2.85 1.1-1.38 2.3-2.02 3.7-2.01 1.58.01 3.08.67 4.68 1.71 5.06 3.3 10.63 5.2 17.31 5.2 5.1 0 9.78-2.89 9.23-6.57-2.18-14.6-38.37-6.19-37.83-30.63C42.44 27.71 55.29 18.69 67.9 19c9.77.25 17.47 3.09 23.08 6.71 1.4.95 2.37 2.83 2.41 4.69.03 1.12-.23 2.13-.86 3.06-.65 1-.97 1.49-1.63 2.49-1.18 1.66-2.57 2.49-4.34 2.48-1.21 0-2.52-.48-3.92-1.14-4.2-2.17-8.56-3.31-13.85-3.31-5.47 0-9.15 3.52-8.76 6.1 2.18 14.47 37.35 5.97 37.84 30.07.3 14.88-15.58 22.52-28.34 22.68Z"></path><path fill="#d4ff4c" d="M105.69 102.58c8.47-.62 12.23-4.7 13.2-13.82.75-7.1 1.03-10.65 1.4-17.76.44-8.48 4.75-13.37 8.92-15.64 1.25-.7 1.25-2.33 0-3.12-4.34-2.59-8.55-8.12-8.94-15.41-.37-6.98-.65-10.46-1.39-17.44-1.05-9.83-4.24-13-12.71-13.62a612 612 0 0 0-76.11 0c-8.47.62-11.67 3.79-12.71 13.62-.74 6.98-1.02 10.46-1.39 17.44-.39 7.29-4.59 12.82-8.94 15.41-1.25.71-1.25 2.41 0 3.12 4.17 2.19 8.48 7.08 8.92 15.64.37 7.1.65 10.65 1.4 17.76.96 9.12 4.72 13.2 13.2 13.82 25.18 1.54 50 1.54 75.18 0Z"></path><path class="fill-current" d="M47.49 69.34c.93-1.21 2-1.74 3.21-1.74 1.34 0 2.67.54 4.01 1.48 4.27 2.82 9.08 4.43 14.83 4.43 4.41 0 7.88-1.88 7.88-5.63 0-9.79-32.46-4.43-32.46-26.43 0-11.81 9.62-18.38 22.04-18.38 8.82 0 15.23 2.55 20.04 5.63 1.2.8 2 2.41 2 4.02 0 .94-.27 1.88-.8 2.68l-1.47 2.15c-1.07 1.48-2.27 2.15-3.74 2.15-1.07 0-2.14-.4-3.34-.94-3.61-1.88-7.35-2.82-11.89-2.82s-7.48 2.55-7.48 5.23c0 10.06 32.46 4.56 32.46 25.89 0 11.94-9.62 19.32-24.31 19.32-9.35 0-16.16-2.82-22.44-8.32-1.07-.94-1.47-2.15-1.47-3.35 0-.94.27-2.01.94-2.82l2-2.55Zm126.21 4.5c.88-1.15 1.85-1.59 3-1.59s2.56.53 3.71 1.41c3.97 2.65 8.47 4.15 13.86 4.15 4.15 0 7.42-1.68 7.42-5.3 0-9.09-30.28-4.15-30.28-24.45 0-10.95 9-17.13 20.57-17.13 8.21 0 14.21 2.3 18.71 5.3 1.15.71 1.85 2.21 1.85 3.71 0 .88-.18 1.68-.71 2.56l-1.41 2.03c-.97 1.41-2.12 2.03-3.44 2.03-.97 0-2.03-.44-3.18-.88-3.35-1.68-6.89-2.65-11.03-2.65s-6.97 2.3-6.97 4.86c0 9.27 30.28 4.24 30.28 24.01 0 11.03-9 17.92-22.69 17.92-8.74 0-15.1-2.65-20.92-7.68a4.23 4.23 0 0 1-1.41-3.18c0-.88.18-1.85.88-2.65l1.77-2.47Zm86.69 5.82c.44.62.62 1.41.62 2.12 0 1.59-.71 3.27-2.12 3.97-4.24 2.56-8.47 3.71-14.04 3.71-12.62 0-17.39-8.21-17.39-22.6V21.31c0-2.56 2.12-4.68 4.68-4.68h5.03c2.56 0 4.68 2.12 4.68 4.68v10.95h13.51c2.56 0 4.68 2.12 4.68 4.68v4.24c0 2.56-2.12 4.68-4.68 4.68h-13.51v20.48c0 6.09 2.03 10.15 6.71 10.15 1.5 0 2.82-.18 3.97-.62s2.03-.62 2.82-.62c1.59 0 2.82.71 3.88 2.56l1.15 1.85Zm8.74-7.77c0-12.36 9.09-18.18 20.48-18.18 4.94 0 9.89 1.59 12.62 3.62v-1.68c0-8.21-2.65-12.62-10.42-12.62-4.24 0-6.97.62-9.62 1.5-.71.18-1.5.44-2.21.44-1.85 0-3.35-.88-4.24-2.65l-.71-1.5c-.18-.62-.53-1.24-.53-2.03 0-1.59 1.15-3.27 2.65-3.97 4.86-2.21 10.42-3.71 16.15-3.71 16.6 0 22.33 8.47 22.33 23.3v29.48c0 2.56-2.12 4.68-4.68 4.68h-3.27c-2.56 0-4.68-2.12-4.68-4.68v-1.85c-3 4.24-9 7.15-16.6 7.15-9.98-.09-17.3-6.44-17.3-17.3Zm33.1-5.82c-2.56-1.85-5.74-2.74-9.8-2.74-4.77 0-9 2.21-9 6.97 0 4.24 3.44 6.62 8.03 6.62 6 0 9.09-2.65 10.86-5.03v-5.83h-.09Zm59.85 13.59c.44.62.62 1.41.62 2.12 0 1.59-.71 3.27-2.12 3.97-4.24 2.56-8.47 3.71-14.04 3.71-12.62 0-17.39-8.21-17.39-22.6V21.31c0-2.56 2.12-4.68 4.68-4.68h5.03c2.56 0 4.68 2.12 4.68 4.68v10.95h13.51c2.56 0 4.68 2.12 4.68 4.68v4.24c0 2.56-2.12 4.68-4.68 4.68h-13.51v20.48c0 6.09 2.03 10.15 6.71 10.15 1.5 0 2.82-.18 3.97-.62s2.03-.62 2.82-.62c1.59 0 2.82.71 3.88 2.56l1.15 1.85Zm8.74-7.77c0-12.36 9.09-18.18 20.48-18.18 4.94 0 9.89 1.59 12.62 3.62v-1.68c0-8.21-2.65-12.62-10.42-12.62-4.24 0-6.97.62-9.62 1.5-.71.18-1.5.44-2.21.44-1.85 0-3.35-.88-4.24-2.65l-.71-1.5c-.18-.62-.53-1.24-.53-2.03 0-1.59 1.15-3.27 2.65-3.97 4.86-2.21 10.42-3.71 16.15-3.71 16.6 0 22.33 8.47 22.33 23.3v29.48c0 2.56-2.12 4.68-4.68 4.68h-3.27c-2.56 0-4.68-2.12-4.68-4.68v-1.85c-3 4.24-9 7.15-16.6 7.15-9.89-.09-17.3-6.44-17.3-17.3Zm33.1-5.82c-2.56-1.85-5.74-2.74-9.8-2.74-4.77 0-9 2.21-9 6.97 0 4.24 3.44 6.62 8.03 6.62 6 0 9.09-2.65 10.86-5.03v-5.83h-.09Zm42.55-27.63c3.97-4.41 10.59-7.15 17.48-7.15 8.56 0 14.3 3.88 16.33 9 3.97-5.3 10.24-9 18.89-9 10.24 0 17.92 5.03 17.92 20.48v31.96c0 2.56-2.12 4.68-4.68 4.68h-5.03c-2.56 0-4.68-2.12-4.68-4.68V55.39c0-6.97-2.82-10.77-9.62-10.77-5.38 0-9.62 2.65-11.56 6.44 0 .88.09 2.82.09 4.15v28.34c0 2.56-2.12 4.68-4.68 4.68h-5.03c-2.56 0-4.68-2.12-4.68-4.68V54.42c0-5.91-3.27-9.71-9.27-9.71-5.03 0-9.18 2.21-11.74 6v33.02c0 2.56-2.12 4.68-4.68 4.68h-5.03c-2.56 0-4.68-2.12-4.68-4.68V36.86c0-2.56 2.12-4.68 4.68-4.68h5.03c2.56 0 4.68 2.12 4.68 4.68v1.59h.26Zm103.02-26.4c0 5.74-4.15 9-8.21 9-4.86 0-9-3.27-9-9 0-5.03 4.15-8.3 9-8.3 4.06 0 8.21 3.27 8.21 8.3m-6 20.22c2.56 0 4.68 2.12 4.68 4.68v46.79c0 2.56-2.12 4.68-4.68 4.68h-5.03c-2.56 0-4.68-2.12-4.68-4.68V36.86c0-2.56 2.12-4.68 4.68-4.68h5.03v.09Zm60.02 14.3c-3.35-1.59-6.27-2.21-9.89-2.21-8.03 0-15.62 6.09-15.62 15.89s7.68 16.07 16.15 16.07c4.41 0 7.59-1.15 10.86-3.27.97-.62 2.03-.97 3-.97 1.5 0 2.82.62 3.88 1.85l2.12 2.65c.62.62.88 1.59.88 2.56 0 1.5-.62 3.18-1.68 3.97-6.71 5.38-12.62 6.62-19.6 6.62-18.54 0-30.81-11.74-30.81-29.4 0-16.33 11.92-29.4 29.04-29.4 7.5 0 12.98 1.24 18.45 4.24 1.41.71 2.21 2.56 2.21 4.15 0 .71-.09 1.41-.53 2.03l-1.85 3.27c-.97 1.59-2.56 2.65-4.24 2.65-.71-.18-1.59-.26-2.38-.71Z"></path></svg> <svg class="h-8 w-auto not-dark:hidden sm:h-9" viewBox="0 0 614.9 111.63" fill="none" aria-hidden="true"><path fill="#FF269E" d="M112.46 110.48c9.62-.6 13.78-5.17 14.72-15.49.73-8.04 1-12.06 1.36-20.11.43-9.6 5.28-15.13 9.96-17.7 1.41-.8 1.4-2.65 0-3.54-4.88-2.94-9.61-9.19-9.98-17.45-.36-7.9-.63-11.85-1.35-19.75-1.02-11.13-4.55-14.67-14.18-15.28a793 793 0 0 0-86.42 0c-9.62.61-13.16 4.15-14.18 15.28-.72 7.9-.99 11.85-1.35 19.75-.38 8.26-5.1 14.51-9.98 17.45a2.01 2.01 0 0 0 0 3.54c4.69 2.49 9.53 8.01 9.96 17.7.36 8.04.63 12.06 1.36 20.11.94 10.32 5.1 14.89 14.72 15.49 28.52 1.53 56.85 1.53 85.36 0M69.55 92.63c-8.77.49-19.7-3.8-25.95-9.95-1.23-1.13-1.73-2.53-1.76-3.92-.03-1.11.23-2.31 1.04-3.23.87-1.14 1.31-1.71 2.18-2.85 1.1-1.38 2.3-2.02 3.7-2.01 1.58.01 3.08.67 4.68 1.71 5.06 3.3 10.63 5.2 17.31 5.2 5.1 0 9.78-2.89 9.23-6.57-2.18-14.6-38.37-6.19-37.83-30.63.29-12.86 13.14-21.88 25.75-21.57 9.77.25 17.47 3.09 23.08 6.71 1.4.95 2.37 2.83 2.41 4.69.03 1.12-.23 2.13-.86 3.06-.65 1-.97 1.49-1.63 2.49-1.18 1.66-2.57 2.49-4.34 2.48-1.21 0-2.52-.48-3.92-1.14-4.2-2.17-8.56-3.31-13.85-3.31-5.47 0-9.15 3.52-8.76 6.1 2.18 14.47 37.35 5.97 37.84 30.07.3 14.88-15.58 22.52-28.34 22.68ZM173.7 72.09c.88-1.15 1.85-1.59 3-1.59s2.56.53 3.71 1.41c3.97 2.65 8.47 4.15 13.86 4.15 4.15 0 7.42-1.68 7.42-5.3 0-9.09-30.28-4.15-30.28-24.45 0-10.95 9-17.13 20.57-17.13 8.21 0 14.21 2.3 18.71 5.3 1.15.71 1.85 2.21 1.85 3.71 0 .88-.18 1.68-.71 2.56l-1.41 2.03c-.97 1.41-2.12 2.03-3.44 2.03-.97 0-2.03-.44-3.18-.88-3.35-1.68-6.89-2.65-11.03-2.65s-6.97 2.3-6.97 4.86c0 9.27 30.28 4.24 30.28 24.01 0 11.03-9 17.92-22.69 17.92-8.74 0-15.1-2.65-20.92-7.68a4.23 4.23 0 0 1-1.41-3.18c0-.88.18-1.85.88-2.65l1.77-2.47Zm86.68 5.83c.44.62.62 1.41.62 2.12 0 1.59-.71 3.27-2.12 3.97-4.24 2.56-8.47 3.71-14.04 3.71-12.62 0-17.39-8.21-17.39-22.6V19.57c0-2.56 2.12-4.68 4.68-4.68h5.03c2.56 0 4.68 2.12 4.68 4.68v10.95h13.51c2.56 0 4.68 2.12 4.68 4.68v4.24c0 2.56-2.12 4.68-4.68 4.68h-13.51V64.6c0 6.09 2.03 10.15 6.71 10.15 1.5 0 2.82-.18 3.97-.62s2.03-.62 2.82-.62c1.59 0 2.82.71 3.88 2.56l1.15 1.85Zm8.74-7.77c0-12.36 9.09-18.18 20.48-18.18 4.94 0 9.89 1.59 12.62 3.62v-1.68c0-8.21-2.65-12.62-10.42-12.62-4.24 0-6.97.62-9.62 1.5-.71.18-1.5.44-2.21.44-1.85 0-3.35-.88-4.24-2.65l-.71-1.5c-.18-.62-.53-1.24-.53-2.03 0-1.59 1.15-3.27 2.65-3.97 4.86-2.21 10.42-3.71 16.15-3.71 16.6 0 22.33 8.47 22.33 23.3v29.48c0 2.56-2.12 4.68-4.68 4.68h-3.27c-2.56 0-4.68-2.12-4.68-4.68V80.3c-3 4.24-9 7.15-16.6 7.15-9.98-.09-17.3-6.44-17.3-17.3Zm33.11-5.83c-2.56-1.85-5.74-2.74-9.8-2.74-4.77 0-9 2.21-9 6.97 0 4.24 3.44 6.62 8.03 6.62 6 0 9.09-2.65 10.86-5.03v-5.83h-.09Zm59.85 13.6c.44.62.62 1.41.62 2.12 0 1.59-.71 3.27-2.12 3.97-4.24 2.56-8.47 3.71-14.04 3.71-12.62 0-17.39-8.21-17.39-22.6V19.57c0-2.56 2.12-4.68 4.68-4.68h5.03c2.56 0 4.68 2.12 4.68 4.68v10.95h13.51c2.56 0 4.68 2.12 4.68 4.68v4.24c0 2.56-2.12 4.68-4.68 4.68h-13.51V64.6c0 6.09 2.03 10.15 6.71 10.15 1.5 0 2.82-.18 3.97-.62s2.03-.62 2.82-.62c1.59 0 2.82.71 3.88 2.56l1.15 1.85Zm8.74-7.77c0-12.36 9.09-18.18 20.48-18.18 4.94 0 9.89 1.59 12.62 3.62v-1.68c0-8.21-2.65-12.62-10.42-12.62-4.24 0-6.97.62-9.62 1.5-.71.18-1.5.44-2.21.44-1.85 0-3.35-.88-4.24-2.65l-.71-1.5c-.18-.62-.53-1.24-.53-2.03 0-1.59 1.15-3.27 2.65-3.97 4.86-2.21 10.42-3.71 16.15-3.71 16.6 0 22.33 8.47 22.33 23.3v29.48c0 2.56-2.12 4.68-4.68 4.68h-3.27c-2.56 0-4.68-2.12-4.68-4.68V80.3c-3 4.24-9 7.15-16.6 7.15-9.89-.09-17.3-6.44-17.3-17.3Zm33.1-5.83c-2.56-1.85-5.74-2.74-9.8-2.74-4.77 0-9 2.21-9 6.97 0 4.24 3.44 6.62 8.03 6.62 6 0 9.09-2.65 10.86-5.03v-5.83h-.09Zm42.55-27.63c3.97-4.41 10.59-7.15 17.48-7.15 8.56 0 14.3 3.88 16.33 9 3.97-5.3 10.24-9 18.89-9 10.24 0 17.92 5.03 17.92 20.48v31.96c0 2.56-2.12 4.68-4.68 4.68h-5.03c-2.56 0-4.68-2.12-4.68-4.68V53.64c0-6.97-2.82-10.77-9.62-10.77-5.38 0-9.62 2.65-11.56 6.44 0 .88.09 2.82.09 4.15V81.8c0 2.56-2.12 4.68-4.68 4.68h-5.03c-2.56 0-4.68-2.12-4.68-4.68V52.67c0-5.91-3.27-9.71-9.27-9.71-5.03 0-9.18 2.21-11.74 6v33.02c0 2.56-2.12 4.68-4.68 4.68h-5.03c-2.56 0-4.68-2.12-4.68-4.68V35.11c0-2.56 2.12-4.68 4.68-4.68h5.03c2.56 0 4.68 2.12 4.68 4.68v1.59h.26ZM549.49 10.3c0 5.74-4.15 9-8.21 9-4.86 0-9-3.27-9-9 0-5.03 4.15-8.3 9-8.3 4.06 0 8.21 3.27 8.21 8.3m-6.01 20.21c2.56 0 4.68 2.12 4.68 4.68v46.79c0 2.56-2.12 4.68-4.68 4.68h-5.03c-2.56 0-4.68-2.12-4.68-4.68V35.11c0-2.56 2.12-4.68 4.68-4.68h5.03v.09Zm60.03 14.3c-3.35-1.59-6.27-2.21-9.89-2.21-8.03 0-15.62 6.09-15.62 15.89s7.68 16.07 16.15 16.07c4.41 0 7.59-1.15 10.86-3.27.97-.62 2.03-.97 3-.97 1.5 0 2.82.62 3.88 1.85l2.12 2.65c.62.62.88 1.59.88 2.56 0 1.5-.62 3.18-1.68 3.97-6.71 5.38-12.62 6.62-19.6 6.62-18.54 0-30.81-11.74-30.81-29.4 0-16.33 11.92-29.4 29.04-29.4 7.5 0 12.98 1.24 18.45 4.24 1.41.71 2.21 2.56 2.21 4.15 0 .71-.09 1.41-.53 2.03l-1.85 3.27c-.97 1.59-2.56 2.65-4.24 2.65-.71-.18-1.59-.26-2.38-.71Z"></path></svg></a> <div class="mt-10 animate-[fade-up_0.7s_ease-out_both] [animation-delay:120ms] sm:mt-12"><p class="font-mono text-sm tracking-wide text-zinc-500 uppercase">Fresh install</p> <h1 class="mt-3 max-w-[20ch] text-4xl font-semibold tracking-tight text-balance text-zinc-950 sm:text-5xl dark:text-white">Welcome to your new Statamic site</h1> <div class="mt-5 max-w-[48ch] text-lg/7 text-pretty text-zinc-600 dark:text-zinc-400 [&amp;_:where(h1,h2,h3,h4,h5,h6)]:font-semibold [&amp;_:where(h1,h2,h3,h4,h5,h6)]:tracking-tight [&amp;_:where(h1,h2,h3,h4,h5,h6)]:text-balance [&amp;_:where(h1,h2,h3,h4,h5,h6)]:text-zinc-950 dark:[&amp;_:where(h1,h2,h3,h4,h5,h6)]:text-white [&amp;_a]:font-medium [&amp;_a]:text-zinc-950 [&amp;_a]:underline [&amp;_a]:decoration-zinc-950/20 [&amp;_a]:underline-offset-3 hover:[&amp;_a]:decoration-zinc-950 dark:[&amp;_a]:text-white dark:[&amp;_a]:decoration-white/25 dark:hover:[&amp;_a]:decoration-white [&amp;_strong]:font-semibold [&amp;_strong]:text-zinc-950 dark:[&amp;_strong]:text-white [&amp;_p+p]:mt-4 [&amp;_ul]:mt-4 [&amp;_ul]:list-disc [&amp;_ul]:pl-5 [&amp;_ol]:mt-4 [&amp;_ol]:list-decimal [&amp;_ol]:pl-5 [&amp;_li+li]:mt-2">${html(content ?? "")}</div></div> <div class="mt-8 flex flex-wrap items-center gap-3 animate-[fade-up_0.7s_ease-out_both] [animation-delay:220ms]"><a href="/cp" class="inline-flex items-center gap-x-2 rounded-lg bg-zinc-950 py-2.5 pr-3 pl-2.5 text-sm font-medium text-white ring-1 ring-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:bg-white dark:text-zinc-950 dark:ring-white dark:focus-visible:outline-white"><svg class="size-4 shrink-0 fill-white dark:fill-zinc-950" viewBox="0 0 16 16" aria-hidden="true"><path d="M13.78 3.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 8.28a.75.75 0 0 1 1.06-1.06L6 9.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg> Open Control Panel</a> <a href="https://statamic.dev" class="inline-flex items-center gap-x-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 ring-1 ring-zinc-950/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:text-zinc-200 dark:ring-white/10 dark:focus-visible:outline-white">Read the docs <svg class="size-4 shrink-0 fill-zinc-400 dark:fill-zinc-500" viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M2 8c0 .414.336.75.75.75h8.69l-1.22 1.22a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06l-2.5-2.5a.75.75 0 1 0-1.06 1.06l1.22 1.22H2.75A.75.75 0 0 0 2 8Z" clip-rule="evenodd"></path></svg></a></div> <div class="mt-14 animate-[fade-up_0.7s_ease-out_both] [animation-delay:320ms] sm:mt-16"><h2 class="text-sm font-medium tracking-tight text-zinc-500">Where to go from here</h2> <ul class="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-zinc-950/5 ring-1 ring-zinc-950/5 sm:grid-cols-2 dark:bg-white/5 dark:ring-white/10"><li class="group relative col-span-full flex items-start gap-x-4 bg-white p-5 sm:p-6 dark:bg-zinc-950 dark:inset-ring dark:inset-ring-white/5"><svg class="mt-0.5 size-5 shrink-0 fill-zinc-950 dark:fill-white" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25ZM3.5 4.25a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75V4.25ZM7 7.75A.75.75 0 0 1 7.75 7h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 7 7.75ZM7.75 10a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5ZM7 13.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"></path></svg> <div class="min-w-0 grow"><h3 class="text-base font-medium tracking-tight text-zinc-950 sm:text-sm dark:text-white"><a href="/cp" class="before:absolute before:inset-0">Control Panel</a></h3> <p class="mt-1 text-base text-pretty text-zinc-600 sm:text-sm dark:text-zinc-400">Edit this page, shape blueprints, and start building collections.</p></div> <svg class="mt-1 size-4 shrink-0 fill-zinc-300 transition-transform group-hover:translate-x-0.5 dark:fill-zinc-600" viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M2 8c0 .414.336.75.75.75h8.69l-1.22 1.22a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06l-2.5-2.5a.75.75 0 1 0-1.06 1.06l1.22 1.22H2.75A.75.75 0 0 0 2 8Z" clip-rule="evenodd"></path></svg></li> <li class="relative flex items-start gap-x-4 bg-white p-5 sm:p-6 dark:bg-zinc-950 dark:inset-ring dark:inset-ring-white/5"><svg class="mt-0.5 size-5 shrink-0 fill-zinc-950 dark:fill-white" viewBox="0 0 20 20" aria-hidden="true"><path d="M10.75 16.82A7.485 7.485 0 0 0 15 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0 0 18 15.06v-11a.75.75 0 0 0-.546-.721A9.005 9.005 0 0 0 15 3a7.478 7.478 0 0 0-4.25 1.32V16.82ZM9.25 4.32A7.478 7.478 0 0 0 5 3c-.85 0-1.673.118-2.454.339A.75.75 0 0 0 2 4.06v11a.75.75 0 0 0 .954.721A9.005 9.005 0 0 1 5 15.5c1.612 0 3.113.451 4.25 1.32V4.32Z"></path></svg> <div class="min-w-0 grow"><h3 class="text-base font-medium tracking-tight text-zinc-950 sm:text-sm dark:text-white"><a href="https://statamic.dev" class="before:absolute before:inset-0">Documentation</a></h3> <p class="mt-1 text-base text-pretty text-zinc-600 sm:text-sm dark:text-zinc-400">Learn how Statamic works end to end.</p></div></li> <li class="relative flex items-start gap-x-4 bg-white p-5 sm:p-6 dark:bg-zinc-950 dark:inset-ring dark:inset-ring-white/5"><svg class="mt-0.5 size-5 shrink-0 fill-zinc-950 dark:fill-white" viewBox="0 0 20 20" aria-hidden="true"><path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z"></path></svg> <div class="min-w-0 grow"><h3 class="text-base font-medium tracking-tight text-zinc-950 sm:text-sm dark:text-white"><a href="https://youtube.com/statamic" class="before:absolute before:inset-0">Videos</a></h3> <p class="mt-1 text-base text-pretty text-zinc-600 sm:text-sm dark:text-zinc-400">Watch walkthroughs on YouTube.</p></div></li> <li class="relative flex items-start gap-x-4 bg-white p-5 sm:p-6 dark:bg-zinc-950 dark:inset-ring dark:inset-ring-white/5"><svg class="mt-0.5 size-5 shrink-0 fill-zinc-950 dark:fill-white" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 0 0 1.33 0l1.713-3.293a.783.783 0 0 1 .642-.413 41.102 41.102 0 0 0 3.55-.414c1.437-.231 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2ZM6.75 7.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 2.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z" clip-rule="evenodd"></path></svg> <div class="min-w-0 grow"><h3 class="text-base font-medium tracking-tight text-zinc-950 sm:text-sm dark:text-white"><a href="https://statamic.com/discord" class="before:absolute before:inset-0">Discord</a></h3> <p class="mt-1 text-base text-pretty text-zinc-600 sm:text-sm dark:text-zinc-400">Hang with thousands of Statamic folks.</p></div></li> <li class="relative flex items-start gap-x-4 bg-white p-5 sm:p-6 dark:bg-zinc-950 dark:inset-ring dark:inset-ring-white/5"><svg class="mt-0.5 size-5 shrink-0 fill-zinc-950 dark:fill-white" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.499 5.085a3.471 3.471 0 0 1-.866 1.942 5.111 5.111 0 0 0 3.826-1.415A8.21 8.21 0 0 0 10 17c4.31 0 8-3.033 8-7s-3.69-7-8-7ZM6.75 9.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 2.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z" clip-rule="evenodd"></path></svg> <div class="min-w-0 grow"><h3 class="text-base font-medium tracking-tight text-zinc-950 sm:text-sm dark:text-white"><a href="https://github.com/statamic/cms/discussions" class="before:absolute before:inset-0">Discussions</a></h3> <p class="mt-1 text-base text-pretty text-zinc-600 sm:text-sm dark:text-zinc-400">Ask questions and get unstuck.</p></div></li></ul></div></main> <footer class="relative mx-auto w-full max-w-3xl px-6 pb-10 sm:px-8"><p class="text-sm text-zinc-500"><a href="https://github.com/statamic/cms" class="font-medium text-zinc-700 underline decoration-zinc-950/15 underline-offset-3 hover:decoration-zinc-950 dark:text-zinc-300 dark:decoration-white/20 dark:hover:decoration-white">Star Statamic on GitHub</a> if you enjoy using it.</p></footer></div>`);
}
//#endregion
//#region resources/components/Pages/Page.svelte
var Page_exports = /* @__PURE__ */ __exportAll({ default: () => Page });
function Page($$renderer, $$props) {
	let { title, content } = $$props;
	$$renderer.push(`<main class="max-w-200 m-0 mx-auto p-8 font-sans"><h1 class="text-amber-200 text-2xl">${escape_html(title)}</h1> <div class="my-8"><button class="bg-blue-400 text-white p-2 py-1 rounded">Zähler: ${escape_html(0)}</button></div> `);
	if (content) $$renderer.push(`<!--[0--><div class="prose">${escape_html(content)}</div>`);
	else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></main>`);
}
//#endregion
//#region resources/js/ssr.js
server_default((page) => createInertiaApp({
	page,
	resolve: (name) => {
		return (/* @__PURE__ */ Object.assign({
			"../components/Pages/ContactForm.svelte": ContactForm_exports,
			"../components/Pages/Home.svelte": Home_exports,
			"../components/Pages/Page.svelte": Page_exports
		}))[`../components/Pages/${name}.svelte`];
	},
	setup: ({ App, props }) => render(App, { props })
}));
//#endregion
export {};
