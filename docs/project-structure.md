# 🗂️ Project Structure — Jorge's Next.js Portfolio

This document describes the full structure of the project and the role of each main directory and key file.

⸻

## 📁 Folder Tree (Simplified)

jorge-nextjs-portfolio/
├── docker/                                # Docker and NGINX setup
│   ├── docker-compose.yaml                # Base Compose config
│   ├── docker-compose-nginx-local.yaml    # NGINX layer for local HTTPS
│   ├── docker-compose-nginx-server.yaml   # NGINX config for server deployments
│   ├── docker-compose-override-dev.yaml   # Dev-specific overrides
│   ├── docker-compose-override-feature.yaml # Feature-specific overrides
│   └── nginx/
│       ├── Dockerfile.nginx               # NGINX container definition
│       ├── local/
│       │   ├── certs/                     # Self-signed SSL certs (not committed)
│       │   └── config/                    # nginx.dev.local.conf, etc.
│       └── server/
│           ├── certs/                     # Real SSL certs for deployment (ignored)
│           └── config/                    # Production NGINX server config
│
├── Dockerfile.nextjs                      # Dockerfile for the Next.js app container
│
├── docs/                                  # Documentation files
│   ├── environments.md                    # Behavior per environment
│   ├── project-structure.md               # This file
│   └── workflow-guide.md                  # Git/Docker flow for teams
│
├── env/                                   # Environment-specific .env files
│   ├── dev/
│   │   ├── cd.env                         # CD settings for dev
│   │   ├── cd.env.example                 # Template version (no secrets)
│   │   ├── ci.env                         # CI settings for dev
│   │   ├── ci.env.example
│   │   ├── local.env                      # Local docker config
│   │   └── local.env.example
│   ├── feature/                           # Feature branches don’t require CD
│   │   ├── ci.env
│   │   ├── ci.env.example
│   │   ├── local.env
│   │   └── local.env.example
│   ├── main/
│   │   ├── cd.env
│   │   ├── cd.env.example
│   │   ├── ci.env
│   │   ├── ci.env.example
│   │   ├── local.env
│   │   └── local.env.example
│   └── qa/
│       ├── cd.env
│       ├── cd.env.example
│       ├── ci.env
│       ├── ci.env.example
│       ├── local.env
│       └── local.env.example
│
├── jest.config.js                         # Jest unit test config
├── jsconfig.json                          # Path aliases for VS Code and Next.js
├── Makefile                               # Unified make targets for all envs
├── next.config.mjs                        # Next.js app config
├── package.json                           # App dependencies and scripts
├── package-lock.json                      # Locked dependencies
├── playwright.config.js                   # Playwright E2E test config
├── project-structure.txt                  # Raw CLI output of this file tree
│
├── public/                                # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── README.md                              # Project overview and usage guide
│
├── src/                                   # Main source code (Next.js App Router)
│   └── app/
│       ├── favicon.ico
│       ├── fonts/
│       │   ├── GeistMonoVF.woff           # Custom mono font
│       │   └── GeistVF.woff               # Custom variable font
│       ├── globals.css                    # Global styles
│       ├── layout.js                      # Root layout component
│       ├── page.js                        # Main page entry
│       ├── page.module.css                # Page-level styles
│       └── tests/
│           ├── jest/                      # Unit tests
│           └── playwright/                # End-to-end tests
│
├── test-results/                          # Output from Playwright or Jest runs (ignored)
│
└── utils/                                 # CLI automation scripts
├── launch.sh                          # Smart launch for current branch (merge/build logic)
└── switch.sh                          # Smart switch with Docker lifecycle and Git prompts

⸻

## 🧠 Notes

- 🔐 All `.env` files are split by environment and include `.example` templates.
- 🔒 SSL certificates for dev, qa, and main are **ignored** and must be generated manually.
- 🧪 `Makefile` and CLI scripts are the entry point for launching or switching environments.
- 🧱 NGINX is used for HTTPS in local and production environments.