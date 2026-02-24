# Store Demo App

Minimal Rails 8 demo application for managing products.

## Stack

- Ruby 3.4.8
- Rails 8.1
- PostgreSQL
- Propshaft + jsbundling-rails + cssbundling-rails
- Tailwind CSS (via `@tailwindcss/cli`)

## Features

- `Product` resource with full CRUD
- `Product` has one attribute: `name`
- Homepage (`/`) points to `products#index`

## Setup

```bash
bin/setup
```

If needed, run manually:

```bash
bundle install
npm install
bin/rails db:prepare
npm run build
npm run build:css
```

## Run the app

```bash
bin/dev
```

`bin/dev` starts Rails and asset watchers.

## Run tests

```bash
bin/rails test
```

## Daytona sandbox

Use [docs/daytona.md](docs/daytona.md) to run this project with Daytona + Docker Compose (`app` + Postgres sidecar) and Codex CLI preinstalled.
Quick commands: `bin/daytona-up` and `bin/daytona-down`.

## Demo flow

1. Open `/`
2. Create product
3. Edit product name
4. Delete product

## Notes

- This app is intentionally simple and optimized for demos.
- Keep domain scope minimal unless explicitly requested.
