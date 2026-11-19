# Internship API

A small Express API backed by SQLite.

## Setup

Install dependencies:

```sh
npm install
```

## Run

Start the API:

```sh
npm start
```

The server listens on port `3000` by default. Set the `PORT` environment
variable to use another port.

## Seed the database

```sh
npm run seed
```

The SQLite database is created at `database/internship.db` the first time the
API or seed script runs. The seed script appends an example internship each
time it runs.

## Endpoints

- `GET /health` — returns the API health status.
- `GET /internships` — returns all internships.
