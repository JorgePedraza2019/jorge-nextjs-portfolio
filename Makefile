# ----------------------------------------
# PHONY declarations
# ----------------------------------------
.PHONY: feature-local-up feature-local-down feature-ci-* \
        dev-local-up dev-local-down dev-cd-* dev-ci-* \
        qa-local-up qa-local-down qa-cd-* qa-ci-* \
        prod-local-up prod-local-down prod-cd-* prod-ci-*

# ----------------------------------------
# Project-level constants
# ----------------------------------------

PROJECT_NAME=jorge-portfolio-frontend

ENV_FEATURE_LOCAL = ./env/feature/local.env
ENV_FEATURE_CI    = ./env/feature/ci.env

ENV_DEV_LOCAL     = ./env/dev/local.env
SSL_DEV_CRT  = ./docker/nginx/local/certs/dev/dev.jorgeportfolio.local.crt
SSL_DEV_KEY  = ./docker/nginx/local/certs/dev/dev.jorgeportfolio.local.key
ENV_DEV_CI        = ./env/dev/ci.env
ENV_DEV_CD    = ./env/dev/cd.env

ENV_QA_LOCAL      = ./env/qa/local.env
SSL_QA_CRT   = ./docker/nginx/local/certs/qa/qa.jorgeportfolio.local.crt
SSL_QA_KEY   = ./docker/nginx/local/certs/qa/qa.jorgeportfolio.local.key
ENV_QA_CI         = ./env/qa/ci.env
ENV_QA_CD     = ./env/qa/cd.env

ENV_PROD_LOCAL    = ./env/prod/local.env
SSL_PROD_CRT = ./docker/nginx/local/certs/prod/jorgeportfolio.local.crt
SSL_PROD_KEY = ./docker/nginx/local/certs/prod/jorgeportfolio.local.key
ENV_PROD_CI       = ./env/prod/ci.env
ENV_PROD_CD   = ./env/prod/cd.env

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
	@docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml -f docker/docker-compose-override-feature.yaml up --build

feature-local-up:
	@sh -c '$(call check-env-file,$(ENV_FEATURE_LOCAL))'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Starting FEATURE container (with logs)...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml -f docker/docker-compose-override-feature.yaml up

feature-local-stop:
	@echo "$(COLOR_YELLOW)⏹️  Stopping FEATURE container...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml stop

feature-local-down:
	@echo "$(COLOR_YELLOW)🧹 Removing FEATURE container...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml down -v

feature-local-lint:
	@docker-compose --env-file ${ENV_FEATURE_LOCAL} -p $(PROJECT_NAME)-feature-local -f docker/feature/docker-compose.feature.yaml exec -T frontend npm run lint

## CI
feature-ci-build-up:
	docker-compose --env-file ${ENV_FEATURE_CI} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml -f docker/docker-compose-override-feature.yaml up -d --build

feature-ci-lint:
	docker-compose --env-file ${ENV_FEATURE_CI} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml exec -T frontend npm run lint

feature-ci-down:
	docker-compose --env-file ${ENV_FEATURE_CI} -f docker/docker-compose.yaml down

# ----------------------------------------
# Development environment
# ----------------------------------------

## Local
dev-local-build-up:
	@sh -c '$(call check-env-file,$(ENV_DEV_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_DEV_CRT)" "$(SSL_DEV_KEY)"
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Building and starting DEV containers (with logs)...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx-local.yaml up --build

dev-local-up:
	@sh -c '$(call check-env-file,$(ENV_DEV_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_DEV_CRT)" "$(SSL_DEV_KEY)"
	@sh -c '$(call check-env-file,$(ENV_DEV_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_DEV_CRT)" "$(SSL_DEV_KEY)"
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Starting DEV containers (with logs)...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx-local.yaml up

dev-local-stop:
	@echo "$(COLOR_YELLOW)⏹️  Stopping DEV containers...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml stop

dev-local-down:
	@echo "$(COLOR_YELLOW)🧹 Removing DEV containers...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml down -v

dev-local-lint:
	@docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.dev.yaml exec -T frontend npm run lint

dev-local-test:
	@docker-compose --env-file ${ENV_DEV_LOCAL} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.dev.yaml exec -T frontend npm test

## CI
dev-ci-build-up:
	docker-compose --env-file ${ENV_DEV_CI} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml up -d --build

dev-ci-install-deps:
	docker-compose --env-file ${ENV_DEV_CI} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml exec -T frontend sh -c 'export NODE_ENV=development && npm install --only=dev --legacy-peer-deps'

dev-ci-lint:
	docker-compose --env-file ${ENV_DEV_CI} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml exec -T frontend npm run lint

dev-ci-jest:
	docker-compose --env-file ${ENV_DEV_CI} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml exec -T frontend npm test

dev-ci-playwright:
	docker-compose --env-file ${ENV_DEV_CI} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml exec -T frontend npx playwright test

dev-ci-down:
	docker-compose --env-file ${ENV_DEV_CI} -f docker/docker-compose.yaml down

## CD (remote server)
dev-cd-build-up:
	@docker-compose --env-file ${ENV_DEV_CD} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up --build -d

dev-cd-up:
	@docker-compose --env-file ${ENV_DEV_CD} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up

dev-cd-down:
	@docker-compose --env-file ${ENV_DEV_CD} -p $(PROJECT_NAME)-dev-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml down -v

# ----------------------------------------
# QA environment
# ----------------------------------------

## Local
qa-local-build-up:
	@sh -c '$(call check-env-file,$(ENV_QA_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_QA_CRT)" "$(SSL_QA_KEY)"
	@echo "$(COLOR_BLUE)🚀 Building and starting QA containers... Running without logs, use 'make qa-local-logs' to see output.$(COLOR_RESET)"
	@sh -c '$(call show-banner)'
	@docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up -d --build
	@echo "$(COLOR_GREEN)✅ QA containers started successfully.$(COLOR_RESET)"

qa-local-up:
	@sh -c '$(call check-env-file,$(ENV_QA_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_QA_CRT)" "$(SSL_QA_KEY)"
	@echo "$(COLOR_BLUE)🚀 Starting QA containers... Running without logs, use 'make qa-local-logs' to see output.$(COLOR_RESET)"
	@sh -c '$(call show-banner)'
	@docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up -d
	@echo "$(COLOR_GREEN)✅ QA containers started successfully.$(COLOR_RESET)"

qa-local-stop:
	@echo "$(COLOR_YELLOW)⏹️  Stopping QA containers...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml stop

qa-local-logs:
	@docker-compose -p $(PROJECT_NAME)-qa-local logs -f

qa-local-down:
	@echo "$(COLOR_YELLOW)🧹 Removing QA containers...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml down -v

qa-local-test:
	@docker-compose --env-file ${ENV_QA_LOCAL} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.qa.yaml exec -T frontend npx playwright test

## CI
qa-ci-build-up:
	docker-compose --env-file ${ENV_QA_CI} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml up -d --build

qa-ci-install-deps:
	docker-compose --env-file ${ENV_QA_CI} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml exec -T frontend sh -c 'export NODE_ENV=development && npm install --only=dev --legacy-peer-deps'

qa-ci-playwright:
	docker-compose --env-file ${ENV_QA_CI} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml exec -T frontend npx playwright test

qa-ci-down:
	docker-compose --env-file ${ENV_QA_CI} -f docker/docker-compose.yaml down

## CD
qa-cd-build-up:
	@docker-compose --env-file ${ENV_QA_CD} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up --build -d

qa-cd-up:
	@docker-compose --env-file ${ENV_QA_CD} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up

qa-cd-down:
	@docker-compose --env-file ${ENV_QA_CD} -p $(PROJECT_NAME)-qa-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml down -v

# ----------------------------------------
# Production environment
# ----------------------------------------

## Local
prod-local-build-up:
	@sh -c '$(call check-env-file,$(ENV_PROD_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_PROD_CRT)" "$(SSL_PROD_KEY)"
	@echo "$(COLOR_BLUE)🚀 Building and starting PRODUCTION containers... Running without logs, use 'make prod-local-logs' to see output.$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_PROD_LOCAL} -p $(PROJECT_NAME)-prod-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up -d --build
	@echo "$(COLOR_GREEN)✅ PRODUCTION containers started successfully.$(COLOR_RESET)"

prod-local-up:
	@sh -c '$(call check-env-file,$(ENV_PROD_LOCAL)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_PROD_CRT)" "$(SSL_PROD_KEY)"
	@echo "$(COLOR_BLUE)🚀 Starting PRODUCTION containers... Running without logs, use 'make prod-local-logs' to see output.$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_PROD_LOCAL} -p $(PROJECT_NAME)-prod-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up -d
	@echo "$(COLOR_GREEN)✅ PRODUCTION containers started successfully.$(COLOR_RESET)"

prod-local-stop:
	@echo "$(COLOR_YELLOW)⏹️  Stopping PRODUCTION containers...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_PROD_LOCAL} -p $(PROJECT_NAME)-prod-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml stop

prod-local-logs:
	@docker-compose -p $(PROJECT_NAME)-prod-local logs -f

prod-local-down:
	@echo "$(COLOR_YELLOW)🧹 Removing PRODUCTION containers...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_PROD_LOCAL} -p $(PROJECT_NAME)-prod-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml down -v

## CI
prod-ci-build-up:
	docker-compose --env-file ${ENV_PROD_CI} -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.yaml up -d --build

prod-ci-down:
	docker-compose --env-file ${ENV_PROD_CI} -f docker/docker-compose.yaml down

## CD
prod-cd-build-up:
	@docker-compose --env-file ${ENV_PROD_CD} -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up --build -d

prod-cd-up:
	@docker-compose --env-file ${ENV_PROD_CD} -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml up

prod-cd-down:
	@docker-compose --env-file ${ENV_PROD_CD} -p $(PROJECT_NAME)-prod-server -f docker/docker-compose.yaml -f docker/docker-compose-nginx-server.yaml down -v