# Pets application

This repository contains the pets application frontend and backend:

- `frontend/`: React + Vite + TypeScript client
- `backend/`: FastAPI server

## Frontend

Install dependencies and start the development server:

```bash
make frontend-install
make frontend-dev
```

The frontend uses `http://localhost:8000` as its API URL by default. This
value can be changed in `frontend/.env`.

## Backend

The backend directory is reserved for the FastAPI application.

Start the backend development server with:

```bash
make backend-dev
```
