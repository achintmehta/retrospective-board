# Retrospective Board 🔄

A **self-hosted, real-time retrospective board** for agile teams. Open-source, MIT-licensed, deployable locally or as a Docker image — no account required.

## Preview

### Dashboard (Dynamic Workspace)
![TeamSync Dashboard](docs/screenshots/home-page-v3.png)

### Board Interface (High Fidelity)
![Sprint Retrospective](docs/screenshots/board-view-v3.png)

## Features

- 📋 **Flexible Organization**: Create board groups and categorize your retrospectives into custom workspaces.
- 🌈 **Theme Customization**: Tailor the interface to your preference with primary and secondary color controls.
- ⚡ **Real-time Collaboration**: Instant sync across all connected clients via Socket.IO.
- 🃏 **Rich Card Interactions**: Drag-and-drop movement, reactions, and threaded replies with image support.
- 🕵️ **Anonymity Options**: Post cards anonymously or with your name for safe feedback.
- 📤 **Advanced Export**: Save your board state as clean **Markdown** or high-fidelity **PDF** snapshots.
- 💾 **Persistent Storage**: Robust data preservation using SQLite.
- 🐳 **One-Click Deployment**: Docker-ready, single-container deployment or Docker Compose.

## Tech Stack (all MIT-licensed)

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Real-time | Socket.IO |
| Backend | Node.js + Express |
| Database | SQLite (sqlite3) |
| Drag & Drop | @hello-pangea/dnd |
| Container | Docker |

---

## Local Development

### Prerequisites
- Node.js ≥ 18
- npm

### Install all dependencies
```bash
npm install          # root (concurrently)
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Start everything with one command
```bash
npm run dev
```

This starts both the backend (port 3001) and the Vite dev server (port 5173) in a single terminal with colour-coded output. Open **http://localhost:5173** in your browser.

> The Vite dev server proxies `/api` and `/socket.io` to the backend automatically.


---

## Production (Docker)

### Single container
```bash
docker build -t retro-board .
docker run -p 3001:3001 -v retro-data:/app/data retro-board
```

### With Docker Compose
```bash
docker compose up -d
```

Open **http://localhost:3001** in your browser.

---

## Configuration

| Environment variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `DATA_DIR` | `./data` | SQLite database directory |
| `CLIENT_URL` | `*` | Allowed CORS origin |

---

## Agentic Workspace & MCP 🤖

This platform is a **First-Class AI Environment**. It includes a robust implementation of the **Model Context Protocol (MCP)**, allowing AI agents to participate in retrospectives alongside human team-members.

### 🔌 Connectivity Options

The server supports dual-mode transport for maximum flexibility:

#### 1. Claude Desktop (SSE / Web mode)
Best for persistent, browser-connected agents. Add this to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "retro-board": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

#### 2. Claude CLI / Claude Code (Stdio mode)
Best for terminal-based agents and local development. Point your CLI directly to the server script:
```bash
node server/src/index.js --stdio
```

### 🔔 Persistent Notification Center
Unlike standard message bridges, this server maintains a **Persistent Activity Log** in SQLite. Agents can "catch up" on missed activity using the `get_recent_notifications` tool or subscribe to real-time `resources/updated` alerts.

### 🛠️ Agent Tool Suite
Agents gain access to 15+ specialized tools, including:
- `get_board_details`: Retrieves structured JSON with `cardId` and `columnId` for programmatic interaction.
- `add_feedback_card`: Proactively contribute to any column.
- `get_recent_notifications`: Query the high-fidelity activity heartbeat.
- `generate_board_summary`: AI-optimized board analysis.

---

## API Specification (OpenAPI) 📖

The project maintains an automated **OpenAPI 3.0** specification.

### 📦 Discovery
You can discover the full API surface by accessing the static specification:
- **URL**: `http://localhost:3001/openapi.json`
- **Format**: JSON-Spec (OAS 3.0)

### ⚙️ Generation
The specification is automatically generated from JSDoc comments in the codebase. To regenerate the spec after making changes, run:
```bash
npm run gen-api
```

---

## License

MIT © RetroBoard Contributors
