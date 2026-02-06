# HRMS Lite

Production-style lightweight Human Resource Management System for a single admin to manage employee records and daily attendance.

## Live Deployment

- Frontend (Netlify): `ADD_NETLIFY_URL_HERE`
- Backend API (Render): `ADD_BACKEND_URL_HERE`

After deployment, update the placeholders above.

## Features

- Employee management
- Add employee (`employeeId`, `fullName`, `email`, `department`)
- View all employees in a structured table
- Delete employee with safe cascade cleanup of attendance
- Attendance management
- Mark attendance by employee and date (`Present` / `Absent`)
- View attendance history by employee
- Chronological attendance records
- Validation and resilience
- Required field validation
- Unique employee ID and unique email enforcement
- Email format validation
- Duplicate attendance prevention per employee/day
- Structured JSON error responses and proper HTTP status codes
- Professional UI/UX
- Responsive layout (mobile + desktop)
- Loading, empty, error, and success states
- Reusable components and clean navigation

## Tech Stack

### Frontend
- React 19 + Vite
- React Router
- Plain CSS (responsive, component-driven)

### Backend
- Node.js + Express
- Sequelize ORM
- SQLite (persistent file DB)
- Zod validation
- Jest + Supertest API tests

### Deployment
- Netlify (frontend via GitHub)
- Render (backend API)

## Monorepo Structure

```text
HRMS Lite/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── database/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── netlify.toml
├── render.yaml
└── README.md
```

## System Architecture Overview

- React frontend calls REST APIs over HTTP.
- Express backend exposes modular routes/controllers/services.
- Sequelize models enforce relational consistency:
  - `Employee` has many `Attendance`
  - Attendance rows are deleted automatically when employee is deleted.
- SQLite file provides persistence (`backend/database/dev.sqlite` locally).

## Database Schema

### Employee
- `id` (PK, auto-increment)
- `employeeId` (unique business ID)
- `fullName`
- `email` (unique)
- `department`
- `createdAt`
- `updatedAt`

### Attendance
- `id` (PK, auto-increment)
- `employeeId` (FK -> Employee.id, cascade delete)
- `date`
- `status` (`Present` | `Absent`)
- `createdAt`
- `updatedAt`
- Unique composite index: (`employeeId`, `date`)

## API Endpoints

Base URL examples:
- Local backend: `http://localhost:5001`
- Deployed backend: `https://your-backend-domain.com`

### Employee APIs
- `POST /employees` - create employee
- `GET /employees` - fetch all employees
- `DELETE /employees/:id` - delete employee

### Attendance APIs
- `POST /attendance` - mark attendance
- `GET /attendance/:employeeId` - attendance history for one employee

### Health
- `GET /health`
- `GET /api/health`

> Backward-compatible aliases `/api/employees` and `/api/attendance` are also enabled.

## Validation Rules

### Employee
- `employeeId`: required, max length 40, unique
- `fullName`: required, min length 2
- `email`: required, valid format, unique
- `department`: required, min length 2

### Attendance
- `employeeId`: required, integer, must reference an existing employee
- `date`: required, valid `YYYY-MM-DD`
- `status`: required, one of `Present` / `Absent`
- No duplicate attendance for same employee on same date

## Error Handling Standards

Structured response shape:

```json
{
  "error": {
    "message": "Human-readable error",
    "details": []
  }
}
```

Status code examples:
- `400` validation error
- `404` resource not found
- `409` duplicate resource conflict
- `500` server error

## Local Setup

## 1) Clone

```bash
git clone https://github.com/rockygupta01/HRMS-Lite.git
cd HRMS-Lite
```

## 2) Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5001`.

## 3) Frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5001
DB_STORAGE=database/dev.sqlite
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5001
```

## Testing & Quality Checks

### Backend tests

```bash
cd backend
npm test
```

### Frontend lint/build

```bash
cd frontend
npm run lint
npm run build
```

## Deployment (GitHub-based)

## Frontend to Netlify (required)

1. Push this repo to GitHub.
2. In Netlify: **Add new site** -> **Import an existing project** -> choose GitHub repo `rockygupta01/HRMS-Lite`.
3. Netlify build settings (already captured in `netlify.toml`):
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add env var in Netlify:
   - `VITE_API_BASE_URL=https://<your-backend-url>`
5. Deploy.

## Backend to Render

1. In Render: **New** -> **Blueprint** and select this repo (uses `render.yaml`), or create a web service manually from `backend`.
2. Ensure persistent disk mount exists at `/var/data` (configured in `render.yaml`).
3. Set `CORS_ORIGIN` to your Netlify domain.
4. Deploy and note backend URL.

## Integration Checklist

- Frontend `VITE_API_BASE_URL` points to live backend URL
- Backend `CORS_ORIGIN` includes Netlify URL
- All operations tested on deployed app:
  - create/list/delete employee
  - mark/view attendance

## Assumptions & Limitations

- Single-admin internal tool (no authentication)
- SQLite used for lightweight persistence
- Backend persistence in production depends on provider disk persistence configuration
- Out of scope by design: payroll, leave, file uploads, role management, analytics

## Optional Bonus Included

- Attendance summary cards in history page:
  - total records
  - present days
  - absent days
