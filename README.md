# Activity Timeline

Full-stack application for tracking and summarizing user activity events.

## How to Run

### Prerequisites
- Node.js
- PostgreSQL

### Setup
1.  **Database**:
    -   Ensure PostgreSQL is running.
    -   Create a database named `activity_timeline` (or update `.env` in `server/`).
    -   Default connection: `postgresql://postgres:postgres@localhost:5432/activity_timeline`

2.  **Backend**:
    ```bash
    cd server
    npm install
    node server.js
    ```
    The server runs on `http://localhost:3000`. The database schema is initialized automatically on start.

3.  **Frontend**:
    ```bash
    cd client
    npm install
    npm run dev
    ```
    Open the URL shown (usually `http://localhost:5173`).

## Design Decisions
-   **Backend**:
    -   Used `pg` library for native PostgreSQL queries to avoid ORM overhead and meet constraints.
    -   Manual validation implemented in `server.js` to avoid external validation libraries.
    -   Single file `server.js` for simplicity, with separated `db.js` for connection.
-   **Frontend**:
    -   React with Vite for a modern, fast development experience.
    -   Plain CSS (`index.css`) with CSS variables for consistent theming without UI libraries.
    -   Component-based structure (`EventForm`, `EventList`, `Summary`) for maintainability.

## Time Spent
-   Approximately 45 minutes.

## Challenges Faced
-   Implementing manual validation and grouping logic without libraries required careful handling of edge cases and data structures.
-   Ensuring the "one comment per file" constraint required writing self-documenting code.
