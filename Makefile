.PHONY: help build up down logs test clean dev prod

# Default target
help:
	@echo "Available commands:"
	@echo "  build    - Build Docker images"
	@echo "  up       - Start services in detached mode"
	@echo "  down     - Stop and remove containers"
	@echo "  logs     - View API logs"
	@echo "  test     - Run tests in container"
	@echo "  clean    - Clean up containers, networks, and volumes"
	@echo "  dev      - Start development environment with hot reloading"
	@echo "  prod     - Start production environment"
	@echo "  shell    - Access API container shell"
	@echo "  health   - Check API health"

# Build Docker images
build:
	docker-compose build

# Start services in detached mode
up:
	docker-compose up -d

# Stop and remove containers
down:
	docker-compose down

# View API logs
logs:
	docker-compose logs -f api

# Run tests in container
test:
	docker-compose exec api deno test --allow-net

# Clean up everything
clean:
	docker-compose down -v --rmi all

# Development environment with hot reloading
dev:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up

# Production environment
prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Access API container shell
shell:
	docker-compose exec api sh

# Check API health
health:
	@echo "Checking API health..."
	@curl -f http://localhost:3000/health || echo "API is not responding"

# Rebuild and start
rebuild:
	docker-compose up --build -d

# View all container status
status:
	docker-compose ps

# Restart API service
restart:
	docker-compose restart api

# View all logs
logs-all:
	docker-compose logs -f 