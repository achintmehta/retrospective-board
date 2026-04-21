## Context

A real-time retrospective board requires simultaneous multi-user interactions that are synchronized instantly. Key challenges include maintaining real-time states across connections, storing state easily without database servers, and making it self-hostable. The application needs to be packaged in Docker so any team can run it internally with minimal configuration. We will ensure all pieces are open-source and MIT licensed.

## Goals / Non-Goals

**Goals:**
- Provide a robust, real-time sync engine utilizing Socket.IO.
- Store board, column, and card data persistently using a lightweight database.
- Provide a single unified Docker container covering both the backend API and frontend client.
- Build an interactive React frontend that syncs changes quickly across clients.

**Non-Goals:**
- User authentication and authorization flows (all edits and changes are open).
- Supporting massive enterprise deployments involving thousands of concurrent user syncs; the scope targets team-level deployments.
- Using heavyweight databases like PostgreSQL or MongoDB that complicate simple Docker setups.

## Decisions

- **Framework Stack**: Node.js + Express backend, React (via Vite) frontend.
  - *Rationale*: Most widely supported JS ecosystem, straightforward to bundle into a single container. Both are MIT licensed.
- **Real-Time Engine**: Socket.IO.
  - *Rationale*: Simplifies WebSocket usage by abstracting connection complexities (like fallbacks), ensuring high compatibility across varying network configurations.
- **Database**: SQLite.
  - *Rationale*: Zero-configuration, file-based database, ideal for simple server setups. The database file can be mapped as a Docker volume for persistence, perfect for self-hosting.
- **Anonymous Operations**: 
  - *Rationale*: Cards and boards operate without tying events to logged-in user profiles. Session-based UI indicators can locally delineate authors if desired, but there is no forced login.

## Risks / Trade-offs

- **Collision of Events**: Handling real-time drag-and-drop or card edits concurrently could lead to conflicting states.
  - *Mitigation*: Treat backend SQLite writes as the ultimate source of truth. Send events with timestamps/versions and broadcast final state to clients instead of optimistically resolving high-conflict items.
- **SQLite Concurrency**: SQLite locks the whole database on write operations.
  - *Mitigation*: For team-level scale environments, write frequency falls well within SQLite capabilities (typically 100k+ writes/second is achievable on SSDs). Use WAL mode.
