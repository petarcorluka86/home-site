# Variables
PROJECT_NAME := home-site
NETWORK := home-site-network

NEXT_IMAGE := nextjs-image
NEXT_CONTAINER := nextjs-container
NEXT_DIR := ./nextjs
NEXT_PORT ?= 3000
NEXT_CONTAINER_PORT ?= 3000

NODE_IMAGE := nodejs-image
NODE_CONTAINER := nodejs-container
NODE_DIR := ./nodejs
NODE_PORT ?= 8000
NODE_CONTAINER_PORT ?= 8000
NODE_HOST ?= 0.0.0.0

POSTGRES_IMAGE := postgres-image
POSTGRES_CONTAINER := postgres-container
POSTGRES_DIR := ./postgres
POSTGRES_PORT ?= 5432
POSTGRES_CONTAINER_PORT ?= 5432
POSTGRES_HOST ?= $(POSTGRES_CONTAINER)
POSTGRES_USER ?= root
POSTGRES_DB ?= db
POSTGRES_HOST_AUTH_METHOD ?= trust


# Helper to create network if it doesn't exist
.PHONY: network
network:
	@if ! docker network inspect $(NETWORK) >/dev/null 2>&1; then \
		docker network create $(NETWORK); \
		echo "Created network $(NETWORK)"; \
	else \
		echo "Network $(NETWORK) already exists"; \
	fi

# ----------------------------------------------------------------------------
# Postgres
# ----------------------------------------------------------------------------
.PHONY: db-build db-start db-stop db-restart db-remove

db-build:
	docker build -t $(POSTGRES_IMAGE) $(POSTGRES_DIR)

db-start: db-build network
	-@docker stop $(POSTGRES_CONTAINER) >/dev/null 2>&1 || true
	-@docker rm $(POSTGRES_CONTAINER) >/dev/null 2>&1 || true
	docker run -d \
		--name $(POSTGRES_CONTAINER) \
		--network $(NETWORK) \
		-p $(POSTGRES_PORT):$(POSTGRES_CONTAINER_PORT) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		-e POSTGRES_HOST_AUTH_METHOD=$(POSTGRES_HOST_AUTH_METHOD) \
		$(POSTGRES_IMAGE)

db-stop:
	-@docker stop $(POSTGRES_CONTAINER) || true

db-restart: db-stop db-start

db-remove: db-stop
	-@docker rm -f $(POSTGRES_CONTAINER) || true

# ----------------------------------------------------------------------------
# Node API
# ----------------------------------------------------------------------------
.PHONY: node-build node-start node-stop node-restart node-remove

node-build:
	docker build -t $(NODE_IMAGE) $(NODE_DIR)

node-start: node-build network
	-@docker stop $(NODE_CONTAINER) >/dev/null 2>&1 || true
	-@docker rm $(NODE_CONTAINER) >/dev/null 2>&1 || true
	docker run -d \
		--name $(NODE_CONTAINER) \
		--network $(NETWORK) \
		-p $(NODE_PORT):$(NODE_CONTAINER_PORT) \
		-e HOSTNAME=$(NODE_HOST) \
		-e PORT=$(NODE_CONTAINER_PORT) \
		-e POSTGRES_HOST=$(POSTGRES_HOST) \
		-e POSTGRES_PORT=$(POSTGRES_PORT) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		$(NODE_IMAGE)

node-stop:
	-@docker stop $(NODE_CONTAINER) || true

node-restart: node-stop node-start

node-remove: node-stop
	-@docker rm -f $(NODE_CONTAINER) || true

# ----------------------------------------------------------------------------
# Next.js frontend
# ----------------------------------------------------------------------------
.PHONY: next-build next-start next-stop next-restart next-remove

next-build:
	docker build -t $(NEXT_IMAGE) $(NEXT_DIR)

next-start: next-build network
	-@docker stop $(NEXT_CONTAINER) >/dev/null 2>&1 || true
	-@docker rm $(NEXT_CONTAINER) >/dev/null 2>&1 || true
	docker run -d \
		--name $(NEXT_CONTAINER) \
		--network $(NETWORK) \
		-p $(NEXT_PORT):$(NEXT_CONTAINER_PORT) \
		$(NEXT_IMAGE)

next-stop:
	-@docker stop $(NEXT_CONTAINER) || true

next-restart: next-stop next-start

next-remove: next-stop
	-@docker rm -f $(NEXT_CONTAINER) || true

# ----------------------------------------------------------------------------
# All services convenience targets
# ----------------------------------------------------------------------------
.PHONY: all-build all-start all-stop all-restart all-remove

all-build: db-build node-build next-build

all-start: db-start node-start next-start

all-stop: next-stop node-stop db-stop

all-restart: all-stop all-start

all-remove: next-remove node-remove db-remove

# Default help
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  db-build|db-start|db-stop|db-restart|db-remove"
	@echo "  node-build|node-start|node-stop|node-restart|node-remove"
	@echo "  next-build|next-start|next-stop|next-restart|next-remove"
	@echo "  all-build|all-start|all-stop|all-restart|all-remove"

