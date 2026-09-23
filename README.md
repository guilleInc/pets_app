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

The application is then available through the Caddy frontend container on
ports `80` and `443`. Caddy serves the compiled React application, proxies
`/api/` to the `backend` service on port `8000`, and keeps the backend internal
to the Compose network. For local development, Compose defaults to `localhost`;
use `APP_DOMAIN=localhost docker compose up --build` and accept Caddy's local
certificate when testing HTTPS. Stop the services with:

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
- `APP_DOMAIN`: public DNS name for the application, such as `pets.example.com`
- `GHCR_USERNAME`: GHCR account username
- `GHCR_TOKEN`: token with `read:packages` permission
- `JWT_SECRET_KEY`: long random secret used to sign backend tokens

The EC2 instance must have Docker Engine and the Docker Compose plugin
installed. Its security group and any host firewall must allow inbound TCP
traffic on ports `80` and `443` (and UDP `443` if HTTP/3 is desired). Create a
DNS `A` record for `APP_DOMAIN` pointing to the EC2 public address before the
first deployment. Caddy obtains the public certificate from Let's Encrypt and
renews it automatically; certificate state is persisted in the `caddy-data`
Docker volume. The backend is tracked as the `backend/` Git submodule, so remember
to initialize submodules when checking out this repository locally:

```bash
git submodule update --init --recursive
```

Generate the JWT secret locally with:

```bash
openssl rand -base64 48
```

To update the backend version deployed by this repository, fetch the desired
backend commit and commit the updated submodule reference:

```bash
git -C backend fetch origin
git -C backend checkout <backend-commit>
git add backend
git commit -m "Update backend version"
git push
```

That parent-repository commit triggers the workflow. The workflow checks out
the pinned backend commit, builds both images, publishes them to GHCR, and
deploys the matching frontend and backend versions to EC2.

## Backend

The backend directory is reserved for the FastAPI application.

Start the backend development server with:

```bash
make backend-dev
```
