# Define targets for various actions in the workflow
.PHONY: local-up local-down dev-local-up dev-local-down dev-server-up dev-server-down \
        qa-local-up qa-local-down qa-server-up qa-server-down \
        prod-local-up prod-local-down prod-server-up prod-server-down

# Project name for Docker Compose
PROJECT_NAME=jorge-nextjs-portfolio

# Environment variable files for different environments (local, dev, qa, prod)
ENV_LOCAL = ../env/feature/.env.feature.local
ENV_DEV_LOCAL = ../env/dev/.env.dev.local
ENV_DEV_SERVER = ../env/dev/.env.dev.server
ENV_QA_LOCAL = ../env/qa/.env.qa.local
ENV_QA_SERVER = ../env/qa/.env.qa.server
ENV_PROD_LOCAL = ../env/prod/.env.prod.local
ENV_PROD_SERVER = ../env/prod/.env.prod.server

# Local environment setup
feature-local-up:
	# Set the environment file for the local feature environment and start the container
	ENV_FILE=${ENV_LOCAL} docker-compose --env-file ./env/feature/.env.feature.local -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.feature.yaml up --build

feature-local-down:
	# Stop and remove the local feature environment container
	docker-compose --env-file ./env/.env.feature.local -p $(PROJECT_NAME)-local -f docker/docker-compose.feature.yaml down

# Development environment in local mode
dev-local-up:
	# Set environment file for the local development environment and start the container
	ENV_FILE=../env/dev/.env.dev.local docker-compose --env-file ./env/dev/.env.dev.local -p $(PROJECT_NAME)-dev-local -f docker/docker-compose-override.yaml -f docker/docker-compose.feature.yaml up --build

dev-local-down:
	# Stop and remove the local development environment container
	ENV_FILE=../env/dev/.env.dev.local docker-compose --env-file ./env/dev/.env.dev.local -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.dev.yaml down

# Development environment in server mode
dev-server-up:
	# Set environment file for the development server environment and start the container
	ENV_FILE=../env/dev/.env.dev.server docker-compose --env-file ./env/dev/.env.dev.server -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.dev.yaml up --build

dev-server-down:
	# Stop and remove the development server container
	ENV_FILE=../env/dev/.env.dev.server docker-compose --env-file ./env/dev/.env.dev.local -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.dev.yaml down

# QA environment in local mode
qa-local-up:
	# Set environment file for the local QA environment and start the container
	ENV_FILE=../env/qa/.env.qa.local docker-compose --env-file ./env/qa/.env.qa.local -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.qa.yaml up --build

qa-local-down:
	# Stop and remove the local QA environment container
	ENV_FILE=../env/qa/.env.qa.local docker-compose --env-file ./env/qa/.env.qa.local -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.qa.yaml down

# QA environment in server mode
qa-server-up:
	# Set environment file for the QA server environment and start the container
	ENV_FILE=../env/qa/.env.qa.server docker-compose --env-file ./env/qa/.env.qa.server -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.qa.yaml up --build

qa-server-down:
	# Stop and remove the QA server container
	ENV_FILE=../env/qa/.env.qa.server docker-compose --env-file ./env/qa/.env.qa.server -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.qa.yaml down

# Production environment in local mode
prod-local-up:
	# Set environment file for the local production environment and start the container
	ENV_FILE=../env/prod/.env.prod.local docker-compose --env-file ./env/prod/.env.prod.local -p $(PROJECT_NAME)-prod-local -f docker/docker-compose.prod.yaml up --build

prod-local-down:
	# Stop and remove the local production environment container
	ENV_FILE=../env/prod/.env.prod.local docker-compose --env-file ./env/prod/.env.prod.local -p $(PROJECT_NAME)-prod-local -f docker/docker-compose.prod.yaml down

# Production environment in server mode
prod-server-up:
	# Set environment file for the production server environment and start the container
	ENV_FILE=../env/prod/.env.prod.server docker-compose --env-file ./env/prod/.env.prod.server -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.prod.yaml up --build

prod-server-down:
	# Stop and remove the production server container
	ENV_FILE=../env/prod/.env.prod.server docker-compose --env-file ./env/prod/.env.prod.server -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.prod.yaml down