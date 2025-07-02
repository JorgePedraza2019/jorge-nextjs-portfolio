# 🧠 Git Workflow Guide with Docker Environments

This document explains how to work with Git and Docker across environments (`feature`, `dev`, `qa`, `main`) using the provided automation scripts.

It covers two typical workflows:
- One for **solo developers**
- One for **collaborative teams**

⸻

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

⸻

## 🧭 Overview

This project uses a multi-environment structure (`feature`, `dev`, `qa`, `main`) powered by Docker Compose.  
It includes automation hooks to manage containers and optionally prompt for merges when switching between branches.

Branches:
- `feature/*`: Active development  
- `dev`: Integration and unit tests  
- `qa`: Staging  
- `main`: Production

Environments are managed using two CLI scripts:

| Script             | Purpose                                                                     |
|--------------------|-----------------------------------------------------------------------------|
| `npm run sw -- dev`  | Switch to a target branch (e.g. dev, qa, main) and start full environment |
| `npm run launch`     | Start environment on the **current branch** with smart merge/build logic  |

⸻

## ✅ Option 1: Solo Developer Workflow

### 🗓️ Daily Workflow

1. **Create a new feature branch**  
   ```bash
   git checkout -b feature/your-feature
   ```

2.	**Code, commit, and push**
   ```bash
   git add .
   git commit -m "New feature implemented"
   git push origin feature/your-feature
   ```

3.	**Switch to dev and integrate your branch**
   ```bash
   npm run sw -- dev
   ```

   This command will:
	•	Stop any previous containers
	•	Fetch latest remote branches
	•	Offer to merge feature/your-feature into dev (if updates exist)
	•	Detect changes in package.json and choose:
	•	make dev-local-build-up (if changed)
	•	make dev-local-up (otherwise)

6. **Test in dev, then optionally push changes**  
   ```bash
   git push origin dev
   ```

7. **Repeat the same flow for QA and Main:**  
   - Switch to `qa`, merge from `dev`, test, push  
   - Switch to `main`, merge from `qa`, test, push  

⸻

### 🔁 Smart Git Merge Detection

When switching branches (via switch.sh) or launching (launch.sh), the system will:
	•	Detect available updates in source branches
	•	e.g., feature/* → dev, dev → qa, qa → main
	•	Offer interactive prompt to merge the branch
	•	Detect whether package.json changed
	•	If yes → build from scratch (make <branch>-local-build-up)
	•	If no → skip build for faster startup

⸻

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

⸻

### 🧪 Dev/QA Maintainers

Maintainers of dev, qa, or main do not switch manually or run Docker commands directly.
Instead, they simply run:
```bash
npm run launch
```

This script:
	•	Detects changes in upstream source branches (e.g., feature/* → dev)
	•	Prompts for merging updates
	•	Applies smart build logic based on package.json diffs
	•	Launches the environment accordingly

✅ This allows QA or Dev users to stay in a single branch and always have the latest changes.

⸻

### 🤖 Merge Automation Behavior

| Branch             | Merge Source Detected        | Example                          |
|--------------------|-----------------------------------------------------------------|
| dev                | origin/feature/*             | Merge feature branches into dev  |
| qa                 | origin/dev                   | Merge dev into qa                |
| main               | origin/qa                    | Merge qa into main               |
| feature/*          | ❌ No merge (direct startup) | Skip merge; build or up directly |

feature/* branches are treated as isolated and do not pull from other branches.

⸻

## 🛠 Best Practices

- ✅ Use npm run sw -- <branch> to switch branches and apply all logic safely
- ✅ Use npm run launch when staying in a branch and checking for updates
- 🧪 Only use make commands for debugging or low-level tasks
- 🔐 Keep .env and cert files properly configured
- ✅ Always verify **CI status** on GitHub before merging  
- 🔁 Push after every successful test or merge to keep the team synced
- 🔍 Keep feature branches **small and focused**  
- 🧹 Clean up old branches after merging  
- 🧠 Prefer **interactive review** for major changes  

⸻

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

| Branch            | CI | CD | Notes                                  |
|-------------------|----|----|----------------------------------------|
| feature/*         | ✅ | ❌ | Tests only (no deployment)             |
| dev               | ✅ | ✅ | Deployed to dev server after CI passes |
| qa                | ✅ | ✅ | Deployed to staging (QA) server        |
| main              | ✅ | ✅ | Final production deployment            |