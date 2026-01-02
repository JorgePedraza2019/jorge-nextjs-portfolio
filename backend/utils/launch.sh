# /backend/utils/launch.sh
#!/usr/bin/env bash
set -e

# =========================
# 🎨 Colors
# =========================
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

# =========================
# ⚙️ Config
# =========================
PROJECT_NAME="jorge-portfolio-backend"
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || printf "")
SANITIZED_BRANCH="${CURRENT_BRANCH//\//-}"

if [ -z "$CURRENT_BRANCH" ]; then
  printf "${COLOR_RED}❌ ERROR: Could not detect current Git branch.${COLOR_RESET}\n"
  exit 1
fi

printf "${COLOR_BLUE}🚀 Launching current branch: '$CURRENT_BRANCH'${COLOR_RESET}\n"

# Define container name based on branch
container_exists() {
  local project

  case "$CURRENT_BRANCH" in
    feature/*)
      project="${PROJECT_NAME}-backend-feature-local"
      ;;
    *)
      project="${PROJECT_NAME}-backend-${SANITIZED_BRANCH}-local"
      ;;
  esac

  # Revisa si hay algún contenedor creado, aunque esté detenido
  docker compose -p "$project" ps -a -q | grep -q .
}

# =========================
# 🔀 Define merge source
# =========================
case "$CURRENT_BRANCH" in
  dev)
    FROM_PATTERN="origin/feature/"
    ;;
  qa)
    FROM_PATTERN="origin/dev"
    ;;
  main)
    FROM_PATTERN="origin/qa"
    ;;
  feature/*)
    printf "${COLOR_YELLOW}🧪 Feature branch detected. Skipping merge logic.${COLOR_RESET}\n"
    if container_exists; then
      make "feature-local-up"
    else
      make "feature-local-build-up"
    fi
    exit 0
    ;;
  *)
    printf "${COLOR_YELLOW}ℹ️  No merge source defined. Launching stack directly.${COLOR_RESET}\n"
    if container_exists; then
      make "${SANITIZED_BRANCH}-local-up"
    else
      make "${SANITIZED_BRANCH}-local-build-up"
    fi
    exit 0
    ;;
esac

if [ -z "$FROM_PATTERN" ]; then
  printf "${COLOR_YELLOW}ℹ️  No merge source defined for '$CURRENT_BRANCH'. Running containers directly...${COLOR_RESET}\n"
  if container_exists; then
    make "${SANITIZED_BRANCH}-local-up"
  else
    make "${SANITIZED_BRANCH}-local-build-up"
  fi
  exit 0
fi

# =========================
# 🌍 Fetch updates
# =========================
git fetch origin

# Look for merge candidates
printf "\n${COLOR_GREEN}🔍 Looking for updates not yet merged into '$CURRENT_BRANCH'...${COLOR_RESET}\n"

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
  printf "${COLOR_YELLOW}ℹ️  No branches with new commits to merge into '$CURRENT_BRANCH'.${COLOR_RESET}\n\n"
  if container_exists; then
    make "${SANITIZED_BRANCH}-local-up"
  else
    make "${SANITIZED_BRANCH}-local-build-up"
  fi
  exit 0
fi

# =========================
# 🧩 Ask user
# =========================
CANDIDATE_LABELS+=("Continue without merging")

printf "${COLOR_YELLOW}🧩 Select a branch to merge into local '$CURRENT_BRANCH':${COLOR_RESET}\n"
for i in "${!CANDIDATE_LABELS[@]}"; do
  printf "     %s) %b\n" "$((i + 1))" "${CANDIDATE_LABELS[$i]}"
done

echo ""
read -p "$(printf "     ${COLOR_YELLOW}#? ${COLOR_RESET}")" USER_CHOICE

if ! [[ "$USER_CHOICE" =~ ^[0-9]+$ ]] || \
   [ "$USER_CHOICE" -lt 1 ] || \
   [ "$USER_CHOICE" -gt "${#CANDIDATE_LABELS[@]}" ]; then
  printf "${COLOR_RED}❌ Invalid selection. Exiting.${COLOR_RESET}\n"
  exit 1
fi

SELECTED_INDEX=$((USER_CHOICE - 1))
SELECTED_BRANCH="${MERGE_CANDIDATES[$SELECTED_INDEX]}"

# =========================
# 🔀 Perform merge
# =========================
if [ -z "$SELECTED_BRANCH" ]; then
  printf "${COLOR_YELLOW}➡️  Continuing without merging...${COLOR_RESET}\n"
else
  printf "${COLOR_GREEN}🔀 Merging '$SELECTED_BRANCH' into '$CURRENT_BRANCH'...${COLOR_RESET}\n"
  if ! git merge origin/"$SELECTED_BRANCH" --no-edit; then
    printf "${COLOR_RED}❌ Merge conflict detected. Resolve manually.${COLOR_RESET}\n"
    exit 1
  fi
fi

# Decide whether to build
if container_exists; then
  if git diff --name-only HEAD^ HEAD | grep -q "package.json"; then
    printf "${COLOR_GREEN}📦 Detected changes in package.json. Running build...${COLOR_RESET}\n"
    make "${SANITIZED_BRANCH}-local-build-up"
  else
    printf "${COLOR_GREEN}✅ No package.json changes. Running standard container up...${COLOR_RESET}\n"
    make "${SANITIZED_BRANCH}-local-up"
  fi
else
  make "${SANITIZED_BRANCH}-local-build-up"
fi