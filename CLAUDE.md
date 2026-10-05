# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Buzzword Bingo for SAP-related events — a freestyle SAPUI5/Fiori application written in TypeScript. It was scaffolded with the SAP Fiori Application Generator (Basic template) and is currently at skeleton stage: `View1` is an empty page with no bingo logic implemented yet.

- Namespace: `de.itsfullofstars.buzzwordbingo.de.itsfullofstars.buzzwordbingo` (doubled namespace — this is how the generator emitted it; `sap.app.id` in [manifest.json](webapp/manifest.json) and the `paths` entry in [tsconfig.json](tsconfig.json) both repeat the segment, so new files must use the same doubled path when referencing the namespace).
- UI5 version: 1.153.0, theme `sap_horizon`.
- No backend service is configured (`Service Type: None`) — there is no OData/mock data layer yet.

## Commands

```bash
npm start              # run via FLP sandbox against ui5.sap.com (runs ts-typecheck first)
npm run start-local     # same, but using ui5-local.yaml (local SAPUI5 framework libs, no proxy to ui5.sap.com)
npm run start-noflp      # run index.html directly, without the Fiori Launchpad sandbox
npm run build            # ui5 build --clean-dest --dest dist (runs ts-typecheck first)
npm run ts-typecheck     # tsc --noEmit
npm run lint              # eslint ./
npm run unit-test        # opens test/unit/unitTests.qunit.html via fiori run
npm run int-test          # opens test/integration/opaTests.qunit.html via fiori run (OPA5 journey tests)
```

There is no headless/CI test runner wired up — `unit-test` and `int-test` open a QUnit HTML runner in a browser via `fiori run`. To run a single QUnit test, filter by module/test name in the browser's QUnit UI (e.g. append `?module=View1%20Controller` to the opened URL) rather than passing a CLI flag.

TypeScript is transpiled to UI5 modules via `ui5-tooling-transpile` (both as a dev-server middleware and a build task in [ui5.yaml](ui5.yaml)); `tsc --noEmit` is only used for type-checking, not compilation.

## Architecture

Standard SAPUI5 MVC layout under [webapp/](webapp/):

- [Component.ts](webapp/Component.ts) — app entry point (`sap.ui.core.IAsyncContentCreation`); sets up the `device` JSON model and initializes routing.
- [manifest.json](webapp/manifest.json) — declares the `i18n` resource model, routing config (router class `sap.m.routing.Router`, single route `RouteView1` targeting `View1`), and CSS resources. Routing/target config here must stay in sync with [controller/App.controller.ts](webapp/controller/App.controller.ts) / [view/App.view.xml](webapp/view/App.view.xml) (root view, holds the `app` aggregation that routed views are added to) and [view/View1.view.xml](webapp/view/View1.view.xml) + [controller/View1.controller.ts](webapp/controller/View1.controller.ts) (the actual page).
- [model/models.ts](webapp/model/models.ts) — exports model factory functions (currently just `createDeviceModel`); add new JSON/i18n model factories here rather than inline in `Component.ts`.
- [css/style.css](webapp/css/style.css) — global custom styling, registered via `sap.ui5.resources.css` in manifest.json.
- [i18n/i18n.properties](webapp/i18n/i18n.properties) — all user-facing text must go through this bundle (`{i18n>key}` bindings), not hardcoded strings in views/controllers.
- [test/unit/](webapp/test/unit/) — QUnit controller unit tests (one file per controller, instantiates the controller directly and calls lifecycle methods).
- [test/integration/](webapp/test/integration/) — OPA5 journey tests; [pages/](webapp/test/integration/pages/) holds one page-object file per view (`AppPage.ts`, `View1Page.ts`) that OPA journeys (`NavigationJourney.ts`) use for arrangements/actions/assertions.
- [test/flpSandbox.html](webapp/test/flpSandbox.html) — local Fiori Launchpad sandbox used by `npm start`/`start-local` to host the app under an FLP tile/intent (`action: display`, object derived from the namespace with dots stripped).

Two near-identical UI5 YAML configs exist: [ui5.yaml](ui5.yaml) (default, proxies `/resources` and `/test-resources` to `https://ui5.sap.com`) and [ui5-local.yaml](ui5-local.yaml) (declares `sap.m`, `sap.ui.core`, `sap.ushell`, `themelib_sap_horizon` as `framework.libraries` so they're served from locally installed packages instead of the CDN proxy). Keep both in sync when changing middleware/build config, since one is just `start` and the other `start-local`.

Linting uses `@sap-ux/eslint-plugin-fiori-tools` recommended config ([eslint.config.mjs](eslint.config.mjs)) — this enforces SAP Fiori tooling conventions (e.g. UI5 namespace/module rules) on top of standard TS linting.
