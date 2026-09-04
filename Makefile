.PHONY: frontend-install frontend-dev frontend-build backend-build backend-dev

frontend-install:
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

backend-build:
	cd backend && uv sync && make generate-env && make seed-db

backend-dev:
	cd backend && make dev
