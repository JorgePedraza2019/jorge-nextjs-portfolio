# ----------------------------------------
# PHONY declarations
# ----------------------------------------
.PHONY: feature-local-up feature-local-down feature-ci-* \
        dev-local-up dev-local-down dev-cd-* dev-ci-*

launch:
	./frontend/utils/launch.sh

# ----------------------------------------
# Project-level constants
# ----------------------------------------

PROJECT_NAME=jorge-portfolio-backend

ENV_FEATURE_LOCAL = ./env/feature/local.env

ENV_DEV_LOCAL     = ./env/dev/local.env

# ----------------------------------------
# Colors (ANSI escape codes)
# ----------------------------------------
COLOR_RED=\033[1;31m
COLOR_GREEN=\033[1;32m
COLOR_YELLOW=\033[1;33m
COLOR_BLUE=\033[1;34m
COLOR_RESET=\033[0m

# ----------------------------------------
# Utils
# ----------------------------------------

## Check if file exists
check-env-file = \
  if [ ! -f "$1" ]; then \
    printf "$(COLOR_RED)❌ Environment file not found: %s$(COLOR_RESET)\n" "$1"; \
    exit 1; \
  fi

## Check if SSL cert and key exist
check-ssl-files = \
  if [ ! -f "$$1" ] || [ ! -f "$$2" ]; then \
    echo "$(COLOR_RED)❌ SSL certificate or key not found:$(COLOR_RESET)"; \
    [ ! -f "$$1" ] && echo "  → Missing cert: $$1"; \
    [ ! -f "$$2" ] && echo "  → Missing key:  $$2"; \
    exit 1; \
  fi

show-banner = \
  echo ""; \
  echo "$(COLOR_GREEN)🎉 Welcome to Jorge Portfolio$(COLOR_RESET)"; \
  echo "$(COLOR_RESET)"

# ----------------------------------------
# Feature environment
# ----------------------------------------

## Local
feature-local-build-up:
	@sh -c '$(call check-env-file,$(ENV_FEATURE_LOCAL))'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Building and starting FEATURE container (with logs)...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_FEATURE_LOCAL} \
		-p $(PROJECT_NAME)-feature-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-override-feature.yaml \
		up --build
	@printf "$(COLOR_GREEN)✅ FEATURE containers started successfully.$(COLOR_RESET)"

feature-local-up:
	@sh -c '$(call check-env-file,$(ENV_FEATURE_LOCAL))'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Starting FEATURE container (with logs)...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_FEATURE_LOCAL} \
		-p $(PROJECT_NAME)-feature-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-override-feature.yaml \
		up

feature-local-stop:
	@echo "$(COLOR_YELLOW)⏹️  Stopping FEATURE container...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_FEATURE_LOCAL} \
		-p $(PROJECT_NAME)-feature-local \
		-f docker/docker-compose.yaml \
		stop

feature-local-down:
	@echo "$(COLOR_YELLOW)🧹 Removing FEATURE container...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_FEATURE_LOCAL} \
		-p $(PROJECT_NAME)-feature-local \
		-f docker/docker-compose.yaml \
		down -v

feature-local-lint:
	@docker-compose \
		--env-file ${ENV_FEATURE_LOCAL} \
		-p $(PROJECT_NAME)-feature-local \
		-f docker/feature/docker-compose.feature.yaml \
		exec -T backend npm run lint


# ----------------------------------------
# Development environment
# ----------------------------------------

## Local
dev-local-build-up:
	@sh -c '$(call check-env-file,$(ENV_DEV_LOCAL));'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Building and starting DEV containers (with logs)...$(COLOR_RESET)"
	@docker-compose \
	  --env-file $(ENV_DEV_LOCAL) \
	  -p $(PROJECT_NAME)-dev-local \
	  -f docker/docker-compose.yaml \
	  -f docker/docker-compose-override-dev.yaml \
	  up --build
	@printf "$(COLOR_GREEN)✅ DEV containers started successfully.$(COLOR_RESET)"

dev-local-up:
	@sh -c '$(call check-env-file,$(ENV_DEV_LOCAL));'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Starting DEV containers (with logs)...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_DEV_LOCAL} \
	  -p $(PROJECT_NAME)-dev-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-override-dev.yaml \
		up

dev-local-stop:
	@echo "$(COLOR_YELLOW)⏹️  Stopping DEV containers...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_DEV_LOCAL} \
		-p $(PROJECT_NAME)-dev-local \
		-f docker/docker-compose.yaml \
		stop

dev-local-down:
	@echo "$(COLOR_YELLOW)🧹 Removing DEV containers...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_DEV_LOCAL} \
		-p $(PROJECT_NAME)-dev-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-local.yaml \
		down -v

dev-local-lint:
	@docker-compose \
		--env-file ${ENV_DEV_LOCAL} \
		-p $(PROJECT_NAME)-dev-local \
		-f docker/docker-compose.dev.yaml \
		exec -T backend npm run lint

dev-local-test:
	@docker-compose \
		--env-file ${ENV_DEV_LOCAL} \
		-p $(PROJECT_NAME)-dev-local \
		-f docker/docker-compose.dev.yaml \
		exec -T backend npm test