#!/usr/bin/env bash

set -e

# ----------------------------------------
# Colors
# ----------------------------------------
COLOR_GREEN='\033[1;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_RED='\033[1;31m'
COLOR_BLUE='\033[1;34m'
COLOR_RESET='\033[0m'

PROJECT_NAME="jorge-portfolio-frontend"
TARGET_BRANCH=$1

if [ -z "$TARGET_BRANCH" ]; then
  printf "${COLOR_RED}❌ ERROR: You must provide a target branch (e.g., dev, qa, main).${COLOR_RESET}\n"
  exit 1
fi

# Get current branch before switching
CURR_BRANCH="$(git symbolic-ref --short HEAD 2>/dev/null || printf "")"

# Try to retrieve the previous branch (optional, si quieres mantener historial)
if [ -f .git/prev-branch.tmp ]; then
  PREV_BRANCH="$(cat .git/prev-branch.tmp)"
else
  PREV_BRANCH=""
fi

printf "${COLOR_BLUE}🔄 Git branch changed. Restarting Docker environment... From: '$PREV_BRANCH' ➡️  To: '$TARGET_BRANCH'${COLOR_RESET}\n"

# Save target branch for future
printf "$TARGET_BRANCH" > .git/prev-branch.tmp

# Skip if same branch (aunque igual haces switch, podría ser opcional)
if [ "$PREV_BRANCH" = "$TARGET_BRANCH" ]; then
  printf "${COLOR_YELLOW}⚠️  Same branch detected ($TARGET_BRANCH), skipping stop/start${COLOR_RESET}\n"
  exit 0
fi

# 🛑 Stop previous environment
case "$PREV_BRANCH" in
  dev) make dev-local-stop || true ;;
  qa) make qa-local-stop || true ;;
  main) make prod-local-stop || true ;;
  feature/*) make feature-local-stop || true ;;
esac

# Cambiar a la nueva rama
git switch "$TARGET_BRANCH"

# Función para checar si contenedor existe para la rama nueva
container_exists() {
  docker ps -a --format '{{.Names}}' | grep -q "${PROJECT_NAME}-app-${TARGET_BRANCH}-local-container"
}

printf "${COLOR_GREEN}🛑 Stopping any running container for '$TARGET_BRANCH' (if any)...${COLOR_RESET}\n"
make "${TARGET_BRANCH}-local-down" || true

# Configurar patrón para buscar ramas que podrían hacer merge a la rama nueva
case "$TARGET_BRANCH" in
  dev) FROM_PATTERN="origin/feature/" ;;
  qa) FROM_PATTERN="origin/dev" ;;
  main) FROM_PATTERN="origin/qa" ;;
  feature/*)
    # Para feature no hay merges, solo levantar contenedor
    if container_exists; then
      make feature-local-up
    else
      make feature-local-build-up
    fi
    exit 0
    ;;
  *)
    printf "${COLOR_YELLOW}ℹ️ No merge automation defined for '$TARGET_BRANCH'${COLOR_RESET}\n"
    make "${TARGET_BRANCH}-local-up"
    exit 0
    ;;
esac

printf "\n"
printf "${COLOR_GREEN}🔍 Looking for branches with updates not yet merged into '$TARGET_BRANCH'...${COLOR_RESET}\n"
git fetch origin

MERGE_CANDIDATES=$(git branch -r --sort=-committerdate | grep "$FROM_PATTERN" | while read -r remote_branch; do
  LOCAL_BRANCH="${remote_branch#origin/}"
  if [ "$(git rev-list --count origin/$TARGET_BRANCH..$remote_branch)" -gt 0 ]; then
    printf "$LOCAL_BRANCH\n"
  fi
done)

if [ -z "$MERGE_CANDIDATES" ]; then
  printf "${COLOR_YELLOW}ℹ️ No branches with new commits to merge into '$TARGET_BRANCH'.${COLOR_RESET}\n"
  if container_exists; then
    make "${TARGET_BRANCH}-local-up"
  else
    make "${TARGET_BRANCH}-local-build-up"
  fi
  exit 0
fi

printf "${COLOR_YELLOW}🧩 Select a branch to merge into '$TARGET_BRANCH':${COLOR_RESET}\n"
select FEATURE_BRANCH in $MERGE_CANDIDATES "Continue without merging"; do
  if [ "$FEATURE_BRANCH" = "Continue without merging" ]; then
    printf "${COLOR_YELLOW}➡️ Continuing without merging...${COLOR_RESET}\n"
    make "${TARGET_BRANCH}-local-up"
    exit 0
  elif [ -n "$FEATURE_BRANCH" ]; then
    printf "${COLOR_GREEN}🔀 Merging '$FEATURE_BRANCH' into '$TARGET_BRANCH'...${COLOR_RESET}\n"
    git merge origin/"$FEATURE_BRANCH" --no-edit || {
      printf "${COLOR_RED}❌ Merge conflict detected. Resolve manually.${COLOR_RESET}\n"
      exit 1
    }
    break
  else
    printf "${COLOR_RED}❌ Invalid selection. Try again.${COLOR_RESET}\n"
  fi
done

# Levantar contenedor con rebuild si package.json cambió
if container_exists; then
  if git diff --name-only HEAD@{1} HEAD | grep -q "package.json"; then
    printf "${COLOR_GREEN}📦 Detected changes in package.json. Running build...${COLOR_RESET}\n"
    make "${TARGET_BRANCH}-local-build-up"
  else
    printf "${COLOR_GREEN}✅ No package.json changes. Running standard container up...${COLOR_RESET}\n"
    make "${TARGET_BRANCH}-local-up"
  fi
else
  make "${TARGET_BRANCH}-local-build-up"
fi