# Daytona Sandbox

This project includes:

- `Dockerfile.daytona` for a self-contained Daytona sandbox (Rails + local Postgres + Codex CLI)
- `docker-compose.daytona.yml` for optional local app + Postgres sidecar

## Prerequisites

- Daytona CLI installed and authenticated
- Docker available to Daytona

## Build a reusable snapshot

```bash
daytona snapshot create \
  --name store-rails-codex \
  --dockerfile Dockerfile.daytona \
  .
```

## Start in Daytona

```bash
daytona create . --dockerfile Dockerfile.daytona --name store-sandbox
```

The sandbox starts with `bin/daytona-start`, which:

- Ruby `3.4.8`
- Node `23.11.0`
- PostgreSQL in the same container
- Codex CLI (`@openai/codex`)
- Runs `bin/rails db:prepare`
- Starts `bin/dev`

## Use Codex in the sandbox

```bash
codex --help
```

If you need authentication inside the sandbox, follow the Codex CLI login flow there.

## Optional DB overrides

You can override defaults in the Daytona sandbox env:

```bash
DAYTONA_DB_NAME=store_development
DAYTONA_DB_USER=store
DAYTONA_DB_PASSWORD=store
```

If `DATABASE_URL` is already set, it is respected.

## TypeScript SDK flow

Create sandbox with:

```bash
npx tsx scripts/daytona-create.ts
```

Useful env vars:

```bash
DAYTONA_SANDBOX_NAME=store-sandbox
DAYTONA_SNAPSHOT_NAME=store-rails-codex
DAYTONA_AUTO_STOP_INTERVAL=0
DAYTONA_AUTO_ARCHIVE_INTERVAL=10080
DAYTONA_AUTO_DELETE_INTERVAL=-1
```

The SDK script creates/reuses a snapshot from `Dockerfile.daytona`, then creates/starts the sandbox and leaves it running.

## Local Docker Compose workflow

For local non-Daytona usage:

```bash
bin/daytona-up
```

## Stop the stack

```bash
bin/daytona-down
```
