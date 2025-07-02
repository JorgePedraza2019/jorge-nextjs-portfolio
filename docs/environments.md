# 🌐 Environments and Deployment Strategy

This document explains how the project behaves per **branch** and **environment** (`local`, `CI`, `CD`) regarding tools, dependencies, servers, testing, and execution.

⸻

### 📚 Table of Contents

1. [📁 Branches Overview](#-branches-overview)  
2. [🛠️ Tools & Technologies](#️-tools--technologies)  
3. [🚀 Environment Behavior Matrix](#-environment-behavior-matrix)  
4. [⚙️ Execution Modes Explained](#️-execution-modes-explained)  
5. [📌 Final Notes](#-final-notes)

⸻

## 📁 Branches Overview

| Branch       | Purpose                                                       |
|--------------|---------------------------------------------------------------|
| `feature/*`  | Development of isolated features                              |
| `dev`        | Integration of features + full automated testing              |
| `qa`         | Manual validation before production (deployed to QA server)   |
| `main`       | Final production build. No testing, stable execution only     |

⸻

## 🛠️ Tools & Technologies

- **Docker**: Used across all environments.
- **NGINX**: Used only in `local` and `CD`, **not** in `CI`. Not used in `feature/*`.
- **Playwright**: Used only in `dev` and `qa`.
- **Jest**: Used only in `dev`.
- **ESLint**: Used in `feature/*` and `dev`.
- **Dev Libraries**: Installed only in `feature/*` and `dev` (`local` and `CI` only).

⸻

## 🚀 Environment Behavior Matrix

| Branch        | Env     | Docker | NGINX | Execution Mode | Dev Dependencies | ESLint | Jest | Playwright  | URL
|---------------|---------|--------|-------|----------------|------------------|--------|------|-------------|------------|
| `feature/*`   | Local   | ✅     | ❌    | development    | ✅               | ✅     | ❌   | ❌          | http://localhost:3000
|               | CI      | ✅     | ❌    | development    | ✅               | ✅     | ❌   | ❌          | -
|               | CD      | ❌     | ❌    | —              | ❌               | ❌     | ❌   | ❌          | -
| `dev`         | Local   | ✅     | ✅    | development    | ✅               | ✅     | ✅   | ❌          | https://dev.jorgeportfolio.local
|               | CI      | ✅     | ❌    | production     | ✅               | ✅     | ✅   | ✅          | -
|               | CD      | ✅     | ✅    | production     | ❌               | ❌     | ❌   | ❌          | https://dev.jorgeportfolio.com
| `qa`          | Local   | ✅     | ✅    | production     | ✅               | ❌     | ❌   | ✅          | https://qa.jorgeportfolio.local
|               | CI      | ✅     | ❌    | production     | ✅               | ❌     | ❌   | ✅          | -
|               | CD      | ✅     | ✅    | production     | ❌               | ❌     | ❌   | ❌          | https://qa.jorgeportfolio.com
| `main`        | Local   | ✅     | ✅    | production     | ❌               | ❌     | ❌   | ❌          | https://jorgeportfolio.local
|               | CI      | ✅     | ❌    | production     | ❌               | ❌     | ❌   | ❌          | -
|               | CD      | ✅     | ✅    | production     | ❌               | ❌     | ❌   | ❌          | https://jorgeportfolio.com

**Note:** Installing `devDependencies` does not depend solely on the execution mode (development vs production). In some CI environments, even if the app runs in production mode (`npm start`), dev tools like ESLint, Jest, and Playwright are required, so they are installed intentionally.

⸻

### ⚙️ Execution Modes Explained

| Mode          | Description |
|---------------|-------------|
| `development` | - Runs the app using `npm run dev` (with hot reloading)<br>- Installs **all dependencies**, including `devDependencies` from `package.json`<br>- Used for active development and local testing |
| `production`  | - Runs the app using `npm start` after a `npm run build`<br>- Installs **only production dependencies** (excluding `devDependencies`)<br>- Used in CI/CD pipelines and production servers |

⸻

## 📌 Final Notes

- **Docker** is always used across all environments to ensure consistency.
- **NGINX** is only enabled in `local` and `CD` environments — **never in CI**.
- `feature/*` branches do **not** have a `CD` server — they are tested locally and via CI.
- Only `dev` and `feature` run **ESLint** checks.
- Only `dev` runs **unit tests (Jest)**.
- Only `dev` and `qa` run **end-to-end tests (Playwright)**.

> Refer to the `Makefile` for the exact commands used in each environment (`*-ci-*`, `*-cd-*`, `*-local-*`), including dependency installation, testing, and teardown.

⸻

📁 This file serves as a high-level guide to understand **what runs where, when, and how**—ensuring clarity and consistency across environments and branches.