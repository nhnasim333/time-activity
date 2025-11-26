# Activity Timeline

Full-stack application for tracking and summarizing user activity events.

## How to Run

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Setup
1.  **Database**:
    -   Ensure MongoDB is running locally OR have a MongoDB Atlas connection string.
    -   Create a `.env` file in the `server/` directory with:
```
        DATABASE_URL=mongodb://localhost:27017
        PORT=5000
```
    -   Or for MongoDB Atlas:
```
        DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/activity_timeline
        PORT=5000
```

2.  **Backend**:
```bash
    cd server
    npm install
    node server.js
```
    The server runs on `http://localhost:5000`.

3.  **Frontend**:
```bash
    cd client
    npm install
    npm start
```
    Open the URL shown (usually `http://localhost:3000`).

## Design Decisions
-   **Backend**:
    -   Used native MongoDB driver (`mongodb` package) to avoid ORM constraints.
    -   Manual validation implemented in `eventController.js` without external validation libraries.
    -   Modular pattern with separate controllers, routes, and config for better code organization.
    -   Simple folder structure: `config/`, `controllers/`, `routes/`.
-   **Frontend**:
    -   React with Create React App for standard development setup.
    -   Plain CSS (`App.css`) with custom styling - no UI libraries used.
    -   Component-based structure (`EventForm`, `EventList`, `Summary`) for maintainability and reusability.

## Time Spent
-   Approximately 4-5 hours across planning, implementation, testing, and documentation.

## Challenges Faced
-   Implementing manual validation for different event types required careful type checking and error aggregation.
-   Calculating `mostActiveDay` manually using native JavaScript grouping logic without aggregation frameworks.
-   Ensuring clean code structure while maintaining the "one comment per file" constraint.
-   Managing CORS and proper error handling between frontend and backend.
```
