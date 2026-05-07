# album-api-v2

Node.js + TypeScript rewrite of the original .NET albums API.

This service manages albums in memory and exposes REST routes compatible with the existing Vue app.

## Requirements

- Node.js 20+
- npm

## Quick Start

From repository root:

```bash
cd album-api-v2
npm install
npm test
npm run build
npm start
```

The API starts on http://localhost:3000 by default.

You can override the port:

```bash
PORT=3000 npm start
```

## Development Mode

```bash
cd album-api-v2
npm run dev
```

## Run With Album Viewer

In two terminals from repository root:

Terminal 1:

```bash
cd album-api-v2
npm install
npm run dev
```

Terminal 2:

```bash
cd album-viewer
npm install
npm run dev
```

The Vue app runs on http://localhost:3001 and proxies /albums to this API on port 3000.

## API Routes

Base URL: http://localhost:3000

### GET /albums
Returns all albums.

- Response: 200 OK

### GET /albums/:id
Returns one album by id.

- Response: 200 OK
- Response: 404 Not Found when id does not exist

### GET /albums/year/:year
Returns albums by release year.

- Response: 200 OK

### POST /albums
Creates a new album. Id is assigned automatically.

Request body:

```json
{
  "title": "Ops Anthem",
  "artist": "Node Runners",
  "year": 2026,
  "price": 9.99,
  "image_url": "https://example.com/ops-anthem.jpg"
}
```

- Response: 201 Created
- Response body includes created album with generated id

### PUT /albums/:id
Replaces an album by id.

Request body:

```json
{
  "title": "Ops Anthem (Remastered)",
  "artist": "Node Runners",
  "year": 2026,
  "price": 10.99,
  "image_url": "https://example.com/ops-anthem-v2.jpg"
}
```

- Response: 200 OK
- Response: 404 Not Found when id does not exist

### DELETE /albums/:id
Deletes an album by id.

- Response: 204 No Content
- Response: 404 Not Found when id does not exist

## Data Model

```ts
interface Album {
  id: number;
  title: string;
  artist: string;
  year: number;
  price: number;
  image_url: string;
}
```

## Notes

- Data is in memory only and resets on process restart.
- Seed data matches the original albums-api sample data titles, artists, years, prices, and image URLs.
- CORS is enabled for local development.
