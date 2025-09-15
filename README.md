# TypeScript Web Server from Scratch

This project is a guided exploration of how to build and host a web server using TypeScript with minimal reliance on frameworks or heavy libraries. It’s designed to provide a deep understanding of how the web works under the hood, rather than just wiring together existing tooling.

## Goals of This Project

- Understand the fundamentals of web servers
> Learn what a web server is, how it handles HTTP requests, and how it powers real-world web applications.

- Build an HTTP server from scratch
> Implement routing, request parsing, and response handling in TypeScript without frameworks like Express, Koa, or Fastify.

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

- TypeScript — the primary development language
- Node.js (HTTP module) — powering the low-level web server logic
- No frameworks — everything is implemented manually for learning purposes
- Lightweight utilities only — minimal external dependencies (e.g. for development tooling)

### Project Structure

```
├── src/
│   ├── server.ts          # Entry point
│   ├── routes/             # Request handlers
│   ├── utils/               # Helper functions
│   └── types/               # Type definitions
├── public/                 # Static assets (HTML/CSS/JS)
├── templates/              # HTML templates
├── config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Running the Project

```
# Install dependencies
npm install

# Build the project (TS -> JS)
npm run build

# Start the server
npm run dev
```

## Next Steps

**Future improvements could include:**

- Markdown-powered blog posts
- Persistent storage with a database
- Authentication and sessions
- Deployment to AWS ECS or EC2

## About This Project

This project was built as part of a guided learning exercise to understand the fundamentals of backend development, HTTP servers, and production deployment using TypeScript.