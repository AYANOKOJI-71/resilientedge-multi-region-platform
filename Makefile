PNPM := npx --yes pnpm@10.6.3

.PHONY: install lint test build dev-api dev-web tf-fmt tf-validate

install:
	$(PNPM) install --frozen-lockfile

lint:
	$(PNPM) lint

test:
	$(PNPM) test

build:
	$(PNPM) build

dev-api:
	$(PNPM) --filter resilientedge-api dev

dev-web:
	$(PNPM) --filter resilientedge-console dev

tf-fmt:
	terraform fmt -recursive terraform

tf-validate:
	@for env in primary secondary global; do cd terraform/envs/$$env && terraform init -backend=false && terraform validate && cd - >/dev/null; done
