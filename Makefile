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

ENV_FEATURE_COMPOSE	=./env/feature/compose.env
ENV_FEATURE_LOCAL 	= ./frontend/env/feature/local.env
# ENV_FEATURE_CI    	= ./env/feature/ci.env
ENV_FEATURE_CI 			= $(shell pwd)/docker/feature/ci.env

ENV_DEV_COMPOSE			=./env/dev/compose.env
ENV_DEV_LOCAL     	= ./frontend/env/dev/local.env
SSL_DEV_CRT  				= ./frontend/docker/nginx/local/certs/dev/dev.jorgeportfolio.local.crt
SSL_DEV_KEY  				= ./frontend/docker/nginx/local/certs/dev/dev.jorgeportfolio.local.key
ENV_DEV_CI        	= ./env/dev/ci.env
ENV_DEV_CD    			= ./env/dev/cd.env

ENV_QA_COMPOSE			=./env/qa/compose.env
ENV_QA_LOCAL      	= ./frontend/env/qa/local.env
SSL_QA_CRT   				= ./frontend/docker/nginx/local/certs/qa/qa.jorgeportfolio.local.crt
SSL_QA_KEY   				= ./frontend/docker/nginx/local/certs/qa/qa.jorgeportfolio.local.key
ENV_QA_CI         	= ./env/qa/ci.env
ENV_QA_CD     			= ./env/qa/cd.env

ENV_MAIN_COMPOSE		=./env/main/compose.env
ENV_MAIN_LOCAL    	= ./frontend/env/main/local.env
SSL_MAIN_CRT 				= ./docker/nginx/local/certs/main/jorgeportfolio.local.crt
SSL_MAIN_KEY 				= ./docker/nginx/local/certs/main/jorgeportfolio.local.key
ENV_MAIN_CI       	= ./env/main/ci.env
ENV_MAIN_CD   			= ./env/main/cd.env

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
	@sh -c '$(call check-env-file,$(ENV_FEATURE_LOCAL))'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Building and starting FEATURE container (with logs)...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_FEATURE_COMPOSE} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml -f docker/docker-compose-override-feature.yaml up --build
	@printf "$(COLOR_GREEN)✅ FEATURE containers started successfully.$(COLOR_RESET)"

feature-local-up:
	@sh -c '$(call check-env-file,$(ENV_FEATURE_COMPOSE))'
	@sh -c '$(call check-env-file,$(ENV_FEATURE_LOCAL))'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Starting FEATURE container (with logs)...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_FEATURE_COMPOSE} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml -f docker/docker-compose-override-feature.yaml up
	@printf "$(COLOR_GREEN)✅ FEATURE containers started successfully.$(COLOR_RESET)"

feature-local-stop:
	@echo "$(COLOR_YELLOW)⏹️  Stopping FEATURE container...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_FEATURE_COMPOSE} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml stop

feature-local-down:
	@echo "$(COLOR_YELLOW)🧹 Removing FEATURE container...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_FEATURE_COMPOSE} -p $(PROJECT_NAME)-feature-local -f docker/docker-compose.yaml down -v

feature-local-lint:
	@docker-compose --env-file ${ENV_FEATURE_COMPOSE} -p $(PROJECT_NAME)-feature-local -f docker/feature/docker-compose.feature.yaml exec -T frontend npm run lint


## Local
dev-local-build-up:
	@sh -c '$(call check-env-file,$(ENV_DEV_COMPOSE)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_DEV_CRT)" "$(SSL_DEV_KEY)'
	@sh -c '$(call check-env-file,$(ENV_DEV_LOCAL))'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Building and starting DEV containers (with logs)...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_DEV_COMPOSE} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx-local.yaml up --build
	@printf "$(COLOR_GREEN)✅ DEV containers started successfully.$(COLOR_RESET)"

dev-local-up:
	@sh -c '$(call check-env-file,$(ENV_DEV_COMPOSE)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_DEV_CRT)" "$(SSL_DEV_KEY)"
	@sh -c '$(call check-env-file,$(ENV_DEV_LOCAL))'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Starting DEV containers (with logs)...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_DEV_COMPOSE} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-override-dev.yaml -f docker/docker-compose-nginx-local.yaml up
	@printf "$(COLOR_GREEN)✅ DEV containers started successfully.$(COLOR_RESET)"

dev-local-stop:
	@echo "$(COLOR_YELLOW)⏹️  Stopping DEV containers...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_DEV_COMPOSE} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml stop

dev-local-down:
	@echo "$(COLOR_YELLOW)🧹 Removing DEV containers...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_DEV_COMPOSE} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml down -v

dev-local-lint:
	@docker-compose --env-file ${ENV_DEV_COMPOSE} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.dev.yaml exec -T frontend npm run lint

dev-local-test:
	@docker-compose --env-file ${ENV_DEV_COMPOSE} -p $(PROJECT_NAME)-dev-local -f docker/docker-compose.dev.yaml exec -T frontend npm test


## Local
qa-local-build-up:
	@sh -c '$(call check-env-file,$(ENV_QA_COMPOSE)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_QA_CRT)" "$(SSL_QA_KEY)"
	@sh -c '$(call check-env-file,$(ENV_QA_LOCAL))'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Building and starting QA containers... Running without logs, use 'make qa-local-logs' to see output.$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_QA_COMPOSE} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up -d --build
	@printf "$(COLOR_GREEN)✅ QA containers started successfully.$(COLOR_RESET)"

qa-local-up:
	@sh -c '$(call check-env-file,$(ENV_QA_COMPOSE)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_QA_CRT)" "$(SSL_QA_KEY)"
	@sh -c '$(call check-env-file,$(ENV_QA_LOCAL))'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Starting QA containers... Running without logs, use 'make qa-local-logs' to see output.$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_QA_COMPOSE} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up
	@printf "$(COLOR_GREEN)✅ QA containers started successfully.$(COLOR_RESET)"

qa-local-stop:
	@echo "$(COLOR_YELLOW)⏹️  Stopping QA containers...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_QA_COMPOSE} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml stop

qa-local-logs:
	@docker-compose -p $(PROJECT_NAME)-qa-local logs -f

qa-local-down:
	@echo "$(COLOR_YELLOW)🧹 Removing QA containers...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_QA_COMPOSE} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml down -v

qa-local-test:
	@docker-compose --env-file ${ENV_QA_COMPOSE} -p $(PROJECT_NAME)-qa-local -f docker/docker-compose.qa.yaml exec -T frontend npx playwright test

## CI
feature-ci-build-up:
	docker-compose --env-file ${ENV_FEATURE_CI} -p $(PROJECT_NAME)-feature-server -f docker/docker-compose.yaml -f docker/docker-compose-override-feature.yaml up -d --build

feature-ci-lint:
	docker-compose --env-file ${ENV_FEATURE_CI} -p $(PROJECT_NAME)-feature-server -f docker/docker-compose.yaml exec -T frontend npm run lint

feature-ci-down:
	docker-compose --env-file ${ENV_FEATURE_CI} -f docker/docker-compose.yaml down


## Local
main-local-build-up:
	@sh -c '$(call check-env-file,$(ENV_MAIN_COMPOSE)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_MAIN_CRT)" "$(SSL_MAIN_KEY)"
	@sh -c '$(call check-env-file,$(ENV_MAIN_LOCAL))'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Building and starting PRODUCTION containers... Running without logs, use 'make main-local-logs' to see output.$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_MAIN_COMPOSE} -p $(PROJECT_NAME)-main-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up -d --build
	@printf "$(COLOR_GREEN)✅ PRODUCTION containers started successfully.$(COLOR_RESET)"

main-local-up:
	@sh -c '$(call check-env-file,$(ENV_MAIN_COMPOSE)); $(call check-ssl-files,$$1,$$2)' dummy "$(SSL_MAIN_CRT)" "$(SSL_MAIN_KEY)"
	@sh -c '$(call check-env-file,$(ENV_MAIN_LOCAL))'
	@sh -c '$(call show-banner)'
	@echo "$(COLOR_BLUE)🚀 Starting PRODUCTION containers... Running without logs, use 'make main-local-logs' to see output.$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_MAIN_COMPOSE} -p $(PROJECT_NAME)-main-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml up -d
	@printf "$(COLOR_GREEN)✅ PRODUCTION containers started successfully.$(COLOR_RESET)"

main-local-stop:
	@echo "$(COLOR_YELLOW)⏹️  Stopping PRODUCTION containers...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_MAIN_COMPOSE} -p $(PROJECT_NAME)-main-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml stop

main-local-logs:
	@docker-compose -p $(PROJECT_NAME)-main-local logs -f

main-local-down:
	@echo "$(COLOR_YELLOW)🧹 Removing PRODUCTION containers...$(COLOR_RESET)"
	@docker-compose --env-file ${ENV_MAIN_COMPOSE} -p $(PROJECT_NAME)-main-local -f docker/docker-compose.yaml -f docker/docker-compose-nginx-local.yaml down -v










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