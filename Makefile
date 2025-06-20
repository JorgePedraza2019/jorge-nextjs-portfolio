# Define targets for various actions in the workflow
.PHONY: local-up local-down dev-local-up dev-local-down dev-server-up dev-server-down \
        qa-local-up qa-local-down qa-server-up qa-server-down \
        prod-local-up prod-local-down prod-server-up prod-server-down

# Project name for Docker Compose
PROJECT_NAME=jorge-portfolio-frontend

# Environment variable files for different environments (local, dev, qa, prod)
ENV_FEATURE_LOCAL = ./env/feature/.env.feature.local
ENV_DEV_LOCAL = ./env/dev/.env.dev.local
ENV_DEV_SERVER = ./env/dev/.env.dev.server
ENV_QA_LOCAL = ./env/qa/.env.qa.local
ENV_QA_SERVER = ./env/qa/.env.qa.server
ENV_PROD_LOCAL = ./env/prod/.env.prod.local
ENV_PROD_SERVER = ./env/prod/.env.prod.server

feature-local-build-up:
	docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml -f docker/docker-compose-override-feature.yaml up --build
feature-local-up:
	docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml -f docker/docker-compose-override-feature.yaml up
feature-local-down:
	docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml down -v

dev-local-build-up:
	docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx.yaml up --build
dev-local-up:
	docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx.yaml up
dev-local-down:
	docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx.yaml down -v

dev-server-build-up:
	docker-compose --env-file ${ENV_DEV_SERVER} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx.yaml up --build
dev-server-up:
	docker-compose --env-file ${ENV_DEV_SERVER} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx.yaml up
dev-server-down:
	docker-compose --env-file ${ENV_DEV_SERVER} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx.yaml down -v

qa-local-build-up:
	docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx.yaml up --build
qa-local-up:
	docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx.yaml up
qa-local-down:
	docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx.yaml down -v

qa-server-build-up:
	docker-compose --env-file ${ENV_QA_SERVER} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx.yaml up --build
qa-server-up:
	docker-compose --env-file ${ENV_QA_SERVER} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx.yaml up
qa-server-down:
	docker-compose --env-file ${ENV_QA_SERVER} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx.yaml down -v

prod-local-build-up:
	docker-compose --env-file ${ENV_PROD_LOCAL} -p $(PROJECT_NAME)-prod-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx.yaml up --build
prod-local-up:
	docker-compose --env-file ${ENV_PROD_LOCAL} -p $(PROJECT_NAME)-prod-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx.yaml up
prod-local-down:
	docker-compose --env-file ${ENV_PROD_LOCAL} -p $(PROJECT_NAME)-prod-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx.yaml down -v

prod-server-build-up:
	docker-compose --env-file ${ENV_PROD_SERVER} -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx.yaml up --build
prod-server-up:
	docker-compose --env-file ${ENV_PROD_SERVER} -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx.yaml up
prod-server-down:
	docker-compose --env-file ${ENV_PROD_SERVER} -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx.yaml down -v




# Local environment setup
# feature-local-up:
# 	# Set the environment file for the local feature environment and start the container
# 	docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/feature/docker-compose.feature.yaml -f docker/feature/docker-compose-override-env-file.yaml up --build

# feature-local-down:
# 	# Stop and remove the local feature environment container
# 	docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/feature/docker-compose.feature.yaml down

# Development environment in local mode
# dev-local-up:
# 	# Set environment file for the local development environment and start the container
# 	docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/dev/docker-compose.dev.yaml -f docker/dev/docker-compose-override-volume.yaml -f docker/dev/docker-compose-override-env-file.yaml -f docker/dev/docker-compose.nginx.yaml up --build

# dev-local-down:
# 	# Stop and remove the local development environment container
# 	docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/dev/docker-compose.dev.yaml -f docker/dev/docker-compose-override-volume.yaml -f docker/dev/docker-compose.nginx.yaml down

# # Development environment in server mode
# dev-server-up:
# 	# Set environment file for the development server environment and start the container
# 	docker-compose --env-file ${ENV_DEV_SERVER} -p $(PROJECT_NAME)-dev-server -f docker/dev/docker-compose.dev.yaml -f docker/dev/docker-compose-override-env-file.yaml -f docker/dev/docker-compose.nginx.yaml up --build

# dev-server-down:
# 	# Stop and remove the development server container
# 	docker-compose --env-file ${ENV_DEV_SERVER} -p $(PROJECT_NAME)-dev-server -f docker/dev/docker-compose.dev.yaml -f docker/dev/docker-compose.nginx.yaml down

# QA environment in local mode
# qa-local-up:
# 	# Set environment file for the local QA environment and start the container
# 	docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/qa/docker-compose.qa.yaml -f docker/qa/docker-compose-override-env-file.yaml -f docker/qa/docker-compose.nginx.yaml up --build

# qa-local-down:
# 	# Stop and remove the local QA environment container
# 	docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/qa/docker-compose.qa.yaml -f docker/qa/docker-compose.nginx.yaml down

# QA environment in server mode
# qa-server-up:
# 	# Set environment file for the QA server environment and start the container
# 	docker-compose --env-file ${ENV_QA_SERVER} -p $(PROJECT_NAME)-qa-server -f docker/qa/docker-compose.qa.yaml -f docker/qa/docker-compose-override-env-file.yaml -f docker/qa/docker-compose.nginx.yaml up --build

# qa-server-down:
# 	# Stop and remove the QA server container
# 	docker-compose --env-file ${ENV_QA_SERVER} -p $(PROJECT_NAME)-qa-server -f docker/qa/docker-compose.qa.yaml -f docker/qa/docker-compose.nginx.yaml down

# Production environment in local mode
# prod-local-up:
# 	# Set environment file for the local production environment and start the container
# 	docker-compose --env-file ${ENV_PROD_LOCAL} -p $(PROJECT_NAME)-prod-local -f docker/prod/docker-compose.prod.yaml -f docker/prod/docker-compose-override-env-file.yaml -f docker/prod/docker-compose.nginx.yaml up --build

# prod-local-down:
# 	# Stop and remove the local production environment container
# 	docker-compose --env-file ${ENV_PROD_LOCAL} -p $(PROJECT_NAME)-prod-local -f docker/prod/docker-compose.prod.yaml -f docker/prod/docker-compose.nginx.yaml down

# Production environment in server mode
# prod-server-up:
# 	# Set environment file for the production server environment and start the container
# 	docker-compose --env-file ${ENV_PROD_SERVER} -p $(PROJECT_NAME)-prod-server -f docker/prod/docker-compose.prod.yaml -f docker/prod/docker-compose-override-env-file.yaml -f docker/prod/docker-compose.nginx.yaml up --build

# prod-server-down:
# 	# Stop and remove the production server container
# 	docker-compose --env-file ${ENV_PROD_SERVER} -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.prod.yaml -f docker/prod/docker-compose.nginx.yaml down
