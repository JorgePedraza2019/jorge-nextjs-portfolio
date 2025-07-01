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
SANITIZED_BRANCH="${TARGET_BRANCH//\//-}"

if [ -z "$TARGET_BRANCH" ]; then
  printf "${COLOR_RED}❌ ERROR: You must provide a target branch (e.g., dev, qa, main).${COLOR_RESET}\n"
  exit 1
fi

# Get current branch before switching
CURR_BRANCH="$(git symbolic-ref --short HEAD 2>/dev/null || printf "")"

# Retrieve the previously checked out branch (optional, for branch history tracking)
# if [ -f .git/prev-branch.tmp ]; then
#   PREV_BRANCH="$(cat .git/prev-branch.tmp)"
# else
#   PREV_BRANCH=""
# fi

PREV_BRANCH="$(git symbolic-ref --short HEAD 2>/dev/null || printf "")"

printf "${COLOR_BLUE}🔄 Git branch changed. Restarting Docker environment... From: '$PREV_BRANCH' ➡️  To: '$TARGET_BRANCH'${COLOR_RESET}\n"

# Save the new branch to a temp file for future reference
# printf "$TARGET_BRANCH" > .git/prev-branch.tmp

# Skip restart if switching to the same branch (optional)
if [ "$PREV_BRANCH" = "$TARGET_BRANCH" ]; then
  printf "${COLOR_YELLOW}⚠️  Same branch detected ($TARGET_BRANCH), skipping stop/start${COLOR_RESET}\n"
  exit 0
fi

# 🛑 Stop the Docker environment for the previous branch
case "$PREV_BRANCH" in
  dev) make dev-local-stop || true ;;
  qa) make qa-local-stop || true ;;
  main) make main-local-stop || true ;;
  feature/*) make feature-local-stop || true ;;
esac

git fetch origin

# Switch to the new target branch
if ! git switch "$TARGET_BRANCH" > /dev/null 2>&1; then
  printf "${COLOR_RED}❌ Failed to switch to branch '$TARGET_BRANCH'${COLOR_RESET}\n"
  exit 1
fi

# Get latest commit from local branch
LOCAL_COMMIT=$(git log -1 HEAD --pretty=format:"%h — %s — %an — %cd" --date=format:"%Y-%m-%d %H:%M") || {
  printf "${COLOR_RED}⚠️ Error getting local commit log${COLOR_RESET}\n"
  LOCAL_COMMIT="(none)"
}

# Get latest commit from remote
REMOTE_COMMIT=$(git log -1 origin/"$TARGET_BRANCH" --pretty=format:"%h — %s — %an — %cd" --date=format:"%Y-%m-%d %H:%M") || {
  printf "${COLOR_RED}⚠️ Error getting origin commit log${COLOR_RESET}\n"
  REMOTE_COMMIT="(none)"
}

printf "\n${COLOR_BLUE}📅 Local  '$TARGET_BRANCH': $LOCAL_COMMIT${COLOR_RESET}"
printf "\n${COLOR_BLUE}☁️  Origin '$TARGET_BRANCH': $REMOTE_COMMIT${COLOR_RESET}\n"

AHEAD_COUNT=$(git rev-list --count origin/"$TARGET_BRANCH"..HEAD)

# Check if local branch is ahead of origin
if [ "$AHEAD_COUNT" -gt 0 ]; then
  printf "\n"
  printf "${COLOR_YELLOW}⚠️  Your local '$TARGET_BRANCH' branch is ahead of 'origin/$TARGET_BRANCH' by $AHEAD_COUNT commit(s).${COLOR_RESET}\n"
  printf "${COLOR_YELLOW}⚠️  Consider pushing your local changes first.${COLOR_RESET}\n"
fi

# Helper function: check if container for the target branch already exists
container_exists() {
  case "$TARGET_BRANCH" in
    feature/*)
      docker ps -a --format '{{.Names}}' | grep -q "${PROJECT_NAME}-app-feature-local-container"
      ;;
    *)
      docker ps -a --format '{{.Names}}' | grep -q "${PROJECT_NAME}-app-${SANITIZED_BRANCH}-local-container"
      ;;
  esac
}

# Define the branch pattern to look for merge candidates into the target branch
case "$TARGET_BRANCH" in
  dev) FROM_PATTERN="origin/feature/" ;;
  qa) FROM_PATTERN="origin/dev" ;;
  main) FROM_PATTERN="origin/qa" ;;
  feature/*)
    # Feature branches do not require merge automation, just start or build the container
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
case "$TARGET_BRANCH" in
  dev)
    printf "${COLOR_GREEN}🔍 Looking for feature branches (origin/feature/*) with updates not yet merged into local '$TARGET_BRANCH'...${COLOR_RESET}\n"
    ;;
  qa)
    printf "${COLOR_GREEN}🔍 Looking for updates from 'origin/dev' not yet merged into local '$TARGET_BRANCH'...${COLOR_RESET}\n"
    ;;
  main)
    printf "${COLOR_GREEN}🔍 Looking for updates from 'origin/qa' not yet merged into local '$TARGET_BRANCH'...${COLOR_RESET}\n"
    ;;
esac

# Identify remote branches that contain commits not yet merged into the target branch
MERGE_CANDIDATES=$(git branch -r --sort=-committerdate | grep "$FROM_PATTERN" | while read -r remote_branch; do
  LOCAL_BRANCH="${remote_branch#origin/}"
  AHEAD=$(git rev-list --count HEAD.."$remote_branch")

  if [ "$AHEAD" -gt 0 ]; then
    COMMIT_INFO=$(git log -1 "$remote_branch" --pretty=format:"%h — %s — %an — %cd" --date=format:"%Y-%m-%d %H:%M")
    printf "$LOCAL_BRANCH — $COMMIT_INFO\n"
  fi
done)

if [ -z "$MERGE_CANDIDATES" ]; then
  printf "${COLOR_YELLOW}ℹ️  No branches with new commits to merge into '$TARGET_BRANCH'.${COLOR_RESET}\n"
  printf "\n"
  if container_exists; then
    printf "${COLOR_BLUE}📦 Container exists. Running make ${TARGET_BRANCH}-local-up...${COLOR_RESET}\n"
    make "${TARGET_BRANCH}-local-up"
  else
    printf "${COLOR_BLUE}📦 Container does not exist. Running make ${TARGET_BRANCH}-local-build-up...${COLOR_RESET}\n"
    make "${TARGET_BRANCH}-local-build-up"
  fi
  printf "${COLOR_GREEN}✅ Done switching to $TARGET_BRANCH${COLOR_RESET}\n"
  exit 0
fi

# Prompt user to select a branch to merge into the target branch
printf "${COLOR_YELLOW}🧩 Select a branch to merge into local '$TARGET_BRANCH':${COLOR_RESET}\n"
select BRANCH_LINE in $MERGE_CANDIDATES "Continue without merging"; do
  if [ "$BRANCH_LINE" = "Continue without merging" ]; then
    printf "${COLOR_YELLOW}➡️  Continuing without merging...${COLOR_RESET}\n"
    make "${TARGET_BRANCH}-local-up"
    exit 0
  elif [ -n "$BRANCH_LINE" ]; then
    FEATURE_BRANCH=$(printf "$BRANCH_LINE" | cut -d " " -f1)
    printf "${COLOR_GREEN}🔀 Merging '$FEATURE_BRANCH' into '$TARGET_BRANCH'...${COLOR_RESET}\n"
    if ! git merge origin/"$FEATURE_BRANCH" --no-edit; then
      printf "${COLOR_RED}❌ Merge conflict detected. Resolve manually.${COLOR_RESET}\n"
      exit 1
    fi
    break
  else
    printf "${COLOR_RED}❌ Invalid selection. Try again.${COLOR_RESET}\n"
  fi
done

# Rebuild container only if the merged changes include package.json
if container_exists; then
  if git diff --name-only HEAD^ HEAD | grep -q "package.json"; then
    printf "${COLOR_GREEN}📦 Detected changes in package.json. Running build...${COLOR_RESET}\n"
    make "${TARGET_BRANCH}-local-build-up"
  else
    printf "${COLOR_GREEN}✅ No package.json changes. Running standard container up...${COLOR_RESET}\n"
    make "${TARGET_BRANCH}-local-up"
  fi
else
  make "${TARGET_BRANCH}-local-build-up"
fi