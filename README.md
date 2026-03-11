# CredPal-Assesment101
A simple nodejs app  with automated integration and deployment, following DevOps best practise
## For integerating security into the pipeline, i could have added more steps for auditing the packages, which will fail the pipeline if a certain level of threat emerged, and also configure quality gate, to scan for the quality of our codes, setting a beanchmark. then for more security for our base image in our containerizzed nodejs service, i would integerate Trivy scan/Snyk scan to scan our built images for any security threat and constantly update the base images.
N.B: MOST steps were not added for a production ready deployment, since the assesment do not mention them.


## Overview
This repo sets up a production-ready DevOps pipeline for a basic Node.js app with endpoints: GET /health, GET /status, POST /process. It includes containerization, CI/CD, IaC, and security best practices.

## Prerequisites
1. AWS ACCOUNT WITH LEAST PRIVILEDGE 
2. DOCKER INSTALLED ON THE EC2 SERVER
3. AWS CLI CONFIGURED LOCALLY

## Local Setup
1. Clone repo: `git clone <repo-url>`
2. Install deps: `cd app && npm install`
3. Create `.env`:
** DB_USER=postgres
** DB_NAME=mydb
8* DB_PASSWORD=secret

4. Run: `docker-compose up --build`
5. Access: http://localhost:3000/health

## Access the App
- Local: http://localhost:3000
- Production: https://<alb-dns> (from Terraform output)


## Deployment
1. Push to main: Triggers CI/CD to build/push image.
2. Push to feature/*: only builds the code to detect early pipeline breaks before creating PR to main
3. Run Terraform: `cd terraform && terraform init && terraform apply`
4. Manual approval in workflow for prod environment
5. Update EC2 user_data use new image.

## Key Decisions
- **Security**: Multi-stage Docker for slim image, non-root user, secrets via .env when running on docker compose /secrets manager if deployed on ecs, HTTPS via ALB/ACM. No secrets in repo.
- **CI/CD**: GitHub Actions for automation on push/PR. Tests ensure quality. Image deploy only on main.
- **Infrastructure**: AWS VPC for isolation, ALB for load balancing/SSL. EC2 for simplicity; ECS recommended for scaling/rolling deploys.
- **Deployment**: Rolling via ECS (or blue-green manual). Zero-downtime prioritized.
