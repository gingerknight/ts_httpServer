# TypeScript Web Server with JWT, and PostgresDB

> [!Note] 
> This is a guided project from Boot.dev to build and learn HTTP/Web servers in Typescript. The build creates similar features as a social network like Twitter.

Chirpy is a TypeScript/Express service that exposes a small social feed with JWT auth, refresh tokens, and admin utilities. It boots an HTTP API, bundles minimal static assets for /app, and includes helpers for validation, metrics, and error handling.

## Goals of This Project

- Understand the fundamentals of web servers
> Learn what a web server is, how it handles HTTP requests, and how it powers real-world web applications.

- Build an HTTP server 
> Implement routing, request parsing, and response handling in TypeScript with a framework. (Express)

- Learn TypeScript for backend development
> Explore how TypeScript’s static typing improves developer experience, correctness, and maintainability.

- Use production-ready tooling
> Set up a build pipeline, organize code with modules, and run the server with robust configuration, logging, and error handling.

## What Did We Build?

We built a much simpler working social platform called Chirpy — a toy social network loosely inspired by Twitter.

While it’s not production-ready or feature-complete, Chirpy demonstrates all the core components of a functioning web server:

- HTTP request routing and response handling
- Serving static HTML, CSS, and JavaScript assets
- Basic dynamic pages rendered from templates
- In-memory storage of user data and “chirps” (posts)
- Configurable metrics and admin utilities

## Tech Stack

- Runtime: Node.js 20 (see .nvmrc)
- Frameworks: Express 5, Drizzle ORM over Postgres
- Tooling: pnpm, TypeScript, Vitest, Zod, Bcrypt, JSON Web Tokens
- Storage: PostgreSQL with migration support via drizzle-kit

### Project Structure

```
├── src/
│   ├── api/            # Route handlers (chirps, auth, tokens, readiness)
│   ├── admin/          # Metrics and reset endpoints
│   ├── app/            # Static assets served under /app
│   ├── db/             # Drizzle config, queries, migrations
│   ├── lib/            # Auth, validation helpers
│   ├── middleware/     # Logging, metrics, error handlers
│   ├── schema.ts       # Drizzle table definitions
│   └── test/           # Vitest suites
├── dist/               # Build output
├── drizzle.config.ts   # Migration generator config
└── README.md

```

### Running the Project

####  Prequisites


- Install pnpm (npm install -g pnpm) and use Node 20 (nvm use handles it).
- Ensure PostgreSQL is running locally and reachable with the connection string used in .env.
- Copy `.env.example` (if present) or create `.env` with **PORT, PLATFORM, SECRET, DB_URL**.
- Run `pnpm install` from the project root.


#### Setup & Commands

```
pnpm install — install dependencies
pnpm build — compile TypeScript into dist/
pnpm dev — rebuild then start the API
pnpm start — run the pre-built JS in production mode
pnpm test — execute Vitest suite
```

#### Database Migrations
- `pnpm migrate` — apply pending migrations (server also auto-runs on boot via src/index.ts)
- `pnpm generate` — diff current schema (src/schema.ts) against the database and emit a new SQL migration into src/db/migrations/
> [!Caution]
> Deleting or hand-editing migrations is unsafe; additive migrations or reset the DB in dev if needed.

## Testing & Coverage

- Tests live under `src/test/` and use Vitest.
- `pnpm test` runs all suites; add a note that 
> [!Tip]
> coverage requires `pnpm add -D @vitest/coverage-v8` and then `pnpm coverage` 

## API Definitions

- POST /api/users — create account (hashes password with bcrypt)
- POST /api/login — issue JWT and refresh token (records token in DB)
- POST /api/chirps — create chirp after header-based auth/validation
- GET /api/chirps, GET /api/chirps/:id — fetch chirps
- POST /api/refresh / POST /api/revoke — manage refresh tokens
- GET /api/healthz, GET /admin/metrics, POST /admin/reset — readiness and admin utilities
> [!Note]
> Requests needing auth expect a Bearer refresh token and JWT secret configured via `.env`.

## Next Steps

**Future improvements could include:**

- Markdown-powered blog posts
- Further development of FrontEnd for use in WebBrowser
- Implement API Documentation like Swagger & JSDocs
- Deployment to AWS ECS or EC2

## About This Project

This project was built as part of a guided learning exercise to understand the fundamentals of backend development, HTTP servers, and production deployment using TypeScript.