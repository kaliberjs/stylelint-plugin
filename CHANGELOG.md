# Changelog

## Unreleased

### Changed
- Migrated all source files from CommonJS to ES modules (`import`/`export`) following the [stylelint v16 migration guide](https://stylelint.io/migration-guide/to-16#deprecated-commonjs-api)
- Added `"type": "module"` and `"exports"` field to `package.json`
- Updated stylelint to v17

## 1.0.3 — 2025-10-29

### Added
- New margin shorthand properties allowed in layout-related rules: `margin-inline`, `margin-inline-start`, `margin-inline-end`, `margin-block`, `margin-block-start`, `margin-block-end`
- Added `ch` unit to the allowed units list

## 1.0.2 — 2025-03-28

### Changed
- Moved dependencies from `peerDependencies` to `dependencies` so consumers get them automatically
- Fixed test runner error (`TypeError: The "paths[0]" argument must be of type string`)

## 1.0.1 — 2025-03-28

### Changed
- Dependency adjustments (moved `peerDependencies` to `dependencies`)

## 1.0.0 — 2025-02-21

### Changed
- Updated README

## 0.0.1 — 2025-02-17

### Added
- Initial release with rules: `color-schemes`, `css-global`, `layout-related-properties`, `naming-policy`, `selector-policy`, `parent-child-policy`, `root-policy`, `at-rule-restrictions`, `index`, `reset`
- Integration tests and unit tests for all rules
