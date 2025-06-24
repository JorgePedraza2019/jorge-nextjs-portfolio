# ----------------------------------------
# PHONY declarations to avoid file/target name collisions
# ----------------------------------------
.PHONY: local-up local-down dev-local-up dev-local-down dev-server-up dev-server-down \
        qa-local-up qa-local-down qa-server-up qa-server-down \
        prod-local-up prod-local-down prod-server-up prod-server-down

# ----------------------------------------
# Project-level constants
# ----------------------------------------

# Name of the project to be used as a Docker Compose prefix
PROJECT_NAME=jorge-portfolio-frontend

# Environment variable files per environment and deployment context
ENV_FEATURE_LOCAL = ./env/feature/.env.feature.local
ENV_DEV_LOCAL     = ./env/dev/.env.dev.local
ENV_DEV_SERVER    = ./env/dev/.env.dev.server
ENV_QA_LOCAL      = ./env/qa/.env.qa.local
ENV_QA_SERVER     = ./env/qa/.env.qa.server
ENV_PROD_LOCAL    = ./env/prod/.env.prod.local
ENV_PROD_SERVER   = ./env/prod/.env.prod.server

# ----------------------------------------
# Feature environment (local) targets
# ----------------------------------------

# Build and start the feature branch environment locally
feature-local-build-up:
	docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml -f docker/docker-compose-override-feature.yaml up --build

# Start the feature branch environment locally without rebuilding
feature-local-up:
	docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml -f docker/docker-compose-override-feature.yaml up

# Stop and remove the local feature environment containers and volumes
feature-local-down:
	docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml down -v

# ----------------------------------------
# Development environment targets
# ----------------------------------------

# Build and start the development environment locally (with NGINX)
dev-local-build-up:
	docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx-local.yaml up --build

# Start the local development environment without rebuilding
dev-local-up:
	docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx-local.yaml up

# Stop and remove the local development containers and volumes
dev-local-down:
	docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml down -v

# Build and start the development environment on the remote server (detached)
dev-server-build-up:
	docker-compose --env-file ${ENV_DEV_SERVER} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up --build -d

# Start the development server environment without rebuilding
dev-server-up:
	docker-compose --env-file ${ENV_DEV_SERVER} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up

# Stop and remove the development server containers and volumes
dev-server-down:
	docker-compose --env-file ${ENV_DEV_SERVER} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml down -v

# ----------------------------------------
# QA environment targets
# ----------------------------------------

# Build and start the QA environment locally
qa-local-build-up:
	docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up --build

# Start the QA environment locally
qa-local-up:
	docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up

# Stop and remove the QA local containers and volumes
qa-local-down:
	docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml down -v

# Build and start the QA server environment (remote) in detached mode
qa-server-build-up:
	docker-compose --env-file ${ENV_QA_SERVER} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up --build -d

# Start the QA server environment
qa-server-up:
	docker-compose --env-file ${ENV_QA_SERVER} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up

# Stop and remove QA server containers and volumes
qa-server-down:
	docker-compose --env-file ${ENV_QA_SERVER} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml down -v

# ----------------------------------------
# Production environment targets
# ----------------------------------------

# Build and start the production environment locally
prod-local-build-up:
	docker-compose --env-file ${ENV_PROD_LOCAL} -p $(PROJECT_NAME)-prod-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up --build

# Start the production environment locally
prod-local-up:
	docker-compose --env-file ${ENV_PROD_LOCAL} -p $(PROJECT_NAME)-prod-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up

# Stop and remove the production local containers and volumes
prod-local-down:
	docker-compose --env-file ${ENV_PROD_LOCAL} -p $(PROJECT_NAME)-prod-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml down -v

# Build and start the production environment on the remote server (detached)
prod-server-build-up:
	docker-compose --env-file ${ENV_PROD_SERVER} -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up --build -d

# Start the production server environment
prod-server-up:
	docker-compose --env-file ${ENV_PROD_SERVER} -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up

# Stop and remove production server containers and volumes
prod-server-down:
	docker-compose --env-file ${ENV_PROD_SERVER} -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml down -v