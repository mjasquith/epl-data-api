# epl-data-api

The goal is to simplify the retrieval of Premier League fixtures and results data.

## Getting Started

### Prerequisites

- Node.js 20+ (for local development)
- npm or yarn
- Docker (for containerized deployment)

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Configuration

Create a `src/config/config.json` file with your football-data.org API token:

```json
{
  "footballDataApiToken": "your-api-token-here",
  "cache": {
    "defaultTtlMs": 300000,
    "matches": {
      "fixtures": 300000,
      "results": 300000,
      "all": 300000
    }
  }
}
```

Alternatively, set the `FOOTBALL_DATA_API_TOKEN` environment variable:

```bash
export FOOTBALL_DATA_API_TOKEN="your-api-token-here"
```

## Running the App

### Development Mode

To run the app in development mode with hot-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`. The Swagger API documentation is available at `http://localhost:3000/api-docs`.

### Production Mode

Build the TypeScript code to JavaScript:

```bash
npm run build
```

Start the server:

```bash
npm start
```

## Building & Running with Docker

### Build the Docker Image

```bash
docker build -t epl-data-api:latest .
```

### Run the Docker Container

```bash
docker run -d \
  -p 3000:3000 \
  -e FOOTBALL_DATA_API_TOKEN="your-api-token-here" \
  --name epl-data-api \
  epl-data-api:latest
```

The server will be available at `http://localhost:3000`.

### Advanced Docker Usage

To run with a custom config file:

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/src/config/config.json:/app/src/config/config.json \
  --name epl-data-api \
  epl-data-api:latest
```

To view logs:

```bash
docker logs -f epl-data-api
```

To stop the container:

```bash
docker stop epl-data-api
docker rm epl-data-api
```

## API Endpoints

- `GET /health` - Health check
- `GET /matches/fixtures` - Get upcoming matches
- `GET /matches/results` - Get completed/live matches
- `GET /matches/all` - Get all matches

Full API documentation available at `/api-docs` when the server is running.
