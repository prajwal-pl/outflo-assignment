# Outflo Server

Backend server for the Outflo application that handles campaign management and LinkedIn profile parsing.

## Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

This will automatically build the TypeScript files to JavaScript (in the `/dist` folder) due to the postinstall script.

## Development

For local development with automatic reloading:

```bash
npm run dev
```

This uses Bun to run the server with live reload on code changes.

## Production

For production deployment:

1. Build the TypeScript files:

```bash
npm run build
```

2. Start the server:

```bash
npm start
```

The `start` script will run the compiled JavaScript from the `dist` directory.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=8000
GROQ_API_KEY=your_groq_api_key
RAPIDAPI_KEY=your_rapidapi_key
```

## API Endpoints

- `GET /campaigns` - Get all campaigns
- `GET /campaigns/:id` - Get a campaign by ID
- `POST /campaigns` - Create a new campaign
- `PUT /campaigns/:id` - Update a campaign
- `DELETE /campaigns/:id` - Delete a campaign
- `POST /personalized-message` - Generate a personalized message from LinkedIn profile
