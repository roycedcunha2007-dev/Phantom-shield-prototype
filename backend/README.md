# Phantom Shield Backend

Phase 2 backend foundation for Phantom Shield. This is an API and real-time infrastructure layer only.

It does **not** implement AI models, endpoint agents, real threat detection, or frontend changes.

## Tech stack

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- bcrypt
- dotenv
- Socket.io
- express-validator
- cors
- helmet
- morgan

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Make sure MongoDB is running and `MONGODB_URI` points to your database.

## Environment variables

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/phantom-shield
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## Scripts

```bash
npm run dev     # Start development server
npm run build   # Compile TypeScript
npm start       # Run compiled server
npm run seed    # Seed MongoDB with Phantom Shield mock data
```

## API response format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Error detail"
}
```

## Endpoints

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `POST /api/auth/logout`

### Devices

Protected routes.

- `GET /api/devices?page=1&limit=10`
- `GET /api/devices/:id`
- `POST /api/devices`
- `PATCH /api/devices/:id`
- `DELETE /api/devices/:id`

### Alerts

Protected routes.

- `GET /api/alerts?page=1&limit=10`
- `GET /api/alerts/:id`
- `POST /api/alerts`
- `PATCH /api/alerts/:id`
- `DELETE /api/alerts/:id`
- `PATCH /api/alerts/:id/block`
- `PATCH /api/alerts/:id/unblock`

### Recommendations

Protected routes.

- `GET /api/recommendations`
- `POST /api/recommendations`
- `PATCH /api/recommendations/:id/apply`

## Folder structure

```text
backend/
  src/
    config/
    controllers/
    database/
    middleware/
    models/
    routes/
    services/
    types/
    utils/
    websocket/
    server.ts
```

## Future integration notes

The backend is intentionally a foundation layer. Later phases can connect:

- frontend mock service replacement
- real endpoint agents
- telemetry ingestion pipelines
- AI risk engine outputs
- audit logging and role-based authorization

Markers are already present in code:

```ts
// TODO: integrate AI risk engine
// TODO: integrate endpoint agents
// TODO: integrate real-time telemetry ingestion
```
