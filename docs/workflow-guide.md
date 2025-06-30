# 🧠 Git Workflow Guide with Docker Environments

This document describes the two recommended Git and Docker workflows for this project:  
- One for a **solo developer**
- Another for a **collaborative team**

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Option 1: Solo Developer Workflow](#option-1-solo-developer-workflow)  
   2.1 [Daily Workflow](#daily-workflow)  
   2.2 [Automated Git Merge Detection](#automated-git-merge-detection)  
3. [Option 2: Team Collaboration Workflow](#option-2-team-collaboration-workflow)  
   3.1 [Feature Developers](#feature-developers)  
   3.2 [Dev/QA Maintainers](#devqa-maintainers)  
   3.3 [Merge Automation](#merge-automation)  
4. [Best Practices](#best-practices)  
5. [CI/CD Considerations](#cicd-considerations)

---

## 🧭 Overview

This project uses a multi-environment structure (`feature`, `dev`, `qa`, `main`) powered by Docker Compose.  
It includes automation hooks (e.g., Git `post-checkout`) to manage containers and optionally prompt for merges when switching between branches.

---

## ✅ Option 1: Solo Developer Workflow

### 🗓️ Daily Workflow

1. **Create a new feature branch**  
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make code changes and commit**  
   ```bash
   git add .
   git commit -m "New feature implemented"
   git push origin feature/your-feature
   ```

3. **Switch to dev**  
   ```bash
   git switch dev
   ```

4. **The `post-checkout` hook will:**  
   - Stop your current docker environment
   - Detect new commits in your `feature` branch  
   - Ask: “Do you want to merge `feature/your-feature` into `dev`?”  
   - If yes → performs `git merge` automatically  
   - If no → skips the merge and starts docker

5. **Based on the changes:**  
   - If `package.json` was modified → runs `make dev-local-build-up`  
   - If not → runs `make dev-local-up`

6. **Test in dev, then optionally push changes**  
   ```bash
   git push origin dev
   ```

7. **Repeat the same flow for QA and Main:**  
   - Switch to `qa`, merge from `dev`, test, push  
   - Switch to `main`, merge from `qa`, test, push  

---

### 🔁 Automated Git Merge Detection

The system automatically checks:  
- If your source branch (e.g., `feature/*`) has new commits  
- If `package.json` or other build-relevant files changed  
- Prompts for a merge only when needed

---

## 👥 Option 2: Team Collaboration Workflow

### 🧱 Feature Developers

Each developer creates their own feature branch:

```bash
git checkout -b feature/username-task
```

They:  
- Work independently  
- Push changes to origin  
- Notify the dev/qa maintainers when ready  

---

### 🧪 Dev/QA Maintainers

These users:  
- Do **not** work on `feature` branches  
- Only run `make dev-local-up` or `make qa-local-up`  
- Do **not** switch branches manually  

The `make dev-local-up` command will automatically:  
- Detect if any `feature` branches have new changes  
- Prompt: “Merge updates from `feature/username-task` into `dev`?”  
- Perform the merge if accepted  

The same logic applies for QA:  
- Detects updates in `dev` and prompts to merge into `qa`

---

### 🤖 Merge Automation

This ensures that **even if the user never uses `git switch`**, the system still checks for upstream changes and handles merges before launching containers.

---

## 🛠 Best Practices

- ✅ Always verify **CI status** on GitHub before merging  
- 🔍 Keep feature branches **small and focused**  
- 🧹 Clean up old branches after merging  
- 🧠 Prefer **interactive review** for major changes  
- 🔐 Ensure `.env` and SSL files are correctly set per environment  

---

## 🚀 CI/CD Considerations

- Each branch (`feature`, `dev`, `qa`, `main`) runs CI automatically via GitHub Actions  
- Merges should only happen if:
	- ✅ CI checks are passing
	- 👀 Code has been reviewed (for teams)
- ✅ CD (Continuous Deployment) is already configured for:
	- dev: Deploys automatically to the development server after every successful push
	- qa: Deploys to the QA server for staging and testing
	- main: Deploys to the production server for final delivery
	- 🔐 Only branches with stable and reviewed code should be merged into main