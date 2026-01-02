#!/usr/bin/env bash
set -e

PROJECT_NAME="jorge-portfolio"
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || printf "")
SANITIZED_BRANCH="${CURRENT_BRANCH//\//-}"

if [[ -z "$CURRENT_BRANCH" ]]; then
  echo "❌ Could not detect branch"
  exit 1
fi

# =========================
# 🔹 Determine Makefile target
# =========================
case "$CURRENT_BRANCH" in
  feature/*)
    TARGET="feature-local-down"
    ;;
  *)
    TARGET="${SANITIZED_BRANCH}-local-down"
    ;;
esac

# =========================
# 🧹 Call Makefile
# =========================
echo "🧹 Bringing down stack using Makefile target: $TARGET"
make "$TARGET"