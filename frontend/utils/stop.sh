#!/usr/bin/env bash
set -e

# =========================================================
# stop.sh
#
# Stops the Docker stack for the current Git branch
# by delegating the action to the corresponding
# Makefile target.
#
# Examples:
# - feature/my-feature  → make feature-local-stop
# - dev                 → make dev-local-stop
# - qa                  → make qa-local-stop
# =========================================================

PROJECT_NAME="jorge-portfolio"

# Detect current Git branch
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || printf "")

# Replace slashes to make branch name Docker/Makefile safe
SANITIZED_BRANCH="${CURRENT_BRANCH//\//-}"

# Fail fast if branch cannot be detected
if [[ -z "$CURRENT_BRANCH" ]]; then
  echo "❌ Could not detect Git branch"
  exit 1
fi

# =========================================================
# 🔹 Determine Makefile target based on branch
# =========================================================
case "$CURRENT_BRANCH" in
  feature/*)
    TARGET="feature-local-stop"
    ;;
  *)
    TARGET="${SANITIZED_BRANCH}-local-stop"
    ;;
esac

# =========================================================
# ⏹️ Stop stack using Makefile
# =========================================================
echo "⏹️ Stopping stack using Makefile target: $TARGET"
make "$TARGET"