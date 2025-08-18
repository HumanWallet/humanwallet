.PHONY: lib
OWNER=Tutellus

SHELL := /bin/sh
.DEFAULT_GOAL := help

export DEBUG ?= humanwallet:*
BUILD ?=

deploy:
	flyctl deploy --config $(PWD)/apps/$(APP)/fly.toml --build-target $(APP) --dockerfile ./.docker/Dockerfile

deploy_demo:
	APP=demo make deploy

dev: ## develop the application
	npm run dev --workspace @humanwallet/demo

dev_prod:  ## develop the production application
	npm run dev:pro --workspace @humanwallet/demo

build: ## build the application
	npx ultra-runner --recursive --build

preview: ## preview the application
	npx ultra-runner --raw --recursive preview

build_dev: ## build and then start env
		make build
		make dev

build_dev_prod: clean ## build and then start prod
		make build
		make dev_prod

build_preview: clean ## build and then start env
		make build
		make preview

compose_dev: ## Start the env to develop using docker compose (BUILD=--build make compose_dev) to force a build
	docker-compose -f ./.docker/compose-dev.yaml -p humanwallet up $(BUILD)

clean: ## Remove all artefactories
	rm -Rf apps/**/{dist,build,node_modules,package-lock.json} 

phoenix: clean ## Soft clean node_modules
	rm -Rf node_modules package-lock.json &&\
		npm i --no-fund --no-audit

help: ## show help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

typecheck:
	@for dir in apps/* packages/*; do \
		if [ -d "$$dir" ]; then \
			echo "Typechecking in $$dir"; \
			(cd $$dir && npx tsc --noEmit); \
		fi \
	done

lint: ## Run the linter
	npm run lint

pretty: ## Run the prettier
	npm run pretty
	
release:
	npm run release --workspace @humanwallet/demo
