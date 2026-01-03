# ----------------------------------------
# PHONY declarations
# ----------------------------------------
.PHONY: feature-local-up feature-local-down feature-ci-* \
        dev-local-up dev-local-down dev-cd-* dev-ci-* \
        qa-local-up qa-local-down qa-cd-* qa-ci-* \
        main-local-up main-local-down main-cd-* main-ci-*

launch:
	./utils/launch.sh
    
# ----------------------------------------
# Project-level constants
# ----------------------------------------

PROJECT_NAME=jorge-portfolio

ENV_FEATURE_LOCAL 	= $(shell pwd)/env/feature/local.env
ENV_FEATURE_CI 			= $(shell pwd)/env/feature/ci.env

ENV_DEV_LOCAL				= $(shell pwd)/env/dev/local.env
ENV_DEV_CI 					= $(shell pwd)/env/dev/ci.env
ENV_DEV_CD 					= $(shell pwd)/env/dev/cd.env
SSL_DEV_CRT  				= ./frontend/docker/nginx/local/certs/dev/dev.jorgeportfolio.local.crt
SSL_DEV_KEY  				= ./frontend/docker/nginx/local/certs/dev/dev.jorgeportfolio.local.key

ENV_QA_LOCAL      	= $(shell pwd)/env/qa/local.env
ENV_QA_CI         	= $(shell pwd)/env/qa/ci.env
ENV_QA_CD     			= $(shell pwd)/env/qa/cd.env
SSL_QA_CRT   				= ./frontend/docker/nginx/local/certs/qa/qa.jorgeportfolio.local.crt
SSL_QA_KEY   				= ./frontend/docker/nginx/local/certs/qa/qa.jorgeportfolio.local.key

ENV_MAIN_LOCAL    	= $(shell pwd)/env/main/local.env
ENV_MAIN_CI       	= $(shell pwd)/env/main/ci.env
ENV_MAIN_CD   			= $(shell pwd)/env/main/cd.env
SSL_MAIN_CRT 				= ./docker/nginx/local/certs/main/jorgeportfolio.local.crt
SSL_MAIN_KEY 				= ./docker/nginx/local/certs/main/jorgeportfolio.local.key

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
	@printf "$(COLOR_BLUE)🚀 Building and starting FEATURE container (with logs)...$(COLOR_RESET)"
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
	@printf "$(COLOR_BLUE)🚀 Starting FEATURE container (with logs)...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_FEATURE_LOCAL} \
		-p $(PROJECT_NAME)-feature-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-override-feature.yaml \
		up
	@printf "$(COLOR_GREEN)✅ FEATURE containers started successfully.$(COLOR_RESET)"

feature-local-stop:
	@printf "$(COLOR_YELLOW)⏹️  Stopping FEATURE container...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_FEATURE_LOCAL} \
		-p $(PROJECT_NAME)-feature-local \
		-f docker/docker-compose.yaml \
		stop

feature-local-down:
	@printf "$(COLOR_YELLOW)🧹 Removing FEATURE container...$(COLOR_RESET)"
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
		exec -T frontend npm run lint

## CI
feature-ci-build-up:
	docker-compose \
		--env-file ${ENV_FEATURE_CI} \
		-p $(PROJECT_NAME)-feature-server \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-override-feature.yaml \
		up -d --build

feature-ci-lint:
	docker-compose \
		--env-file ${ENV_FEATURE_CI} \
		-p $(PROJECT_NAME)-feature-server \
		-f docker/docker-compose.yaml \
		exec -T frontend npm run lint

feature-ci-down:
	docker-compose \
		--env-file ${ENV_FEATURE_CI} \
		-f docker/docker-compose.yaml \
		down


# ----------------------------------------
# Dev environment
# ----------------------------------------

## Local
dev-local-build-up:
	@sh -c '$(call check-env-file,$(ENV_DEV_LOCAL));'
	@sh -c '$(call check-ssl-files,$$1,$$2)' dummy "$(SSL_DEV_CRT)" "$(SSL_DEV_KEY)"
	@sh -c '$(call show-banner)'
	@printf "$(COLOR_BLUE)🚀 Building and starting DEV containers (with logs)...$(COLOR_RESET)"
	@docker-compose \
	  --env-file $(ENV_DEV_LOCAL) \
	  -p $(PROJECT_NAME)-dev-local \
	  -f docker/docker-compose.yaml \
	  -f docker/docker-compose-override-dev.yaml \
	  -f docker/docker-compose-nginx-local.yaml \
	  up --build
	@printf "$(COLOR_GREEN)✅ DEV containers started successfully.$(COLOR_RESET)"

dev-local-up:
	@sh -c '$(call check-env-file,$(ENV_DEV_LOCAL));'
	@sh -c '$(call check-ssl-files,$$1,$$2)' dummy "$(SSL_DEV_CRT)" "$(SSL_DEV_KEY)"
	@sh -c '$(call show-banner)'
	@printf "$(COLOR_BLUE)🚀 Starting DEV containers (with logs)...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_DEV_LOCAL} \
		-p $(PROJECT_NAME)-dev-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-override-dev.yaml \
		-f docker/docker-compose-nginx-local.yaml \
		up
	@printf "$(COLOR_GREEN)✅ DEV containers started successfully.$(COLOR_RESET)"

dev-local-stop:
	@printf "$(COLOR_YELLOW)⏹️  Stopping DEV containers...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_DEV_LOCAL} \
		-p $(PROJECT_NAME)-dev-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-local.yaml \
		stop

dev-local-down:
	@printf "$(COLOR_YELLOW)🧹 Removing DEV containers...$(COLOR_RESET)"
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
		exec -T frontend npm run lint

dev-local-test:
	@docker-compose \
		--env-file ${ENV_DEV_LOCAL} \
		-p $(PROJECT_NAME)-dev-local \
		-f docker/docker-compose.dev.yaml \
		exec -T frontend npm test

## CI
dev-ci-build-up:
	docker-compose \
		--env-file ${ENV_DEV_CI} \
		-p $(PROJECT_NAME)-dev-server \
		-f docker/docker-compose.yaml \
		up -d --build

dev-ci-install-deps:
	docker-compose \
		--env-file ${ENV_DEV_CI} \
		-p $(PROJECT_NAME)-dev-server \
		-f docker/docker-compose.yaml \
		exec -T frontend sh -c 'export NODE_ENV=development && npm install --only=dev --legacy-peer-deps'

dev-ci-lint:
	docker-compose \
		--env-file ${ENV_DEV_CI} \
		-p $(PROJECT_NAME)-dev-server \
		-f docker/docker-compose.yaml \
		exec -T frontend npm run lint

dev-ci-jest:
	docker-compose \
		--env-file ${ENV_DEV_CI} \
		-p $(PROJECT_NAME)-dev-server \
		-f docker/docker-compose.yaml \
		exec -T frontend npm test

dev-ci-playwright:
	docker-compose \
		--env-file ${ENV_DEV_CI} \
		-p $(PROJECT_NAME)-dev-server \
		-f docker/docker-compose.yaml \
		exec -T frontend npx playwright test

dev-ci-down:
	docker-compose \
		--env-file ${ENV_DEV_CI} \
		-f docker/docker-compose.yaml \
		down

## CD (remote server)
# dev-cd-build-up:
# 	@docker-compose \
# 		--env-file ${ENV_DEV_CD} \
# 		-p $(PROJECT_NAME)-dev-server \
# 		-f docker/docker-compose.yaml \
# 		-f docker/docker-compose-nginx-server.yaml \
# 		up --build -d

# dev-cd-build-push-backend:
# 	docker build -t backend:$(SHA) -f ./backend/Dockerfile.nestjs ./backend
# 	docker tag backend:$(SHA) $(ECR_URI):$(SHA)
# 	docker push $(ECR_URI):$(SHA)

dev-cd-build-push-backend:
	docker build \
      -t backend:$(SHA) \
      -f ./backend/Dockerfile.nestjs.prod \
      --build-arg NODE_ENV=$(NODE_ENV) \
      ./backend
	docker tag backend:$(SHA) $(ECR_URI):$(SHA)
	docker push $(ECR_URI):$(SHA)

# dev-cd-build-push-frontend:
# 	docker build -t frontend:$(SHA) -f ./frontend/Dockerfile.nextjs ./frontend
# 	docker tag frontend:$(SHA) $(ECR_URI):$(SHA)
# 	docker push $(ECR_URI):$(SHA)

dev-cd-build-push-frontend:
	docker build \
      -t frontend:$(SHA) \
      -f ./frontend/Dockerfile.nextjs \
      --build-arg NODE_ENV=$(NODE_ENV) \
      --build-arg INSTALL_PLAYWRIGHT=$(INSTALL_PLAYWRIGHT) \
      --build-arg INSTALL_DEV_LIBRARIES=$(INSTALL_DEV_LIBRARIES) \
      --build-arg BACKEND_URL=$(BACKEND_URL) \
      --build-arg NEXT_PUBLIC_ASSETS_URL=$(NEXT_PUBLIC_ASSETS_URL) \
      --build-arg NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$(NEXT_PUBLIC_RECAPTCHA_SITE_KEY) \
      --build-arg NEXT_PUBLIC_RECAPTCHA_SECRET_KEY=$(NEXT_PUBLIC_RECAPTCHA_SECRET_KEY) \
      --build-arg NEXT_PUBLIC_GA_ID=$(NEXT_PUBLIC_GA_ID) \
      --build-arg NEXT_PUBLIC_INTERNAL_API_KEY=$(NEXT_PUBLIC_INTERNAL_API_KEY) \
      --build-arg NEXT_PUBLIC_ENABLE_ANALYTICS=$(NEXT_PUBLIC_ENABLE_ANALYTICS) \
      ./frontend
	docker tag frontend:$(SHA) $(ECR_URI):$(SHA)
	docker push $(ECR_URI):$(SHA)

dev-cd-up:
	@docker-compose \
		--env-file ${ENV_DEV_CD} \
		-p $(PROJECT_NAME)-dev-server \
		-f docker/docker-compose-server.yaml \
		-f docker/docker-compose-nginx-server.yaml \
		up

# dev-cd-down:
# 	@docker-compose \
# 		--env-file ${ENV_DEV_CD} \
# 		-p $(PROJECT_NAME)-dev-server \
# 		-f docker/docker-compose.yaml \
# 		-f docker/docker-compose-nginx-server.yaml \
# 		down -v

# ----------------------------------------
# QA environment
# ----------------------------------------

## Local
qa-local-build-up:
	@sh -c '$(call check-env-file,$(ENV_QA_LOCAL));'
	@sh -c '$(call check-ssl-files,$$1,$$2)' dummy "$(SSL_QA_CRT)" "$(SSL_QA_KEY)"
	@sh -c '$(call show-banner)'
	@printf "$(COLOR_BLUE)🚀 Building and starting QA containers... Running without logs, use 'make qa-local-logs' to see output.$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_QA_LOCAL} \
		-p $(PROJECT_NAME)-qa-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-local.yaml \
		up -d --build
	@printf "$(COLOR_GREEN)✅ QA containers started successfully.$(COLOR_RESET)"

qa-local-up:
	@sh -c '$(call check-env-file,$(ENV_QA_LOCAL));'
	@sh -c '$(call check-ssl-files,$$1,$$2)' dummy "$(SSL_QA_CRT)" "$(SSL_QA_KEY)"
	@sh -c '$(call show-banner)'
	@printf "$(COLOR_BLUE)🚀 Starting QA containers... Running without logs, use 'make qa-local-logs' to see output.$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_QA_LOCAL} \
		-p $(PROJECT_NAME)-qa-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-local.yaml \
		up
	@printf "$(COLOR_GREEN)✅ QA containers started successfully.$(COLOR_RESET)"

qa-local-stop:
	@printf "$(COLOR_YELLOW)⏹️  Stopping QA containers...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_QA_LOCAL} \
		-p $(PROJECT_NAME)-qa-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-local.yaml \
		stop

qa-local-logs:
	@docker-compose \
		-p $(PROJECT_NAME)-qa-local \
		logs -f

qa-local-down:
	@printf "$(COLOR_YELLOW)🧹 Removing QA containers...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_QA_LOCAL} \
		-p $(PROJECT_NAME)-qa-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-local.yaml \
		down -v

qa-local-test:
	@docker-compose \
		--env-file ${ENV_QA_LOCAL} \
		-p $(PROJECT_NAME)-qa-local \
		-f docker/docker-compose.qa.yaml \
		exec -T frontend npx playwright test

## CI
qa-ci-build-up:
	docker-compose \
		--env-file ${ENV_QA_CI} \
		-p $(PROJECT_NAME)-qa-server \
		-f docker/docker-compose.yaml \
		up -d --build

qa-ci-install-deps:
	docker-compose \
		--env-file ${ENV_QA_CI} \
		-p $(PROJECT_NAME)-qa-server \
		-f docker/docker-compose.yaml \
		exec -T frontend sh -c 'export NODE_ENV=development && npm install --only=dev --legacy-peer-deps'

qa-ci-playwright:
	docker-compose \
		--env-file ${ENV_QA_CI} \
		-p $(PROJECT_NAME)-qa-server \
		-f docker/docker-compose.yaml \
		exec -T frontend npx playwright test

qa-ci-down:
	docker-compose \
		--env-file ${ENV_QA_CI} \
		-f docker/docker-compose.yaml \
		down

## CD
qa-cd-build-up:
	@docker-compose \
		--env-file ${ENV_QA_CD} \
		-p $(PROJECT_NAME)-qa-server \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-server.yaml \
		up --build -d

qa-cd-up:
	@docker-compose \
		--env-file ${ENV_QA_CD} \
		-p $(PROJECT_NAME)-qa-server \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-server.yaml \
		up

qa-cd-down:
	@docker-compose \
		--env-file ${ENV_QA_CD} \
		-p $(PROJECT_NAME)-qa-server \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-server.yaml \
		down -v


# ----------------------------------------
# Production environment
# ----------------------------------------

## Local
main-local-build-up:
	@sh -c '$(call check-env-file,$(ENV_MAIN_LOCAL));'
	@sh -c '$(call check-ssl-files,$$1,$$2)' dummy "$(SSL_MAIN_CRT)" "$(SSL_MAIN_KEY)"
	@sh -c '$(call show-banner)'
	@printf "$(COLOR_BLUE)🚀 Building and starting PRODUCTION containers... Running without logs, use 'make main-local-logs' to see output.$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_MAIN_LOCAL} \
		-p $(PROJECT_NAME)-main-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-local.yaml \
		up -d --build
	@printf "$(COLOR_GREEN)✅ PRODUCTION containers started successfully.$(COLOR_RESET)"

main-local-up:
	@sh -c '$(call check-env-file,$(ENV_MAIN_LOCAL));'
	@sh -c '$(call check-ssl-files,$$1,$$2)' dummy "$(SSL_MAIN_CRT)" "$(SSL_MAIN_KEY)"
	@sh -c '$(call show-banner)'
	@printf "$(COLOR_BLUE)🚀 Starting PRODUCTION containers... Running without logs, use 'make main-local-logs' to see output.$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_MAIN_LOCAL} \
		-p $(PROJECT_NAME)-main-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-local.yaml \
		up -d
	@printf "$(COLOR_GREEN)✅ PRODUCTION containers started successfully.$(COLOR_RESET)"

main-local-stop:
	@printf "$(COLOR_YELLOW)⏹️  Stopping PRODUCTION containers...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_MAIN_LOCAL} \
		-p $(PROJECT_NAME)-main-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-local.yaml \
		stop

main-local-logs:
	@docker-compose \
		-p $(PROJECT_NAME)-main-local \
		logs -f

main-local-down:
	@printf "$(COLOR_YELLOW)🧹 Removing PRODUCTION containers...$(COLOR_RESET)"
	@docker-compose \
		--env-file ${ENV_MAIN_LOCAL} \
		-p $(PROJECT_NAME)-main-local \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-local.yaml \
		down -v

## CI
main-ci-build-up:
	docker-compose \
		--env-file ${ENV_MAIN_CI} \
		-p $(PROJECT_NAME)-main-server \
		-f docker/docker-compose.yaml \
		up -d --build

main-ci-down:
	docker-compose \
		--env-file ${ENV_MAIN_CI} \
		-f docker/docker-compose.yaml \
		down

## CD
main-cd-build-up:
	@docker-compose \
		--env-file ${ENV_MAIN_CD} \
		-p $(PROJECT_NAME)-main-server \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-server.yaml \
		up --build -d

main-cd-up:
	@docker-compose \
		--env-file ${ENV_MAIN_CD} \
		-p $(PROJECT_NAME)-main-server \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-server.yaml \
		up

main-cd-down:
	@docker-compose \
		--env-file ${ENV_MAIN_CD} \
		-p $(PROJECT_NAME)-main-server \
		-f docker/docker-compose.yaml \
		-f docker/docker-compose-nginx-server.yaml \
		down -v