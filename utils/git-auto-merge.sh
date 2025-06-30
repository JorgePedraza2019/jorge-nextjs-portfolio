#!/usr/bin/env bash

set -e

COLOR_GREEN='\033[1;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_RED='\033[1;31m'
COLOR_RESET='\033[0m'

PROJECT_NAME="jorge-portfolio-frontend"

TARGET_BRANCH=$1

# 🔍 Check if the container exists
container_exists() {
  docker ps -a --format '{{.Names}}' | grep -q "${PROJECT_NAME}-app-${TARGET_BRANCH}-local-container"
}

# Infer the branch we should merge from
case "$TARGET_BRANCH" in
  dev)
    FROM_PATTERN="origin/feature/"
    ;;
  qa)
    FROM_PATTERN="origin/dev"
    ;;
  main)
    FROM_PATTERN="origin/qa"
    ;;
  *)
    echo "${COLOR_YELLOW}ℹ️ No merge automation defined for '$TARGET_BRANCH'${COLOR_RESET}"
    exit 0
    ;;
esac

if [ -z "$TARGET_BRANCH" ]; then
  echo "${COLOR_RED}❌ ERROR: No target branch specified (e.g., dev, qa, main).${COLOR_RESET}"
  exit 1
fi

echo ""
echo "${COLOR_GREEN}🔍 Looking for feature branches that have updates not yet merged into '$TARGET_BRANCH'...${COLOR_RESET}"

# Ensure local and remote are up to date
git fetch origin

# List remote feature branches that are ahead of target branch
MERGE_CANDIDATES=$(git branch -r --sort=-committerdate | grep "$FROM_PATTERN" | while read -r remote_branch; do
  LOCAL_BRANCH="${remote_branch#origin/}"
  # Check if there are commits in feature that are not in target
  if [ "$(git rev-list --count origin/$TARGET_BRANCH..$remote_branch)" -gt 0 ]; then
    echo "$LOCAL_BRANCH"
  fi
done)

if [ -z "$MERGE_CANDIDATES" ]; then
  echo "${COLOR_YELLOW}ℹ️  No feature branches with new commits to merge into '$TARGET_BRANCH'.${COLOR_RESET}"
  if container_exists; then
    make "${TARGET_BRANCH}-local-up"
  else
    make "${TARGET_BRANCH}-local-build-up"
  fi
  exit 0
fi

echo "${COLOR_YELLOW}🧩 Select a feature branch to merge into '$TARGET_BRANCH':${COLOR_RESET}"
select FEATURE_BRANCH in $MERGE_CANDIDATES "Cancel"; do
  if [ "$FEATURE_BRANCH" = "Cancel" ]; then
    echo "${COLOR_YELLOW}🚫 Merge canceled by user.${COLOR_RESET}"
    exit 0
  elif [ -n "$FEATURE_BRANCH" ]; then
    echo "${COLOR_GREEN}🔀 Merging '$FEATURE_BRANCH' into '$TARGET_BRANCH'...${COLOR_RESET}"
    git merge origin/"$FEATURE_BRANCH" --no-edit || {
      echo "${COLOR_RED}❌ Merge conflict detected. Please resolve manually.${COLOR_RESET}"
      exit 1
    }
    break
  else
    echo "${COLOR_RED}❌ Invalid selection. Try again.${COLOR_RESET}"
  fi
done

# Check if package.json was modified in the merge
if container_exists; then
  if git diff --name-only HEAD@{1} HEAD | grep -q "package.json"; then
    echo "${COLOR_GREEN}📦 Detected changes in package.json. Running build...${COLOR_RESET}"
    make "${TARGET_BRANCH}-local-build-up"
  else
    echo "${COLOR_GREEN}✅ No package.json changes. Running standard container up...${COLOR_RESET}"
    make "${TARGET_BRANCH}-local-up"
  fi
else
  make "${TARGET_BRANCH}-local-build-up"
fi