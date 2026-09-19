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

Build and run the frontend and backend containers together:

```bash
make docker-up
```

The application is then available at `http://localhost:8080`. The frontend
proxies `/api/` to the `backend` service on port `8000`, which is kept internal
to the Compose network. Stop the services with:

```bash
make docker-down
```

## Deployment

The `Build and deploy` workflow publishes both images to GHCR and deploys the
release to `/opt/pets-app` on EC2 after a push to `main`. Configure these
repository secrets:

- `EC2_HOST`: EC2 hostname or public IP
- `EC2_USER`: SSH user
- `EC2_SSH_KEY`: private deployment key
- `EC2_KNOWN_HOSTS`: verified SSH host key entry
- `GHCR_USERNAME`: GHCR account username
- `GHCR_TOKEN`: token with `read:packages` permission

The EC2 instance must have Docker Engine and the Docker Compose plugin
installed. The backend source and Dockerfile must be available under
`backend/` in the GitHub Actions checkout before the publish and deploy jobs
can run. The current `.gitignore` excludes `/backend/`, so remove that rule if
the backend will be committed into this repository.

## Backend

The backend directory is reserved for the FastAPI application.

Start the backend development server with:

```bash
make backend-dev
```
