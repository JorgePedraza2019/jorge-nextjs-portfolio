# Jorge's Next.js Portfolio

## 📌 Description

This is my personal portfolio built with **Next.js** and **React**, designed to showcase my skills as a frontend developer.  
It features a **responsive design**, **modern animations**, and sections for highlighted projects and technologies.  
This project demonstrates my ability to build professional, visually engaging, and user-friendly web applications.

⸻

## 📚 Table of Contents

1. [Technologies Used](#-technologies-used)
2. [Installation](#️-installation)
   - [Prerequisites](#prerequisites)
   - [Clone the Repository](#clone-the-repository)
   - [Environment Variables](#environment-variables)
   - [SSL Certificates](#-ssl-certificates-for-local-https-in-dev-qa-and-main)
3. [Development Workflow](#-development-workflow)
   - [Change Branch & Launch](#-change-branch--launch-environment)
   - [Launch Current Branch](#-launch-environment-on-current-branch)
   - [Manual Docker Run](#-docker-manual)
4. [Accessing the App](#-accessing-the-app)
5. [Project Structure](#-project-structure)
6. [Project Status](#-project-status)
7. [Contact](#-contact)

⸻

## 🚀 Technologies Used

- **Next.js** — React framework for SSR, routing, and static site generation.
- **React** — UI library for building component-based interfaces.
- **Material UI** — Modern component library for responsive, accessible UI.
- **CSS** — Custom styles and animations.
- **Docker** — Containerization for local consistency and CI/CD.
- **Playwright** — End-to-end testing framework.
- **Jest** — Unit and integration testing.
- **Husky** — Git hooks for enforcing code quality on commits.

⸻

## ⚙️ Installation

### Prerequisites

This project requires [Docker](https://www.docker.com/) to run containers locally.

- **Windows / Mac users:**  
  Install [Docker Desktop](https://docs.docker.com/desktop/), which includes Docker Engine, Docker CLI, Compose, and Kubernetes.

- **Linux users:**  
  Install Docker Engine and CLI based on your distro:  
  https://docs.docker.com/engine/install/

> ✅ Ensure Docker is running and accessible from the terminal.

⸻

### 📦 Clone the Repository

```bash
git clone https://github.com/JorgePedraza2019/jorge-nextjs-portfolio.git
cd jorge-nextjs-portfolio
```

### First-Time Setup (One-Time Only):
📄 **Environment Variables**

For each branch (`feature/*`, `dev`, `qa`, `main`), you must have the corresponding `.env` files inside the `/env/<branch>/` directory:

| Branch      | Required Files                  | Path(s)                                                              |
|-------------|---------------------------------|----------------------------------------------------------------------|
| feature/*   | `local.env`, `ci.env`           | `env/feature/local.env`, `env/feature/ci.env`                        |
| dev         | `local.env`, `ci.env`, `cd.env` | `env/dev/local.env`,     `env/dev/ci.env`,     `env/dev/cd.env`      |
| qa          | `local.env`, `ci.env`, `cd.env` | `env/qa/local.env`,      `env/qa/ci.env`,      `env/qa/cd.env`       |
| main        | `local.env`, `ci.env`, `cd.env` | `env/main/local.env`,    `env/main/ci.env`,    `env/main/cd.env`     |

Each of these has a .env.example file with default values.

📌 Copy the .env.example files and rename them to .env, then customize any sensitive values:

```bash
cp env/feature/local.env.example env/feature/local.env
cp env/feature/ci.env.example env/feature/ci.env
```

```bash
cp env/dev/local.env.example env/dev/local.env
cp env/dev/ci.env.example env/dev/ci.env
cp env/dev/cd.env.example env/dev/cd.env
```

```bash
cp env/qa/local.env.example env/qa/local.env
cp env/qa/ci.env.example env/qa/ci.env
cp env/qa/cd.env.example env/qa/cd.env
```

```bash
cp env/main/local.env.example env/main/local.env
cp env/main/ci.env.example env/main/ci.env
cp env/main/cd.env.example env/main/cd.env
```

Open your terminal, navigate to the root folder of the project, and run the following commands to make the CLI scripts executable:
```bash
chmod +x utils/launch.sh
chmod +x utils/switch.sh
```

📄 **🔐 SSL Certificates (for Local HTTPS in dev, qa, and main)**
To enable HTTPS and NGINX locally for the dev, qa, and main environments, you must create self-signed SSL certificates.

Each branch expects a specific certificate structure under the ./certs/ folder:

| Branch      | Certificate File                                        | Key File                                                |
|-------------|---------------------------------------------------------|---------------------------------------------------------|
| dev         | `docker/nginx/local/certs/dev.jorgeportfolio.local.crt` | `docker/nginx/local/certs/dev.jorgeportfolio.local.key` |
| qa          | `docker/nginx/local/certs/qa.jorgeportfolio.local.crt`  | `docker/nginx/local/certs/qa.jorgeportfolio.local.key`  |
| main        | `docker/nginx/local/certs/jorgeportfolio.local.crt`     | `docker/nginx/local/certs/jorgeportfolio.local.key`     |

These certificates are mounted into the NGINX Docker container and required to access the app locally over HTTPS at:
	•	https://dev.jorgeportfolio.local
	•	https://qa.jorgeportfolio.local
	•	https://jorgeportfolio.local

🛠 Generate with OpenSSL (examples for dev, qa, and main):
```bash
mkdir -p docker/nginx/local/certs/dev
openssl req -x509 -newkey rsa:4096 -nodes \
  -keyout docker/nginx/local/certs/dev/dev.jorgeportfolio.local.key \
  -out docker/nginx/local/certs/dev/dev.jorgeportfolio.local.crt \
  -days 365 \
  -subj "/CN=dev.jorgeportfolio.local"
```

```bash
mkdir -p docker/nginx/local/certs/qa
openssl req -x509 -newkey rsa:4096 -nodes \
  -keyout docker/nginx/local/certs/qa/qa.jorgeportfolio.local.key \
  -out docker/nginx/local/certs/qa/qa.jorgeportfolio.local.crt \
  -days 365 \
  -subj "/CN=qa.jorgeportfolio.local"
```

```bash
mkdir -p docker/nginx/local/certs/main
openssl req -x509 -newkey rsa:4096 -nodes \
  -keyout docker/nginx/local/certs/main/jorgeportfolio.local.key \
  -out docker/nginx/local/certs/main/jorgeportfolio.local.crt \
  -days 365 \
  -subj "/CN=jorgeportfolio.local"
```

✅ Alternatively, you can use mkcert for trusted local certs.

⸻

## 🧪 Development Workflow:

### 🌀 Change Branch & Launch Environment

Use this command to switch environments (e.g., dev, qa, main, or feature/*). This will:
	•	Stop any running containers
	•	Fetch remote updates
	•	Offer to merge updates (e.g., feature → dev)
	•	Detect changes in package.json
	•	Decide between standard up or build-up
```bash
npm run sw -- dev       # or qa, main, feature/xyz
```

### 🚀 Launch Current Branch (No Switching)

If you’re already on the correct branch and just want to start the environment with smart logic:
```bash
npm run launch
```

This will:
	•	Check for updates in source branches (e.g. dev ← feature/...)
	•	Offer merge prompt if updates exist
	•	Detect package.json changes
	•	Run make <branch>-local-up or make <branch>-local-build-up accordingly

### 🐳 Docker (Manual)
To run directly without using switch.sh or launch.sh, you can manually run the containers via make:
```bash
make dev-local-up          # if container already built
make dev-local-build-up    # if running for the first time or package.json changed
```

You can replace dev with qa, main, or feature as needed.
> See [WORKFLOW-GUIDE.md](./docs/workflow-guide.md) for more setup details.

### 🧭 Accessing the App

Once the environment is up, open your browser and navigate to the corresponding URL based on the current branch:

| Branch     | URL                              |
|------------|----------------------------------|
| feature/*  | http://localhost:3000            |
| dev        | https://dev.jorgeportfolio.local |
| qa         | https://qa.jorgeportfolio.local  |
| main       | https://jorgeportfolio.local     |

> 🔒 Note: For `dev`, `qa`, and `main`, make sure SSL certificates are correctly configured.  
> See [ENVIRONMENTS.md](./docs/environments.md) for more setup details.

⸻

## 📂 Project Structure
> See [PROJECT-STRUCTURE.md](./docs/project-structure.md) for a full breakdown of folders and responsibilities.

⸻

## 📄 Project Status
This project is actively maintained and under development.
Future updates will include new projects, visual improvements, and performance optimizations.

For deeper reference, see:

- 📖 [ENVIRONMENTS.md](./docs/environments.md)  
- 📖 [WORKFLOW-GUIDE.md](./docs/workflow-guide.md)  
- 📖 [PROJECT-STRUCTURE.md](./docs/project-structure.md)

⸻

## 📬 Contact
Feel free to reach out for questions or collaboration opportunities:
📧 jorge.pedraza.valdez@gmail.com