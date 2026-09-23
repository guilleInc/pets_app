.PHONY: frontend-install frontend-dev frontend-build frontend-docker-build frontend-docker-run docker-up docker-down backend-build backend-dev

frontend-install:
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

frontend-docker-build:
	docker build --build-arg VITE_API_URL="$${VITE_API_URL:-/api}" -t pets-frontend ./frontend

frontend-docker-run:
	docker run --rm -e APP_DOMAIN=:80 -p 8080:80 pets-frontend

docker-up:
	docker compose up --build

docker-down:
	docker compose down

backend-build:
	cd backend && uv sync && make generate-env && make seed-db

backend-dev:
	cd backend && make dev
