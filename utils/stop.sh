#!/usr/bin/env bash
set -e

PROJECT_NAME="jorge-portfolio"
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || printf "")
SANITIZED_BRANCH="${CURRENT_BRANCH//\//-}"

if [[ -z "$CURRENT_BRANCH" ]]; then
  echo "❌ Could not detect branch"
  exit 1
fi

case "$CURRENT_BRANCH" in
  feature/*)
    STACK_NAME="${PROJECT_NAME}-feature-local"
    ;;
  *)
    STACK_NAME="${PROJECT_NAME}-${SANITIZED_BRANCH}-local"
    ;;
esac

echo "⏹️ Stopping stack: $STACK_NAME"
docker compose -p "$STACK_NAME" stop