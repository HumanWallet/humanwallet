# HumanWallet Monorepo Makefile
# Manages SDK and demo app projects

.PHONY: help install build dev clean test lint format typecheck deps

# Default target
help: ## Show this help message
	@echo "HumanWallet Monorepo Management"
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Installation commands
install: ## Install all dependencies for the monorepo
	@echo "Installing root dependencies..."
	npm install
	@echo "Installing workspace dependencies..."
	npm install --workspaces

install-sdk: ## Install dependencies for SDK package only
	@echo "Installing SDK dependencies..."
	npm install --workspace=packages/sdk

install-demo: ## Install dependencies for demo app only
	@echo "Installing demo app dependencies..."
	npm install --workspace=apps/humanwallet-domain-architecture-example

# Build commands
build: ## Build all packages
	@echo "Building all packages..."
	npm run build --workspaces --if-present

build-sdk: ## Build SDK package only
	@echo "Building SDK..."
	npm run build --workspace=packages/sdk

build-demo: ## Build demo app only
	@echo "Building demo app..."
	npm run build --workspace=apps/humanwallet-domain-architecture-example



# Development commands
dev: ## Start development mode for all packages
	@echo "Starting development mode..."
	npm run dev --workspaces --if-present

dev-sdk: ## Start development mode for SDK (watch mode)
	@echo "Starting SDK in watch mode..."
	npm run watch-build --workspace=packages/sdk

dev-demo: ## Start development mode for demo app
	@echo "Starting demo app..."
	 npm run dev --workspace=apps/humanwallet-domain-architecture-example

# Test commands
test: ## Run tests for all packages
	@echo "Running tests..."
	npm run test --workspaces --if-present

test-sdk: ## Run tests for SDK package only
	@echo "Running SDK tests..."
	npm run test --workspace=packages/sdk --if-present

test-demo: ## Run tests for demo app
	@echo "Running demo app tests..."
	npm run test --workspace=apps/humanwallet-domain-architecture-example --if-present

# Linting and formatting
lint: ## Run linting for all packages
	@echo "Running linting..."
	npm run lint --workspaces --if-present

lint-sdk: ## Run linting for SDK package only
	@echo "Running SDK linting..."
	npm run lint --workspace=packages/sdk --if-present

format: ## Format code for all packages
	@echo "Formatting code..."
	npx prettier --write "packages/**/*.{ts,tsx,js,jsx,json,md}"
	npx prettier --write "apps/**/*.{ts,tsx,js,jsx,json,md}"

format-check: ## Check code formatting for all packages
	@echo "Checking code formatting..."
	npx prettier --check "packages/**/*.{ts,tsx,js,jsx,json,md}"
	npx prettier --check "apps/**/*.{ts,tsx,js,jsx,json,md}"

typecheck: ## Run TypeScript type checking for all packages
	@echo "Running type checking..."
	npm run typecheck --workspaces --if-present

typecheck-sdk: ## Run TypeScript type checking for SDK only
	@echo "Running SDK type checking..."
	cd packages/sdk && npx tsc --noEmit

# Cleanup commands
clean: ## Clean all build artifacts and node_modules
	@echo "Cleaning all packages..."
	npm run clean --workspaces --if-present
	rm -rf node_modules
	rm -rf packages/*/node_modules
	rm -rf apps/*/node_modules


clean-dist: ## Clean only build artifacts (dist folders)
	@echo "Cleaning build artifacts..."
	find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
	find . -name "build" -type d -exec rm -rf {} + 2>/dev/null || true

clean-sdk: ## Clean SDK build artifacts
	@echo "Cleaning SDK..."
	rm -rf packages/sdk/dist

clean-demo: ## Clean demo app build artifacts
	@echo "Cleaning demo app..."
	rm -rf apps/humanwallet-domain-architecture-example/dist

# Package management
deps: ## Show dependency tree for all packages
	@echo "Dependency tree:"
	npm list --workspaces

deps-outdated: ## Check for outdated dependencies
	@echo "Checking for outdated dependencies..."
	npm outdated --workspaces

deps-update: ## Update all dependencies
	@echo "Updating dependencies..."
	npm update --workspaces

# Release commands
version-sdk: ## Update SDK version (use VERSION=x.x.x)
	@if [ -z "$(VERSION)" ]; then \
		echo "Usage: make version-sdk VERSION=x.x.x"; \
		exit 1; \
	fi
	cd packages/sdk && npm version $(VERSION)

publish-sdk: ## Publish SDK to registry
	@echo "Publishing SDK..."
	cd packages/sdk && npm publish



# Utility commands
workspace-info: ## Show workspace information
	@echo "Workspace Information:"
	@echo "====================="
	@npm query ".workspace"
	@echo ""
	@echo "Package Scripts:"
	@echo "==============="
	@npm run --workspaces --if-present

check-env: ## Check development environment
	@echo "Environment Check:"
	@echo "=================="
	@echo "Node version: $$(node --version)"
	@echo "NPM version: $$(npm --version)"
	@echo "TypeScript version: $$(npx tsc --version 2>/dev/null || echo 'Not installed')"
	@echo ""
	@echo "Workspace packages:"
	@npm list --depth=0 --workspaces
