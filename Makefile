# ----------------------------------------
# PHONY declarations
# ----------------------------------------
.PHONY: feature-local-up feature-local-down feature-ci-* \
        dev-local-up dev-local-down dev-cd-* dev-ci-* \
        qa-local-up qa-local-down qa-cd-* qa-ci-* \
        main-local-up main-local-down main-cd-* main-ci-*

SHELL := /usr/bin/env bash

launch:
	./utils/launch.sh
    
# ----------------------------------------
# Project-level constants
# ----------------------------------------

PROJECT_NAME=jorge-portfolio

ENV_FEATURE_COMPOSE=./env/feature/compose.env
ENV_DEV_COMPOSE=./env/dev/compose.env

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
	@sh -c '$(call check-env-file,$(ENV_FEATURE_COMPOSE))'
	@echo "$(COLOR_BLUE)🚀 Building and starting FEATURE container (with logs)...$(COLOR_RESET)"
	@sh -c '$(call show-banner)'
	@docker-compose --env-file ${ENV_FEATURE_COMPOSE} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml -f docker/docker-compose-override-feature.yaml up --build


## Local
dev-local-build-up:
	@sh -c '$(call check-env-file,$(ENV_DEV_COMPOSE))'
	@echo "$(COLOR_BLUE)🚀 Building and starting DEV containers (with logs)...$(COLOR_RESET)"
	@sh -c '$(call show-banner)'
	@docker-compose --env-file ${ENV_DEV_COMPOSE} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx-local.yaml up --build


## Local
qa-local-build-up:
# 	@sh -c '$(call check-env-file,$(ENV_QA_COMPOSE)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_QA_CRT)" "$(SSL_QA_KEY)"
	@sh -c '$(call check-env-file,$(ENV_QA_COMPOSE));
	@echo "$(COLOR_BLUE)🚀 Building and starting QA containers... Running without logs, use 'make qa-local-logs' to see output.$(COLOR_RESET)"
	@sh -c '$(call show-banner)'
	@docker-compose --env-file ${ENV_QA_COMPOSE} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up -d --build
	@echo "$(COLOR_GREEN)✅ QA containers started successfully.$(COLOR_RESET)"

# dev-local-up:
# 	@sh -c '$(call check-env-file,$(ENV_DEV_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_DEV_CRT)" "$(SSL_DEV_KEY)"
# 	@sh -c '$(call check-env-file,$(ENV_DEV_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_DEV_CRT)" "$(SSL_DEV_KEY)"
# 	@sh -c '$(call show-banner)'
# 	@echo "$(COLOR_BLUE)🚀 Starting DEV containers (with logs)...$(COLOR_RESET)"
# 	@docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx-local.yaml up

# dev-local-stop:
# 	@echo "$(COLOR_YELLOW)⏹️  Stopping DEV containers...$(COLOR_RESET)"
# 	@docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml stop

# dev-local-down:
# 	@echo "$(COLOR_YELLOW)🧹 Removing DEV containers...$(COLOR_RESET)"
# 	@docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml down -v

# dev-local-lint:
# 	@docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.dev.yaml exec -T frontend npm run lint

# dev-local-test:
# 	@docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.dev.yaml exec -T frontend npm test

# ## CI
# dev-ci-build-up:
# 	docker-compose --env-file ${ENV_DEV_CI} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml up -d --build

# dev-ci-install-deps:
# 	docker-compose --env-file ${ENV_DEV_CI} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml exec -T frontend sh -c 'export NODE_ENV=development && npm install --only=dev --legacy-peer-deps'

# dev-ci-lint:
# 	docker-compose --env-file ${ENV_DEV_CI} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml exec -T frontend npm run lint

# dev-ci-jest:
# 	docker-compose --env-file ${ENV_DEV_CI} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml exec -T frontend npm test

# dev-ci-playwright:
# 	docker-compose --env-file ${ENV_DEV_CI} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml exec -T frontend npx playwright test

# dev-ci-down:
# 	docker-compose --env-file ${ENV_DEV_CI} -f docker/docker-compose.yaml down

# ## CD (remote server)
# dev-cd-build-up:
# 	@docker-compose --env-file ${ENV_DEV_CD} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up --build -d

# dev-cd-up:
# 	@docker-compose --env-file ${ENV_DEV_CD} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up

# dev-cd-down:
# 	@docker-compose --env-file ${ENV_DEV_CD} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml down -v

# # ----------------------------------------
# # QA environment
# # ----------------------------------------

# ## Local
# qa-local-build-up:
# 	@sh -c '$(call check-env-file,$(ENV_QA_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_QA_CRT)" "$(SSL_QA_KEY)"
# 	@echo "$(COLOR_BLUE)🚀 Building and starting QA containers... Running without logs, use 'make qa-local-logs' to see output.$(COLOR_RESET)"
# 	@sh -c '$(call show-banner)'
# 	@docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up -d --build
# 	@echo "$(COLOR_GREEN)✅ QA containers started successfully.$(COLOR_RESET)"

# qa-local-up:
# 	@sh -c '$(call check-env-file,$(ENV_QA_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_QA_CRT)" "$(SSL_QA_KEY)"
# 	@echo "$(COLOR_BLUE)🚀 Starting QA containers... Running without logs, use 'make qa-local-logs' to see output.$(COLOR_RESET)"
# 	@sh -c '$(call show-banner)'
# 	@docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up -d
# 	@echo "$(COLOR_GREEN)✅ QA containers started successfully.$(COLOR_RESET)"

# qa-local-stop:
# 	@echo "$(COLOR_YELLOW)⏹️  Stopping QA containers...$(COLOR_RESET)"
# 	@docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml stop

# qa-local-logs:
# 	@docker-compose -p $(PROJECT_NAME)-qa-local logs -f

# qa-local-down:
# 	@echo "$(COLOR_YELLOW)🧹 Removing QA containers...$(COLOR_RESET)"
# 	@docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml down -v

# qa-local-test:
# 	@docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.qa.yaml exec -T frontend npx playwright test

# ## CI
# qa-ci-build-up:
# 	docker-compose --env-file ${ENV_QA_CI} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml up -d --build

# qa-ci-install-deps:
# 	docker-compose --env-file ${ENV_QA_CI} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml exec -T frontend sh -c 'export NODE_ENV=development && npm install --only=dev --legacy-peer-deps'

# qa-ci-playwright:
# 	docker-compose --env-file ${ENV_QA_CI} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml exec -T frontend npx playwright test

# qa-ci-down:
# 	docker-compose --env-file ${ENV_QA_CI} -f docker/docker-compose.yaml down

# ## CD
# qa-cd-build-up:
# 	@docker-compose --env-file ${ENV_QA_CD} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up --build -d

# qa-cd-up:
# 	@docker-compose --env-file ${ENV_QA_CD} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up

# qa-cd-down:
# 	@docker-compose --env-file ${ENV_QA_CD} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml down -v

# # ----------------------------------------
# # Production environment
# # ----------------------------------------

# ## Local
# main-local-build-up:
# 	@sh -c '$(call check-env-file,$(ENV_MAIN_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_MAIN_CRT)" "$(SSL_MAIN_KEY)"
# 	@echo "$(COLOR_BLUE)🚀 Building and starting PRODUCTION containers... Running without logs, use 'make main-local-logs' to see output.$(COLOR_RESET)"
# 	@docker-compose --env-file ${ENV_MAIN_LOCAL} -p $(PROJECT_NAME)-main-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up -d --build
# 	@echo "$(COLOR_GREEN)✅ PRODUCTION containers started successfully.$(COLOR_RESET)"

# main-local-up:
# 	@sh -c '$(call check-env-file,$(ENV_MAIN_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_MAIN_CRT)" "$(SSL_MAIN_KEY)"
# 	@echo "$(COLOR_BLUE)🚀 Starting PRODUCTION containers... Running without logs, use 'make main-local-logs' to see output.$(COLOR_RESET)"
# 	@docker-compose --env-file ${ENV_MAIN_LOCAL} -p $(PROJECT_NAME)-main-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up -d
# 	@echo "$(COLOR_GREEN)✅ PRODUCTION containers started successfully.$(COLOR_RESET)"

# main-local-stop:
# 	@echo "$(COLOR_YELLOW)⏹️  Stopping PRODUCTION containers...$(COLOR_RESET)"
# 	@docker-compose --env-file ${ENV_MAIN_LOCAL} -p $(PROJECT_NAME)-main-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml stop

# main-local-logs:
# 	@docker-compose -p $(PROJECT_NAME)-main-local logs -f

# main-local-down:
# 	@echo "$(COLOR_YELLOW)🧹 Removing PRODUCTION containers...$(COLOR_RESET)"
# 	@docker-compose --env-file ${ENV_MAIN_LOCAL} -p $(PROJECT_NAME)-main-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml down -v

# ## CI
# main-ci-build-up:
# 	docker-compose --env-file ${ENV_MAIN_CI} -p $(PROJECT_NAME)-main-server -f docker/docker-compose.yaml up -d --build

# main-ci-down:
# 	docker-compose --env-file ${ENV_MAIN_CI} -f docker/docker-compose.yaml down

# ## CD
# main-cd-build-up:
# 	@docker-compose --env-file ${ENV_MAIN_CD} -p $(PROJECT_NAME)-main-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up --build -d

# main-cd-up:
# 	@docker-compose --env-file ${ENV_MAIN_CD} -p $(PROJECT_NAME)-main-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up

# main-cd-down:
# 	@docker-compose --env-file ${ENV_MAIN_CD} -p $(PROJECT_NAME)-main-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml down -v