#!/usr/bin/env bash
set -e

# -------------------------
# Colors
# -------------------------
COLOR_GREEN='\033[1;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_RED='\033[1;31m'
COLOR_BLUE='\033[1;34m'
COLOR_RESET='\033[0m'
COLOR_HASH='\033[0;37m'
COLOR_MSG='\033[1;33m'
COLOR_AUTHOR='\033[1;32m'
COLOR_FILES='\033[1;35m'
COLOR_BRANCH='\033[1;34m'

PROJECT_NAME="jorge-portfolio-frontend"
TARGET_BRANCH=$1
SANITIZED_BRANCH="${TARGET_BRANCH//\//-}"

if [ -z "$TARGET_BRANCH" ]; then
  printf "${COLOR_RED}❌ ERROR: You must provide a target branch (e.g., dev, qa, main).${COLOR_RESET}\n"
  exit 1
fi

PREV_BRANCH="$(git symbolic-ref --short HEAD 2>/dev/null || printf "")"

printf "${COLOR_BLUE}🔄 Git branch changed. Restarting Docker environment... From: '$PREV_BRANCH' ➡️  To: '$TARGET_BRANCH'${COLOR_RESET}\n"

if [ "$PREV_BRANCH" = "$TARGET_BRANCH" ]; then
  printf "${COLOR_YELLOW}⚠️  Same branch detected ($TARGET_BRANCH), skipping stop/start${COLOR_RESET}\n"
  exit 0
fi

case "$PREV_BRANCH" in
  dev) make dev-local-stop || true ;;
  qa) make qa-local-stop || true ;;
  main) make main-local-stop || true ;;
  feature/*) make feature-local-stop || true ;;
esac

git fetch origin

if ! git switch "$TARGET_BRANCH" > /dev/null 2>&1; then
  printf "${COLOR_RED}❌ Failed to switch to branch '$TARGET_BRANCH'${COLOR_RESET}\n"
  exit 1
fi

LOCAL_COMMIT=$(git log -1 HEAD --pretty=format:"%h — %s — %an — %cd" --date=format:"%Y-%m-%d %H:%M" || echo "(none)")
REMOTE_COMMIT=$(git log -1 origin/"$TARGET_BRANCH" --pretty=format:"%h — %s — %an — %cd" --date=format:"%Y-%m-%d %H:%M" || echo "(none)")

printf "\n${COLOR_BLUE}📅 Local  '$TARGET_BRANCH': $LOCAL_COMMIT${COLOR_RESET}"
printf "\n${COLOR_BLUE}☁️  Origin '$TARGET_BRANCH': $REMOTE_COMMIT${COLOR_RESET}\n"

AHEAD_COUNT=$(git rev-list --count origin/"$TARGET_BRANCH"..HEAD)
if [ "$AHEAD_COUNT" -gt 0 ]; then
  printf "\n${COLOR_YELLOW}⚠️  Your local '$TARGET_BRANCH' branch is ahead of 'origin/$TARGET_BRANCH' by $AHEAD_COUNT commit(s).${COLOR_RESET}\n"
  printf "${COLOR_YELLOW}⚠️  Consider pushing your local changes first.${COLOR_RESET}\n"
fi

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

case "$TARGET_BRANCH" in
  dev) FROM_PATTERN="origin/feature/" ;;
  qa) FROM_PATTERN="origin/dev" ;;
  main) FROM_PATTERN="origin/qa" ;;
  feature/*)
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

printf "\n${COLOR_GREEN}🔍 Looking for updates not yet merged into local '$TARGET_BRANCH'...${COLOR_RESET}\n"

MERGE_CANDIDATES=()
CANDIDATE_LABELS=()

while read -r remote_branch; do
  LOCAL_BRANCH="${remote_branch#origin/}"
  COMMITS_AHEAD=$(git rev-list --count HEAD.."$remote_branch")
  if [ "$COMMITS_AHEAD" -gt 0 ]; then
    COMMIT_HASH=$(git log -1 --pretty=format:"%h" "$remote_branch")
    COMMIT_MSG=$(git log -1 --pretty=format:"%s" "$remote_branch" | cut -c1-60)
    COMMIT_AUTHOR=$(git log -1 --pretty=format:"%an" "$remote_branch")
    COMMIT_DATE=$(git log -1 --pretty=format:"%cd" --date=format:"%Y-%m-%d %H:%M")
    FILES=$(git diff-tree --no-commit-id --name-only -r "$COMMIT_HASH" | head -3 | tr '\n' ', ' | sed 's/, $//')
    FILE_COUNT=$(git diff-tree --no-commit-id --name-only -r "$COMMIT_HASH" | wc -l | tr -d ' ')
    if [ "$FILE_COUNT" -gt 3 ]; then
      FILES="$FILES... (+$((FILE_COUNT - 3)) more)"
    fi

    MERGE_CANDIDATES+=("$LOCAL_BRANCH")
    CANDIDATE_LABELS+=("${COLOR_BRANCH}${LOCAL_BRANCH}${COLOR_RESET} — ${COLOR_HASH}${COMMIT_HASH}${COLOR_RESET} — ${COLOR_MSG}${COMMIT_MSG}${COLOR_RESET} — ${COLOR_AUTHOR}${COMMIT_AUTHOR}${COLOR_RESET} — ${COLOR_HASH}${COMMIT_DATE}${COLOR_RESET} — ${COLOR_FILES}${FILES}${COLOR_RESET}")
  fi
done < <(git branch -r --sort=-committerdate | grep "$FROM_PATTERN")

if [ "${#MERGE_CANDIDATES[@]}" -eq 0 ]; then
  printf "${COLOR_YELLOW}ℹ️  No branches with new commits to merge into '$TARGET_BRANCH'.${COLOR_RESET}\n\n"
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

CANDIDATE_LABELS+=("Continue without merging")

printf "\n${COLOR_YELLOW}🧩 Select a branch to merge into local '$TARGET_BRANCH':${COLOR_RESET}\n\n"

for i in "${!CANDIDATE_LABELS[@]}"; do
  printf "%s) %b\n" "$((i + 1))" "${CANDIDATE_LABELS[$i]}"
done

# Ask for input
echo ""
read -p "$(printf "${COLOR_YELLOW}#? ${COLOR_RESET}")" USER_CHOICE

if ! [[ "$USER_CHOICE" =~ ^[0-9]+$ ]] || [ "$USER_CHOICE" -lt 1 ] || [ "$USER_CHOICE" -gt "${#CANDIDATE_LABELS[@]}" ]; then
  printf "${COLOR_RED}❌ Invalid selection. Exiting.${COLOR_RESET}\n"
  exit 1
fi

SELECTED_INDEX=$((USER_CHOICE - 1))
SELECTED_BRANCH="${MERGE_CANDIDATES[$SELECTED_INDEX]}"

if [ "$SELECTED_BRANCH" = "" ]; then
  printf "${COLOR_YELLOW}➡️  Continuing without merging...${COLOR_RESET}\n"
  make "${TARGET_BRANCH}-local-up"
  exit 0
fi

printf "${COLOR_GREEN}🔀 Merging '$SELECTED_BRANCH' into '$TARGET_BRANCH'...${COLOR_RESET}\n"
if ! git merge origin/"$SELECTED_BRANCH" --no-edit; then
  printf "${COLOR_RED}❌ Merge conflict detected. Resolve manually.${COLOR_RESET}\n"
  exit 1
fi

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