# Daytona Sandbox

This project includes:

- `Dockerfile.daytona` for the app sandbox image (with Codex CLI)
- `docker-compose.daytona.yml` for app + Postgres sidecar

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

## Start app + Postgres

```bash
bin/daytona-up
```

This starts:

- Ruby `3.4.8`
- Node `23.11.0`
- Postgres `16` sidecar (`db` service)
- Codex CLI (`@openai/codex`)
- Rails app on `http://localhost:3000`

## Use Codex in the sandbox

```bash
codex --help
```

If you need authentication inside the sandbox, follow the Codex CLI login flow there.

## Optional: create a Daytona workspace first

If you want this repo opened in Daytona before running Compose:

```bash
daytona create . --dockerfile Dockerfile.daytona --name store-sandbox
```

Then run inside that workspace:

```bash
bin/daytona-up
```

## Stop the stack

```bash
bin/daytona-down
```
