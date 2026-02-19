# AGENTS

## Purpose

This is a demo Rails 8 app. Keep functionality intentionally simple.

## Product direction

- Primary goal: demonstrate a basic CRUD workflow.
- Current domain: `Product` with a single `name` attribute.
- Homepage should remain the entry point for product management (`/` -> `products#index`).

## Implementation guidelines

- Prefer Rails conventions and generators.
- Avoid introducing new architecture layers unless required.
- Minimize dependencies and configuration complexity.
- Prioritize readability over abstraction.

## UI guidelines

- Keep UI plain and functional.
- Forms and actions must be clearly visible and usable.
- Avoid heavy custom styling; keep only lightweight defaults.

## Testing guidelines

- Add/update tests for behavior changes.
- Keep test setup simple and fast.

## Out of scope unless requested

- Authentication/authorization
- Background jobs, caching, search, external integrations
- Multi-entity business workflows
