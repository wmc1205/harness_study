# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A small, dependency-free static web project (Korean UI, `lang="ko"`). There is no build step, package manager, linter, or test suite. To run it, open `index.html` directly in a browser (or serve the folder with any static server, e.g. `python3 -m http.server`).

- `index.html` + `style.css` + `app.js`: a Todo list app.
- `js-basics.html`: a standalone, self-contained JavaScript study-notes page (inline `<style>`, no JS dependencies); unrelated to the Todo app.

## Todo app architecture

`app.js` is a single script with module-level state, no framework:

- State is the `todos` array (`{ id, text, done }`, `id = Date.now()`), persisted as JSON in `localStorage['todos']`.
- Every mutation (`addTodo`, `toggleTodo`, `deleteTodo`) follows the same pattern: update `todos` → `save()` → `render()`. `render()` rebuilds the whole list via DOM APIs (`textContent`, not `innerHTML` with user data) and updates the remaining-count element.
- Theme: `localStorage['theme']` (`'light'`/`'dark'`) is applied as `data-theme` on `<html>`. An inline script in `<head>` of `index.html` sets it before first paint to avoid a flash, so keep it there. When no explicit theme is stored, `app.js` falls back to the `prefers-color-scheme` media query (`isDark()`). `style.css` must therefore support both `[data-theme]` overrides and the media query.
- Element IDs in `index.html` (`todo-form`, `todo-input`, `todo-list`, `todo-count`, `theme-toggle`) are looked up by `app.js`; renaming one requires updating both.
